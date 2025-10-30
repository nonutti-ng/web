'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage({}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check for OAuth errors
                const errorParam = searchParams.get('error');
                if (errorParam) {
                    setError(
                        'Authentication provider error. Please try again.',
                    );
                    setIsChecking(false);

                    setTimeout(() => {
                        if (window.opener) {
                            window.opener.postMessage(
                                { type: 'auth_error', error: errorParam },
                                window.location.origin,
                            );
                            window.close();
                        } else {
                            router.push('/');
                        }
                    }, 2000);
                    return;
                }

                // Redirect - the underlying page will refetch the session
                if (window.opener) {
                    window.opener.postMessage(
                        { type: 'auth_success' },
                        window.location.origin,
                    );
                    window.close();
                } else {
                    router.push('/');
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                setError('Authentication failed. Please try again.');
                setIsChecking(false);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className='min-h-screen flex items-center justify-center bg-background'>
            <div className='text-center space-y-4'>
                {error ? (
                    <>
                        <div className='w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center'>
                            <svg
                                className='w-8 h-8 text-destructive'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </div>
                        <h2 className='text-xl font-semibold text-foreground'>
                            Authentication Failed
                        </h2>
                        <p className='text-muted-foreground'>{error}</p>
                    </>
                ) : (
                    <>
                        <div className='w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center'>
                            <svg
                                className='w-8 h-8 text-primary animate-spin'
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
                        </div>
                        <h2 className='text-xl font-semibold text-foreground'>
                            {isChecking
                                ? 'Completing authentication...'
                                : 'Redirecting...'}
                        </h2>
                        <p className='text-muted-foreground'>
                            {isChecking
                                ? 'Please wait while we verify your credentials'
                                : 'Taking you back to the app'}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
