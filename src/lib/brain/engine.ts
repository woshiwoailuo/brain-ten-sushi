import { CATEGORIES, hashStr, shuffle, type Answer, type Category } from "./meta";
import { QUESTIONS, type Question } from "./questions";

export type { Answer, Mode } from "./meta";
export {
  CATEGORIES,
  beijingDate,
  beijingMsToNextMidnight,
  nicknameFor,
  roomCode,
  shuffle,
} from "./meta";

export type PublicQuestion = Omit<Question, "answer" | "explanation" | "aliases">;

export type Dimension = {
  name: Category;
  correct: number;
  total: number;
  earned: number;
  possible: number;
};

export type Assessment = {
  version: "weighted-v3";
  score: number;
  base: number;
  consistency: number;
  tier: string;
  correct: number;
  dimensions: Dimension[];
  fillRight: number;
  fillTotal: number;
  hardRight: number;
  hardTotal: number;
  roast: string;
  advice: string;
};

export type ReviewItem = PublicQuestion & {
  answer: string;
  explanation: string;
  chosen: number | string | null;
  chosenLabel: string;
  correct: boolean;
  weight: number;
};

const TYPE_BASE = { choice: 4, boolean: 3, fill: 5 } as const;

function byId(id: number): Question {
  const q = QUESTIONS.find((x) => x.id === id);
  if (!q) throw new Error("题目不存在");
  return q;
}

export function weightOf(q: Question): number {
  return TYPE_BASE[q.type] * q.difficulty;
}

export function pickSet(seed: string): number[] {
  const ids: number[] = [];
  for (const cat of CATEGORIES) {
    const pool = QUESTIONS.filter((q) => q.category === cat);
    const picked = shuffle(pool, hashStr(seed + "|" + cat)).slice(0, 2);
    ids.push(...picked.map((q) => q.id));
  }
  return shuffle(ids, hashStr(seed + "|order"));
}

export function pickDaily(day: string): number[] {
  return pickSet("daily:" + day);
}

export function pickPractice(salt: string): number[] {
  return pickSet("practice:" + salt);
}

export function publicize(q: Question, optionSeed: number): PublicQuestion {
  const options =
    q.type === "fill" ? [] : q.type === "boolean" ? [...q.options] : shuffle(q.options, optionSeed);
  return {
    id: q.id,
    category: q.category,
    title: q.title,
    visual: q.visual,
    options,
    type: q.type,
    difficulty: q.difficulty,
    fillKind: q.fillKind,
    inputMode: q.inputMode,
  };
}

export function optionSeedFor(key: string, id: number): number {
  return hashStr(key + ":opt:" + id);
}

const FW = "０１２３４５６７８９．";
const HW = "0123456789.";

function toHalfWidth(s: string): string {
  return s.replace(/[０-９．]/g, (c) => {
    const i = FW.indexOf(c);
    return i >= 0 ? HW[i]! : c;
  });
}

