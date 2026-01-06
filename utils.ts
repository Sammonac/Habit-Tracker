
export const START_DATE = new Date('2026-01-06T00:00:00');

export const getLocalDateString = (offset: number = 0): string => {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

export const getCurrentDateString = (): string => {
  return START_DATE.toISOString().split('T')[0];
};

export const calculateStreak = (habitId: string, data: Record<string, Record<string, boolean>>): number => {
  const records = data[habitId] || {};
  let streak = 0;
  
  // Start from "today" (Jan 6, 2026) and count backwards
  for (let i = 0; i < 365; i++) {
    const dateStr = getLocalDateString(i);
    if (records[dateStr]) {
      streak++;
    } else {
      // If today isn't done yet, streak isn't necessarily broken if yesterday was done
      if (i === 0) continue;
      break;
    }
  }
  return streak;
};

export const getDisplayDate = (dateStr: string): string => {
  const parts = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(parts[1]) - 1]} ${parts[2]}`;
};
