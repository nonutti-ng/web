/**
 * Timezone-aware date formatting utilities
 * All dates from the server are assumed to be in UTC
 */

import { DateTime } from 'luxon';

/**
 * Check if timezone is a UTC offset (starts with + or -)
 */
function isUTCOffset(timezone: string): boolean {
    return timezone.startsWith('+') || timezone.startsWith('-');
}

/**
 * Convert UTC offset string to Luxon-compatible zone name
 * e.g., "+05:30" => "UTC+5:30", "-07:00" => "UTC-7"
 */
function normalizeTimezone(timezone: string): string {
    if (isUTCOffset(timezone)) {
        // Luxon expects "UTC+5:30" or "UTC-7" format
        return `UTC${timezone}`;
    }
    return timezone;
}

/**
 * Parse input to a Luxon DateTime object
 */
function parseToDateTime(date: string | Date | number, timezone: string): DateTime {
    const zone = normalizeTimezone(timezone);

    if (typeof date === 'string') {
        // Parse ISO string, assume it's in UTC
        return DateTime.fromISO(date, { zone: 'utc' }).setZone(zone);
    } else if (typeof date === 'number') {
        // Parse timestamp
        return DateTime.fromMillis(date, { zone: 'utc' }).setZone(zone);
    } else {
        // Parse Date object
        return DateTime.fromJSDate(date, { zone: 'utc' }).setZone(zone);
    }
}

/**
 * Format a date string (ISO or Date object) to a readable format in the specified timezone
 * @param date - ISO date string, Date object, or timestamp
 * @param timezone - IANA timezone string (e.g., 'America/New_York') or UTC offset (e.g., '+05:30')
 * @param formatString - Luxon format string (default: 'MMM d, yyyy')
 */
export function formatDateInTimezone(
    date: string | Date | number,
    timezone: string,
    formatString: string = 'MMM d, yyyy'
): string {
    try {
        const dt = parseToDateTime(date, timezone);

        if (!dt.isValid) {
            console.error('Invalid date:', dt.invalidReason);
            return 'Invalid date';
        }

        return dt.toFormat(formatString);
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
    const zone = normalizeTimezone(timezone);
    const now = DateTime.now().setZone(zone);
    return now.toJSDate();
}

/**
 * Get the start of today in the specified timezone
 * This is useful for date comparisons
 */
export function getTodayStartInTimezone(timezone: string): Date {
    const zone = normalizeTimezone(timezone);
    const now = DateTime.now().setZone(zone).startOf('day');
    return now.toJSDate();
}

/**
 * Format a date as "Today", "Yesterday", or the actual date
 */
export function formatRelativeDate(date: string | Date | number, timezone: string): string {
    try {
        const zone = normalizeTimezone(timezone);
        const targetDate = parseToDateTime(date, timezone).startOf('day');
        const today = DateTime.now().setZone(zone).startOf('day');

        if (!targetDate.isValid) {
            return 'Invalid date';
        }

        const diffDays = today.diff(targetDate, 'days').days;

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
    return DateTime.fromJSDate(date, { zone: 'utc' }).toISO() || '';
}

/**
 * Check if a date is today in the specified timezone
 */
export function isToday(date: string | Date | number, timezone: string): boolean {
    try {
        const zone = normalizeTimezone(timezone);
        const targetDate = parseToDateTime(date, timezone).startOf('day');
        const today = DateTime.now().setZone(zone).startOf('day');

        if (!targetDate.isValid) {
            return false;
        }

        return targetDate.equals(today);
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
    const zone = normalizeTimezone(timezone);

    // Create date at midnight on the specified day in the target timezone
    const dt = DateTime.fromObject(
        { year, month: 11, day, hour: 0, minute: 0, second: 0, millisecond: 0 },
        { zone }
    );

    return dt.toJSDate();
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
    const zone = normalizeTimezone(timezone);

    // Get current time in the target timezone
    const now = DateTime.now().setZone(zone);
    const currentYear = now.year;
    const currentMonth = now.month; // 1-indexed, November = 11

    // Determine target year - if we're in November or later, target next year
    let targetYear = currentYear;
    if (currentMonth >= 11) {
        targetYear = currentYear + 1;
    }

    // Create November 1st midnight in the target timezone
    const nov1 = DateTime.fromObject(
        { year: targetYear, month: 11, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
        { zone }
    );

    // Calculate difference
    const diff = nov1.diff(now, ['days', 'hours', 'minutes', 'seconds']);

    return {
        days: Math.floor(diff.days),
        hours: Math.floor(diff.hours % 24),
        minutes: Math.floor(diff.minutes % 60),
        seconds: Math.floor(diff.seconds % 60),
    };
}
