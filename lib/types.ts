interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null | undefined;
    createdAt: string;
    updatedAt: string;
    hasCompletedOnboarding: boolean;
}

interface TryWithEntries {
    try: Try;
    entries: Entry[];
}

interface Entry {
    entryId: string;
    tryId: string;
    date: string;
    status: string;
    createdAt: string;
    updatedAt: null;
}

interface Try {
    tryId: string;
    userId: string;
    year: string;
    state: string;
    createdAt: string;
    updatedAt: null;
}

interface RedditAccount {
    name: string;
    id: string;
    icon_img: string;
    created_utc: number;
    link_karma: number;
    comment_karma: number;
}
