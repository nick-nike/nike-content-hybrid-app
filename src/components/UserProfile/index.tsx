import type { FC } from 'react';
import { UserAvatar } from '../UserAvatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { useUserInfo } from '@/services/user/useUserInfo';

const UserProfile: FC = () => {
    const { userInfo: { shortName, username, email, roles } } = useUserInfo();
    return (
        <Popover>
            <PopoverTrigger className="size-9 cursor-pointer">
                <UserAvatar userName={shortName || username} />
            </PopoverTrigger>
            <PopoverContent sideOffset={16}>
                <div className={cn('relative z-1 mb-2')}>
                    <div className="flex items-center">
                        <div className="flex flex-1 flex-col">
                            <span className="inline-flex items-center text-xl font-medium">
                                {username}
                            </span>
                            <span className="mt-2 text-sm">{email}</span>
                        </div>
                    </div>
                    <ul className="flex max-w-63 flex-wrap">
                        {roles.flatMap((item) => (
                            <li key={item.id} className="mt-2 mr-2 rounded-sm bg-[#CBC8F5] px-1 text-xs leading-6 font-normal">
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export { UserProfile };
