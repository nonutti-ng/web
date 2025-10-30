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
    description: 'Track your No Nut November progress with daily check-ins',
    generator: 'v0.app',
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
                    <TimezoneProvider>
                        {children}
                    </TimezoneProvider>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
