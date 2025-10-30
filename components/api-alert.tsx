import { AlertCircleIcon } from 'lucide-react';

export function APIAlert({
    error_reason,
    code,
    details,
}: {
    error_reason: string;
    code: string;
    details?: string;
}) {
    return (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30'>
            <div className='flex gap-3'>
                <div className='shrink-0'>
                    <AlertCircleIcon className='h-5 w-5 text-red-600 dark:text-red-500' />
                </div>
                <div className='flex-1 space-y-2'>
                    <h3 className='text-sm font-semibold text-red-900 dark:text-red-200'>
                        Aw, snap.
                    </h3>
                    <p className='text-sm text-red-800 dark:text-red-300'>
                        Something went wrong while trying to communicate with
                        our servers. If this issue persists, please provide the
                        following information:
                    </p>
                    <div className='mt-3 space-y-1.5 rounded-md bg-red-100 p-3 font-mono text-xs dark:bg-red-950/50'>
                        <div className='flex gap-2'>
                            <span className='font-semibold text-red-900 dark:text-red-400'>
                                Error Reason:
                            </span>
                            <span className='text-red-700 dark:text-red-500'>
                                {error_reason}
                            </span>
                        </div>
                        <div className='flex gap-2'>
                            <span className='font-semibold text-red-900 dark:text-red-400'>
                                Error Code:
                            </span>
                            <span className='text-red-700 dark:text-red-500'>
                                {code}
                            </span>
                        </div>
                        {details && (
                            <div className='flex gap-2'>
                                <span className='font-semibold text-red-900 dark:text-red-400'>
                                    Details:
                                </span>
                                <span className='text-red-700 dark:text-red-500'>
                                    {details}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
