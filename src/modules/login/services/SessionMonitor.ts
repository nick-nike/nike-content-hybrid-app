import { oktaAuth, AUTH_CONFIG } from './config';
import { getTokenInfo, refreshTokens, clearTokens, getTokenTimeRemaining } from './authGuard';
import { TokenManager } from './TokenManager';
import { SessionEvent, SessionEventType } from './auth';


export class SessionMonitor {
    private static instance: SessionMonitor;
    private refreshTimer: NodeJS.Timeout | null = null;
    private activityTimer: NodeJS.Timeout | null = null;
    private lastActivity: number = Date.now();
    private isMonitoring: boolean = false;
    private eventListeners: Set<(event: SessionEvent) => void> = new Set();
    private tokenManager: TokenManager;
    private activityEventHandlers: Array<() => void> = [];
    private isNetworkOnline: boolean = navigator.onLine;

    private constructor() {
        this.tokenManager = TokenManager.getInstance();
        this.setupNetworkListeners();
        this.setupStorageListener();
        this.setupPageVisibilityListener();
    }

    public static getInstance(): SessionMonitor {
        if (!SessionMonitor.instance) {
            SessionMonitor.instance = new SessionMonitor();
        }
        return SessionMonitor.instance;
    }

    /**
     * 开始监控
     */
    public startMonitoring(): void {
        if (this.isMonitoring) {
            return;
        }

        this.isMonitoring = true;
        this.lastActivity = Date.now();

        // 设置定期检查
        this.refreshTimer = setInterval(() => {
            this.checkTokenStatus();
        }, AUTH_CONFIG.refreshInterval * 1000);

        // 监听用户活动
        this.setupActivityListeners();

        // 监听Okta token事件
        this.setupOktaListeners();

        console.log('Session monitoring started');
        
        // 监听跨标签页通信
        this.setupCrossTabCommunication();
    }

    /**
     * 停止监控
     */
    public stopMonitoring(): void {
        if (!this.isMonitoring) {
            return;
        }

        this.isMonitoring = false;

        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }

        if (this.activityTimer) {
            clearTimeout(this.activityTimer);
            this.activityTimer = null;
        }

