
/**
 * Format a date as "29th April 2025"
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  
  // Add ordinal suffix to the day
  const ordinalSuffix = getOrdinalSuffix(day);
  
  return `${day}${ordinalSuffix} ${month} ${year}`;
};

/**
 * Format a time as "5:00 PM"
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * Get the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};
