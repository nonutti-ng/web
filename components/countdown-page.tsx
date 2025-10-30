'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTimezone } from '@/lib/timezone-context';
import { getTimeUntilNovember } from '@/lib/date-utils';
import {
    Clock,
    Calendar,
    Hourglass,
    Timer,
    Settings,
    Plus,
    X,
} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    COMMON_TIMEZONES,
    getBrowserTimezone,
    isValidUTCOffset,
    normalizeUTCOffset,
    isUTCOffset,
} from '@/lib/timezone-storage';

export function CountdownPage({
    onDevOverride,
}: {
    onDevOverride: () => void;
}) {
    const { timezone, setTimezone, browserTimezone } = useTimezone();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [showDevButton, setShowDevButton] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [timezonePopoverOpen, setTimezonePopoverOpen] = useState(false);
    const [showCustomOffset, setShowCustomOffset] = useState(false);
    const [customOffset, setCustomOffset] = useState('');
    const [offsetError, setOffsetError] = useState('');

    useEffect(() => {
        setMounted(true);
        const calculateTimeLeft = () => {
            return getTimeUntilNovember(timezone);
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setShowDevButton(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearInterval(timer);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [timezone]);

    const timeUnits = [
        {
            value: timeLeft.days,
            label: 'Days',
            icon: Calendar,
            color: 'text-blue-500',
        },
        {
            value: timeLeft.hours,
            label: 'Hours',
            icon: Clock,
            color: 'text-purple-500',
        },
        {
            value: timeLeft.minutes,
            label: 'Minutes',
            icon: Hourglass,
            color: 'text-pink-500',
        },
        {
            value: timeLeft.seconds,
            label: 'Seconds',
            icon: Timer,
            color: 'text-orange-500',
        },
    ];

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 p-4 relative overflow-hidden'>
            {/* Animated background elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse' />
                <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]' />
            </div>

            <div className='max-w-4xl w-full text-center space-y-10 relative z-10'>
                {/* Header Section */}
                <div
                    className={`space-y-6 transition-all duration-1000 ${
                        mounted
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 -translate-y-4'
                    }`}
                >
                    <div className='inline-block'>
                        <div className='relative'>
                            <h1 className='text-6xl md:text-8xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-in fade-in slide-in-from-top-4 duration-700'>
                                Not Yet...
                            </h1>
                            <div className='absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl -z-10' />
                        </div>
                    </div>
                    <p className='text-xl md:text-3xl text-muted-foreground font-light animate-in fade-in slide-in-from-top-8 duration-700 delay-150'>
                        No Nut November is approaching
                    </p>
                </div>

                {/* Countdown Card */}
                <Card
                    className={`bg-card/50 backdrop-blur-xl border-2 shadow-2xl transition-all duration-1000 delay-300 ${
                        mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                >
                    <CardContent className='pt-10 pb-10 px-6'>
                        <div className='space-y-8'>
                            <div className='flex items-center justify-center gap-2'>
                                <div className='h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent' />
                                <p className='text-sm font-semibold text-muted-foreground uppercase tracking-widest'>
                                    Challenge Begins In
                                </p>
                                <div className='h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent' />
                            </div>

                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
                                {timeUnits.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div
                                            key={item.label}
                                            className={`group relative p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                                mounted
                                                    ? 'animate-in fade-in zoom-in duration-500'
                                                    : 'opacity-0'
                                            }`}
                                            style={{
                                                animationDelay: `${
                                                    400 + index * 100
                                                }ms`,
                                            }}
                                        >
                                            {/* Background glow on hover */}
                                            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300' />

                                            <div className='relative space-y-3'>
                                                <Icon
                                                    className={`w-6 h-6 mx-auto ${item.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                                                />
                                                <div className='text-5xl md:text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent tabular-nums'>
                                                    {String(
                                                        item.value,
                                                    ).padStart(2, '0')}
                                                </div>
                                                <div className='text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium'>
                                                    {item.label}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Message */}
                <div
                    className={`space-y-4 transition-all duration-1000 delay-700 ${
                        mounted
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                    }`}
                >
                    <p className='text-base text-muted-foreground'>
                        Prepare yourself mentally. The challenge awaits.
                    </p>

                    {/* Timezone Selector */}
                    <Popover
                        open={timezonePopoverOpen}
                        onOpenChange={setTimezonePopoverOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='text-xs text-muted-foreground/70 hover:text-muted-foreground gap-2 h-auto py-2 px-3'
                            >
                                <Clock className='w-3 h-3' />
                                <span>
                                    Timezone:{' '}
                                    {isUTCOffset(timezone)
                                        ? `UTC ${timezone}`
                                        : COMMON_TIMEZONES.find(
                                              (tz) => tz.value === timezone,
                                          )?.label || timezone}
                                </span>
                                <Settings className='w-3 h-3 ml-1 opacity-50' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-80' align='center'>
                            <div className='space-y-4'>
                                <div>
                                    <h4 className='font-medium text-sm mb-1'>
                                        Timezone Settings
                                    </h4>
                                    <p className='text-xs text-muted-foreground'>
                                        Choose your timezone for accurate
                                        countdown
                                    </p>
                                </div>

                                {!showCustomOffset ? (
                                    <>
                                        <Select
                                            value={
                                                isUTCOffset(timezone)
                                                    ? ''
                                                    : timezone
                                            }
                                            onValueChange={(value) => {
                                                setTimezone(value);
                                                setShowCustomOffset(false);
                                                setCustomOffset('');
                                                setOffsetError('');
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COMMON_TIMEZONES.map((tz) => (
                                                    <SelectItem
                                                        key={tz.value}
                                                        value={tz.value}
                                                    >
                                                        {tz.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() =>
                                                setShowCustomOffset(true)
                                            }
                                            className='w-full'
                                        >
                                            <Plus className='h-4 w-4 mr-2' />
                                            Use Custom UTC Offset
                                        </Button>
                                    </>
                                ) : (
                                    <div className='space-y-2'>
                                        <div className='flex gap-2'>
                                            <div className='flex-1'>
                                                <Input
                                                    placeholder='e.g., +05:30 or -07:00'
                                                    value={customOffset}
                                                    onChange={(e) => {
                                                        setCustomOffset(
                                                            e.target.value,
                                                        );
                                                        setOffsetError('');
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const trimmed =
                                                                customOffset.trim();
                                                            if (!trimmed) {
                                                                setOffsetError(
                                                                    'Please enter a UTC offset',
                                                                );
                                                                return;
                                                            }
                                                            if (
                                                                !isValidUTCOffset(
                                                                    trimmed,
                                                                )
                                                            ) {
                                                                setOffsetError(
                                                                    'Invalid format. Use +HH:MM or -HH:MM',
                                                                );
                                                                return;
                                                            }
                                                            const normalized =
                                                                normalizeUTCOffset(
                                                                    trimmed,
                                                                );
                                                            setTimezone(
                                                                normalized,
                                                            );
                                                            setCustomOffset(
                                                                normalized,
                                                            );
                                                            setOffsetError('');
                                                            setShowCustomOffset(
                                                                false,
                                                            );
                                                        } else if (
                                                            e.key === 'Escape'
                                                        ) {
                                                            setShowCustomOffset(
                                                                false,
                                                            );
                                                            setCustomOffset('');
                                                            setOffsetError('');
                                                        }
                                                    }}
                                                    className={
                                                        offsetError
                                                            ? 'border-destructive'
                                                            : ''
                                                    }
                                                />
                                            </div>
                                            <Button
                                                size='sm'
                                                onClick={() => {
                                                    const trimmed =
                                                        customOffset.trim();
                                                    if (!trimmed) {
                                                        setOffsetError(
                                                            'Please enter a UTC offset',
                                                        );
                                                        return;
                                                    }
                                                    if (
                                                        !isValidUTCOffset(
                                                            trimmed,
                                                        )
                                                    ) {
                                                        setOffsetError(
                                                            'Invalid format. Use +HH:MM or -HH:MM',
                                                        );
                                                        return;
                                                    }
                                                    const normalized =
                                                        normalizeUTCOffset(
                                                            trimmed,
                                                        );
                                                    setTimezone(normalized);
                                                    setCustomOffset(normalized);
                                                    setOffsetError('');
                                                    setShowCustomOffset(false);
                                                }}
                                            >
                                                Apply
                                            </Button>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                onClick={() => {
                                                    setShowCustomOffset(false);
                                                    setCustomOffset('');
                                                    setOffsetError('');
                                                }}
                                            >
                                                <X className='h-4 w-4' />
                                            </Button>
                                        </div>
                                        {offsetError && (
                                            <p className='text-xs text-destructive'>
                                                {offsetError}
                                            </p>
                                        )}
                                        <p className='text-xs text-muted-foreground'>
                                            Enter a UTC offset in the format
                                            +HH:MM or -HH:MM
                                        </p>
                                    </div>
                                )}

                                {browserTimezone !== timezone &&
                                    !showCustomOffset && (
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => {
                                                setTimezone(
                                                    getBrowserTimezone(),
                                                );
                                                setTimezonePopoverOpen(false);
                                                setShowCustomOffset(false);
                                                setCustomOffset('');
                                                setOffsetError('');
                                            }}
                                            className='w-full text-xs'
                                        >
                                            Use Browser Timezone
                                            <span className='ml-2 text-muted-foreground'>
                                                (
                                                {COMMON_TIMEZONES.find(
                                                    (tz) =>
                                                        tz.value ===
                                                        browserTimezone,
                                                )?.label || browserTimezone}
                                                )
                                            </span>
                                        </Button>
                                    )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Dev Override Button */}
                {showDevButton && (
                    <div className='pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={onDevOverride}
                            className='text-xs opacity-50 hover:opacity-100 transition-all'
                        >
                            Dev Override: Skip to November
                        </Button>
                        <p className='text-xs text-muted-foreground/50 mt-2'>
                            For development purposes only
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
