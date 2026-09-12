import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import {
  beijingDate,
  evaluate,
  nicknameFor,
  optionSeedFor,
  pickDaily,
  pickPractice,
  publicize,
  roomCode,
  type Answer,
  type Assessment,
  type Mode,
  type PublicQuestion,
  type ReviewItem,
} from "./engine";
import { asTime } from "./meta";
import { QUESTIONS } from "./questions";

const guestId = z.string().uuid();
const modeZ = z.enum(["practice", "daily", "pk"]);

export type AttemptView = {
  id: string;
  mode: Mode;
  roomId: string | null;
  score: number | null;
  startedAt: number;
  finishedAt: number | null;
  questions: PublicQuestion[];
  answers: Answer[] | null;
  assessment?: Assessment;
  review?: ReviewItem[];
  room?: RoomView | null;
};

export type RankRow = { rank: number; name: string; score: number };

export type RoomPlayer = {
  name: string;
  me: boolean;
  done: boolean;
  score: number | null;
};

export type RoomView = {
  id: string;
  complete: boolean;
  expired: boolean;
  full: boolean;
  joined: boolean;
  players: RoomPlayer[];
};

function parseIds(raw: string): number[] {
  const v = JSON.parse(raw) as unknown;
  if (!Array.isArray(v) || v.some((x) => typeof x !== "number")) {
    throw new Error("题目数据损坏");
  }
  return v;
}

function publicQuestions(ids: number[], optionKey: string): PublicQuestion[] {
  return ids.map((id) => {
    const q = QUESTIONS.find((x) => x.id === id);
    if (!q) throw new Error("题目不存在");
    return publicize(q, optionSeedFor(optionKey, id));
  });
}

async function loadRoom(sql: Awaited<ReturnType<typeof getSql>>, roomId: string, guest: string) {
  const rooms = await sql<{
    id: string;
    question_ids: string;
    option_key: string;
    expires_at: string | Date;
  }>`select id, question_ids, option_key, expires_at from brain_rooms where id = ${roomId}`;
  const room = rooms[0];
  if (!room) throw new Error("房间不存在或链接无效。");
  const players = await sql<{
    guest_id: string;
    nickname: string;
    score: number | null;
    done: boolean;
  }>`select guest_id, nickname, score, done from brain_room_players where room_id = ${roomId} order by joined_at asc`;
  const expired = asTime(room.expires_at) <= Date.now();
  const complete = players.length >= 2 && players.every((p) => p.done);
  const joined = players.some((p) => p.guest_id === guest);
  return {
    room,
    players,
    view: {
      id: room.id,
      complete,
      expired,
      full: players.length >= 2,
      joined,
      players: players.map((p) => ({
        name: p.nickname,
        me: p.guest_id === guest,
        done: p.done,
        score: complete ? p.score : null,
      })),
    } satisfies RoomView,
  };
}

export const startSession = createServerFn({ method: "POST" })
  .validator(z.object({ guestId }))
  .handler(async ({ data }) => {
    return { name: nicknameFor(data.guestId) };
  });

export const fetchLeaderboard = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const day = beijingDate();
  const rows = await sql<{ nickname: string; score: number }>`
    select nickname, score from brain_daily
    where day = ${day}
    order by score desc, created_at asc
    limit 50`;
  let last = -1;
  let rank = 0;
  const ranked: RankRow[] = rows.map((r, i) => {
    if (r.score !== last) {
      rank = i + 1;
      last = r.score;
    }
    return { rank, name: r.nickname, score: r.score };
  });
  return { date: day, rows: ranked };
});

export const startAttempt = createServerFn({ method: "POST" })
  .validator(
    z.object({
      guestId,
      mode: modeZ,
      roomId: z.string().min(4).max(12).optional(),
    }),
  )
  .handler(async ({ data }): Promise<AttemptView> => {
    const sql = await getSql();
    const name = nicknameFor(data.guestId);
    const now = Date.now();

    if (data.mode === "daily") {
      const day = beijingDate(now);
      const existing = await sql<{ id: string; payload: string }>`
        select id, payload from brain_daily
        where day = ${day} and guest_id = ${data.guestId}
        limit 1`;
      if (existing[0]) {
        return JSON.parse(existing[0].payload) as AttemptView;
      }
    }

    if (data.mode === "pk") {
      if (!data.roomId) throw new Error("缺少房间号");
      const packed = await loadRoom(sql, data.roomId, data.guestId);
      if (packed.view.expired && !packed.view.joined) {
        throw new Error("房间已过期。");
      }
      if (packed.view.full && !packed.view.joined) {
        throw new Error("房间已满，两位玩家已经入场。");
      }
      const mine = packed.players.find((p) => p.guest_id === data.guestId);
      if (mine?.done) {
        const rows = await sql<{ payload: string }>`
          select payload from brain_room_players
          where room_id = ${data.roomId} and guest_id = ${data.guestId}`;
        if (rows[0]?.payload) {
          const prev = JSON.parse(rows[0].payload) as AttemptView;
          prev.room = packed.view;
          return prev;
        }
      }
      if (!packed.view.joined) {
        await sql`
          insert into brain_room_players (room_id, guest_id, nickname, done)
          values (${data.roomId}, ${data.guestId}, ${name}, false)`;
      }
      const ids = parseIds(packed.room.question_ids);
      const optionKey = packed.room.option_key;
      const id = crypto.randomUUID();
      await sql`
        insert into brain_attempts (id, guest_id, mode, room_id, question_ids, option_key, started_at)
        values (${id}, ${data.guestId}, ${"pk"}, ${data.roomId}, ${JSON.stringify(ids)}, ${optionKey}, ${now})`;
      const room = (await loadRoom(sql, data.roomId, data.guestId)).view;
      return {
        id,
        mode: "pk",
        roomId: data.roomId,
        score: null,
        startedAt: now,
        finishedAt: null,
        questions: publicQuestions(ids, optionKey),
        answers: null,
        room,
      };
    }

    const optionKey =
      data.mode === "daily" ? "daily:" + beijingDate(now) : "practice:" + crypto.randomUUID();
    const ids = data.mode === "daily" ? pickDaily(beijingDate(now)) : pickPractice(optionKey);
    const id = crypto.randomUUID();
    await sql`
      insert into brain_attempts (id, guest_id, mode, room_id, question_ids, option_key, started_at)
      values (${id}, ${data.guestId}, ${data.mode}, ${null}, ${JSON.stringify(ids)}, ${optionKey}, ${now})`;
    return {
      id,
      mode: data.mode,
      roomId: null,
      score: null,
      startedAt: now,
      finishedAt: null,
      questions: publicQuestions(ids, optionKey),
      answers: null,
    };
  });