function stripPoetry(s: string): string {
  return s.replace(/[\s,，。、．.！!？?；;：:"""''“”‘’《》〈〉·…—\-_+]/g, "");
}

export function matchFill(q: Question, raw: string): boolean {
  const t = String(raw ?? "").trim();
  if (!t) return false;
  const candidates = [q.answer, ...q.aliases];
  if (q.fillKind === "poetry") {
    const n = stripPoetry(t);
    return candidates.some((c) => stripPoetry(c) === n);
  }
  const half = toHalfWidth(t).replace(/,/g, "").replace(/\s/g, "");
  const num = Number(half);
  for (const c of candidates) {
    const ch = toHalfWidth(String(c)).replace(/,/g, "").replace(/\s/g, "");
    if (ch === half) return true;
    const cn = Number(ch);
    if (!Number.isNaN(num) && !Number.isNaN(cn) && num === cn) return true;
  }
  return false;
}

function isCorrect(q: Question, chosen: Answer, options: string[]): boolean {
  if (chosen === null || chosen === undefined) return false;
  if (q.type === "fill") return matchFill(q, String(chosen));
  if (typeof chosen !== "number") return false;
  const picked = options[chosen];
  return picked === q.answer;
}

function chosenLabel(q: Question, chosen: Answer, options: string[]): string {
  if (q.type === "fill") return String(chosen ?? "");
  if (typeof chosen !== "number") return "";
  return options[chosen] ?? "";
}

export function evaluate(
  ids: number[],
  answers: Answer[],
  optionKey: string,
): { score: number; assessment: Assessment; review: ReviewItem[] } {
  if (ids.length !== 10 || answers.length !== 10) {
    throw new Error("本轮应为 10 道题");
  }
  const qs = ids.map(byId);
  const publics = qs.map((q) => publicize(q, optionSeedFor(optionKey, q.id)));

  const dimMap = new Map<Category, Dimension>();
  for (const cat of CATEGORIES) {
    dimMap.set(cat, {
      name: cat,
      correct: 0,
      total: 0,
      earned: 0,
      possible: 0,
    });
  }

  let base = 0;
  let correctCount = 0;
  let fillRight = 0;
  let fillTotal = 0;
  let hardRight = 0;
  let hardTotal = 0;
  const review: ReviewItem[] = [];

  qs.forEach((q, i) => {
    const pub = publics[i]!;
    const w = weightOf(q);
    const ok = isCorrect(q, answers[i] ?? null, pub.options);
    const dim = dimMap.get(q.category)!;
    dim.total += 1;
    dim.possible += w;
    if (ok) {
      dim.correct += 1;
      dim.earned += w;
      base += w;
      correctCount += 1;
    }
    if (q.type === "fill") {
      fillTotal += 1;
      if (ok) fillRight += 1;
    }
    if (q.difficulty === 3) {
      hardTotal += 1;
      if (ok) hardRight += 1;
    }
    review.push({
      ...pub,
      answer: q.answer,
      explanation: q.explanation,
      chosen: answers[i] ?? null,
      chosenLabel: chosenLabel(q, answers[i] ?? null, pub.options),
      correct: ok,
      weight: w,
    });
  });

  let consistency = 0;
  for (const dim of dimMap.values()) {
    if (dim.total > 0 && dim.correct === dim.total) consistency += 2;
  }
  const score = base + consistency;
  const possible = [...dimMap.values()].reduce((s, d) => s + d.possible, 0) + 10;
  const ratio = possible > 0 ? score / possible : 0;
  const tier = tierFor(ratio, correctCount);
  const dimensions = CATEGORIES.map((c) => dimMap.get(c)!).filter((d) => d.total > 0);
  const weakest = [...dimensions].sort((a, b) => a.earned / (a.possible || 1) - b.earned / (b.possible || 1))[0];

  return {
    score,
    assessment: {
      version: "weighted-v3",
      score,
      base,
      consistency,
      tier,
      correct: correctCount,
      dimensions,
      fillRight,
      fillTotal,
      hardRight,
      hardTotal,
      roast: roastFor({ correctCount, fillRight, fillTotal, hardRight, hardTotal, ratio, weakest }),
      advice: adviceFor(weakest, fillRight, fillTotal),
    },
    review,
  };
}

function tierFor(ratio: number, correct: number): string {
  if (correct === 10 && ratio >= 0.9) return "锋芒毕露";
  if (ratio >= 0.82) return "锋芒毕露";
  if (ratio >= 0.64) return "状态在线";
  if (ratio >= 0.46) return "渐入佳境";
  if (ratio >= 0.28) return "正在热身";
  return "还在热机";
}

function roastFor(p: {
  correctCount: number;
  fillRight: number;
  fillTotal: number;
  hardRight: number;
  hardTotal: number;
  ratio: number;
  weakest?: Dimension;
}): string {
  const { correctCount, fillRight, fillTotal, hardRight, hardTotal, ratio, weakest } = p;
  if (correctCount === 10) {
    return "十道全中。这不是运气，是大脑今天愿意加班。可以把这份状态借给待办清单看看。";
  }
  if (ratio >= 0.82) {
    return "这轮几乎把题库按在地上摩擦。留一两道给明天的排行榜，也算讲究。";
  }
  if (fillTotal > 0 && fillRight === 0) {
    return `这轮像是手指已经交卷，大脑还在读题。填空答对 ${fillRight}/${fillTotal}，选项一撤，推理就需要自己搭台阶了。`;
  }
  if (hardTotal > 0 && hardRight === hardTotal && correctCount < 8) {
    return "挑战题倒是咬下来了，基础题却在鞋带上绊了一跤。锋利归锋利，鞋带也得系。";
  }
  if (correctCount <= 2) {
    return "这轮更像热身前的伸展。下一轮先让眼睛和选项对上号，分数会自己跟上来。";
  }
  if (weakest && weakest.correct === 0 && weakest.total > 0) {
    return `${weakest.name}这组今天集体放假。其余科目还在岗，说明不是没电，是有人没打卡。`;
  }
  if (ratio >= 0.5) {
    return "中段发挥，稳，但不吵。再盯紧填空和判断的措辞，指数会再跳一截。";
  }
  return "有对有错，像一杯温度刚好的茶：能喝，还没到回甘。下一轮把看走眼的那两道揪出来。";
}

function adviceFor(weakest: Dimension | undefined, fillRight: number, fillTotal: number): string {
  if (fillTotal > 0 && fillRight / fillTotal < 0.5) {
    return "填空不必追求华丽：计算题写半角数字，诗词只填缺的那句，标点可带可不带。";
  }
  if (weakest && weakest.total > 0 && weakest.correct < weakest.total) {
    return `${weakest.name}这轮还有提升空间：先排除不符合条件的答案，再检查结论。`;
  }
  return "五种思考方式轮着练，比死磕同一类更接近真实的热身。";
}

