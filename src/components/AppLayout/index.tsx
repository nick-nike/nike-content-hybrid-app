import { useOktaAuth } from '@okta/okta-react';
import type { FC, PropsWithChildren } from 'react';
import { AppAsider } from '../AppAsider';
import { AppHeader } from '../AppHeader';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

const AppLayout: FC<PropsWithChildren<Props>> = ({ children, className }) => {
    const { authState } = useOktaAuth();

    // Get user info from Okta (if available)
    const username = authState?.idToken?.claims?.name || 'User';

    return (
        <div className={cn('min-h-screen flex', className)}>
            <AppAsider />
            <div className="flex flex-1 flex-col">
                <AppHeader {...{ username } as any} />
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

export { AppLayout };
