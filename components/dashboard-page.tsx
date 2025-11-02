'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiController } from '@/lib/api-controller';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import APIError from '@/lib/APIError';
import { APIAlert } from './api-alert';
import { useTimezone } from '@/lib/timezone-context';
import {
    getDateStringForComparison,
    createNovemberDate,
    dateToUTC,
    getCurrentDateInTimezone,
} from '@/lib/date-utils';

interface DashboardPageProps {
    userData: User | null;
}

export function DashboardPage({ userData }: DashboardPageProps) {
    const { timezone } = useTimezone();
    const [status, setStatus] = useState<'in' | 'out'>('in');
    const [checkIns, setCheckIns] = useState<
        { id: string; date: string; status: 'in' | 'out' }[]
    >([]);
    const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [canConfirm, setCanConfirm] = useState(false);
    const [showSurveyDialog, setShowSurveyDialog] = useState(false);
    const [surveyReason, setSurveyReason] = useState('');
    const [surveyOtherText, setSurveyOtherText] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [apiError, setApiError] = useState<APIError | null>(null);
    const [showPreviousDayDialog, setShowPreviousDayDialog] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedDayStatus, setSelectedDayStatus] = useState<
        'in' | 'out' | null
    >(null);
    const [showFailDialog, setShowFailDialog] = useState(false);
    const [failCountdown, setFailCountdown] = useState(5);
    const [canConfirmFail, setCanConfirmFail] = useState(false);
    const [showTimezoneNotice, setShowTimezoneNotice] = useState(true);

    useEffect(() => {
        const fetchCurrentTry = async () => {
            try {
                const tryData = await apiController.getCurrentTry();

                // Convert entries to the format used by the dashboard
                // Use timezone-aware date formatting
                // NOTE: Entry dates from server are UTC timestamps. When converted to user's timezone,
                // they may appear on a different calendar day than when the user clicked the button.
                // For example: User in UTC-5 checks in at 11 PM on Nov 2. Server records 4 AM Nov 3 UTC.
                // When displayed, it converts back to Nov 2, 11 PM in UTC-5 timezone.
                const formattedCheckIns = tryData.entries.map((entry) => ({
                    id: entry.entryId,
                    date: getDateStringForComparison(entry.date, timezone),
                    status: entry.status as 'in' | 'out',
                }));

                setCheckIns(formattedCheckIns);

                // Set status based on try state
                const currentStatus = tryData.try.state as 'in' | 'out';
                setStatus(currentStatus);

                // Check if already checked in today
                // Due to timezone differences between server (UTC) and user, we need to check
                // if there's an entry for today OR if the most recent entry was created within
                // the last 24 hours (to handle cases where server timestamp differs from user's local day)
                const todayInTimezone = getCurrentDateInTimezone(timezone);
                const today = getDateStringForComparison(todayInTimezone, timezone);

                // First check for exact date match
                let todayCheckIn = formattedCheckIns.find((c) => c.date === today);

                // If no exact match, check if the most recent entry is from within the last 20 hours
                // This handles the case where the server's UTC timestamp puts it on a different day
                if (!todayCheckIn && formattedCheckIns.length > 0) {
                    const mostRecentEntry = tryData.entries.reduce((latest, entry) => {
                        const entryTime = new Date(entry.date).getTime();
                        const latestTime = new Date(latest.date).getTime();
                        return entryTime > latestTime ? entry : latest;
                    });

                    const mostRecentTime = new Date(mostRecentEntry.date).getTime();
                    const now = Date.now();
                    const hoursSinceLastEntry = (now - mostRecentTime) / (1000 * 60 * 60);

                    // If the most recent entry was within the last 20 hours, consider it as today
                    // 20 hours accounts for timezone differences and gives reasonable margin
                    if (hoursSinceLastEntry < 20) {
                        todayCheckIn = formattedCheckIns.find(
                            (c) => c.id === mostRecentEntry.entryId
                        );
                    }
                }

                if (todayCheckIn) {
                    setHasCheckedInToday(true);
                } else {
                    setHasCheckedInToday(false);
                }
            } catch (error) {
                console.error('Failed to load dashboard data:', error);

                if (error instanceof APIError) {
                    setApiError(error);
                } else {
                    setApiError(
                        new APIError('An unknown error occurred.', 'unknown'),
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentTry();
    }, [timezone]);

    useEffect(() => {
        if (showConfirmDialog && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanConfirm(true);
        }
    }, [showConfirmDialog, countdown]);

    useEffect(() => {
        if (showFailDialog && failCountdown > 0) {
            const timer = setTimeout(() => {
                setFailCountdown(failCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (failCountdown === 0) {
            setCanConfirmFail(true);
        }
    }, [showFailDialog, failCountdown]);

    const handleCheckIn = async (newStatus: 'in' | 'out') => {
        if (newStatus === 'out') {
            setShowConfirmDialog(true);
            setCountdown(5);
            setCanConfirm(false);
            return;
        }

        setIsCheckingIn(true);

        try {
            // Call the API to log the status
            const result = await apiController.log(newStatus);

            const todayInTimezone = getCurrentDateInTimezone(timezone);
            const today = getDateStringForComparison(todayInTimezone, timezone);
            const newCheckIn = {
                id: result.id,
                date: today,
                status: newStatus,
            };

            const updatedCheckIns = checkIns.filter((c) => c.date !== today);
            updatedCheckIns.push(newCheckIn);

            setCheckIns(updatedCheckIns);
            setStatus(newStatus);
            setHasCheckedInToday(true);

            // Show celebration for staying IN
            if (newStatus === 'in') {
                setShowCelebration(true);
                setTimeout(() => {
                    const banner =
                        document.getElementById('celebration-banner');
                    if (banner) {
                        banner.classList.add(
                            'animate-out',
                            'fade-out',
                            'slide-out-to-top',
                            'duration-300',
                        );
                        setTimeout(() => setShowCelebration(false), 300);
                    }
                }, 2700);
            }
        } catch (error) {
            console.error('Failed to log IN status:', error);

            if (error instanceof APIError) {
                console.log('Setting API error state:', error);
                setApiError(error);
            } else {
                setApiError(
                    new APIError('An unknown error occurred.', 'unknown'),
                );
            }
        } finally {
            setIsCheckingIn(false);
        }
    };

    const handleConfirmOut = () => {
        setShowConfirmDialog(false);
        setShowSurveyDialog(true);
    };

    const handleSurveySubmit = async () => {
        setShowSurveyDialog(false);
        setIsCheckingIn(true);

        try {
            const todayInTimezone = getCurrentDateInTimezone(timezone);
            const today = getDateStringForComparison(todayInTimezone, timezone);

            // Check if there's already an entry for today
            const existingEntry = checkIns.find((c) => c.date === today);

            if (existingEntry) {
                // If already checked in today, fail the existing entry
                await apiController.failTry(existingEntry.id);

                // Update local state
                const newCheckIn = {
                    id: existingEntry.id,
                    date: today,
                    status: 'out' as const,
                };

                const updatedCheckIns = checkIns.filter((c) => c.date !== today);
                updatedCheckIns.push(newCheckIn);

                setCheckIns(updatedCheckIns);
            } else {
                // No existing entry, create a new OUT log
                const result = await apiController.log('out');

                const newCheckIn = {
                    id: result.id,
                    date: today,
                    status: 'out' as const,
                };

                const updatedCheckIns = checkIns.filter((c) => c.date !== today);
                updatedCheckIns.push(newCheckIn);

                setCheckIns(updatedCheckIns);
            }

            setStatus('out');
            setHasCheckedInToday(true);

            // TODO: Send survey data to backend API if needed
            // const surveyData = {
            //     date: today,
            //     reason: surveyReason,
            //     otherText: surveyReason === 'other' ? surveyOtherText : '',
            // };

            // Reset survey state
            setSurveyReason('');
            setSurveyOtherText('');
        } catch (error) {
            console.error('Failed to log OUT status:', error);
            if (error instanceof APIError) {
                setApiError(error);
            } else {
                setApiError(
                    new APIError('An unknown error occurred.', 'unknown'),
                );
            }
        } finally {
            setIsCheckingIn(false);
        }
    };

    const handleSurveySkip = async () => {
        setShowSurveyDialog(false);
        setIsCheckingIn(true);

        try {
            const todayInTimezone = getCurrentDateInTimezone(timezone);
            const today = getDateStringForComparison(todayInTimezone, timezone);

            // Check if there's already an entry for today
            const existingEntry = checkIns.find((c) => c.date === today);

            if (existingEntry) {
                // If already checked in today, fail the existing entry
                await apiController.failTry(existingEntry.id);

                // Update local state
                const newCheckIn = {
                    id: existingEntry.id,
                    date: today,
                    status: 'out' as const,
                };

                const updatedCheckIns = checkIns.filter((c) => c.date !== today);
                updatedCheckIns.push(newCheckIn);

                setCheckIns(updatedCheckIns);
            } else {
                // No existing entry, create a new OUT log
                const result = await apiController.log('out');

                const newCheckIn = {
                    id: result.id,
                    date: today,
                    status: 'out' as const,
                };

                const updatedCheckIns = checkIns.filter((c) => c.date !== today);
                updatedCheckIns.push(newCheckIn);

                setCheckIns(updatedCheckIns);
            }

            setStatus('out');
            setHasCheckedInToday(true);

            // Reset survey state
            setSurveyReason('');
            setSurveyOtherText('');
        } catch (error) {
            console.error('Failed to log OUT status:', error);
            if (error instanceof APIError) {
                setApiError(error);
            } else {
                setApiError(
                    new APIError('An unknown error occurred.', 'unknown'),
                );
            }
        } finally {
            setIsCheckingIn(false);
        }
    };

    const handleDayClick = (day: number) => {
        const currentDay = getDaysInNovember();

        // Don't allow clicking future days or today (today uses the main buttons)
        if (day >= currentDay) {
            return;
        }

        // Find existing check-in for this day
        const dayDate = createNovemberDate(2025, day, timezone);
        const dayDateString = getDateStringForComparison(dayDate, timezone);
        const existingCheckIn = checkIns.find((c) => c.date === dayDateString);

        setSelectedDay(day);
        setSelectedDayStatus(existingCheckIn?.status || null);
        setShowPreviousDayDialog(true);
    };

    const handlePreviousDaySubmit = async () => {
        if (selectedDay === null || selectedDayStatus === null) return;

        setIsCheckingIn(true);

        try {
            // Create date for the selected day in the user's timezone
            const dayDate = createNovemberDate(2025, selectedDay, timezone);
            const isoDate = dateToUTC(dayDate);

            // Call API to log previous day
            const result = await apiController.logPrevious(
                isoDate,
                selectedDayStatus,
            );

            // Update local state
            const dayDateString = getDateStringForComparison(dayDate, timezone);
            const newCheckIn = {
                id: result.id,
                date: dayDateString,
                status: selectedDayStatus,
            };

            const updatedCheckIns = checkIns.filter(
                (c) => c.date !== dayDateString,
            );
            updatedCheckIns.push(newCheckIn);
            setCheckIns(updatedCheckIns);

            // If marking as OUT, update overall status
            if (selectedDayStatus === 'out') {
                setStatus('out');
            }

            setShowPreviousDayDialog(false);
            setSelectedDay(null);
            setSelectedDayStatus(null);
        } catch (error) {
            console.error('Failed to log previous day:', error);
            if (error instanceof APIError) {
                setApiError(error);
            } else {
                setApiError(
                    new APIError('An unknown error occurred.', 'unknown'),
                );
            }
        } finally {
            setIsCheckingIn(false);
        }
    };

    const handleFailDayClick = () => {
        setShowPreviousDayDialog(false);
        setShowFailDialog(true);
        setFailCountdown(5);
        setCanConfirmFail(false);
    };

    const handleConfirmFail = async () => {
        if (selectedDay === null) return;

        setIsCheckingIn(true);

        try {
            // Find the entry for this day
            const dayDate = createNovemberDate(2025, selectedDay, timezone);
            const dayDateString = getDateStringForComparison(dayDate, timezone);
            const existingCheckIn = checkIns.find(
                (c) => c.date === dayDateString,
            );

            if (!existingCheckIn) {
                throw new APIError('No entry found for this day', 'no_entry');
            }

            // Mark as OUT using failTry
            await apiController.failTry(existingCheckIn.id);

            // Update local state
            const newCheckIn = {
                id: existingCheckIn.id,
                date: dayDateString,
                status: 'out' as const,
            };
            const updatedCheckIns = checkIns.filter(
                (c) => c.date !== dayDateString,
            );
            updatedCheckIns.push(newCheckIn);
            setCheckIns(updatedCheckIns);
            setStatus('out');

            setShowFailDialog(false);
            setSelectedDay(null);
            setSelectedDayStatus(null);
        } catch (error) {
            console.error('Failed to mark day as failed:', error);
            if (error instanceof APIError) {
                setApiError(error);
            } else {
                setApiError(
                    new APIError('An unknown error occurred.', 'unknown'),
                );
            }
        } finally {
            setIsCheckingIn(false);
        }
    };

    const getDaysInNovember = () => {
        const now = getCurrentDateInTimezone(timezone);
        const currentDay = now.getDate();
        return currentDay;
    };

    const getSuccessfulDays = () => {
        return checkIns.filter((c) => c.status === 'in').length;
    };

    const getProgress = () => {
        const totalDays = 30;
        const currentDay = getDaysInNovember();
        return (currentDay / totalDays) * 100;
    };

    // Helper function to determine if a day should be visually marked as OUT
    const isDayVisuallyOut = (day: number) => {
        const dayDate = createNovemberDate(2025, day, timezone);
        const dayDateString = getDateStringForComparison(dayDate, timezone);
        const checkIn = checkIns.find((c) => c.date === dayDateString);

        // If there's an actual OUT entry, mark it as OUT
        if (checkIn?.status === 'out') {
            return true;
        }

        // If user is currently OUT, mark all days after the first OUT day as OUT
        if (status === 'out') {
            const firstOutDay = checkIns.find((c) => c.status === 'out');
            if (firstOutDay) {
                // Parse the date string back to a Date object
                // The format is "EEE MMM dd yyyy"
                const firstOutDate = new Date(firstOutDay.date);
                const firstOutDayNum = firstOutDate.getDate();
                // Mark all days from the first OUT day onwards, including future days
                if (day >= firstOutDayNum) {
                    return true;
                }
            }
        }

        return false;
    };

    const currentDay = getDaysInNovember();
    const successfulDays = getSuccessfulDays();
    const progress = getProgress();

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 md:p-8'>
                <div className='max-w-4xl mx-auto space-y-6'>
                    <div className='text-center space-y-2 animate-pulse'>
                        <div className='h-12 bg-muted rounded-lg w-64 mx-auto' />
                        <div className='h-4 bg-muted rounded w-48 mx-auto' />
                    </div>
                    <Card className='bg-card/50 backdrop-blur border-border/50'>
                        <CardHeader>
                            <div className='h-6 bg-muted rounded w-32 animate-pulse' />
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='w-32 h-32 rounded-full bg-muted mx-auto animate-pulse' />
                            <div className='space-y-2'>
                                <div className='h-10 bg-muted rounded animate-pulse' />
                                <div className='h-10 bg-muted rounded animate-pulse' />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    } else if (isLoading === false && !userData && apiError != null) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 md:p-8'>
                <div className='max-w-4xl mx-auto space-y-6'>
                    {/* API Error Alert */}
                    {apiError && (
                        <APIAlert
                            error_reason={apiError.message}
                            code={apiError.code}
                            details={
                                apiError.details
                                    ? String(apiError.details)
                                    : undefined
                            }
                        />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4 md:p-8'>
            <div className='max-w-4xl mx-auto space-y-6'>
                {/* API Error Alert */}
                {apiError && (
                    <APIAlert
                        error_reason={apiError.message}
                        code={apiError.code}
                        details={
                            apiError.details
                                ? String(apiError.details)
                                : undefined
                        }
                    />
                )}

                {/* Timezone Notice */}
                {showTimezoneNotice && (
                    <div className='bg-gradient-to-r from-blue-500/15 via-blue-400/10 to-blue-500/15 border-l-4 border-blue-500 rounded-lg p-4 backdrop-blur shadow-lg'>
                        <div className='flex items-start gap-3'>
                            <div className='flex-shrink-0'>
                                <div className='w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center'>
                                    <svg
                                        className='w-5 h-5 text-blue-500'
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
                            </div>
                            <div className='flex-1 space-y-2'>
                                <div className='flex items-start justify-between gap-2'>
                                    <h3 className='text-sm font-bold text-blue-700 dark:text-blue-300'>
                                        📢 Server Timezone Announcement
                                    </h3>
                                    <button
                                        onClick={() => setShowTimezoneNotice(false)}
                                        className='flex-shrink-0 text-blue-600/60 hover:text-blue-600 dark:text-blue-400/60 dark:hover:text-blue-400 transition-colors'
                                        aria-label='Dismiss notice'
                                    >
                                        <svg
                                            className='w-5 h-5'
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
                                    </button>
                                </div>
                                <p className='text-sm text-blue-700/90 dark:text-blue-300/90 leading-relaxed'>
                                    The server runs in <strong className='font-semibold'>UTC time</strong> and may not accept a check-in until it&apos;s the next day in UTC. This prevents duplicates and spam/abuse.
                                </p>
                                <div className='bg-blue-500/10 rounded-md p-3 border border-blue-500/30'>
                                    <p className='text-xs text-blue-700/90 dark:text-blue-300/90 leading-relaxed'>
                                        <strong className='font-semibold'>Seeing errors T1001 or T1006?</strong> Please wait until it&apos;s the next day in UTC. If it&apos;s way past midnight UTC and you&apos;re still getting these errors, contact <strong className='font-semibold'>sticksdev</strong> on Discord or <strong className='font-semibold'>u/JustALinuxNerd17</strong> on Reddit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Celebration Banner */}
                {showCelebration && (
                    <div
                        id='celebration-banner'
                        className='animate-in slide-in-from-top duration-500'
                    >
                        <Card className='bg-gradient-to-r from-green-500/20 via-green-400/10 to-green-500/20 border-green-500/50 backdrop-blur'>
                            <CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='flex-shrink-0'>
                                        <div className='w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center animate-in zoom-in duration-300'>
                                            <svg
                                                className='w-7 h-7 text-green-500'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='text-lg font-bold text-green-600 dark:text-green-400'>
                                            Another Day Strong! 💪
                                        </h3>
                                        <p className='text-sm text-green-600/80 dark:text-green-400/80'>
                                            You're doing amazing! Keep up the
                                            great work, champion!
                                        </p>
                                    </div>
                                    <div className='flex-shrink-0'>
                                        <div className='text-3xl animate-bounce'>
                                            🎉
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card
                    className={`backdrop-blur border-border/50 ${
                        status === 'out'
                            ? 'bg-red-500/10 border-red-500/50'
                            : 'bg-card/50'
                    }`}
                >
                    <CardHeader>
                        <CardTitle
                            className={status === 'out' ? 'text-red-500' : ''}
                        >
                            {status === 'out'
                                ? 'Challenge Failed'
                                : 'Current Status'}
                        </CardTitle>
                        <CardDescription
                            className={status === 'out' ? 'text-red-400' : ''}
                        >
                            {status === 'in'
                                ? 'You are currently IN'
                                : 'You are OUT for the rest of November'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='flex items-center justify-center'>
                            <div
                                className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold transition-all duration-300 ${
                                    status === 'in'
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'bg-red-500/30 text-red-500 ring-4 ring-red-500/20'
                                }`}
                            >
                                {status === 'in' ? 'IN' : 'OUT'}
                            </div>
                        </div>

                        {status === 'out' && (
                            <div className='text-center space-y-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30'>
                                <AlertTriangle className='h-8 w-8 text-red-500 mx-auto' />
                                <p className='font-semibold text-red-500'>
                                    Challenge Failed
                                </p>
                                <p className='text-sm text-red-400'>
                                    You are OUT for the rest of November. Better
                                    luck next year!
                                </p>
                            </div>
                        )}

                        {status === 'in' && !hasCheckedInToday && (
                            <div className='space-y-3'>
                                <p className='text-center text-sm text-muted-foreground'>
                                    Check in for today - Are you still in?
                                </p>
                                <div className='flex gap-3'>
                                    <Button
                                        onClick={() => handleCheckIn('in')}
                                        disabled={isCheckingIn}
                                        className='flex-1 bg-green-600 hover:bg-green-700 text-white'
                                        size='lg'
                                    >
                                        {isCheckingIn ? (
                                            <svg
                                                className='w-5 h-5 animate-spin'
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
                                        ) : (
                                            'Still IN'
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => handleCheckIn('out')}
                                        disabled={isCheckingIn}
                                        variant='destructive'
                                        className='flex-1'
                                        size='lg'
                                    >
                                        {isCheckingIn ? (
                                            <svg
                                                className='w-5 h-5 animate-spin'
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
                                        ) : (
                                            "I'm OUT"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {hasCheckedInToday && status === 'in' && (
                            <div className='space-y-3'>
                                <div className='text-center'>
                                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium'>
                                        <svg
                                            className='w-4 h-4'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                        Checked in for today
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <p className='text-xs text-muted-foreground mb-2'>
                                        Need to update your status?
                                    </p>
                                    <Button
                                        onClick={() => handleCheckIn('out')}
                                        disabled={isCheckingIn}
                                        variant='destructive'
                                        size='sm'
                                    >
                                        Mark as OUT
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Progress Card */}
                <Card className='bg-card/50 backdrop-blur border-border/50'>
                    <CardHeader>
                        <CardTitle>November Progress</CardTitle>
                        <CardDescription>
                            Day {currentDay} of 30
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    Progress
                                </span>
                                <span className='font-medium'>
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress value={progress} className='h-3' />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='p-4 rounded-lg bg-accent/50 border border-border'>
                                <div className='text-3xl font-bold text-foreground'>
                                    {successfulDays}
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    Successful Days
                                </div>
                            </div>
                            <div className='p-4 rounded-lg bg-accent/50 border border-border'>
                                <div className='text-3xl font-bold text-foreground'>
                                    {30 - currentDay}
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    Days Remaining
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Calendar View */}
                <Card className='bg-card/50 backdrop-blur border-border/50'>
                    <CardHeader>
                        <CardTitle>Check-in Calendar</CardTitle>
                        <CardDescription>
                            Your daily progress throughout November
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-7 gap-3'>
                            {Array.from({ length: 30 }, (_, i) => {
                                const day = i + 1;
                                // Create the date string for this day to compare with checkIns
                                const dayDate = createNovemberDate(2025, day, timezone);
                                const dayDateString = getDateStringForComparison(dayDate, timezone);
                                const checkIn = checkIns.find((c) => c.date === dayDateString);
                                const isPast = day < currentDay;
                                const isToday = day === currentDay;
                                const isVisuallyOut = isDayVisuallyOut(day);
                                // Today should only show as "needs check-in" if there's no check-in yet
                                const isTodayNeedsCheckIn = isToday && !checkIn && !isVisuallyOut;
                                const hasMissingData =
                                    isPast && !checkIn && !isVisuallyOut;
                                // Tiles are clickable if: past day, not visually OUT, not OUT entry
                                const isClickable =
                                    isPast &&
                                    !isVisuallyOut &&
                                    checkIn?.status !== 'out';

                                return (
                                    <button
                                        key={day}
                                        onClick={() =>
                                            isClickable && handleDayClick(day)
                                        }
                                        disabled={!isClickable}
                                        className={`group relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                                            isVisuallyOut
                                                ? 'bg-gradient-to-br from-red-500/30 to-red-600/20 border-red-500/70 text-red-600 dark:text-red-400 shadow-lg shadow-red-500/20'
                                                : checkIn?.status === 'in'
                                                ? 'bg-gradient-to-br from-green-500/30 to-green-600/20 border-green-500/70 text-green-600 dark:text-green-400 shadow-lg shadow-green-500/20 hover:scale-105 cursor-pointer'
                                                : hasMissingData
                                                ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:scale-105 hover:border-amber-500 cursor-pointer'
                                                : isPast
                                                ? 'bg-muted/30 border-border/50 text-muted-foreground/70'
                                                : isTodayNeedsCheckIn
                                                ? 'bg-gradient-to-br from-primary/30 to-primary/20 border-primary text-primary ring-4 ring-primary/20 shadow-xl shadow-primary/30 animate-pulse'
                                                : 'bg-background/50 border-border/30 text-muted-foreground/50 cursor-not-allowed'
                                        }`}
                                    >
                                        <span
                                            className={`text-base transition-opacity ${
                                                hasMissingData
                                                    ? 'group-hover:opacity-0'
                                                    : ''
                                            }`}
                                        >
                                            {day}
                                        </span>
                                        {checkIn?.status === 'in' &&
                                            !isVisuallyOut && (
                                                <svg
                                                    className='absolute -top-1 -right-1 w-4 h-4 text-green-500 animate-in zoom-in duration-300'
                                                    fill='currentColor'
                                                    viewBox='0 0 20 20'
                                                >
                                                    <path
                                                        fillRule='evenodd'
                                                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                                        clipRule='evenodd'
                                                    />
                                                </svg>
                                            )}
                                        {isVisuallyOut && (
                                            <svg
                                                className='absolute -top-1 -right-1 w-4 h-4 text-red-500'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        )}
                                        {hasMissingData && (
                                            <>
                                                <div className='absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                                    <svg
                                                        className='w-5 h-5 text-amber-600 dark:text-amber-400'
                                                        fill='none'
                                                        stroke='currentColor'
                                                        viewBox='0 0 24 24'
                                                    >
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            strokeWidth={2}
                                                            d='M12 4v16m8-8H4'
                                                        />
                                                    </svg>
                                                </div>
                                                <div className='absolute -bottom-0.5 -right-0.5'>
                                                    <svg
                                                        className='w-3 h-3 text-amber-500'
                                                        fill='currentColor'
                                                        viewBox='0 0 20 20'
                                                    >
                                                        <path
                                                            fillRule='evenodd'
                                                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                                            clipRule='evenodd'
                                                        />
                                                    </svg>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className='space-y-3 mt-6'>
                            <div className='flex gap-6 text-xs font-medium text-muted-foreground justify-center flex-wrap'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-4 h-4 rounded-md bg-gradient-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/70' />
                                    <span>Still IN</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-4 h-4 rounded-md bg-gradient-to-br from-red-500/30 to-red-600/20 border-2 border-red-500/70' />
                                    <span>OUT</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-4 h-4 rounded-md bg-amber-500/10 border-2 border-amber-500/50 relative'>
                                        <svg
                                            className='absolute -bottom-0.5 -right-0.5 w-2 h-2 text-amber-500'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                    </div>
                                    <span>Missing Data</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='w-4 h-4 rounded-md bg-gradient-to-br from-primary/30 to-primary/20 border-2 border-primary' />
                                    <span>Today</span>
                                </div>
                            </div>
                            <p className='text-xs text-center text-muted-foreground'>
                                Click on past days with missing data to add your
                                status. Hover to see the add icon.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
            >
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2 text-red-500'>
                            <AlertTriangle className='h-5 w-5' />
                            Confirm You Are OUT
                        </DialogTitle>
                        <DialogDescription className='space-y-3 pt-2'>
                            <div className='font-semibold text-foreground'>
                                Are you confirming that you nutted voluntarily?
                            </div>
                            <div className='text-sm'>
                                This action{' '}
                                <span className='font-bold text-red-500'>
                                    CANNOT be undone
                                </span>
                                . Once you mark yourself as OUT, you are OUT for
                                the rest of November.
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                You will be marked as having failed the
                                challenge.
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='flex-col sm:flex-col gap-2'>
                        <div className='flex gap-2 w-full'>
                            <Button
                                variant='outline'
                                onClick={() => setShowConfirmDialog(false)}
                                className='flex-1'
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={handleConfirmOut}
                                disabled={!canConfirm}
                                className='flex-1 relative overflow-hidden'
                            >
                                {/* Progress bar inset */}
                                <div
                                    className='absolute inset-0 bg-red-600/30 transition-all duration-500 ease-linear'
                                    style={{
                                        width: `${
                                            ((5 - countdown) / 5) * 100
                                        }%`,
                                    }}
                                />
                                <span className='relative z-10'>
                                    {canConfirm
                                        ? "Confirm I'm OUT"
                                        : `Wait ${countdown}s`}
                                </span>
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showSurveyDialog} onOpenChange={setShowSurveyDialog}>
                <DialogContent className='sm:max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>Help Us Understand</DialogTitle>
                        <DialogDescription>
                            Why exactly did you get out? This data helps us
                            understand patterns and is completely anonymous.
                            (Optional)
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                        <RadioGroup
                            value={surveyReason}
                            onValueChange={setSurveyReason}
                        >
                            <div className='flex items-start space-x-3 space-y-0'>
                                <RadioGroupItem value='edging-ruined' id='r1' />
                                <Label
                                    htmlFor='r1'
                                    className='font-normal cursor-pointer'
                                >
                                    Edging that led to a ruined orgasm
                                </Label>
                            </div>
                            <div className='flex items-start space-x-3 space-y-0'>
                                <RadioGroupItem value='porn' id='r2' />
                                <Label
                                    htmlFor='r2'
                                    className='font-normal cursor-pointer'
                                >
                                    Watched porn and couldn't resist
                                </Label>
                            </div>
                            <div className='flex items-start space-x-3 space-y-0'>
                                <RadioGroupItem value='sex' id='r3' />
                                <Label
                                    htmlFor='r3'
                                    className='font-normal cursor-pointer'
                                >
                                    Had sex
                                </Label>
                            </div>
                            <div className='flex items-start space-x-3 space-y-0'>
                                <RadioGroupItem value='stress-relief' id='r5' />
                                <Label
                                    htmlFor='r5'
                                    className='font-normal cursor-pointer'
                                >
                                    Needed stress relief
                                </Label>
                            </div>
                            <div className='flex items-start space-x-3 space-y-0'>
                                <RadioGroupItem value='accident' id='r6' />
                                <Label
                                    htmlFor='r6'
                                    className='font-normal cursor-pointer'
                                >
                                    Accidental/unexpected
                                </Label>
                            </div>
                            <div className='flex items-start space-x-3 space-y-0'>
                                <RadioGroupItem value='other' id='r7' />
                                <Label
                                    htmlFor='r7'
                                    className='font-normal cursor-pointer'
                                >
                                    Other (please specify)
                                </Label>
                            </div>
                        </RadioGroup>

                        {surveyReason === 'other' && (
                            <Textarea
                                placeholder='Please describe what happened...'
                                value={surveyOtherText}
                                onChange={(e) =>
                                    setSurveyOtherText(e.target.value)
                                }
                                className='min-h-[100px]'
                            />
                        )}
                    </div>
                    <DialogFooter className='flex-col sm:flex-row gap-2'>
                        <Button
                            variant='outline'
                            onClick={handleSurveySkip}
                            className='flex-1'
                        >
                            Skip
                        </Button>
                        <Button
                            onClick={handleSurveySubmit}
                            disabled={
                                !surveyReason ||
                                (surveyReason === 'other' &&
                                    !surveyOtherText.trim())
                            }
                            className='flex-1'
                        >
                            {isCheckingIn ? (
                                <svg
                                    className='w-5 h-5 animate-spin'
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
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showPreviousDayDialog}
                onOpenChange={setShowPreviousDayDialog}
            >
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle>
                            Update Day {selectedDay} Status
                        </DialogTitle>
                        <DialogDescription>
                            What was your status on November {selectedDay}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 py-4'>
                        {checkIns.find(
                            (c) =>
                                c.date ===
                                new Date(
                                    2025,
                                    9,
                                    selectedDay || 1,
                                ).toDateString(),
                        )?.status === 'in' ? (
                            <div className='space-y-4'>
                                <div className='text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30'>
                                    <p className='text-sm font-medium text-green-700 dark:text-green-400'>
                                        This day is marked as IN
                                    </p>
                                    <p className='text-xs text-muted-foreground mt-1'>
                                        You can only change it to OUT if it was
                                        a mistake
                                    </p>
                                </div>
                                {status !== 'out' ? (
                                    <div>
                                        <p className='text-sm text-muted-foreground mb-3'>
                                            Made a mistake? Mark this day as
                                            failed
                                        </p>
                                        <Button
                                            onClick={handleFailDayClick}
                                            variant='outline'
                                            className='w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                                        >
                                            <AlertTriangle className='h-4 w-4 mr-2' />
                                            Mark Day as Failed
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30'>
                                        <p className='text-sm font-medium text-red-700 dark:text-red-400'>
                                            You are already in a failed state
                                        </p>
                                        <p className='text-xs text-muted-foreground mt-1'>
                                            Cannot mark additional days as
                                            failed
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='flex gap-3'>
                                <Button
                                    onClick={() => setSelectedDayStatus('in')}
                                    variant={
                                        selectedDayStatus === 'in'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className={`flex-1 ${
                                        selectedDayStatus === 'in'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : ''
                                    }`}
                                >
                                    Still IN
                                </Button>
                                <Button
                                    onClick={() => setSelectedDayStatus('out')}
                                    variant={
                                        selectedDayStatus === 'out'
                                            ? 'destructive'
                                            : 'outline'
                                    }
                                    className='flex-1'
                                >
                                    I was OUT
                                </Button>
                            </div>
                        )}
                    </div>
                    <DialogFooter className='flex-col sm:flex-row gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setShowPreviousDayDialog(false);
                                setSelectedDay(null);
                                setSelectedDayStatus(null);
                            }}
                            className={
                                checkIns.find(
                                    (c) =>
                                        c.date ===
                                        new Date(
                                            2025,
                                            9,
                                            selectedDay || 1,
                                        ).toDateString(),
                                )?.status === 'in'
                                    ? 'w-full'
                                    : 'flex-1'
                            }
                        >
                            {checkIns.find(
                                (c) =>
                                    c.date ===
                                    new Date(
                                        2025,
                                        9,
                                        selectedDay || 1,
                                    ).toDateString(),
                            )?.status === 'in'
                                ? 'Close'
                                : 'Cancel'}
                        </Button>
                        {!checkIns.find(
                            (c) =>
                                c.date ===
                                new Date(
                                    2025,
                                    9,
                                    selectedDay || 1,
                                ).toDateString(),
                        )?.status && (
                            <Button
                                onClick={handlePreviousDaySubmit}
                                disabled={
                                    selectedDayStatus === null || isCheckingIn
                                }
                                className='flex-1'
                            >
                                {isCheckingIn ? (
                                    <svg
                                        className='w-5 h-5 animate-spin'
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
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showFailDialog} onOpenChange={setShowFailDialog}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2 text-red-500'>
                            <AlertTriangle className='h-5 w-5' />
                            Mark Day {selectedDay} as Failed
                        </DialogTitle>
                        <DialogDescription className='space-y-3 pt-2'>
                            <div className='font-semibold text-foreground'>
                                Are you sure you want to mark November{' '}
                                {selectedDay} as failed?
                            </div>
                            <div className='text-sm'>
                                This will change the day from IN to OUT and mark
                                your entire try as failed. This action{' '}
                                <span className='font-bold text-red-500'>
                                    CANNOT be undone
                                </span>
                                .
                            </div>
                            <div className='text-sm text-muted-foreground'>
                                Use this if you accidentally marked a day as IN
                                when you were actually OUT.
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='flex-col sm:flex-col gap-2'>
                        <div className='flex gap-2 w-full'>
                            <Button
                                variant='outline'
                                onClick={() => {
                                    setShowFailDialog(false);
                                    setShowPreviousDayDialog(true);
                                }}
                                className='flex-1'
                            >
                                Cancel
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={handleConfirmFail}
                                disabled={!canConfirmFail}
                                className='flex-1 relative overflow-hidden'
                            >
                                <div
                                    className='absolute inset-0 bg-red-600/30 transition-all duration-500 ease-linear'
                                    style={{
                                        width: `${
                                            ((5 - failCountdown) / 5) * 100
                                        }%`,
                                    }}
                                />
                                <span className='relative z-10'>
                                    {canConfirmFail
                                        ? 'Confirm Failed'
                                        : `Wait ${failCountdown}s`}
                                </span>
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
