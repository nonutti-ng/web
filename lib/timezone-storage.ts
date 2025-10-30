/**
 * Timezone preference storage utility
 * Manages timezone preferences with localStorage fallback
 * Default timezone: America/New_York (EST/EDT)
 */

const TIMEZONE_STORAGE_KEY = 'nnn_user_timezone';
const DEFAULT_TIMEZONE = 'America/New_York'; // EST/EDT

export interface TimezonePreference {
    timezone: string;
    lastUpdated: string;
}

/**
 * Get the user's timezone preference
 * Priority: localStorage -> browser detection -> default (EST)
 */
export function getTimezonePreference(): string {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return DEFAULT_TIMEZONE;
    }

    try {
        // Try to get from localStorage first
        const stored = localStorage.getItem(TIMEZONE_STORAGE_KEY);
        if (stored) {
            const parsed: TimezonePreference = JSON.parse(stored);
            return parsed.timezone;
        }
    } catch (error) {
        console.warn('Failed to read timezone preference from localStorage:', error);
    }

    // Fallback to default EST
    return DEFAULT_TIMEZONE;
}

/**
 * Set the user's timezone preference
 */
export function setTimezonePreference(timezone: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const preference: TimezonePreference = {
            timezone,
            lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(TIMEZONE_STORAGE_KEY, JSON.stringify(preference));
    } catch (error) {
        console.error('Failed to save timezone preference to localStorage:', error);
    }
}

/**
 * Clear the timezone preference (resets to default)
 */
export function clearTimezonePreference(): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.removeItem(TIMEZONE_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear timezone preference from localStorage:', error);
    }
}

/**
 * Get browser's detected timezone (for auto-detection UI)
 */
export function getBrowserTimezone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        console.warn('Failed to detect browser timezone:', error);
        return DEFAULT_TIMEZONE;
    }
}

/**
 * Common timezone options for the UI
 */
export const COMMON_TIMEZONES = [
    { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
    { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
    { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKST/AKDT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET/CEST)' },
    { value: 'Asia/Tokyo', label: 'Japan Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST/AEDT)' },
] as const;

/**
 * Validates a UTC offset string
 * Accepts formats: +HH:MM, -HH:MM, +HHMM, -HHMM, +HH, -HH
 */
export function isValidUTCOffset(offset: string): boolean {
    // Match patterns like +05:30, -07:00, +0530, -0700, +05, -07
    const offsetPattern = /^[+-](?:(?:[0-1][0-9]|2[0-3])(?::?[0-5][0-9])?|[0-9](?::?[0-5][0-9])?)$/;
    return offsetPattern.test(offset);
}

/**
 * Normalizes a UTC offset to the format +HH:MM or -HH:MM
 */
export function normalizeUTCOffset(offset: string): string {
    if (!isValidUTCOffset(offset)) {
        return offset; // Return as-is if invalid
    }

    const sign = offset[0];
    const rest = offset.slice(1);

    // Remove colon if present
    const noColon = rest.replace(':', '');

    // Pad to 4 digits if needed
    let digits = noColon;
    if (digits.length === 1) {
        digits = `0${digits}00`;
    } else if (digits.length === 2) {
        digits = `${digits}00`;
    } else if (digits.length === 3) {
        digits = `0${digits}`;
    }

    // Extract hours and minutes
    const hours = digits.slice(0, 2);
    const minutes = digits.slice(2, 4);

    return `${sign}${hours}:${minutes}`;
}

/**
 * Checks if a timezone string is a UTC offset (vs IANA timezone name)
 */
export function isUTCOffset(timezone: string): boolean {
    return timezone.startsWith('+') || timezone.startsWith('-');
}
