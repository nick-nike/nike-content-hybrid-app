import type { FC } from 'react';
import { cn } from '@/lib/utils';

export const StatusLabel: FC<{
    enabled?: boolean;
    enabledLabel?: string;
    disabledLabel?: string;
}> = ({ enabled, enabledLabel, disabledLabel }) => {
    return (
        <div className="inline-flex items-center">
            <span
                className={cn('mr-2 h-2 w-2 shrink-0 rounded-full', enabled ? 'bg-green-500' : 'bg-gray-400')}
            />
            {enabled ? enabledLabel || 'Enabled' : disabledLabel || 'Disabled'}
        </div>
    );
};