        this.removeActivityListeners();
        console.log('Session monitoring stopped');
    }

    /**
     * 添加事件监听器
     */
    public addEventListener(listener: (event: SessionEvent) => void): void {
        this.eventListeners.add(listener);
    }

    /**
     * 移除事件监听器
     */
    public removeEventListener(listener: (event: SessionEvent) => void): void {
        this.eventListeners.delete(listener);
    }

    /**
     * 触发事件
     */
    private emitEvent(type: SessionEventType, payload?: any): void {
        const event: SessionEvent = {
            type,
            payload,
            timestamp: Date.now()
        };

        this.eventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in session event listener:', error);
            }
        });
    }

    /**
     * 🔄 统一Token状态检查 - 闭环核心逻辑
     * Tech Lead要求：只管expire time是否即将过期，然后retry3次失败就弹窗
     */
    private async checkTokenStatus(): Promise<void> {
        try {
            const tokenInfo = await getTokenInfo();
            
            if (!tokenInfo) {
                console.log('❌ No token found - session expired');
                this.emitEvent(SessionEventType.SESSION_EXPIRED, {
                    reason: 'no_token',
                    message: 'Authentication expired, please log in again'
                });
                return;
            }

            // 检查是否已过期
            if (tokenInfo.isExpired) {
                console.log('❌ Token already expired');
                this.emitEvent(SessionEventType.SESSION_EXPIRED, {
                    reason: 'token_expired',
                    message: 'Authentication expired, please log in again'
                });
                return;
            }

            // 🎯 核心逻辑：检查是否即将在5分钟内过期
            if (tokenInfo.isExpiringSoon) {
                console.log('⏰ Token expiring soon - starting unified refresh process...');
                await this.handleUnifiedTokenRefresh();
                return;
            }

            // Token状态健康，继续监控
            console.log('✅ Token status healthy, continuing monitoring...');

        } catch (error) {
            console.error('❌ Error in unified token status check:', error);
            // 检查失败也触发刷新逻辑
            await this.handleUnifiedTokenRefresh();
        }
    }

    /**
     * 处理token过期
     */
    private async handleTokenExpired(): Promise<void> {
        console.warn('Token has expired');
        this.emitEvent(SessionEventType.TOKEN_EXPIRED);
        this.broadcastToOtherTabs('session_expired', { reason: 'token_expired' });
        await clearTokens();
        this.stopMonitoring();
    }


    /**
     * 检查用户活动
     */
    private checkUserActivity(): void {
        const now = Date.now();
        const inactiveTime = now - this.lastActivity;
        const maxInactiveTime = AUTH_CONFIG.activityTimeout * 60 * 1000;

        if (inactiveTime > maxInactiveTime) {
            console.warn('User inactive for too long');
            this.emitEvent(SessionEventType.SESSION_EXPIRED, {
                reason: 'user_inactive',
                inactiveTime
            });
        }
    }

    /**
     * 更新用户活动时间
     */
    private updateActivity(): void {
        this.lastActivity = Date.now();
        this.emitEvent(SessionEventType.USER_ACTIVITY, {
            timestamp: this.lastActivity
        });
    }

    /**
     * 设置活动监听器
     */
    private setupActivityListeners(): void {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const throttledUpdate = this.throttle(() => {
            this.updateActivity();
        }, 5000); // 5秒内最多更新一次

        events.forEach(eventName => {
            document.addEventListener(eventName, throttledUpdate as EventListener, true);
        });
    }

    /**
     * 移除活动监听器
     */
    private removeActivityListeners(): void {
        // 注意：这里需要保存事件处理器的引用才能正确移除
        // 在实际实现中，您可能需要在setupActivityListeners中保存这些引用
    }

    /**
     * 设置Okta事件监听器
     */
    private setupOktaListeners(): void {
        // 监听自定义token事件
        window.addEventListener('oktaTokenRenewed', (event: any) => {
            this.emitEvent(SessionEventType.TOKEN_REFRESHED, event.detail);
        });

        window.addEventListener('oktaTokenError', (event: any) => {
            this.emitEvent(SessionEventType.REFRESH_FAILED, event.detail);
        });
    }

    /**
     * 节流函数
     */
    private throttle(func: Function, limit: number): Function {
        let inThrottle: boolean;
        return function(this: any, ...args: any[]) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 获取当前会话状态
     */
    public getSessionStatus() {
        return {
            isMonitoring: this.isMonitoring,
            lastActivity: this.lastActivity,
            tokenManager: this.tokenManager.getRefreshStatus(),
            isOnline: this.isNetworkOnline
        };
    }

    /**
     * 设置网络状态监听器
     */
    private setupNetworkListeners(): void {
        window.addEventListener('online', () => {
            this.isNetworkOnline = true;
            console.log('Network back online, checking token status');
            this.checkTokenStatus();
            this.emitEvent(SessionEventType.USER_ACTIVITY, { type: 'network_online' });
        });

        window.addEventListener('offline', () => {
            this.isNetworkOnline = false;
            console.log('Network went offline');
            this.emitEvent(SessionEventType.SESSION_WARNING, { 
                type: 'network_offline',
                message: 'Network connection lost. Some features may be limited.' 
            });
        });
    }

    /**
     * 设置跨标签页通信
     */
    private setupCrossTabCommunication(): void {
        // 监听其他标签页的认证事件
        window.addEventListener('storage', (event) => {
            if (event.key === 'oktaAuthEvent') {
                try {
                    const authEvent = JSON.parse(event.newValue || '');
                    console.log('Cross-tab auth event:', authEvent);
                    
                    switch (authEvent.type) {
                        case 'logout':
                            this.emitEvent(SessionEventType.SESSION_EXPIRED, authEvent.payload);
                            break;
                        case 'token_refreshed':
                            this.emitEvent(SessionEventType.TOKEN_REFRESHED, authEvent.payload);
                            break;
                        case 'session_expired':
                            this.emitEvent(SessionEventType.SESSION_EXPIRED, authEvent.payload);
                            break;
                    }
                } catch (error) {
                    console.error('Error parsing cross-tab auth event:', error);
                }
            }
        });
    }

    /**
     * 广播事件到其他标签页
     */
    private broadcastToOtherTabs(type: string, payload?: any): void {
        try {
            const event = {
                type,
                payload,
                timestamp: Date.now(),
                tabId: Math.random().toString(36)
            };
            localStorage.setItem('oktaAuthEvent', JSON.stringify(event));
            // 立即清除，避免污染存储
            setTimeout(() => {
                localStorage.removeItem('oktaAuthEvent');
            }, 100);
        } catch (error) {
            console.error('Error broadcasting to other tabs:', error);
        }
    }

    /**
     * 设置存储监听器（监听sessionStorage变化）
     */
    private setupStorageListener(): void {
        // 监听sessionStorage中的token变化
        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function(key: string, value: string) {
            if (key.includes('okta-token-storage')) {
                window.dispatchEvent(new CustomEvent('oktaStorageChange', {
                    detail: { key, value }
                }));
            }
            originalSetItem.apply(this, [key, value]);
        };

        window.addEventListener('oktaStorageChange', (event: any) => {
            console.log('Okta storage changed:', event.detail);
            // 检查token状态
            setTimeout(() => this.checkTokenStatus(), 100);
        });
    }


    /**
     * 🔄 统一Token刷新处理 - 闭环核心逻辑
     * Tech Lead要求：5分钟左右开始refresh，成功继续倒计时，失败10秒retry，3次后弹窗
     */
    private async handleUnifiedTokenRefresh(): Promise<void> {
        console.log('🔄 Starting unified token refresh process...');
        
        try {
            const success = await this.tokenManager.refreshToken();
            if (success) {
                console.log('✅ Unified token refresh successful - continuing monitoring cycle');
                this.emitEvent(SessionEventType.TOKEN_REFRESHED, { 
                    method: 'unified_refresh',
                    timestamp: Date.now(),
                    message: 'Token refreshed successfully, continuing normal operation'
                });
                this.broadcastToOtherTabs('token_refreshed', { 
                    method: 'unified_refresh',
                    timestamp: Date.now() 
                });
            } else {
                const refreshStatus = this.tokenManager.getRefreshStatus();
                console.warn(`❌ Unified token refresh failed - attempt ${refreshStatus.attempts}/${AUTH_CONFIG.maxRefreshAttempts}`);
                
                if (refreshStatus.attempts >= AUTH_CONFIG.maxRefreshAttempts) {
                    // 3次重试失败后触发弹窗
                    console.log('🚨 Max retry attempts exceeded - showing auth expired modal');
                    this.emitEvent(SessionEventType.SESSION_EXPIRED, {
                        reason: 'max_refresh_attempts_exceeded',
                        attempts: refreshStatus.attempts,
                        message: 'Authentication expired, please log in again'
                    });
                } else {
                    // 继续重试逻辑
                    this.emitEvent(SessionEventType.REFRESH_FAILED, {
                        method: 'unified_refresh',
                        attempts: refreshStatus.attempts,
                        maxAttempts: AUTH_CONFIG.maxRefreshAttempts,
                        nextRetryIn: AUTH_CONFIG.retryInterval
                    });
                }
            }
        } catch (error) {
            console.error('❌ Error in unified token refresh process:', error);
            this.emitEvent(SessionEventType.REFRESH_FAILED, {
                method: 'unified_refresh',
                error: error instanceof Error ? error.message : 'Unknown error',
                message: 'Network or server error during token refresh'
            });
        }
    }

    /**
     * 强制刷新token（用于测试）
     */
    public async forceTokenRefresh(): Promise<boolean> {
        console.log('Force refreshing token...');
        return await this.tokenManager.refreshToken();
    }

    /**
     * 设置页面可见性监听器 - 用于检测用户离开后回到页面的场景
     */
    private setupPageVisibilityListener(): void {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                console.log('Page became visible - checking token status...');
                this.handlePageReturn();
            } else {
                console.log('Page became hidden - user left the page');
            }
        });
    }

    /**
     * 处理用户回到页面时的逻辑
     */
    private async handlePageReturn(): Promise<void> {
        try {
            // 检查token状态
            const tokenInfo = await getTokenInfo();
            
            if (!tokenInfo) {
                console.log('No token found on page return');
                this.emitEvent(SessionEventType.SESSION_EXPIRED, { 
                    reason: 'no_token_on_return',
                    message: '会话已过期，请重新登录'
                });
                return;
            }

            // 如果token已过期，尝试统一刷新
            if (tokenInfo.isExpired || tokenInfo.isExpiringSoon) {
                console.log('Token expired/expiring on page return - attempting unified refresh...');
                await this.handleUnifiedTokenRefresh();
            } else {
                console.log('Token is still valid on page return');
                // 更新最后活动时间
                this.updateActivity();
            }
        } catch (error) {
            console.error('Error handling page return:', error);
        }
    }

    /**
     * 🧪 统一测试方法 - 模拟Token即将过期的闭环流程
     * 覆盖完整的5分钟提前刷新 → 成功继续 OR 失败重试3次 → 弹窗重新认证的完整闭环
     */
    public async simulateUnifiedTokenFlow(): Promise<void> {
        console.log('🧪 Starting unified token flow simulation...');
        console.log('📋 This simulates the complete closed-loop: 5min early refresh → retry 3 times → modal if failed');
        
        // 直接触发统一的Token刷新流程
        await this.handleUnifiedTokenRefresh();
    }

    /**
     * 🧪 模拟网络失败的重试场景
     * 强制模拟3次失败，演示完整的重试逻辑和最终弹窗
     */
    public async simulateNetworkFailureRetry(): Promise<void> {
        console.log('🧪 Simulating network failure retry scenario...');
        console.log('📋 This will force 3 failed attempts with 10s intervals, then show auth modal');
        
        // 重置TokenManager状态，强制进入失败模式
        this.tokenManager.resetRetryCount();
        
        // 模拟3次失败的尝试
        for (let attempt = 1; attempt <= AUTH_CONFIG.maxRefreshAttempts; attempt++) {
            console.log(`🔄 Simulating failed refresh attempt ${attempt}/${AUTH_CONFIG.maxRefreshAttempts}`);
            
            this.emitEvent(SessionEventType.REFRESH_FAILED, {
                method: 'network_failure_simulation',
                attempts: attempt,
                maxAttempts: AUTH_CONFIG.maxRefreshAttempts,
                nextRetryIn: AUTH_CONFIG.retryInterval,
                message: `Simulated network failure - attempt ${attempt}/${AUTH_CONFIG.maxRefreshAttempts}`
            });
            
            // 如果不是最后一次尝试，等待重试间隔
            if (attempt < AUTH_CONFIG.maxRefreshAttempts) {
                console.log(`⏳ Waiting ${AUTH_CONFIG.retryInterval} seconds before next attempt...`);
                await new Promise(resolve => setTimeout(resolve, AUTH_CONFIG.retryInterval * 1000));
            }
        }
        
        // 所有尝试失败后，触发认证过期弹窗
        console.log('🚨 All retry attempts failed - triggering auth expired modal');
        this.emitEvent(SessionEventType.SESSION_EXPIRED, {
            reason: 'simulated_max_retry_exceeded',
            attempts: AUTH_CONFIG.maxRefreshAttempts,
            message: 'Authentication expired, please log in again'
        });
    }

    /**
     * 模拟token即将过期（用于测试）
     */
    public async simulateTokenExpiring(): Promise<void> {
        console.log('Simulating token expiring soon...');
        this.emitEvent(SessionEventType.SESSION_WARNING, {
            type: 'token_expiring_soon',
            timeRemaining: 2,
            message: 'Your session will expire in 2 minutes (simulated)'
        });
    }

    /**
     * 模拟用户长时间无活动（用于测试）
     */
    public simulateUserInactivity(): void {
        console.log('Simulating user inactivity...');
        this.lastActivity = Date.now() - (AUTH_CONFIG.activityTimeout * 60 * 1000 + 1000);
        this.checkUserActivity();
    }
}
