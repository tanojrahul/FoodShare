import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);

/**
 * Format a date based on the provided format style
 * @param {Date|string} date - The date to format
 * @param {string} formatStyle - Format style (default: 'YYYY-MM-DD')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatStyle = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  try {
    // Format mappings for common styles
    const formats = {
      'DD/MM/YYYY': 'DD/MM/YYYY',
      'MM/DD/YYYY': 'MM/DD/YYYY',
      'MMM DD, YYYY': 'MMM DD, YYYY',
      'MMMM DD, YYYY': 'MMMM DD, YYYY',
      'DD MMM YYYY': 'DD MMM YYYY',
      'YYYY-MM-DD': 'YYYY-MM-DD',
      'short': 'L', // Localized short date
      'long': 'LL', // Localized long date
      'time': 'LT', // Localized time
      'datetime': 'YYYY-MM-DD HH:mm:ss',
      'compact': 'YYYY/MM/DD',
      'iso': 'YYYY-MM-DDTHH:mm:ssZ'
    };

    // Use the mapped format or the provided format directly
    const format = formats[formatStyle] || formatStyle;
    
    return dayjs(date).format(format);
  } catch (error) {
    console.error('Date formatting error:', error);
    return String(date);
  }
};

/**
 * Convert timestamp to relative time (e.g., "2 hours ago")
 * @param {Date|string} timestamp - The timestamp to convert
 * @param {boolean} withoutSuffix - If true, removes the suffix/prefix (ago/in)
 * @returns {string} Human-readable relative time
 */
export const timeAgo = (timestamp, withoutSuffix = false) => {
  if (!timestamp) return '';
  
  try {
    return dayjs(timestamp).fromNow(withoutSuffix);
  } catch (error) {
    console.error('Relative time calculation error:', error);
    return String(timestamp);
  }
};

/**
 * Calculate the expiry status of an item
 * @param {Date|string} expirationDate - The expiration date to check
 * @returns {Object} Status object with type and message
 */
export const calculateExpiryStatus = (expirationDate) => {
  if (!expirationDate) {
    return { type: 'unknown', message: 'No expiration date', class: 'text-gray-500' };
  }
  
  try {
    const now = dayjs();
    const expiry = dayjs(expirationDate);
    
    // Already expired
    if (expiry.isBefore(now)) {
      return { 
        type: 'expired', 
        message: 'Expired', 
        class: 'text-red-600 bg-red-100' 
      };
    }
    
    // Calculate hours left
    const hoursLeft = expiry.diff(now, 'hour', true);
    
    // Expiring soon (less than 6 hours)
    if (hoursLeft <= 6) {
      return { 
        type: 'expiring-soon', 
        message: `Expires in ${Math.ceil(hoursLeft)} hour${Math.ceil(hoursLeft) !== 1 ? 's' : ''}`, 
        class: 'text-yellow-600 bg-yellow-100' 
      };
    }
    
    // Expiring today, but not soon
    if (expiry.isToday()) {
      return { 
        type: 'expiring-today', 
        message: 'Expires today', 
        class: 'text-orange-600 bg-orange-100' 
      };
    }
    
    // Valid and not expiring soon
    return { 
      type: 'valid', 
      message: `Expires in ${Math.floor(expiry.diff(now, 'day', true))} days`, 
      class: 'text-green-600 bg-green-100' 
    };
  } catch (error) {
    console.error('Expiry status calculation error:', error);
    return { type: 'error', message: 'Error calculating expiry', class: 'text-gray-500' };
  }
};

/**
 * Get hours left until a date
 * @param {Date|string} date - The target date
 * @returns {number} Hours remaining (negative if date is in the past)
 */
export const getHoursLeft = (date) => {
  if (!date) return 0;
  
  try {
    const now = dayjs();
    const targetDate = dayjs(date);
    return targetDate.diff(now, 'hour', true).toFixed(1);
  } catch (error) {
    console.error('Hours calculation error:', error);
    return 0;
  }
};

