import type { FC, PropsWithChildren } from 'react';
import { UserProfile } from '../UserProfile';
import { Input } from '../ui/input';

type Props = {
    title: string;
    onSearch?: (keyword: string) => void;
    onChange?: (keyword: string) => void;
};

const AppHeader: FC<PropsWithChildren<Props>> = ({ children, title, onSearch, onChange }) => {
    return (
        <header className="flex items-center justify-between gap-8 bg-white px-8 py-4 text-black-11">
            <div className="flex flex-1 items-center gap-8">
                <h1 className="text-2xl">{title}</h1>
                {(!!onSearch || !!onChange) && (
                    <Input
                        placeholder="Search..."
                        className="max-w-sm"
                        onChange={e => onChange?.(e.currentTarget.value)}
                        onKeyDown={e => e.key === 'Enter' && onSearch?.(e.currentTarget.value)}
                    />
                )}
            </div>
            {children}
            <UserProfile />
        </header>
    );
};

export { AppHeader };
