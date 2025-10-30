'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getTimezonePreference,
    setTimezonePreference,
    getBrowserTimezone,
} from './timezone-storage';

interface TimezoneContextType {
    timezone: string;
    setTimezone: (timezone: string) => void;
    browserTimezone: string;
    isLoading: boolean;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export function TimezoneProvider({ children }: { children: ReactNode }) {
    const [timezone, setTimezoneState] = useState<string>('America/New_York');
    const [browserTimezone, setBrowserTimezone] = useState<string>('America/New_York');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load timezone preference on mount
        const storedTimezone = getTimezonePreference();
        const detectedTimezone = getBrowserTimezone();

        setTimezoneState(storedTimezone);
        setBrowserTimezone(detectedTimezone);
        setIsLoading(false);
    }, []);

    const setTimezone = (newTimezone: string) => {
        setTimezoneState(newTimezone);
        setTimezonePreference(newTimezone);
    };

    return (
        <TimezoneContext.Provider
            value={{
                timezone,
                setTimezone,
                browserTimezone,
                isLoading,
            }}
        >
            {children}
        </TimezoneContext.Provider>
    );
}

export function useTimezone() {
    const context = useContext(TimezoneContext);
    if (context === undefined) {
        throw new Error('useTimezone must be used within a TimezoneProvider');
    }
    return context;
}
