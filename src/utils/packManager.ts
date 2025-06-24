// Constants for pack opening management
const PACK_OPEN_TIMESTAMPS_KEY = 'holomatchPackOpenTimestamps';
const MAX_PACKS_PER_WINDOW = 2;
// const PACK_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const PACK_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Retrieves the array of pack opening timestamps from sessionStorage.
 * @returns {number[]} An array of timestamps, or an empty array if none are found or an error occurs.
 */
function getPackOpenTimestamps(): number[] {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const storedTimestamps = sessionStorage.getItem(PACK_OPEN_TIMESTAMPS_KEY);
      if (storedTimestamps) {
        const timestamps = JSON.parse(storedTimestamps);
        if (Array.isArray(timestamps) && timestamps.every(ts => typeof ts === 'number')) {
          return timestamps;
        }
      }
    }
  } catch (error) {
    console.error("Error parsing pack open timestamps from sessionStorage:", error);
  }
  return [];
}

/**
 * Saves the array of pack opening timestamps to sessionStorage.
 * @param {number[]} timestamps - The array of timestamps to save.
 */
function savePackOpenTimestamps(timestamps: number[]): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(PACK_OPEN_TIMESTAMPS_KEY, JSON.stringify(timestamps));
    }
  } catch (error) {
    console.error("Error saving pack open timestamps to sessionStorage:", error);
  }
}

/**
 * Records a new pack opening by adding the current timestamp.
 * It also cleans up timestamps older than PACK_WINDOW_MS from the current time
 * and ensures only the most recent MAX_PACKS_PER_WINDOW are kept if somehow exceeded.
 */
export function recordPackOpening(): void {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    console.warn('sessionStorage not available. Pack opening not recorded.');
    return;
  }
  let timestamps = getPackOpenTimestamps();
  const now = Date.now();

  // Add current opening time
  timestamps.push(now);

  // Filter out timestamps that are older than PACK_WINDOW_MS from the current time
  // This ensures the window is "rolling"
  timestamps = timestamps.filter(ts => (now - ts) < PACK_WINDOW_MS);

  // If, after filtering, we still have more than MAX_PACKS_PER_WINDOW (e.g. due to a very short window or rapid openings),
  // keep only the most recent ones up to the limit.
  // This step is crucial for enforcing the MAX_PACKS_PER_WINDOW limit strictly within the PACK_WINDOW_MS.
  if (timestamps.length > MAX_PACKS_PER_WINDOW) {
    timestamps = timestamps.slice(-MAX_PACKS_PER_WINDOW);
  }

  savePackOpenTimestamps(timestamps);
}

/**
 * Checks if a new pack can be opened and provides the time until the next opening if not.
 * @returns {{ canOpen: boolean; timeUntilNextOpenMs?: number; packsOpenedInWindow: number }}
 *          `canOpen` is true if a pack can be opened.
 *          `timeUntilNextOpenMs` is the time in milliseconds until the next pack opening is allowed, if `canOpen` is false.
 *          `packsOpenedInWindow` is the number of packs opened in the current rolling window.
 */
export function checkPackAvailability(): { canOpen: boolean; timeUntilNextOpenMs?: number; packsOpenedInWindow: number } {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    console.warn('sessionStorage not available. Assuming pack can be opened.');
    return { canOpen: true, packsOpenedInWindow: 0 };
  }
  const now = Date.now();
  const timestamps = getPackOpenTimestamps();

  // Filter timestamps to only include those within the current PACK_WINDOW_MS relative to now
  const recentTimestamps = timestamps.filter(ts => (now - ts) < PACK_WINDOW_MS);

  if (recentTimestamps.length < MAX_PACKS_PER_WINDOW) {
    // User has opened fewer than MAX_PACKS_PER_WINDOW in the last PACK_WINDOW_MS
    return { canOpen: true, packsOpenedInWindow: recentTimestamps.length };
  } else {
    // User has already opened MAX_PACKS_PER_WINDOW in the last PACK_WINDOW_MS
    // Sort recent timestamps to find the earliest one that's part of the current full window
    recentTimestamps.sort((a, b) => a - b); // Oldest to newest
    const earliestBlockingTimestamp = recentTimestamps[0]; // This is the timestamp that makes the window full

    // The next pack can be opened PACK_WINDOW_MS after this earliestBlockingTimestamp
    const nextAvailableTime = earliestBlockingTimestamp + PACK_WINDOW_MS;
    const timeUntilNextOpenMs = Math.max(0, nextAvailableTime - now);

    return { canOpen: false, timeUntilNextOpenMs, packsOpenedInWindow: recentTimestamps.length };
  }
}

/**
 * Gets the number of packs opened within the current PACK_WINDOW_MS.
 * @returns {number} The count of recently opened packs.
 */
export function getPacksOpenedInCurrentWindow(): number {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    console.warn('sessionStorage not available. Returning 0 packs opened.');
    return 0;
  }
  const now = Date.now();
  const timestamps = getPackOpenTimestamps();
  const recentTimestamps = timestamps.filter(ts => (now - ts) < PACK_WINDOW_MS);
  return recentTimestamps.length;
}

/**
 * Clears all recorded pack opening timestamps from sessionStorage.
 */
export function clearPackOpenTimestamps(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(PACK_OPEN_TIMESTAMPS_KEY);
    }
  } catch (error) {
    console.error("Error clearing pack open timestamps from sessionStorage:", error);
  }
}
