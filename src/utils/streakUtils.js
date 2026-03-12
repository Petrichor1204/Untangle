const STREAK_KEY = 'hairly_streak_v2';
const COINS_KEY = 'hairly_coins';

// ── Streak helpers ──────────────────────────────────────────────

export const getStreakData = () => {
  try {
    const stored = localStorage.getItem(STREAK_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { streakCount: 0, lastActiveDate: null, activityDates: [] };
};

/** Call once per meaningful action (log, learn, task). */
export const updateStreak = () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const data = getStreakData();

  // Don't double-count the same day
  if (data.lastActiveDate === today) return data;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newStreakCount =
    data.lastActiveDate === yesterdayStr ? data.streakCount + 1 : 1;

  // Keep a rolling 60-day window of active dates
  const activityDates = [
    ...new Set([...(data.activityDates || []), today]),
  ].slice(-60);

  const newData = { streakCount: newStreakCount, lastActiveDate: today, activityDates };
  localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
  return newData;
};

/**
 * Returns a boolean[7] where index 0 = Monday … 6 = Sunday.
 * true means the user was active on that day in the current week.
 */
export const getWeekActivity = () => {
  const data = getStreakData();
  const activitySet = new Set(data.activityDates || []);

  // Find Monday of the current week
  const today = new Date();
  const jsDay = today.getDay(); // 0=Sun … 6=Sat
  const monday = new Date(today);
  monday.setDate(today.getDate() - (jsDay === 0 ? 6 : jsDay - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return activitySet.has(d.toISOString().slice(0, 10));
  });
};

/**
 * Returns today's index in the Mon–Sun display array (0 = Mon … 6 = Sun).
 */
export const getTodayIndex = () => {
  const jsDay = new Date().getDay(); // 0=Sun … 6=Sat
  return jsDay === 0 ? 6 : jsDay - 1;
};

// ── Coins helpers ───────────────────────────────────────────────

export const getCoins = () => {
  try {
    return parseInt(localStorage.getItem(COINS_KEY) || '0', 10);
  } catch {
    return 0;
  }
};

export const addCoins = (amount) => {
  const current = getCoins();
  const next = current + amount;
  localStorage.setItem(COINS_KEY, String(next));
  return next;
};
