import type { FC } from 'react';

type Props = {
    enabled: boolean;
    enabledLabel?: string;
    disabledLabel?: string;
};

// eslint-disable-next-line import/no-unused-modules
export const EnabledTag: FC<Props> = ({ enabled, enabledLabel = 'Enabled', disabledLabel = 'Disabled' }) => {
    return (
        <div
            className={`mt-2 flex h-5 w-14 items-center justify-center font-medium ${
                enabled ? 'bg-[#1EAA52]' : 'bg-gray-100'
            } rounded text-xxs text-white`}
        >
            {enabled ? enabledLabel : disabledLabel}
        </div>
    );
};
