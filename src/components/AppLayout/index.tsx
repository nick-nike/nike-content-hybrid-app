import { useOktaAuth } from '@okta/okta-react';
import type { FC, PropsWithChildren } from 'react';
import { AppAsider } from '../AppAsider';
import { AppHeader } from '../AppHeader';
import { cn } from '@/lib/utils';
import { useOktaAuth as useCustomOktaAuth } from '@/modules/login/services/useOktaAuth';
import { SessionExpiredModal } from '@/modules/login/components/SessionExpiredModal';

type Props = {
    className?: string;
};

const AppLayout: FC<PropsWithChildren<Props>> = ({ children, className }) => {
    const { authState } = useOktaAuth();
    const { 
        showAuthModal, 
        closeAuthModal, 
        handleReauthorize 
    } = useCustomOktaAuth();

    // Get user info from Okta (if available)
    const username = authState?.idToken?.claims?.name || 'User';

    // 处理Resume Session按钮点击
    const handleResumeSession = () => {
        console.log('🔗 Global Resume Session clicked');
        handleReauthorize(); // 使用useOktaAuth的重新验证逻辑
    };

    // 处理Cancel按钮点击
    const handleCancelSession = () => {
        console.log('❌ Global Cancel Session clicked');
        closeAuthModal(); // 关闭弹窗
    };

    return (
        <div className={cn('min-h-screen flex overflow-hidden', className)}>
            <AppAsider />
            <div className="flex flex-1 flex-col">
                <AppHeader {...{ username } as any} />
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>
            
            {/* 🚨 全局 Session Expired Modal */}
            <SessionExpiredModal 
                isVisible={showAuthModal}
                onResumeSession={handleResumeSession}
                onCancel={handleCancelSession}
            />
        </div>
    );
};

export { AppLayout };
