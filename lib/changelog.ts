import { DateTime } from 'luxon';

export interface ChangelogEntry {
    id: string;
    version: string;
    date: string; // ISO date string (YYYY-MM-DD)
    title: string;
    description: string;
    changes: {
        type: 'feature' | 'improvement' | 'bugfix' | 'breaking';
        description: string;
    }[];
}

// Format changelog date using Luxon to avoid timezone issues
export function formatChangelogDate(
    dateString: string,
    timezone?: string,
): string {
    // Parse date in the user's timezone (or system timezone if not provided)
    const dt = DateTime.fromISO(dateString, { zone: timezone || 'system' });

    return dt.toLocaleString({
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export const CHANGELOGS: ChangelogEntry[] = [
    {
        id: 'v1.0.1',
        version: '1.0.1',
        date: '2025-11-01',
        title: 'Bug fix #1 and Improvements',
        description:
            "Various bug fixes and some minor improvements. I hope you are enjoying what I've built so far! As always, feel free to reach out with any feedback or issues (sticksdev on discord, or JustALuinxNerd17 on reddit).",
        changes: [
            {
                type: 'breaking',
                description:
                    'Removed discord scope guilds.join on login with Discord as it was not being used. Many other people raised privacy concerns about this scope, so I decided to remove it entirely to ease those concerns. No functionality was affected by this change. You may revoke this permission from your Discord settings if you had previously granted it.',
            },
            {
                type: 'feature',
                description:
                    "Settings page added! You can now customize your experience and manage your account settings.Including linking your Reddit account after onboarding (if you skipped it initially), and changing your timezone preference. We'll add more settings in the future!",
            },
            {
                type: 'feature',
                description:
                    "Added changelog feature to track new updates. This will show you what's new whenever we release a new version, so you can stay informed about the latest features and fixes.You can view the changelog from the settings page anytime, and we'll also show it automatically when there are new updates.",
            },
            {
                type: 'improvement',
                description:
                    'Improved timezone handling with Luxon library. Dates should now display more consistently across different browsers and regions, reducing issues related to timezone and how the UI displays dates and sometimes may allow you to send an incorrect date to the server.',
            },
            {
                type: 'bugfix',
                description:
                    'Fixed an issue where onboarding was failing to generate the survey ID when completing onboarding. Onboarding should now complete successfully every time.',
            },
            {
                type: 'bugfix',
                description:
                    'Fixed an issue when marking an existing day as out, would create a duplicate entry instead of updating the existing one. These duplicate entries have been cleaned up in the database.',
            },
            {
                type: 'bugfix',
                description:
                    'Fixed issues with ID generation when logging a day. Logging should error out much less frequently now.',
            },
        ],
    },
    // Add more changelog entries here as you release new versions
];

// Get the latest changelog entry
export function getLatestChangelog(): ChangelogEntry | null {
    return CHANGELOGS[0] || null;
}

// Get all changelogs
export function getAllChangelogs(): ChangelogEntry[] {
    return CHANGELOGS;
}

// Check if user has seen a specific changelog
export function hasSeenChangelog(changelogId: string): boolean {
    const seenChangelogs = getSeenChangelogs();
    return seenChangelogs.includes(changelogId);
}

// Get all seen changelogs
export function getSeenChangelogs(): string[] {
    if (typeof window === 'undefined') return [];
    const seen = localStorage.getItem('nnn_seen_changelogs');
    return seen ? JSON.parse(seen) : [];
}

// Mark a changelog as seen
export function markChangelogAsSeen(changelogId: string): void {
    if (typeof window === 'undefined') return;
    const seenChangelogs = getSeenChangelogs();
    if (!seenChangelogs.includes(changelogId)) {
        seenChangelogs.push(changelogId);
        localStorage.setItem(
            'nnn_seen_changelogs',
            JSON.stringify(seenChangelogs),
        );
    }
}

// Check if there are unseen changelogs
export function hasUnseenChangelogs(): boolean {
    const latest = getLatestChangelog();
    if (!latest) return false;
    return !hasSeenChangelog(latest.id);
}
