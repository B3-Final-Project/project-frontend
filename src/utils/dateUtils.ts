export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMsUntilTomorrow(): number {
  // Commented out for now because for development it's easier to have a fixed value
  // const now = new Date();
  // const tomorrow = new Date(now);
  // tomorrow.setDate(now.getDate() + 1);
  // tomorrow.setHours(0, 0, 0, 0);
  // return tomorrow.getTime() - now.getTime();


  // For development, return a fixed value (1 minute)
  return 60 *1000
}
