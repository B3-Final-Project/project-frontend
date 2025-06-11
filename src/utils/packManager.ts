import { getCookie, setCookie } from './cookieUtils';
import { getMsUntilTomorrow, getTodayDateString } from './dateUtils';

const PACK_OPEN_STATS_COOKIE_NAME = 'holomatchPackOpenStats';
const MAX_PACKS_PER_DAY = 2;

interface PackOpenStats {
  date: string;
  count: number;
}

function getCurrentDateString(): string {
  return getTodayDateString();
}

export function getPackOpenStats(): PackOpenStats {
  const cookieValue = getCookie(PACK_OPEN_STATS_COOKIE_NAME);
  if (cookieValue) {
    try {
      const stats = JSON.parse(cookieValue) as PackOpenStats;
      if (stats && typeof stats.date === 'string' && typeof stats.count === 'number') {
        return stats;
      }
    } catch (error) {
      console.error("Error parsing pack open stats cookie:", error);
    }
  }
  return { date: getCurrentDateString(), count: 0 };
}

function savePackOpenStats(stats: PackOpenStats): void {
  setCookie(PACK_OPEN_STATS_COOKIE_NAME, JSON.stringify(stats), 2);
}

export function canOpenNewPack(): boolean {
  const stats = getPackOpenStats();
  const today = getCurrentDateString();
  console.log('[packManager] canOpenNewPack: Current stats:', JSON.stringify(stats), 'Today:', today);

  if (stats.date !== today) {
    savePackOpenStats({ date: today, count: 0 });
    return true;
  }
  const result = stats.count < MAX_PACKS_PER_DAY;
  console.log(`[packManager] canOpenNewPack: stats.count (${stats.count}) < MAX_PACKS_PER_DAY (${MAX_PACKS_PER_DAY}) is ${result}`);
  return result;
}

export function recordPackOpened(): void {
  let stats = getPackOpenStats();
  const today = getCurrentDateString();
  console.log('[packManager] recordPackOpened: Initial stats:', JSON.stringify(stats));

  if (stats.date !== today) {
    stats = { date: today, count: 1 };
  } else {
    stats.count = Math.min(stats.count + 1, MAX_PACKS_PER_DAY);
  }
  console.log('[packManager] recordPackOpened: Stats to save:', JSON.stringify(stats));
  savePackOpenStats(stats);
}

export function getRemainingPacksToday(): number {
  const stats = getPackOpenStats();
  const today = getCurrentDateString();

  if (stats.date !== today) {
    return MAX_PACKS_PER_DAY;
  }
  return Math.max(0, MAX_PACKS_PER_DAY - stats.count);
}

export function getTimeUntilNextPackAvailability(): number {
  if (canOpenNewPack()) {
    return 0;
  }

  return getMsUntilTomorrow();
}