/**
 * Get the current date-time in the specified format
 * @param {string} format - Output format (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Current date-time string
 */
export const getCurrentDateTime = (format = 'YYYY-MM-DD HH:mm:ss') => {
  try {
    return dayjs().format(format);
  } catch (error) {
    console.error('Current date-time calculation error:', error);
    return new Date().toISOString();
  }
};

/**
 * Check if the date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  try {
    return dayjs(date).isToday();
  } catch (error) {
    console.error('isToday check error:', error);
    return false;
  }
};

/**
 * Format a date range
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {string} format - Date format to use
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate, format = 'MMM DD') => {
  if (!startDate || !endDate) return '';
  
  try {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    
    // If same day, return single date
    if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
      return start.format(format);
    }
    
    // If same month and year, format accordingly
    if (
      start.format('YYYY-MM') === end.format('YYYY-MM')
    ) {
      return `${start.format('MMM DD')} - ${end.format('DD, YYYY')}`;
    }
    
    // If same year, format accordingly
    if (start.format('YYYY') === end.format('YYYY')) {
      return `${start.format('MMM DD')} - ${end.format('MMM DD, YYYY')}`;
    }
    
    // Different years
    return `${start.format('MMM DD, YYYY')} - ${end.format('MMM DD, YYYY')}`;
  } catch (error) {
    console.error('Date range formatting error:', error);
    return `${String(startDate)} - ${String(endDate)}`;
  }
};

/**
 * Convert a time string to minutes
 * @param {string} timeStr - Time string (e.g., "1h 30m" or "90m")
 * @returns {number} Minutes
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  
  try {
    // Handle "Xh Ym" format
    if (timeStr.includes('h') || timeStr.includes('m')) {
      let totalMinutes = 0;
      
      // Extract hours
      const hourMatch = timeStr.match(/(\d+)h/);
      if (hourMatch) {
        totalMinutes += parseInt(hourMatch[1], 10) * 60;
      }
      
      // Extract minutes
      const minuteMatch = timeStr.match(/(\d+)m/);
      if (minuteMatch) {
        totalMinutes += parseInt(minuteMatch[1], 10);
      }
      
      return totalMinutes;
    } 
    
    // Handle numeric input (assume minutes)
    return parseInt(timeStr, 10) || 0;
  } catch (error) {
    console.error('Time to minutes conversion error:', error);
    return 0;
  }
};

/**
 * Format minutes into a readable time string
 * @param {number} minutes - Minutes to format
 * @returns {string} Formatted time string (e.g., "1h 30m")
 */
export const formatMinutes = (minutes) => {
  if (minutes === undefined || minutes === null) return '';
  
  try {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  } catch (error) {
    console.error('Minutes formatting error:', error);
    return String(minutes) + 'm';
  }
};

/**
 * Add specified time to a date
 * @param {Date|string} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit to add ('days', 'hours', 'minutes', etc.)
 * @returns {Date} New date
 */
export const addTime = (date, amount, unit) => {
  if (!date) return new Date();
  
  try {
    return dayjs(date).add(amount, unit).toDate();
  } catch (error) {
    console.error('Add time error:', error);
    return new Date();
  }
};

/**
 * Get a date with time set to the start/end of the day
 * @param {Date|string} date - Input date
 * @param {string} position - 'start' or 'end'
 * @returns {Date} Date with time set to start/end of day
 */
export const getDayBoundary = (date, position = 'start') => {
  if (!date) return new Date();
  
  try {
    const d = dayjs(date);
    return position === 'start' ? d.startOf('day').toDate() : d.endOf('day').toDate();
  } catch (error) {
    console.error('Day boundary calculation error:', error);
    return new Date();
  }
};

// Export all utilities as a default object
export default {
  formatDate,
  timeAgo,
  calculateExpiryStatus,
  getHoursLeft,
  getCurrentDateTime,
  isToday,
  formatDateRange,
  timeToMinutes,
  formatMinutes,
  addTime,
  getDayBoundary
};
