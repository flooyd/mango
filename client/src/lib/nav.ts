// Thin wrappers around the local Mango daemon's navigation endpoints.
export const API = 'http://localhost:8080';

/** Jump the running Dota 2 client to a specific game tick. Fire-and-forget. */
export function jumpToTick(tick: number): void {
  fetch(`${API}/navigation/goto-tick/${tick}`).catch(() => {
    /* Dota client not available — ignore */
  });
}

export async function bringToTop(): Promise<void> {
  try {
    await fetch(`${API}/navigation/bring-to-top`);
  } catch {
    /* ignore */
  }
}

export function openReplay(matchId: string): void {
  fetch(`${API}/navigation/open-replay/${matchId}`).catch(() => {
    /* ignore */
  });
}
