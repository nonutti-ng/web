'use client';

import { useState, useEffect } from 'react';
import { CountdownPage } from '@/components/countdown-page';
import { LandingPage } from '@/components/landing-page';
import { OnboardingPage } from '@/components/onboarding-page';
import { DashboardPage } from '@/components/dashboard-page';
import { MaintenancePage } from '@/components/maintenance-page';
import { NavBar } from '@/components/nav-bar';
import { ThemeToggle } from '@/components/theme-toggle';
import { AutoShowChangelog } from '@/components/changelog-dialog';
import { useSession, signOut } from '@/lib/auth-client';
import { apiController } from '@/lib/api-controller';

export default function Page() {
    const { data: session, isPending, refetch } = useSession();
    const [apiUser, setApiUser] = useState<User | null>(null);
    const [isNovember, setIsNovember] = useState(false);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [devOverride, setDevOverride] = useState(false);

    // Check if maintenance mode is enabled
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
    const maintenanceReason = process.env.NEXT_PUBLIC_MAINTENANCE_REASON || 'Major timezone refactoring';
    const maintenanceRedditUrl = process.env.NEXT_PUBLIC_MAINTENANCE_REDDIT_URL || 'https://reddit.com/r/nonutnovember';

    useEffect(() => {
        // Check if it's November
        const now = new Date();
        const month = now.getMonth();
        setIsNovember(month === 10); // November is month 10 (0-indexed)

        const storedDevOverride = localStorage.getItem('nnn_dev_override');
        if (storedDevOverride === 'true') {
            setDevOverride(true);
        }
    }, []);

    // Send me API request when session is available
    useEffect(() => {
        const fetchUser = async () => {
            if (session?.user) {
                try {
                    const user = await apiController.getMe();
                    setApiUser(user);
                    setHasCompletedOnboarding(user.hasCompletedOnboarding);
                } catch (error) {
                    console.error('Failed to fetch API user:', error);
                }
            } else {
                setApiUser(null);
                setHasCompletedOnboarding(false);
            }
        };

        fetchUser();
    }, [session]);

    const handleOnboardingComplete = async (data: {
        ageGroup: string;
        gender: string;
        previousParticipation: string;
        reason?: string;
        redditUsername?: string;
    }) => {
        try {
            await apiController.completeOnboarding({
                ...data,
                hasDoneState: data.previousParticipation,
            });

            setHasCompletedOnboarding(true);
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
            throw error;
        }
    };

    const toggleDevOverride = () => {
        const newValue = !devOverride;
        setDevOverride(newValue);
        localStorage.setItem('nnn_dev_override', String(newValue));
    };

    const handleLogout = async () => {
        // Sign out from Better Auth
        await signOut();
        setApiUser(null);
        setHasCompletedOnboarding(false);

        // Refresh page
        window.location.reload();
    };

    // Show maintenance page if enabled
    if (isMaintenanceMode) {
        return (
            <>
                <div className='fixed top-4 right-4 z-50'>
                    <ThemeToggle />
                </div>
                <MaintenancePage
                    reason={maintenanceReason}
                    redditPostUrl={maintenanceRedditUrl}
                />
            </>
        );
    }

    // Show loading state while checking session
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

    if (
        !isNovember &&
        process.env.NEXT_PUBLIC_DISABLE_COUNTDOWN_PAGE !== 'true'
    ) {
        return (
            <>
                <div className='fixed top-4 right-4 z-50 flex gap-2'>
                    <ThemeToggle />
                </div>
                <CountdownPage onDevOverride={toggleDevOverride} />
            </>
        );
    }

    // Show landing page if not authenticated
    if (!session?.user || !apiUser) {
        return (
            <>
                <div className='fixed top-4 right-4 z-50'>
                    <ThemeToggle />
                </div>
                <LandingPage onAuthComplete={refetch} />
            </>
        );
    }

    // Show onboarding if authenticated but not completed
    if (!hasCompletedOnboarding) {
        return (
            <>
                <div className='fixed top-4 right-4 z-50'>
                    <ThemeToggle />
                </div>
                <OnboardingPage onComplete={handleOnboardingComplete} />
            </>
        );
    }

    return (
        <>
            <NavBar
                userData={apiUser}
                onLogout={handleLogout}
                devOverride={devOverride}
                onToggleDevOverride={toggleDevOverride}
            />
            <DashboardPage userData={apiUser} />
            <AutoShowChangelog />
        </>
    );
}
