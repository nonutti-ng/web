'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/nav-bar';
import { StatsPage } from '@/components/stats-page';
import { useSession, signOut } from '@/lib/auth-client';

export default function Stats() {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [devOverride, setDevOverride] = useState(false);

    useEffect(() => {
        const storedDevOverride = localStorage.getItem('nnn_dev_override');
        if (storedDevOverride === 'true') {
            setDevOverride(true);
        }
    }, []);

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    const toggleDevOverride = () => {
        const newValue = !devOverride;
        setDevOverride(newValue);
        localStorage.setItem('nnn_dev_override', String(newValue));
    };

    // Show loading state while checking auth
    if (isPending) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
                    <p className='mt-4 text-muted-foreground'>Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
    if (!session?.user) {
        router.push('/');
        return null;
    }

    return (
        <>
            <NavBar
                onLogout={handleLogout}
                devOverride={devOverride}
                onToggleDevOverride={toggleDevOverride}
                userData={session.user}
            />
            <StatsPage />
        </>
    );
}
