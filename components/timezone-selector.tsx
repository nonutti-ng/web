'use client';

import { useState } from 'react';
import { useTimezone } from '@/lib/timezone-context';
import {
    COMMON_TIMEZONES,
    getBrowserTimezone,
    isValidUTCOffset,
    normalizeUTCOffset,
    isUTCOffset
} from '@/lib/timezone-storage';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Clock, Plus, X } from 'lucide-react';

export function TimezoneSelector() {
    const { timezone, setTimezone, browserTimezone } = useTimezone();
    const [showCustomOffset, setShowCustomOffset] = useState(isUTCOffset(timezone));
    const [customOffset, setCustomOffset] = useState(isUTCOffset(timezone) ? timezone : '');
    const [offsetError, setOffsetError] = useState('');

    const handleAutoDetect = () => {
        const detected = getBrowserTimezone();
        setTimezone(detected);
        setShowCustomOffset(false);
        setCustomOffset('');
        setOffsetError('');
    };

    const handleSelectChange = (value: string) => {
        setTimezone(value);
        setShowCustomOffset(false);
        setCustomOffset('');
        setOffsetError('');
    };

    const handleCustomOffsetChange = (value: string) => {
        setCustomOffset(value);
        setOffsetError('');
    };

    const handleApplyCustomOffset = () => {
        const trimmed = customOffset.trim();

        if (!trimmed) {
            setOffsetError('Please enter a UTC offset');
            return;
        }

        if (!isValidUTCOffset(trimmed)) {
            setOffsetError('Invalid format. Use +HH:MM or -HH:MM (e.g., +05:30, -07:00)');
            return;
        }

        const normalized = normalizeUTCOffset(trimmed);
        setTimezone(normalized);
        setCustomOffset(normalized);
        setOffsetError('');
    };

    const handleShowCustomOffset = () => {
        setShowCustomOffset(true);
        setCustomOffset('');
        setOffsetError('');
    };

    const handleCancelCustomOffset = () => {
        setShowCustomOffset(false);
        setCustomOffset('');
        setOffsetError('');

        // If current timezone is a custom offset, reset to default
        if (isUTCOffset(timezone)) {
            setTimezone(COMMON_TIMEZONES[0].value);
        }
    };

    const currentLabel = isUTCOffset(timezone)
        ? `UTC ${timezone}`
        : COMMON_TIMEZONES.find((tz) => tz.value === timezone)?.label || timezone;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Timezone</h3>
            </div>

            <div className="space-y-3">
                {!showCustomOffset ? (
                    <>
                        <Select value={isUTCOffset(timezone) ? '' : timezone} onValueChange={handleSelectChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select timezone">
                                    {currentLabel}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {COMMON_TIMEZONES.map((tz) => (
                                    <SelectItem key={tz.value} value={tz.value}>
                                        {tz.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShowCustomOffset}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Use Custom UTC Offset
                        </Button>
                    </>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="e.g., +05:30 or -07:00"
                                    value={customOffset}
                                    onChange={(e) => handleCustomOffsetChange(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleApplyCustomOffset();
                                        } else if (e.key === 'Escape') {
                                            handleCancelCustomOffset();
                                        }
                                    }}
                                    className={offsetError ? 'border-destructive' : ''}
                                />
                            </div>
                            <Button size="sm" onClick={handleApplyCustomOffset}>
                                Apply
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelCustomOffset}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {offsetError && (
                            <p className="text-xs text-destructive">{offsetError}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Enter a UTC offset in the format +HH:MM or -HH:MM
                        </p>
                    </div>
                )}

                {browserTimezone !== timezone && !showCustomOffset && (
                    <div className="flex items-center justify-between gap-2 rounded-md bg-muted p-3">
                        <p className="text-sm text-muted-foreground">
                            Your browser detected:{' '}
                            <span className="font-medium text-foreground">
                                {COMMON_TIMEZONES.find((tz) => tz.value === browserTimezone)?.label ||
                                    browserTimezone}
                            </span>
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAutoDetect}
                        >
                            Use Browser Timezone
                        </Button>
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    All dates and times will be displayed in this timezone. The server stores all
                    data in UTC.
                </p>
            </div>
        </div>
    );
}
