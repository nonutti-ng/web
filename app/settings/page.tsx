'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { apiController } from '@/lib/api-controller';
import { NavBar } from '@/components/nav-bar';
import { SettingsPage as SettingsPageComponent } from '@/components/settings-page';

function SettingsPageContent() {
    const router = useRouter();
    const urlParams = useSearchParams();
    const { data: session, isPending } = useSession();
    const [apiUser, setApiUser] = useState<User | null>(null);
    const [currentTry, setCurrentTry] = useState<Try | null>(null);
    const [showLinkSuccess, setShowLinkSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user) {
                try {
                    const [user, tryData] = await Promise.all([
                        apiController.getMe(),
                        apiController.getCurrentTry().catch(() => null),
                    ]);
                    setApiUser(user);
                    setCurrentTry(tryData?.try || null);

                    // If we have a reddit_linked param, show a success message
                    if (urlParams.get('reddit_linked') === 'true')
                        setShowLinkSuccess(true);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            } else if (!isPending) {
                // Redirect to home if not authenticated
                router.push('/');
            }
        };

        fetchData();
    }, [session, isPending, router, urlParams]);

    const handleLogout = async () => {
        router.push('/');
    };

    if (isPending) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-background'>
                <div className='text-center space-y-4'>
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
                    <p className='text-muted-foreground'>Loading...</p>
                </div>
            </div>
        );
    }

    if (!session?.user || !apiUser) {
        return null;
    }

    return (
        <>
            <NavBar userData={apiUser} onLogout={handleLogout} />
            <SettingsPageComponent userData={apiUser} tryData={currentTry} didLinkReddit={showLinkSuccess} />
        </>
    );
}

export default function SettingsPage() {
    return (
        <Suspense
            fallback={
                <div className='min-h-screen flex items-center justify-center bg-background'>
                    <div className='text-center space-y-4'>
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
                        <p className='text-muted-foreground'>Loading...</p>
                    </div>
                </div>
            }
        >
            <SettingsPageContent />
        </Suspense>
    );
}
