'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function LandingPage({
    onAuthComplete,
}: {
    onAuthComplete: () => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        // Listen for messages from the popup window
        const handleMessage = (event: MessageEvent) => {
            // Verify the origin matches our app
            if (event.origin !== window.location.origin) {
                return;
            }

            if (event.data.type === 'auth_success') {
                setIsLoading(false);
                onAuthComplete();
            } else if (event.data.type === 'auth_error') {
                setIsLoading(false);
                setAuthError('Authentication failed. Please try again.');
                setTimeout(() => setAuthError(null), 5000);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleDiscordAuth = () => {
        setIsLoading(true);
        setAuthError(null);

        // Open Discord OAuth in a popup window
        const authUrl = `${window.location.origin}/auth/redirect?provider=discord`;
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            authUrl,
            'Discord Authentication',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
        );

        // Check if popup was blocked
        if (!popup) {
            setIsLoading(false);
            setAuthError(
                'Popup was blocked. Please allow popups for this site.',
            );
            return;
        }

        // Poll to check if popup was closed without completing auth
        const pollTimer = setInterval(() => {
            if (popup.closed) {
                clearInterval(pollTimer);
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4'>
            <Card className='max-w-md w-full bg-card/50 backdrop-blur border-border/50'>
                <CardHeader className='text-center space-y-4'>
                    <div className='mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
                        <svg
                            className='w-8 h-8 text-primary'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                        </svg>
                    </div>
                    <CardTitle className='text-3xl font-bold'>
                        No Nut November
                    </CardTitle>
                    <CardDescription className='text-base'>
                        Join thousands in the ultimate self-control challenge
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {authError && (
                        <div className='p-3 rounded-lg bg-destructive/10 border border-destructive/20'>
                            <p className='text-sm text-destructive text-center'>
                                {authError}
                            </p>
                        </div>
                    )}
                    <div className='space-y-4'>
                        <div className='flex items-start gap-3'>
                            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                <svg
                                    className='w-3 h-3 text-primary'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className='text-sm font-medium text-foreground'>
                                    Track Your Progress
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    Daily check-ins to monitor your journey
                                </p>
                            </div>
                        </div>
                        <div className='flex items-start gap-3'>
                            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                <svg
                                    className='w-3 h-3 text-primary'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className='text-sm font-medium text-foreground'>
                                    Anonymous Data
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    All information is anonymized and secure
                                </p>
                            </div>
                        </div>
                        <div className='flex items-start gap-3'>
                            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                <svg
                                    className='w-3 h-3 text-primary'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className='text-sm font-medium text-foreground'>
                                    Community Support
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    Join a supportive community of participants
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleDiscordAuth}
                        disabled={isLoading}
                        className='w-full bg-[#5865F2] hover:bg-[#4752C4] text-white'
                        size='lg'
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className='w-5 h-5 mr-2 animate-spin'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                >
                                    <circle
                                        className='opacity-25'
                                        cx='12'
                                        cy='12'
                                        r='10'
                                        stroke='currentColor'
                                        strokeWidth='4'
                                    />
                                    <path
                                        className='opacity-75'
                                        fill='currentColor'
                                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                    />
                                </svg>
                                Connecting...
                            </>
                        ) : (
                            <>
                                <svg
                                    className='w-5 h-5 mr-2'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path d='M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' />
                                </svg>
                                Continue with Discord
                            </>
                        )}
                    </Button>

                    <p className='text-xs text-center text-muted-foreground'>
                        By continuing, you agree to our{' '}
                        <a
                            href='/privacy'
                            className='underline hover:text-foreground'
                        >
                            Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a
                            href='/terms'
                            className='underline hover:text-foreground'
                        >
                            Terms of Service
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
