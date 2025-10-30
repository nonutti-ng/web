import APIError from './APIError';

export class APIController {
    constructor() {}

    async fetchFromAPI<T>(endpoint: string, options: RequestInit = {}) {
        const baseURL =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
        const url = `${baseURL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                ...(options.headers || {}),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Do we have an error message from the server?
            let errorMessage = 'Failed to fetch data.';
            let errorCode = '';
            try {
                const errorData = (await response.json()) as {
                    code?: string;
                    message?: string;
                };
                if (errorData.message) {
                    errorMessage = errorData.message;
                }

                if (errorData.code) {
                    errorCode = errorData.code;
                }
            } catch (e) {
                // Ignore JSON parse errors
            }

            throw new APIError(errorMessage, errorCode);
        }

        return response.json() as T;
    }

    async getMe(): Promise<User> {
        return this.fetchFromAPI<User>('/users/me');
    }

    async completeOnboarding(data: {
        ageGroup: string;
        gender: string;
        hasDoneState: string;
        reason?: string;
    }): Promise<void> {
        await this.fetchFromAPI<void>('/users/onboard', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async log(status: 'in' | 'out'): Promise<{ id: string }> {
        return this.fetchFromAPI<{ id: string }>('/tries/me/log', {
            method: 'POST',
            body: JSON.stringify({ status }),
        });
    }

    async logPrevious(
        date: string,
        status: 'in' | 'out',
    ): Promise<{ id: string }> {
        return this.fetchFromAPI<{ id: string }>('/tries/me/log', {
            method: 'POST',
            body: JSON.stringify({ date, status }),
        });
    }

    async getCurrentTry(): Promise<TryWithEntries> {
        return this.fetchFromAPI<TryWithEntries>('/tries/me/current');
    }

    async failTry(entryId: string): Promise<void> {
        await this.fetchFromAPI<void>(`/tries/me/${entryId}/fail`, {
            method: 'POST',
        });
    }

    async getLinkedReddit(): Promise<RedditAccount | null> {
        return this.fetchFromAPI<RedditAccount | null>('/users/me/reddit');
    }
}

// Export a singleton instance for use in the app
export const apiController = new APIController();
