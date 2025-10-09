import type { FC } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';

const avatarIconThemes = ['bg-[#6A64DF]', 'bg-[#1EAA52]', 'bg-[#FFA000]', 'bg-[#4e72f2]', 'bg-[#ee6467]'];

const UserAvatar: FC<{ userName: string; className?: string }> = ({ userName, className }) => {
    const iconIndex = userName.charAt(0).toLowerCase().charCodeAt(0) % avatarIconThemes.length;
    return (
        <Avatar className={className}>
            <AvatarFallback className={`${avatarIconThemes[iconIndex]} text-white`}>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};

export { UserAvatar };
