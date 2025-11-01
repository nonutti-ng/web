'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimezoneSelector } from '@/components/timezone-selector';
import { apiController } from '@/lib/api-controller';
import { Link2, User, Calendar, Hash, CheckCircle2, X, Sparkles, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ChangelogDialog } from '@/components/changelog-dialog';
import { getAllChangelogs, hasSeenChangelog, formatChangelogDate, type ChangelogEntry } from '@/lib/changelog';
import { useTimezone } from '@/lib/timezone-context';

interface SettingsPageProps {
    userData: User;
    tryData: Try | null;
    didLinkReddit: boolean;
}

export function SettingsPage({
    userData,
    tryData,
    didLinkReddit,
}: SettingsPageProps) {
    const { timezone } = useTimezone();
    const [redditAccount, setRedditAccount] = useState<RedditAccount | null>(
        null,
    );
    const [isLoadingReddit, setIsLoadingReddit] = useState(true);
    const [isLinkingReddit, setIsLinkingReddit] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(didLinkReddit);
    const [selectedChangelog, setSelectedChangelog] = useState<ChangelogEntry | null>(null);
    const [showChangelogDialog, setShowChangelogDialog] = useState(false);

    useEffect(() => {
        const fetchRedditAccount = async () => {
            try {
                const account = await apiController.getLinkedReddit();
                setRedditAccount(account);
            } catch (error) {
                console.warn(
                    'No linked Reddit account found or fetch error:',
                    error,
                );
            } finally {
                setIsLoadingReddit(false);
            }
        };

        fetchRedditAccount();
    }, []);

    const handleLinkReddit = async () => {
        setIsLinkingReddit(true);
        // Redirect to Reddit OAuth
        window.location.href =
            '/auth/redirect?provider=reddit&next=/settings?reddit_linked=true';
    };

    const handleViewChangelog = (changelog: ChangelogEntry) => {
        setSelectedChangelog(changelog);
        setShowChangelogDialog(true);
    };

    const changelogs = getAllChangelogs();

    return (
        <div className='min-h-screen bg-background'>
            <div className='container mx-auto px-4 py-8 max-w-4xl'>
                {showSuccessAlert && (
                    <Alert className='mb-6 border-green-600 bg-green-50 dark:bg-green-950/30 animate-in fade-in slide-in-from-top-2 duration-300'>
                        <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
                        <AlertDescription className='flex items-center justify-between'>
                            <span className='text-green-800 dark:text-green-200'>
                                Reddit account linked successfully!
                            </span>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='h-6 w-6 p-0 hover:bg-green-200 dark:hover:bg-green-900'
                                onClick={() => setShowSuccessAlert(false)}
                            >
                                <X className='h-4 w-4 text-green-800 dark:text-green-200' />
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                <div className='space-y-6'>
                    {/* Header */}
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>
                            Settings
                        </h1>
                        <p className='text-muted-foreground mt-2'>
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <User className='h-5 w-5' />
                                Account Information
                            </CardTitle>
                            <CardDescription>
                                Your account details and identifiers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-center gap-4'>
                                <Avatar className='h-16 w-16'>
                                    <AvatarImage
                                        src={userData.image ?? undefined}
                                        alt={userData.name}
                                    />
                                    <AvatarFallback className='text-lg'>
                                        {userData.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='font-medium text-lg'>
                                        {userData.name}
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        {userData.email}
                                    </p>
                                </div>
                            </div>

                            <div className='grid gap-3 pt-4 border-t'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2 text-sm'>
                                        <Hash className='h-4 w-4 text-muted-foreground' />
                                        <span className='text-muted-foreground'>
                                            User ID:
                                        </span>
                                    </div>
                                    <code className='text-xs bg-muted px-2 py-1 rounded'>
                                        {userData.id}
                                    </code>
                                </div>

                                {tryData && (
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <Calendar className='h-4 w-4 text-muted-foreground' />
                                            <span className='text-muted-foreground'>
                                                Try ID:
                                            </span>
                                        </div>
                                        <code className='text-xs bg-muted px-2 py-1 rounded'>
                                            {tryData.tryId}
                                        </code>
                                    </div>
                                )}

                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2 text-sm'>
                                        <Calendar className='h-4 w-4 text-muted-foreground' />
                                        <span className='text-muted-foreground'>
                                            Member since:
                                        </span>
                                    </div>
                                    <span className='text-sm'>
                                        {new Date(
                                            userData.createdAt,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reddit Connection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Link2 className='h-5 w-5' />
                                Reddit Connection
                            </CardTitle>
                            <CardDescription>
                                Link your Reddit account to participate in
                                community features
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingReddit ? (
                                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                                    <div className='w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin' />
                                    Loading Reddit account...
                                </div>
                            ) : redditAccount ? (
                                <div className='space-y-4'>
                                    <div className='flex items-center gap-4 p-4 rounded-lg bg-muted/50'>
                                        <Avatar className='h-12 w-12'>
                                            <AvatarImage
                                                src={redditAccount.icon_img}
                                                alt={redditAccount.name}
                                            />
                                            <AvatarFallback>
                                                {redditAccount.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='flex-1'>
                                            <p className='font-medium'>
                                                u/{redditAccount.name}
                                            </p>
                                            <div className='flex gap-4 text-sm text-muted-foreground mt-1'>
                                                <span>
                                                    {redditAccount.link_karma.toLocaleString()}{' '}
                                                    post karma
                                                </span>
                                                <span>
                                                    {redditAccount.comment_karma.toLocaleString()}{' '}
                                                    comment karma
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 text-sm text-green-600 dark:text-green-400'>
                                            <div className='w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full' />
                                            Connected
                                        </div>
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        Your Reddit account is linked. You can
                                        now participate in community features.
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-4'>
                                    <p className='text-sm text-muted-foreground'>
                                        Connect your Reddit account to unlock
                                        community features and participate in
                                        discussions.
                                    </p>
                                    <Button
                                        onClick={handleLinkReddit}
                                        disabled={isLinkingReddit}
                                        className='gap-2'
                                    >
                                        {isLinkingReddit ? (
                                            <>
                                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Link2 className='h-4 w-4' />
                                                Link Reddit Account
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timezone Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timezone</CardTitle>
                            <CardDescription>
                                Set your timezone for accurate date and time
                                display
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TimezoneSelector />
                        </CardContent>
                    </Card>

                    {/* Changelog */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Sparkles className='h-5 w-5' />
                                Changelog
                            </CardTitle>
                            <CardDescription>
                                View update history and new features
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-3'>
                                {changelogs.map((changelog) => {
                                    const isSeen = hasSeenChangelog(changelog.id);
                                    return (
                                        <div
                                            key={changelog.id}
                                            className='flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors'
                                        >
                                            <div className='flex items-center gap-3'>
                                                <FileText className='h-5 w-5 text-muted-foreground' />
                                                <div>
                                                    <div className='flex items-center gap-2'>
                                                        <p className='font-medium'>
                                                            {changelog.title}
                                                        </p>
                                                        <Badge variant='secondary' className='text-xs'>
                                                            v{changelog.version}
                                                        </Badge>
                                                        {!isSeen && (
                                                            <Badge className='text-xs bg-blue-500 hover:bg-blue-600'>
                                                                New
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className='text-xs text-muted-foreground mt-1'>
                                                        {formatChangelogDate(changelog.date, timezone)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => handleViewChangelog(changelog)}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Changelog Dialog */}
            {selectedChangelog && (
                <ChangelogDialog
                    open={showChangelogDialog}
                    onOpenChange={setShowChangelogDialog}
                    changelog={selectedChangelog}
                />
            )}
        </div>
    );
}
