'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MaintenancePageProps {
    reason?: string;
    redditPostUrl?: string;
}

export function MaintenancePage({
    reason = 'Major timezone refactoring',
    redditPostUrl = 'https://reddit.com/r/nonutnovember',
}: MaintenancePageProps) {
    return (
        <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4'>
            <div className='max-w-2xl w-full space-y-6'>
                <div className='text-center space-y-4'>
                    <div className='flex justify-center'>
                        <div className='w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center'>
                            <svg
                                className='w-10 h-10 text-amber-500'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className='text-4xl font-bold text-foreground'>
                        Under Maintenance
                    </h1>
                    <p className='text-lg text-muted-foreground'>
                        We&apos;re currently performing maintenance on
                        nonutti.ng
                    </p>
                </div>

                <Card className='bg-card/80 backdrop-blur border-border'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <svg
                                className='w-5 h-5 text-primary'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            What&apos;s happening?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <p className='text-muted-foreground leading-relaxed'>
                            We&apos;re currently working on:{' '}
                            <strong className='text-foreground'>
                                {reason}
                            </strong>
                        </p>

                        <div className='bg-primary/10 rounded-lg p-4 border border-primary/30'>
                            <p className='text-sm text-foreground/90'>
                                This maintenance is necessary to improve the
                                accuracy of check-ins and calendar displays for
                                users across all timezones.
                            </p>
                        </div>

                        {redditPostUrl && (
                            <div className='pt-2'>
                                <a
                                    href={redditPostUrl}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium'
                                >
                                    <svg
                                        className='w-5 h-5'
                                        fill='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path d='M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z' />
                                    </svg>
                                    Read more on Reddit
                                    <svg
                                        className='w-4 h-4'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                                        />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className='bg-card/80 backdrop-blur border-border'>
                    <CardContent className='pt-6'>
                        <div className='space-y-3'>
                            <div className='flex items-start gap-3'>
                                <div className='w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                    <svg
                                        className='w-4 h-4 text-green-500'
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
                                    <p className='font-semibold text-foreground'>
                                        Your data is safe
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        We'll have a migration plan in place for
                                        the timezone changes to ensure all your
                                        data remains intact.
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                    <svg
                                        className='w-4 h-4 text-blue-500'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className='font-semibold text-foreground'>
                                        We&apos;ll be back soon
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        This maintenance should be completed
                                        within a few days. We appreciate your
                                        patience!
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                    <svg
                                        className='w-4 h-4 text-purple-500'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                    >
                                        <path d='M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z' />
                                        <path d='M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z' />
                                    </svg>
                                </div>
                                <div>
                                    <p className='font-semibold text-foreground'>
                                        Questions?
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        Contact{' '}
                                        <strong className='text-foreground'>
                                            sticksdev
                                        </strong>{' '}
                                        on Discord or{' '}
                                        <strong className='text-foreground'>
                                            u/JustALinuxNerd17
                                        </strong>{' '}
                                        on Reddit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className='text-center text-sm text-muted-foreground'>
                    <p>Thank you for your patience and understanding! 💪</p>
                </div>
            </div>
        </div>
    );
}
