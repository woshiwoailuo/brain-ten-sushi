const KEY = "brain-ten-guest";

export type Guest = { id: string; name: string };

function makeId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getGuest(): Guest {
  if (typeof window === "undefined") return { id: "", name: "玩家" };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Guest;
      if (parsed?.id && parsed?.name) return parsed;
    }
  } catch {
    /* ignore */
  }
  const id = makeId();
  const hex = id.replace(/-/g, "").slice(-6).toUpperCase();
  const guest = { id, name: "玩家" + hex };
  localStorage.setItem(KEY, JSON.stringify(guest));
  return guest;
}

export const PROGRESS_KEY = "brain-ten-progress";
