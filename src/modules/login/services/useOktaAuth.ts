import { useContext, useEffect, useState, useCallback } from 'react';
import { useOktaAuth as useOktaReactAuth } from '@okta/okta-react';
import { SessionMonitor } from './SessionMonitor';
import { SessionEventType, SessionEvent } from './auth';
import { getTokenInfo, verifyAuthentication, getTokenTimeRemaining } from './authGuard';

export interface UseOktaAuthReturn {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any;
    error: string | null;
    warning: string | null;
    login: () => void;
    logout: () => Promise<void>;
    refreshSession: () => Promise<boolean>;
    sessionStatus: any;
    tokenTimeRemaining: number;
    // 🧪 统一测试方法
    simulateUnifiedTokenFlow: () => Promise<void>;
    simulateNetworkFailureRetry: () => Promise<void>;
    // 🔄 统一认证弹窗状态
    showAuthModal: boolean;
    authModalReason: string;
    authModalAttempts: number;
    closeAuthModal: () => void;
    handleReauthorize: () => void;
}

export const useOktaAuth = (): UseOktaAuthReturn => {
    const { oktaAuth, authState } = useOktaReactAuth();
    const [error, setError] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [tokenTimeRemaining, setTokenTimeRemaining] = useState(0);
    // 🔄 统一认证弹窗状态 - Session Lifecycle Management
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalReason, setAuthModalReason] = useState('');
    const [authModalAttempts, setAuthModalAttempts] = useState(0);
    const sessionMonitor = SessionMonitor.getInstance();

    // 处理会话事件
    useEffect(() => {
        const handleSessionEvent = (event: SessionEvent) => {
            switch (event.type) {
                case SessionEventType.TOKEN_REFRESHED:
                    setError(null);
                    setIsTokenValid(true);
                    console.log('Token refreshed automatically');
                    break;

                case SessionEventType.TOKEN_EXPIRED:
                case SessionEventType.SESSION_EXPIRED:
                    setIsTokenValid(false);
                    setError('Your session has expired. Please log in again.');
                    // 🔄 显示统一认证弹窗
                    setShowAuthModal(true);
                    setAuthModalReason(event.payload?.reason || 'session_expired');
                    setAuthModalAttempts(event.payload?.attempts || 0);
                    break;

                case SessionEventType.REFRESH_FAILED:
                    if (event.payload?.attempts >= 3) {
                        setError('Unable to refresh your session. Please log in again.');
                        setIsTokenValid(false);
                    }
                    break;

                case SessionEventType.SESSION_WARNING:
                    setWarning(event.payload?.message || 'Session warning');
                    console.warn('Session warning:', event.payload);
                    // 30秒后清除警告
                    setTimeout(() => setWarning(null), 30000);
                    break;
            }
        };

        sessionMonitor.addEventListener(handleSessionEvent);

        return () => {
            sessionMonitor.removeEventListener(handleSessionEvent);
        };
    }, [sessionMonitor]);

    // 验证认证状态
    useEffect(() => {
        const verifyAuth = async () => {
            if (authState?.isAuthenticated && !authState.isPending) {
                const isValid = await verifyAuthentication();
                setIsTokenValid(isValid);

                if (isValid) {
                    // 开始会话监控
                    sessionMonitor.startMonitoring();
                } else {
                    // 停止会话监控
                    sessionMonitor.stopMonitoring();
                    setError('Invalid session. Please log in again.');
                }
            } else {
                setIsTokenValid(false);
                sessionMonitor.stopMonitoring();
            }
        };

        verifyAuth();
    }, [authState?.isAuthenticated, authState?.isPending, sessionMonitor]);

    const login = () => {
        setError(null);
        oktaAuth.signInWithRedirect();
    };

    const logout = async () => {
        try {
            sessionMonitor.stopMonitoring();
            await oktaAuth.signOut();
            setIsTokenValid(false);
            setError(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refreshSession = async (): Promise<boolean> => {
        try {
            setError(null);
            const tokenInfo = await getTokenInfo();
            if (tokenInfo && !tokenInfo.isExpired) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Refresh session error:', error);
            setError('Failed to refresh session');
            return false;
        }
    };

    // 🧪 统一测试方法
    const simulateUnifiedTokenFlow = useCallback(async (): Promise<void> => {
        console.log('🧪 Starting unified token flow simulation from useOktaAuth...');
        await sessionMonitor.simulateUnifiedTokenFlow();
    }, [sessionMonitor]);

    const simulateNetworkFailureRetry = useCallback(async (): Promise<void> => {
        console.log('🧪 Starting network failure retry simulation from useOktaAuth...');
        await sessionMonitor.simulateNetworkFailureRetry();
    }, [sessionMonitor]);

    // 🔄 统一认证弹窗处理方法 - Session Lifecycle Management
    const closeAuthModal = useCallback(() => {
        console.log('🔄 closeAuthModal called - 关闭认证弹窗');
        setShowAuthModal(false);
        setAuthModalReason('');
        setAuthModalAttempts(0);
        setError(null);
    }, []);

    const handleReauthorize = useCallback(() => {
        console.log('🔐 用户点击重新验证 - 直接跳转到Okta验证页面');
        
        // 保存当前页面URL，用于认证成功后返回
        const currentUrl = window.location.href;
        sessionStorage.setItem('returnUrl', currentUrl);
        console.log('💾 保存当前页面URL:', currentUrl);
        
        // 发送用户点击重新验证事件，通知流程进入步骤13
        const userActionEvent = new CustomEvent('USER_CLICKED_REAUTHORIZE', {
            detail: {
                step: 13,
                message: '用户手动点击重新验证按钮，跳转到Okta验证页面'
            }
        });
        window.dispatchEvent(userActionEvent);
        
        // 直接在当前页面跳转到Okta验证，验证成功后会回到当前页面
        // 弹窗保持开启状态，继续100秒监听逻辑，等待验证成功后自动关闭
        oktaAuth.signInWithRedirect({
            originalUri: currentUrl
        });
    }, [oktaAuth]);

    // 定期更新token剩余时间
    useEffect(() => {
        const updateTokenTime = async () => {
            if (authState?.isAuthenticated && isTokenValid) {
                try {
                    const timeRemaining = await getTokenTimeRemaining();
                    setTokenTimeRemaining(timeRemaining);
                } catch (error) {
                    console.error('Error getting token time remaining:', error);
                    setTokenTimeRemaining(0);
                }
            } else {
                setTokenTimeRemaining(0);
            }
        };

        // 立即更新一次
        updateTokenTime();

        // 每分钟更新一次
        const interval = setInterval(updateTokenTime, 60000);

        return () => clearInterval(interval);
    }, [authState?.isAuthenticated, isTokenValid]);

    return {
        isAuthenticated: (authState?.isAuthenticated ?? false) && isTokenValid,
        isLoading: Boolean(authState?.isPending ?? false),
        user: authState?.user || null,
        error,
        warning,
        login,
        logout,
        refreshSession,
        sessionStatus: sessionMonitor?.getSessionStatus() || {},
        tokenTimeRemaining,
        simulateUnifiedTokenFlow,
        simulateNetworkFailureRetry,
        // 🔄 统一认证弹窗状态和方法 - Session Lifecycle Management
        showAuthModal,
        authModalReason,
        authModalAttempts,
        closeAuthModal,
        handleReauthorize
    };
};
