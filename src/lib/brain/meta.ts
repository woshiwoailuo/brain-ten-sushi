export const CATEGORIES = ["数字规律", "图形推理", "语言类比", "逻辑判断", "空间方向"] as const;
export type Category = (typeof CATEGORIES)[number];
export type Mode = "practice" | "daily" | "pk";
export type Answer = number | string | null;

export function beijingDate(now = Date.now()): string {
  return new Date(now + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

export function beijingMsToNextMidnight(now = Date.now()): number {
  const day = beijingDate(now);
  const next = Date.parse(day + "T00:00:00+08:00") + 24 * 3600 * 1000;
  return Math.max(0, next - now);
}

export function nicknameFor(guestId: string): string {
  const hex = guestId.replace(/-/g, "").slice(-6).toUpperCase();
  return "玩家" + (hex || "000000");
}

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let n = seed >>> 0;
  const rand = () => {
    n = (n + 0x6d2b79f5) | 0;
    let t = Math.imul(n ^ (n >>> 15), 1 | n);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

export function roomCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

export function asTime(v: string | Date | number | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (v instanceof Date) return v.getTime();
  const n = Date.parse(String(v));
  return Number.isNaN(n) ? 0 : n;
}
