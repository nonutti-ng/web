'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { authClient, useSession } from '@/lib/auth-client';
import { APIAlert } from './api-alert';
import APIError from '@/lib/APIError';
import { TimezoneSelector } from '@/components/timezone-selector';
import { apiController } from '@/lib/api-controller';

interface OnboardingPageProps {
    onComplete: (data: {
        ageGroup: string;
        gender: string;
        previousParticipation: string;
        reason?: string;
        redditUsername?: string;
    }) => Promise<void>;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
    const [step, setStep] = useState(1);
    const [ageGroup, setAgeGroup] = useState('');
    const [gender, setGender] = useState('');
    const [previousParticipation, setPreviousParticipation] = useState('');
    const [reason, setReason] = useState('');
    const [redditLinked, setRedditLinked] = useState(false);
    const [redditUsername, setRedditUsername] = useState('');
    const [redditAccount, setRedditAccount] = useState<RedditAccount | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConnectingReddit, setIsConnectingReddit] = useState(false);
    const [isFetchingReddit, setIsFetchingReddit] = useState(false);
    const [direction, setDirection] = useState<'forward' | 'backward'>(
        'forward',
    );
    const [error, setError] = useState<APIError | null>(null);

    const handleRedditConnect = () => {
        setIsConnectingReddit(true);

        // Create a popup window for Reddit OAuth
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;

        const redditAuthURL = `${window.location.origin}/auth/redirect?provider=reddit`;
        const popup = window.open(
            redditAuthURL,
            'Reddit Authentication',
            `width=${width},height=${height},left=${left},top=${top}`,
        );

        // Reddit is not our main sign in, so we listen for the popup to close
        const interval = setInterval(async () => {
            if (popup!.closed) {
                clearInterval(interval);
                setIsConnectingReddit(false);

                // Fetch Reddit account info after popup closes
                setIsFetchingReddit(true);
                try {
                    const account = await apiController.getLinkedReddit();
                    if (account) {
                        setRedditAccount(account);
                        setRedditLinked(true);
                        setRedditUsername(account.name);
                    }
                } catch (error) {
                    console.error('Failed to fetch Reddit account:', error);
                } finally {
                    setIsFetchingReddit(false);
                }
            }
        }, 500);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setDirection('forward');

        try {
            await onComplete({
                ageGroup,
                gender,
                previousParticipation,
                reason: reason.trim() === '' ? undefined : reason,
                redditUsername: redditLinked ? redditUsername : undefined,
            });
        } catch (error) {
            setIsSubmitting(false);

            if (error instanceof APIError) {
                setError(error);
            } else {
                setError(
                    new APIError(
                        'An unexpected error occurred.',
                        'unexpected_error',
                    ),
                );
            }

            console.error('Failed to complete onboarding:', error);
            return;
        }

        setIsSubmitting(false);
        setStep(7);
    };

    const handleNext = () => {
        setDirection('forward');
        setStep(step + 1);
    };

    const handleBack = () => {
        setDirection('backward');
        setStep(step - 1);
    };

    const canProceed = () => {
        if (step === 1) return ageGroup !== '';
        if (step === 2) return gender !== '';
        if (step === 3) return previousParticipation !== '';
        if (step === 4) return true; // reason is optional
        if (step === 5) return true; // timezone is required but always has default
        if (step === 6) return true; // Reddit linking is optional
        return true;
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4'>
            <Card className='max-w-lg w-full bg-card/50 backdrop-blur border-border/50'>
                <CardHeader>
                    <CardTitle>Welcome to NNN</CardTitle>
                    <CardDescription>
                        Help us understand our community better. All data is
                        anonymized and used only for statistics.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {error && (
                        <APIAlert
                            error_reason={error.message}
                            code={error.code}
                        />
                    )}

                    {step < 7 && (
                        <div className='flex gap-2'>
                            {[1, 2, 3, 4, 5, 6].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                        s <= step ? 'bg-primary' : 'bg-muted'
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    <div className='relative overflow-hidden'>
                        <div
                            key={step}
                            className={`animate-in fade-in duration-500 ${
                                direction === 'forward'
                                    ? 'slide-in-from-right-8'
                                    : 'slide-in-from-left-8'
                            }`}
                        >
                            {/* Step 1: Age Group */}
                            {step === 1 && (
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold mb-2'>
                                            What's your age group?
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            This helps us understand
                                            participation demographics
                                        </p>
                                    </div>
                                    <RadioGroup
                                        value={ageGroup}
                                        onValueChange={setAgeGroup}
                                    >
                                        {[
                                            '18_24',
                                            '25_34',
                                            '35_44',
                                            '45_plus',
                                        ].map((value) => (
                                            <div
                                                key={value}
                                                onClick={() =>
                                                    setAgeGroup(value)
                                                }
                                                className='flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer'
                                            >
                                                <RadioGroupItem
                                                    value={value}
                                                    id={value}
                                                />
                                                <Label
                                                    htmlFor={value}
                                                    className='flex-1 cursor-pointer'
                                                >
                                                    {value === '18_24'
                                                        ? '18-24'
                                                        : value === '25_34'
                                                        ? '25-34'
                                                        : value === '35_44'
                                                        ? '35-44'
                                                        : '45+'}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            )}

                            {/* Step 2: Gender */}
                            {step === 2 && (
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold mb-2'>
                                            What's your gender?
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            This helps us understand
                                            participation patterns
                                        </p>
                                    </div>
                                    <RadioGroup
                                        value={gender}
                                        onValueChange={setGender}
                                    >
                                        {[
                                            { value: 'male', label: 'Male' },
                                            {
                                                value: 'female',
                                                label: 'Female',
                                            },
                                            {
                                                value: 'non_binary',
                                                label: 'Non-binary',
                                            },
                                            {
                                                value: 'prefer_not_to_say',
                                                label: 'Prefer not to say',
                                            },
                                        ].map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() =>
                                                    setGender(option.value)
                                                }
                                                className='flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer'
                                            >
                                                <RadioGroupItem
                                                    value={option.value}
                                                    id={option.value}
                                                />
                                                <Label
                                                    htmlFor={option.value}
                                                    className='flex-1 cursor-pointer'
                                                >
                                                    {option.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            )}

                            {/* Step 3: Previous Participation */}
                            {step === 3 && (
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold mb-2'>
                                            Have you done this before?
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Let us know if you're a returning
                                            participant
                                        </p>
                                    </div>
                                    <RadioGroup
                                        value={previousParticipation}
                                        onValueChange={setPreviousParticipation}
                                    >
                                        {[
                                            {
                                                value: 'first_time',
                                                label: 'First time',
                                            },
                                            {
                                                value: 'participated_before',
                                                label: "I've participated before",
                                            },
                                            {
                                                value: 'completed_before',
                                                label: "I've completed it before",
                                            },
                                        ].map((option) => (
                                            <div
                                                key={option.value}
                                                onClick={() =>
                                                    setPreviousParticipation(
                                                        option.value,
                                                    )
                                                }
                                                className='flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer'
                                            >
                                                <RadioGroupItem
                                                    value={option.value}
                                                    id={option.value}
                                                />
                                                <Label
                                                    htmlFor={option.value}
                                                    className='flex-1 cursor-pointer'
                                                >
                                                    {option.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            )}

                            {/* Step 4: Reason (Optional) */}
                            {step === 4 && (
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold mb-2'>
                                            Why are you doing NNN?
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Optional - Share your motivation
                                        </p>
                                    </div>
                                    <Textarea
                                        value={reason}
                                        onChange={(e) =>
                                            setReason(e.target.value)
                                        }
                                        placeholder='Self-improvement, challenge myself, health reasons, etc.'
                                        className='min-h-32 resize-none'
                                    />
                                </div>
                            )}

                            {/* Step 5: Timezone Selection */}
                            {step === 5 && (
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold mb-2'>
                                            Set your timezone
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            All dates and times will be
                                            displayed in your selected timezone
                                        </p>
                                    </div>
                                    <TimezoneSelector />
                                </div>
                            )}

                            {/* Step 6: Reddit Linking (Optional) */}
                            {step === 6 && (
                                <div className='space-y-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold mb-2'>
                                            Link your Reddit account?
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Optional - We'll automatically
                                            update your flair on the NNN
                                            subreddit
                                        </p>
                                    </div>

                                    {isFetchingReddit ? (
                                        <div className='p-8 rounded-lg border border-border/50 bg-card/50 backdrop-blur'>
                                            <div className='flex flex-col items-center gap-4'>
                                                <div className='relative'>
                                                    <div className='absolute inset-0 bg-[#FF4500]/20 rounded-full blur-xl animate-pulse' />
                                                    <div className='relative h-16 w-16 border-4 border-[#FF4500] border-t-transparent rounded-full animate-spin' />
                                                </div>
                                                <div className='text-center'>
                                                    <p className='font-medium mb-1'>
                                                        Fetching your Reddit
                                                        account...
                                                    </p>
                                                    <p className='text-sm text-muted-foreground'>
                                                        This will only take a
                                                        moment
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : !redditLinked ? (
                                        <div className='space-y-3'>
                                            <Button
                                                onClick={handleRedditConnect}
                                                disabled={isConnectingReddit}
                                                className='w-full h-12 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-medium'
                                                size='lg'
                                            >
                                                {isConnectingReddit ? (
                                                    <>
                                                        <svg
                                                            className='w-5 h-5 mr-2 animate-spin'
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
                                                        Connecting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg
                                                            className='w-5 h-5 mr-2'
                                                            viewBox='0 0 24 24'
                                                            fill='currentColor'
                                                        >
                                                            <path d='M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z' />
                                                        </svg>
                                                        Sign in with Reddit
                                                    </>
                                                )}
                                            </Button>
                                            <p className='text-xs text-center text-muted-foreground'>
                                                You can also skip this and
                                                continue without linking
                                            </p>
                                        </div>
                                    ) : (
                                        <div className='rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border-2 border-green-500/30 overflow-hidden'>
                                            <div className='p-4'>
                                                <div className='flex items-start gap-4'>
                                                    <div className='flex items-center justify-center w-16 h-16 rounded-full bg-[#FF4500]'>
                                                        <svg
                                                            className='w-10 h-10 text-white'
                                                            viewBox='0 0 24 24'
                                                            fill='currentColor'
                                                        >
                                                            <path d='M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z' />
                                                        </svg>
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <div className='flex items-center gap-2 mb-1'>
                                                            <svg
                                                                className='w-4 h-4 text-green-600 dark:text-green-400 shrink-0'
                                                                fill='none'
                                                                viewBox='0 0 24 24'
                                                                stroke='currentColor'
                                                            >
                                                                <path
                                                                    strokeLinecap='round'
                                                                    strokeLinejoin='round'
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d='M5 13l4 4L19 7'
                                                                />
                                                            </svg>
                                                            <p className='font-semibold text-green-600 dark:text-green-400'>
                                                                Successfully
                                                                Connected!
                                                            </p>
                                                        </div>
                                                        <p className='text-lg font-medium mb-2'>
                                                            u/{redditUsername}
                                                        </p>
                                                        {redditAccount && (
                                                            <div className='flex gap-4 text-sm text-muted-foreground'>
                                                                <div>
                                                                    <span className='font-medium text-foreground'>
                                                                        {redditAccount.link_karma.toLocaleString()}
                                                                    </span>{' '}
                                                                    post karma
                                                                </div>
                                                                <div>
                                                                    <span className='font-medium text-foreground'>
                                                                        {redditAccount.comment_karma.toLocaleString()}
                                                                    </span>{' '}
                                                                    comment
                                                                    karma
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <svg
                                                        className='w-5 h-5 text-green-600 dark:text-green-400'
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
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 7: Success */}
                            {step === 7 && (
                                <div className='space-y-6 py-8'>
                                    <div className='flex flex-col items-center space-y-6'>
                                        {/* Animated Checkmark */}
                                        <div className='relative flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-4 border-green-500'>
                                            <svg
                                                className='w-12 h-12 text-green-500'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'
                                                strokeWidth={3}
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                            >
                                                <path
                                                    d='M5 13l4 4L19 7'
                                                    style={{
                                                        strokeDasharray: 24,
                                                        strokeDashoffset: 24,
                                                        animation:
                                                            'draw 0.6s ease-out forwards',
                                                    }}
                                                />
                                            </svg>
                                        </div>

                                        {/* Success Message */}
                                        <div className='text-center space-y-3'>
                                            <h3 className='text-2xl font-bold text-green-600 dark:text-green-400'>
                                                You're All Set!
                                            </h3>
                                            <p className='text-muted-foreground max-w-sm'>
                                                Welcome to No Nut November. Your
                                                journey begins now. Stay strong!
                                            </p>
                                        </div>

                                        {/* Loading Dots */}
                                        <div className='flex gap-2'>
                                            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]' />
                                            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]' />
                                            <div className='w-2 h-2 bg-primary rounded-full animate-bounce' />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {step < 7 && (
                        <div className='flex gap-3'>
                            {step > 1 && (
                                <Button
                                    variant='outline'
                                    onClick={handleBack}
                                    className='flex-1'
                                >
                                    Back
                                </Button>
                            )}
                            {step < 6 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={!canProceed()}
                                    className='flex-1'
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !canProceed()}
                                    className='flex-1'
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className='w-4 h-4 mr-2 animate-spin'
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
                                            Starting...
                                        </>
                                    ) : (
                                        'Start Challenge'
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
