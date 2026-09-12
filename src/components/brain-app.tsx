import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/brain/meta";
import { beijingMsToNextMidnight, type Answer } from "@/lib/brain/meta";
import type { AttemptView, RankRow, RoomView } from "@/lib/brain/functions";
import {
  createRoom,
  fetchLeaderboard,
  fetchRoom,
  refreshAttempt,
  startAttempt,
  startSession,
  submitAttempt,
} from "@/lib/brain/functions";
import { getGuest, PROGRESS_KEY } from "@/lib/brain/guest";

type Screen = "home" | "quiz" | "result" | "board" | "room";
type Mode = "practice" | "daily" | "pk";

const MODE_LABEL: Record<Mode, string> = {
  daily: "每日挑战",
  practice: "随机练习",
  pk: "好友 PK",
};

function diffLabel(d: number) {
  return ["", "基础", "进阶", "挑战"][d] ?? "";
}

function typeLabel(q: { type: string; fillKind?: string }) {
  if (q.fillKind === "poetry") return "古诗词填空";
  return { fill: "数字填空", boolean: "判断题", choice: "选择题" }[q.type] ?? "选择题";
}

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "请求失败，请重试";
}

function answered(v: Answer) {
  return v !== null && (typeof v !== "string" || v.trim().length > 0);
}

