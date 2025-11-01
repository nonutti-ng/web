'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ChangelogEntry,
    markChangelogAsSeen,
    hasUnseenChangelogs,
    getLatestChangelog,
    formatChangelogDate,
} from '@/lib/changelog';
import { useTimezone } from '@/lib/timezone-context';
import { Sparkles, Bug, Wrench, AlertTriangle } from 'lucide-react';

interface ChangelogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    changelog: ChangelogEntry;
}

function getChangeIcon(type: string) {
    switch (type) {
        case 'feature':
            return <Sparkles className='h-4 w-4 text-blue-500' />;
        case 'improvement':
            return <Wrench className='h-4 w-4 text-green-500' />;
        case 'bugfix':
            return <Bug className='h-4 w-4 text-orange-500' />;
        case 'breaking':
            return <AlertTriangle className='h-4 w-4 text-red-500' />;
        default:
            return null;
    }
}

function getChangeLabel(type: string) {
    switch (type) {
        case 'feature':
            return 'New';
        case 'improvement':
            return 'Improved';
        case 'bugfix':
            return 'Fixed';
        case 'breaking':
            return 'Breaking';
        default:
            return type;
    }
}

export function ChangelogDialog({
    open,
    onOpenChange,
    changelog,
}: ChangelogDialogProps) {
    const { timezone } = useTimezone();

    const handleClose = () => {
        markChangelogAsSeen(changelog.id);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='max-w-2xl'>
                <DialogHeader className='space-y-3'>
                    <div className='flex items-center gap-2'>
                        <Sparkles className='h-6 w-6 text-primary' />
                        <DialogTitle className='text-2xl'>
                            What's New in v{changelog.version}
                        </DialogTitle>
                    </div>
                    <DialogDescription className='space-y-2'>
                        <div className='text-lg font-medium'>
                            {changelog.title}
                        </div>
                        <div className='flex items-center gap-2'>
                            <span>
                                {formatChangelogDate(changelog.date, timezone)}
                            </span>
                        </div>
                        {changelog.description && (
                            <p className='text-sm leading-relaxed pt-1'>
                                {changelog.description}
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className='relative'>
                    <ScrollArea className='h-[50vh] pr-4'>
                        <div className='space-y-4 pb-4'>
                            <div className='space-y-3'>
                                {changelog.changes.map((change, index) => (
                                    <div
                                        key={index}
                                        className='flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
                                    >
                                        <div className='mt-0.5'>
                                            {getChangeIcon(change.type)}
                                        </div>
                                        <div className='flex-1 space-y-1'>
                                            <Badge
                                                variant='outline'
                                                className='text-xs font-normal mb-1'
                                            >
                                                {getChangeLabel(change.type)}
                                            </Badge>
                                            <p className='text-sm'>
                                                {change.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                    {/* Scroll indicator gradient at bottom */}
                    <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none' />
                </div>

                <div className='flex justify-end gap-2 pt-4 border-t'>
                    <Button onClick={handleClose}>Got it!</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Auto-show changelog component that displays the latest unseen changelog
export function AutoShowChangelog() {
    const [open, setOpen] = useState(false);
    const [changelog, setChangelog] = useState<ChangelogEntry | null>(null);

    useEffect(() => {
        // Check if there are unseen changelogs
        if (hasUnseenChangelogs()) {
            const latest = getLatestChangelog();
            if (latest) {
                setChangelog(latest);
                // Show after a short delay for better UX
                setTimeout(() => setOpen(true), 1000);
            }
        }
    }, []);

    if (!changelog) return null;

    return (
        <ChangelogDialog
            open={open}
            onOpenChange={setOpen}
            changelog={changelog}
        />
    );
}
