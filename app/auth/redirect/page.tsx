'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function AuthRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        // Grab the query parameters from the URL (?provider=)
        const params = new URLSearchParams(window.location.search);
        const provider = params.get('provider') || 'discord';

        // Call better auth signin
        if (provider !== 'reddit') {
            authClient.signIn.social({
                provider,
                callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`,
            });
        } else {
            authClient.linkSocial({
                provider,
                callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback`,
            });
        }
    }, [router]);

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
                <p className='text-muted-foreground'>Redirecting...</p>
            </div>
        </div>
    );
}
