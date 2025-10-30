/**
 * Timezone-aware date formatting utilities
 * All dates from the server are assumed to be in UTC
 */

import { format, parseISO, addMinutes } from 'date-fns';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';

/**
 * Parse UTC offset string to minutes
 * e.g., "+05:30" => 330, "-07:00" => -420
 */
function parseUTCOffsetToMinutes(offset: string): number {
    const match = offset.match(/([+-])(\d{1,2}):?(\d{2})?/);
    if (!match) return 0;

    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2]);
    const minutes = parseInt(match[3] || '0');

    return sign * (hours * 60 + minutes);
}

/**
 * Check if timezone is a UTC offset (starts with + or -)
 */
function isUTCOffset(timezone: string): boolean {
    return timezone.startsWith('+') || timezone.startsWith('-');
}

/**
 * Format a date string (ISO or Date object) to a readable format in the specified timezone
 * @param date - ISO date string, Date object, or timestamp
 * @param timezone - IANA timezone string (e.g., 'America/New_York') or UTC offset (e.g., '+05:30')
 * @param formatString - date-fns format string (default: 'MMM d, yyyy')
 */
export function formatDateInTimezone(
    date: string | Date | number,
    timezone: string,
    formatString: string = 'MMM d, yyyy'
): string {
    try {
        let dateObj: Date;
        if (typeof date === 'string') {
            dateObj = parseISO(date);
        } else if (typeof date === 'number') {
            dateObj = new Date(date);
        } else {
            dateObj = date;
        }

        // Handle UTC offset format
        if (isUTCOffset(timezone)) {
            const offsetMinutes = parseUTCOffsetToMinutes(timezone);
            // Convert UTC date to the target offset
            const utcTime = dateObj.getTime();
            const localDate = new Date(utcTime + offsetMinutes * 60 * 1000);
            return format(localDate, formatString);
        }

        // Handle IANA timezone
        return formatInTimeZone(dateObj, timezone, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

/**
 * Format a date to just the date part (e.g., "Nov 15, 2025")
 */
export function formatDate(date: string | Date | number, timezone: string): string {
    return formatDateInTimezone(date, timezone, 'MMM d, yyyy');
}

/**
 * Format a date to date with day of week (e.g., "Mon, Nov 15, 2025")
 */
export function formatDateWithDay(date: string | Date | number, timezone: string): string {
    return formatDateInTimezone(date, timezone, 'EEE, MMM d, yyyy');
}

/**
 * Format a date to date and time (e.g., "Nov 15, 2025 3:45 PM")
 */
export function formatDateTime(date: string | Date | number, timezone: string): string {
    return formatDateInTimezone(date, timezone, 'MMM d, yyyy h:mm a');
}

/**
 * Format just the time (e.g., "3:45 PM")
 */
export function formatTime(date: string | Date | number, timezone: string): string {
    return formatDateInTimezone(date, timezone, 'h:mm a');
}

/**
 * Get current date in the specified timezone
 */
export function getCurrentDateInTimezone(timezone: string): Date {
    if (isUTCOffset(timezone)) {
        const now = new Date();
        const offsetMinutes = parseUTCOffsetToMinutes(timezone);
        return new Date(now.getTime() + offsetMinutes * 60 * 1000);
    }
    return toZonedTime(new Date(), timezone);
}

/**
 * Get the start of today in the specified timezone
 * This is useful for date comparisons
 */
export function getTodayStartInTimezone(timezone: string): Date {
    const now = toZonedTime(new Date(), timezone);
    now.setHours(0, 0, 0, 0);
    return now;
}

/**
 * Format a date as "Today", "Yesterday", or the actual date
 */
export function formatRelativeDate(date: string | Date | number, timezone: string): string {
    try {
        const targetDate = typeof date === 'string' ? parseISO(date) : new Date(date);
        const zonedTargetDate = toZonedTime(targetDate, timezone);
        const zonedToday = toZonedTime(new Date(), timezone);

        // Set to start of day for comparison
        zonedTargetDate.setHours(0, 0, 0, 0);
        zonedToday.setHours(0, 0, 0, 0);

        const diffTime = zonedToday.getTime() - zonedTargetDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays === -1) return 'Tomorrow';

        return formatDate(date, timezone);
    } catch (error) {
        console.error('Error formatting relative date:', error);
        return formatDate(date, timezone);
    }
}

/**
 * Convert a date to ISO string for API submission
 * The server expects UTC, so we convert from the user's timezone to UTC
 */
export function dateToUTC(date: Date): string {
    return date.toISOString();
}

/**
 * Check if a date is today in the specified timezone
 */
export function isToday(date: string | Date | number, timezone: string): boolean {
    try {
        const targetDate = typeof date === 'string' ? parseISO(date) : new Date(date);
        const zonedTargetDate = toZonedTime(targetDate, timezone);
        const zonedToday = toZonedTime(new Date(), timezone);

        return (
            zonedTargetDate.getFullYear() === zonedToday.getFullYear() &&
            zonedTargetDate.getMonth() === zonedToday.getMonth() &&
            zonedTargetDate.getDate() === zonedToday.getDate()
        );
    } catch (error) {
        console.error('Error checking if date is today:', error);
        return false;
    }
}

/**
 * Get a date string in the format the dashboard uses for comparison
 * Returns format: "Day Mon DD YYYY" (e.g., "Fri Nov 15 2025")
 */
export function getDateStringForComparison(date: string | Date | number, timezone: string): string {
    return formatDateInTimezone(date, timezone, 'EEE MMM dd yyyy');
}

/**
 * Create a date object for a specific day in November of a given year in the user's timezone
 * This is useful for the NNN calendar where we want day 1-30
 */
export function createNovemberDate(year: number, day: number, timezone: string): Date {
    if (isUTCOffset(timezone)) {
        // For UTC offsets, create the date in UTC then adjust
        const utcDate = new Date(Date.UTC(year, 10, day, 0, 0, 0, 0));
        const offsetMinutes = parseUTCOffsetToMinutes(timezone);
        // We want to return a date that when displayed will show the right day
        // So we adjust by the offset
        return new Date(utcDate.getTime() + offsetMinutes * 60 * 1000);
    }

    // Create date in the specified IANA timezone
    const dateStr = `${year}-11-${String(day).padStart(2, '0')}T00:00:00`;
    return toZonedTime(new Date(dateStr), timezone);
}

/**
 * Get the time until November 1st in the specified timezone
 */
export function getTimeUntilNovember(timezone: string): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
} {
    // Get current time
    const now = new Date();

    if (isUTCOffset(timezone)) {
        // Handle UTC offset
        const offsetMinutes = parseUTCOffsetToMinutes(timezone);

        // Get current time in the target timezone
        const nowInZone = new Date(now.getTime() + offsetMinutes * 60 * 1000);
        const currentYear = nowInZone.getUTCFullYear();
        const currentMonth = nowInZone.getUTCMonth(); // 0-indexed, November = 10

        // Determine target year - if we're in November or later, target next year
        let targetYear = currentYear;
        if (currentMonth >= 10) {
            targetYear = currentYear + 1;
        }

        // Create November 1st midnight in UTC
        const nov1UTC = new Date(Date.UTC(targetYear, 10, 1, 0, 0, 0, 0));

        // Adjust for the offset to get "Nov 1 midnight in this offset" as a UTC timestamp
        // If offset is +05:30, Nov 1 midnight there is Nov 1 00:00 - 5:30 = Oct 31 18:30 UTC
        const nov1MidnightInZone = new Date(nov1UTC.getTime() - offsetMinutes * 60 * 1000);

        // Calculate difference from now
        const difference = nov1MidnightInZone.getTime() - now.getTime();

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    // Handle IANA timezone
    // Convert current time to the user's timezone to check year/month
    const nowInZone = toZonedTime(now, timezone);
    const currentYear = nowInZone.getFullYear();
    const currentMonth = nowInZone.getMonth(); // 0-indexed, November = 10

    // Determine target year - if we're in November or later, target next year
    let targetYear = currentYear;
    if (currentMonth >= 10) {
        targetYear = currentYear + 1;
    }

    // Create a date representing "November 1st 00:00:00" in the target timezone
    // This creates a local date as if you're in that timezone
    const nov1LocalDate = new Date(targetYear, 10, 1, 0, 0, 0, 0);

    // Convert this "local time in target timezone" to UTC
    // fromZonedTime takes a date and treats it as if it were in the given timezone
    const nov1stUTC = fromZonedTime(nov1LocalDate, timezone);

    // Calculate difference from now
    const difference = nov1stUTC.getTime() - now.getTime();

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}
