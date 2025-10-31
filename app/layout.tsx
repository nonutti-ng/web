import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { TimezoneProvider } from '@/lib/timezone-context';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'No Nut November - Challenge Tracker',
    description:
        'Track your No Nut November progress with daily check-ins and join thousands of participants worldwide in this month-long challenge.',
    keywords: [
        'No Nut November',
        'NNN',
        'Challenge',
        'Self-improvement',
        'Tracker',
        'Progress',
    ],
    authors: [{ name: 'NNN Community' }],
    openGraph: {
        title: 'No Nut November - Challenge Tracker',
        description:
            'Track your No Nut November progress with daily check-ins and join thousands of participants worldwide.',
        url: 'https://nonutti.ng',
        siteName: 'No Nut November Tracker',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'No Nut November - Challenge Tracker',
        description:
            'Track your No Nut November progress with daily check-ins and join thousands worldwide.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={`font-sans antialiased`}>
                <ThemeProvider defaultTheme='system' storageKey='nnn-theme'>
                    <TimezoneProvider>{children}</TimezoneProvider>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