export const submitAttempt = createServerFn({ method: "POST" })
  .validator(
    z.object({
      guestId,
      attemptId: z.string().uuid(),
      answers: z.array(z.union([z.number().int().min(0).max(3), z.string().max(80)])).length(10),
    }),
  )
  .handler(async ({ data }): Promise<AttemptView> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      guest_id: string;
      mode: Mode;
      room_id: string | null;
      question_ids: string;
      option_key: string;
      started_at: number;
      finished_at: number | null;
      score: number | null;
      payload: string | null;
    }>`select id, guest_id, mode, room_id, question_ids, option_key, started_at, finished_at, score, payload
       from brain_attempts where id = ${data.attemptId}`;
    const att = rows[0];
    if (!att || att.guest_id !== data.guestId) throw new Error("本轮答题已失效，请返回首页重开。");
    if (att.finished_at && att.payload) return JSON.parse(att.payload) as AttemptView;

    const ids = parseIds(att.question_ids);
    const result = evaluate(ids, data.answers as Answer[], att.option_key);
    const finishedAt = Date.now();
    const view: AttemptView = {
      id: att.id,
      mode: att.mode,
      roomId: att.room_id,
      score: result.score,
      startedAt: Number(att.started_at),
      finishedAt,
      questions: publicQuestions(ids, att.option_key),
      answers: data.answers as Answer[],
      assessment: result.assessment,
      review: result.review,
    };

    if (att.mode === "daily") {
      const day = beijingDate(att.started_at);
      const existing = await sql<{ guest_id: string }>`
        select guest_id from brain_daily where day = ${day} and guest_id = ${data.guestId}`;
      if (existing[0]) {
        const prev = await sql<{ payload: string }>`
          select payload from brain_daily where day = ${day} and guest_id = ${data.guestId}`;
        return JSON.parse(prev[0]!.payload) as AttemptView;
      }
      await sql`
        insert into brain_daily (day, guest_id, nickname, score, payload)
        values (${day}, ${data.guestId}, ${nicknameFor(data.guestId)}, ${result.score}, ${JSON.stringify(view)})`;
    }

    if (att.mode === "pk" && att.room_id) {
      await sql`
        update brain_room_players
        set done = true, score = ${result.score}, correct = ${result.assessment.correct},
            answers = ${JSON.stringify(data.answers)}, payload = ${JSON.stringify(view)}
        where room_id = ${att.room_id} and guest_id = ${data.guestId}`;
      view.room = (await loadRoom(sql, att.room_id, data.guestId)).view;
    }

    await sql`
      update brain_attempts
      set finished_at = ${finishedAt}, score = ${result.score}, payload = ${JSON.stringify(view)}
      where id = ${att.id}`;
    return view;
  });

export const refreshAttempt = createServerFn({ method: "POST" })
  .validator(z.object({ guestId, attemptId: z.string().uuid() }))
  .handler(async ({ data }): Promise<AttemptView> => {
    const sql = await getSql();
    const rows = await sql<{ payload: string | null; room_id: string | null; guest_id: string }>`
      select payload, room_id, guest_id from brain_attempts where id = ${data.attemptId}`;
    const att = rows[0];
    if (!att || att.guest_id !== data.guestId || !att.payload) {
      throw new Error("还没有可刷新的成绩。");
    }
    const view = JSON.parse(att.payload) as AttemptView;
    if (att.room_id) view.room = (await loadRoom(sql, att.room_id, data.guestId)).view;
    return view;
  });

export const createRoom = createServerFn({ method: "POST" })
  .validator(z.object({ guestId }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = roomCode();
    const optionKey = "pk:" + id;
    const ids = pickPractice(optionKey);
    const expires = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
    await sql`
      insert into brain_rooms (id, question_ids, option_key, expires_at)
      values (${id}, ${JSON.stringify(ids)}, ${optionKey}, ${expires})`;
    await sql`
      insert into brain_room_players (room_id, guest_id, nickname, done)
      values (${id}, ${data.guestId}, ${nicknameFor(data.guestId)}, false)`;
    const packed = await loadRoom(sql, id, data.guestId);
    return packed.view;
  });

export const fetchRoom = createServerFn({ method: "POST" })
  .validator(z.object({ guestId, roomId: z.string().min(4).max(12) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    return (await loadRoom(sql, data.roomId, data.guestId)).view;
  });
