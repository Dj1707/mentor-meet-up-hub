
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indian Rupee currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string with ₹ symbol
 */
export function formatIndianRupee(amount: number, options: { decimals?: number } = {}) {
  const { decimals = 2 } = options;
  
  // Convert to string with fixed decimal places
  const numStr = amount.toFixed(decimals);
  
  // Split into whole and decimal parts
  const [whole, decimal] = numStr.split('.');
  
  // Format the whole part with Indian number system (commas after every 3 digits from right, then every 2)
  let formattedWhole = '';
  const wholeLength = whole.length;
  
  for (let i = 0; i < wholeLength; i++) {
    // Add comma after first 3 digits from right, then after every 2 digits
    if (i > 0 && (wholeLength - i) % 2 === 1 && (wholeLength - i) > 3) {
      formattedWhole += ',';
    } else if (i > 0 && (wholeLength - i) === 3) {
      formattedWhole += ',';
    }
    formattedWhole += whole[i];
  }
  
  // Return the formatted string with ₹ symbol and decimal part if needed
  return decimals > 0 
    ? `₹${formattedWhole}.${decimal}` 
    : `₹${formattedWhole}`;
}