export function BrainApp({ pk }: { pk?: string }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("home");
  const [guest, setGuest] = useState({ id: "", name: "" });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [current, setCurrent] = useState<AttemptView | null>(null);
  const [answers, setAnswers] = useState<Answer[]>(Array(10).fill(null));
  const [index, setIndex] = useState(0);
  const [room, setRoom] = useState<RoomView | null>(null);
  const [board, setBoard] = useState<{ date: string; rows: RankRow[] } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharePk, setSharePk] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [remain, setRemain] = useState("");
  const shareUrlRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setGuest(getGuest());
  }, []);

  useEffect(() => {
    const tick = () => {
      const ms = beijingMsToNextMidnight();
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      setRemain(`${h} 小时 ${m} 分后换题`);
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!guest.id) return;
    void startSession({ data: { guestId: guest.id } }).catch(() => {});
    if (pk) {
      void run(async () => {
        const r = await fetchRoom({ data: { guestId: guest.id, roomId: pk } });
        setRoom(r);
        setScreen("room");
      });
      return;
    }
    try {
      const raw = sessionStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { attempt: AttemptView; answers: Answer[]; index: number };
      if (saved?.attempt?.id && saved.attempt.score === null) {
        setCurrent(saved.attempt);
        setAnswers(saved.answers);
        setIndex(saved.index ?? 0);
        setScreen("quiz");
      }
    } catch {
      /* ignore */
    }
  }, [guest.id, pk]);

  useEffect(() => {
    if (screen === "quiz" && current) {
      sessionStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ attempt: current, answers, index }),
      );
    }
  }, [screen, current, answers, index]);

  async function run(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setStatus("正在连接…");
    try {
      await fn();
      setStatus("");
    } catch (e) {
      setStatus(errMsg(e));
    } finally {
      setBusy(false);
    }
  }

  function persistClear() {
    sessionStorage.removeItem(PROGRESS_KEY);
  }

  function goHome() {
    persistClear();
    setCurrent(null);
    setRoom(null);
    setBoard(null);
    setAnswers(Array(10).fill(null));
    setIndex(0);
    setStatus("");
    setScreen("home");
    void navigate({ to: "/", search: {} });
    window.scrollTo(0, 0);
  }

  function begin(mode: Mode, roomId?: string) {
    void run(async () => {
      const att = await startAttempt({
        data: { guestId: guest.id, mode, roomId },
      });
      setCurrent(att);
      if (att.room) setRoom(att.room);
      if (att.score !== null) {
        persistClear();
        setScreen("result");
      } else {
        setAnswers(att.answers ?? Array(10).fill(null));
        setIndex(0);
        setScreen("quiz");
      }
      window.scrollTo(0, 0);
    });
  }

  function openBoard() {
    setScreen("board");
    setBoard(null);
    void run(async () => {
      setBoard(await fetchLeaderboard());
    });
  }

  function startPk() {
    void run(async () => {
      const r = await createRoom({ data: { guestId: guest.id } });
      setRoom(r);
      setScreen("room");
      void navigate({ to: "/", search: { pk: r.id } });
    });
  }

  const q = current?.questions[index];
  const canNext = answered(answers[index] ?? null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL(window.location.href);
    u.search = sharePk && (pk || room?.id) ? "?pk=" + encodeURIComponent(pk || room?.id || "") : "";
    return u.toString();
  }, [sharePk, pk, room?.id, shareOpen]);

  async function copyShare() {
    const value = shareUrl;
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch {
      const input = shareUrlRef.current;
      if (input) {
        input.focus();
        input.select();
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        }
      }
    }
    setCopyStatus(ok ? "链接已复制，发给朋友即可。" : "请长按上方链接，选择复制后发送。");
  }

  function submitQuiz() {
    if (!current || !canNext) return;
    void run(async () => {
      const att = await submitAttempt({
        data: { guestId: guest.id, attemptId: current.id, answers: answers as (number | string)[] },
      });
      persistClear();
      setCurrent(att);
      if (att.room) setRoom(att.room);
      setScreen("result");
      window.scrollTo(0, 0);
    });
  }

  return (
    <>
      <header className="bt-header">
        <a className="bt-brand" href="/" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <span className="bt-logo">10</span>
          脑力十题
        </a>
        <button
          className="bt-text-btn"
          type="button"
          onClick={() => {
            setSharePk(screen === "room" || (current?.mode === "pk" && screen === "result"));
            setCopyStatus("");
            setShareOpen(true);
          }}
        >
          邀请朋友
        </button>
      </header>
      <main className="bt-main">
        {screen === "home" && (
          <section className="bt-start">
            <div className="bt-intro">
              <div className="bt-eyebrow">THE THINKING BREAK</div>
              <h1>
                给大脑，
                <br />
                一个小挑战。
              </h1>
              <p>
                独自热身，或与朋友同题较量。
                <br />
                十道题，换个角度想一想。
              </p>
              <div className="bt-big">
                10<span>道灵感热身</span>
              </div>
            </div>
            <div className="bt-setup">
              <h2>今天，怎么挑战？</h2>
              <div className="bt-types">
                {CATEGORIES.map((c) => (
                  <span className="bt-chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
              <div className="bt-mode-list">
                <button className="bt-mode" type="button" onClick={() => begin("practice")}>
                  <b>随机练习</b>
                  <span>106 道题库 · 每轮 10 题 · 不计入排行</span>
                </button>
                <button className="bt-mode" type="button" onClick={() => begin("daily")}>
                  <b>
                    每日挑战 <em>上榜</em>
                  </b>
                  <span>点选为主 · 古诗词与计算仍填空 · 每日同题 · {remain}</span>
                </button>
                <button className="bt-mode" type="button" onClick={startPk}>
                  <b>
                    好友 PK <em>1 对 1</em>
                  </b>
                  <span>创建房间，发链接邀请朋友应战</span>
                </button>
              </div>
              <div className="bt-home-links">
                <button className="bt-text-btn" type="button" onClick={openBoard}>
                  查看今日排行榜
                </button>
                <button className="bt-text-btn" type="button" onClick={() => setInfoOpen(true)}>
                  {guest.name || "访客身份"}
                </button>
              </div>
              <p className="bt-note">
                按难度、题型和分类表现综合打分，结尾送你一段锐评。指数不是 IQ；访客身份绑定本机，无需账号。刷新也不会丢掉正在作答的题目。
              </p>
              <p className="bt-status" role="status">
                {status}
              </p>
            </div>
          </section>
        )}

        {screen === "quiz" && current && q && (
          <section className="bt-quiz">
            <div className="bt-quiz-top">
              <strong>
                第 {String(index + 1).padStart(2, "0")} 题 <span>/ 10</span>
              </strong>
              <span>{MODE_LABEL[current.mode]}</span>
            </div>
            <div
              className="bt-progress"
              role="progressbar"
              aria-label="答题进度"
              aria-valuemin={0}
              aria-valuemax={10}
              aria-valuenow={index}
            >
              <div style={{ width: `${index * 10}%` }} />
            </div>
            <div className="bt-card">
              <div className="bt-qmeta">
                <span className="bt-chip">{q.category}</span>
                <span>
                  {typeLabel(q)} · {diffLabel(q.difficulty)}
                </span>
              </div>
              <h1 id="question" tabIndex={-1} ref={questionRef}>
                {q.title}
              </h1>
              {q.visual ? <div className="bt-visual">{q.visual}</div> : null}
              {q.type === "fill" ? (
                <>
                  <label className="bt-fill-label" htmlFor="fillAnswer">
                    填写你的答案
                  </label>
                  <input
                    id="fillAnswer"
                    className="bt-fill"
                    type="text"
                    inputMode={q.inputMode === "decimal" ? "decimal" : "text"}
                    maxLength={80}
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={typeof answers[index] === "string" ? String(answers[index]) : ""}
                    onChange={(e) => {
                      const next = [...answers];
                      next[index] = e.target.value;
                      setAnswers(next);
                    }}
                  />
                  <p className="bt-muted">
                    {q.fillKind === "poetry"
                      ? "只填写缺少的诗词句子；可带标点和空格。"
                      : "数字无需加单位；支持全角数字。"}
                  </p>
                </>
              ) : (
                <div className="bt-options" role="group" aria-labelledby="question">
                  {q.options.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      className={"bt-option" + (answers[index] === i ? " selected" : "")}
                      aria-pressed={answers[index] === i}
                      onClick={() => {
                        const next = [...answers];
                        next[index] = i;
                        setAnswers(next);
                      }}
                    >
                      <span className="letter">
                        {q.type === "boolean" ? (v === "正确" ? "✓" : "×") : "ABCD"[i]}
                      </span>
                      <span>{v}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="bt-actions">
                <button
                  className="bt-text-btn"
                  type="button"
                  disabled={index === 0 || busy}
                  onClick={() => {
                    if (index > 0) {
                      setIndex(index - 1);
                      questionRef.current?.focus({ preventScroll: true });
                    }
                  }}
                >
                  上一题
                </button>
                <button
                  className="bt-primary"
                  type="button"
                  disabled={!canNext || busy}
                  onClick={() => {
                    if (index < 9) {
                      setIndex(index + 1);
                      questionRef.current?.focus({ preventScroll: true });
                      window.scrollTo(0, 0);
                    } else {
                      submitQuiz();
                    }
                  }}
                >
                  {index === 9 ? "提交并看锐评" : "下一题"}
                </button>
              </div>
              <p className="bt-status" role="status">
                {status}
              </p>
            </div>
            <p className="bt-small">提交前可修改 · 不按速度扣分 · 中途刷新会自动续上</p>
          </section>
        )}

        {screen === "result" && current && (
          <ResultView
            current={current}
            status={status}
            busy={busy}
            onHome={goHome}
            onBoard={openBoard}
            onInvite={() => {
              setSharePk(true);
              setCopyStatus("");
              setShareOpen(true);
            }}
            onRefresh={() => {
              void run(async () => {
                const att = await refreshAttempt({
                  data: { guestId: guest.id, attemptId: current.id },
                });
                setCurrent(att);
                if (att.room) setRoom(att.room);
              });
            }}
          />
        )}

        {screen === "board" && (
          <section className="bt-quiz">
            <div className="bt-hero">
              <div className="bt-eyebrow">DAILY LEADERBOARD</div>
              <h1>今日脑力榜</h1>
              <p>{board?.date ?? "…"} · 北京时间 · 每天零点换题</p>
            </div>
            <div className="bt-card">
              <p className="bt-note">
                今日同题，每个访客只记录首次提交。按同题的难度加权积分排名，同分并列；仅展示前 50 条。访客身份不等于实名身份，本榜仅供娱乐。
              </p>
              {!board && <p className="bt-status">正在加载…</p>}
              {board && board.rows.length === 0 && (
                <div className="bt-empty">
                  今天还没有成绩。
                  <br />
                  来成为第一位挑战者吧。
                </div>
              )}
              {board && board.rows.length > 0 && (
                <div className="bt-rank">
                  <div className="bt-rank-row bt-rank-head">
                    <span>名次</span>
                    <span>玩家</span>
                    <span>指数</span>
                  </div>
                  {board.rows.map((r, i) => (
                    <div className="bt-rank-row" key={i}>
                      <b>{r.rank}</b>
                      <span>{r.name}</span>
                      <strong>{r.score}</strong>
                    </div>
                  ))}
                </div>
              )}
              <button className="bt-primary" type="button" onClick={() => begin("daily")}>
                参加今日挑战
              </button>
              <div className="bt-actions">
                <button className="bt-text-btn" type="button" onClick={goHome}>
                  返回首页
                </button>
                <button className="bt-text-btn" type="button" onClick={openBoard}>
                  刷新排行榜
                </button>
              </div>
              <p className="bt-status" role="status">
                {status}
              </p>
            </div>
          </section>
        )}

        {screen === "room" && room && (
          <section className="bt-quiz">
            <PkPanel
              room={room}
              onInvite={() => {
                setSharePk(true);
                setCopyStatus("");
                setShareOpen(true);
              }}
              onRefresh={() => {
                void run(async () => {
                  const r = await fetchRoom({ data: { guestId: guest.id, roomId: room.id } });
                  setRoom(r);
                });
              }}
            />
            <div className="bt-card">
              <h2>接受这场挑战</h2>
              <p>
                {guest.name}，准备好后即可开始。每人仅一次成绩，提交后不可修改。
              </p>
              <button
                className="bt-primary"
                type="button"
                disabled={busy || ((room.expired || room.full) && !room.joined)}
                onClick={() => begin("pk", room.id)}
              >
                {room.joined ? "继续答题 / 查看成绩" : "开始我的 PK"}
              </button>
              <p className="bt-status" role="status">
                {status}
              </p>
              <button className="bt-text-btn" type="button" onClick={goHome}>
                返回首页
              </button>
            </div>
          </section>
        )}
      </main>
      <footer className="bt-footer">
        不贴标签，只探索思考的乐趣。
        <br />
        <span>趣味测验 · 不等同于标准化智商测评</span>
      </footer>

      {shareOpen && (
        <dialog className="bt-dialog" open>
          <h2>{sharePk ? "邀请朋友同题 PK" : "邀请朋友一起挑战"}</h2>
          <p>复制下方链接发给朋友。微信里也可长按链接转发。</p>
          <input ref={shareUrlRef} aria-label="分享链接" readOnly value={shareUrl} />
          <button className="bt-primary" type="button" onClick={() => void copyShare()}>
            复制链接
          </button>
          <p className="bt-status" role="status">
            {copyStatus}
          </p>
          <button className="bt-text-btn" type="button" onClick={() => setShareOpen(false)}>
            关闭
          </button>
        </dialog>
      )}
      {infoOpen && (
        <dialog className="bt-dialog" open>
          <h2>访客身份</h2>
          <p>
            当前身份：{guest.name}。记录绑定这台设备的浏览器，无需微信授权。更换设备或清除站点数据后会变成新访客。
          </p>
          <p>每日挑战每个访客只记录首次提交；好友 PK 双方可不同时在线，房间 24 小时有效。</p>
          <button className="bt-primary" type="button" onClick={() => setInfoOpen(false)}>
            知道了
          </button>
        </dialog>
      )}
    </>
  );
}

function PkPanel({
  room,
  onInvite,
  onRefresh,
}: {
  room: RoomView;
  onInvite: () => void;
  onRefresh: () => void;
}) {
  const me = room.players.find((p) => p.me);
  const other = room.players.find((p) => !p.me);
  const verdict = room.complete
    ? me && other
      ? me.score! > other.score!
        ? "本轮你获胜！"
        : me.score! < other.score!
          ? "本轮朋友获胜"
          : "同分，平局！"
      : "本轮已完成"
    : room.expired
      ? "房间已过期"
      : room.players.length < 2
        ? "等待朋友加入"
        : "等待双方完成";
  return (
    <div className="bt-card">
      <h2>{verdict}</h2>
      <div className="bt-pk">
        {room.players.map((p) => (
          <div key={p.name + String(p.me)}>
            <strong>
              {p.name}
              {p.me ? "（你）" : ""}
            </strong>
            <span>{room.complete ? `${p.score} 点` : p.done ? "已完成" : "已入场"}</span>
          </div>
        ))}
        {room.players.length < 2 && (
          <div>
            <strong>朋友席位</strong>
            <span>等待应战</span>
          </div>
        )}
      </div>
      <p className="bt-note">
        同一套题、同一选项顺序。房间创建后 24 小时有效；双方可分别完成，无需同时在线。
      </p>
      <div className="bt-actions">
        <button className="bt-primary" type="button" onClick={onInvite}>
          复制 PK 邀请链接
        </button>
        <button className="bt-text-btn" type="button" onClick={onRefresh}>
          刷新战况
        </button>
      </div>
    </div>
  );
}

function ResultView({
  current,
  status,
  busy,
  onHome,
  onBoard,
  onInvite,
  onRefresh,
}: {
  current: AttemptView;
  status: string;
  busy: boolean;
  onHome: () => void;
  onBoard: () => void;
  onInvite: () => void;
  onRefresh: () => void;
}) {
  const seconds = Math.round(((current.finishedAt ?? Date.now()) - current.startedAt) / 1000);
  const evaluation = current.assessment;
  const r = current.room;
  const rev = current.review;
  return (
    <section className="bt-result">
      <div className="bt-hero">
        <div className="bt-eyebrow">THINKING PROFILE</div>
        <h1>本轮脑力挑战指数</h1>
        <div className="bt-score">{current.score ?? "—"}</div>
        <p className="bt-tier">{evaluation ? evaluation.tier : "等待双方完成后解读"}</p>
        <p>
          {evaluation ? `答对 ${evaluation.correct} / 10 题 · ` : ""}
          用时 {Math.floor(seconds / 60)} 分 {seconds % 60} 秒
        </p>
        <p>难度加权积分 · 没有固定满分 · 不是 IQ</p>
      </div>
      {r ? <PkPanel room={r} onInvite={onInvite} onRefresh={onRefresh} /> : null}
      {evaluation ? (
        <div className="bt-card bt-roast">
          <span className="bt-chip">本轮锐评 · 按答题表现生成</span>
          <h2>{evaluation.roast}</h2>
          <p>{evaluation.advice}</p>
          <p className="bt-muted">调侃这次发挥，不给你的智商或人格贴标签。</p>
        </div>
      ) : null}
      <div className="bt-card">
        <h2>{current.mode === "daily" ? "今日成绩已记录" : "五种思考方式"}</h2>
        {evaluation ? (
          <>
            <div className="bt-dims">
              {evaluation.dimensions.map((d) => (
                <div className="bt-dim" key={d.name}>
                  <span>{d.name}</span>
                  <div className="bt-bar">
                    <i style={{ width: `${d.possible ? (d.earned / d.possible) * 100 : 0}%` }} />
                  </div>
                  <b>
                    {d.correct}/{d.total}
                  </b>
                </div>
              ))}
            </div>
            <div className="bt-parts">
              <span>
                答题积分 <strong>{evaluation.base}</strong>
              </span>
              <span>
                稳定性奖励 <strong>+{evaluation.consistency}</strong>
              </span>
            </div>
            <p className="bt-note">
              {evaluation.hardTotal
                ? `挑战难度答对 ${evaluation.hardRight}/${evaluation.hardTotal}；`
                : ""}
              填空答对 {evaluation.fillRight}/{evaluation.fillTotal}。
              {current.mode === "daily"
                ? "同日同题、同规则排行。"
                : "不同随机题组之间不宜直接比较积分。"}
            </p>
          </>
        ) : (
          <p>双方完成后公开分类表现、锐评和答案。房间过期后也可查看自己的解析。</p>
        )}
        <details className="bt-details">
          <summary>这次怎么打分？</summary>
          <p>
            难度按编辑预设分为基础、进阶、挑战，系数分别为 1、2、3。选择题答对得 4 × 难度系数，判断题为 3 ×
            系数，古诗词与计算填空为 5 × 系数；答错得 0。每类两题全部答对，再奖励 2 点稳定性积分。不按答题速度加减分。
          </p>
          <p>
            等级综合本轮可获得的加权积分和实际表现生成。难度与权重尚未经过人群标定，这不是标准化智商测验，不能估计
            IQ 或保证误差范围。
          </p>
        </details>
        <div className="bt-actions">
          <button className="bt-primary" type="button" onClick={onHome} disabled={busy}>
            返回首页
          </button>
          <button className="bt-text-btn" type="button" onClick={onBoard}>
            排行榜
          </button>
        </div>
        <p className="bt-status" role="status">
          {status}
        </p>
      </div>
      {rev ? (
        <div className="bt-card">
          <h2>答案与思路</h2>
          {rev.map((q, i) => (
            <details className="bt-details" key={q.id}>
              <summary>
                <span className={q.correct ? "bt-ok" : "bt-no"}>{q.correct ? "✓" : "×"}</span> 第{" "}
                {i + 1} 题 · {q.category}
              </summary>
              <p>{q.title}</p>
              {q.visual ? <p style={{ whiteSpace: "pre-line" }}>{q.visual}</p> : null}
              <p>
                你的答案：{q.chosenLabel || "（未作答）"}
                <br />
                正确答案：{q.answer}
              </p>
              <p>{q.explanation}</p>
            </details>
          ))}
        </div>
      ) : null}
    </section>
  );
}
