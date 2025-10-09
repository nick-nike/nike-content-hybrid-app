import { oktaAuth } from './config';
import { refreshTokens, getTokenInfo, clearTokens, getTokenTimeRemaining } from './authGuard';
import { RefreshAttempt, SessionEvent, SessionEventType } from './auth';

export interface TokenManagerConfig {
    maxRetryAttempts: number;
    retryDelay: number;
    refreshThreshold: number;
}

export class TokenManager {
    private static instance: TokenManager;
    private refreshAttempts: RefreshAttempt[] = [];
    private isRefreshing: boolean = false;
    private refreshPromise: Promise<boolean> | null = null;
    private config: TokenManagerConfig;
    private eventListeners: Set<(event: SessionEvent) => void> = new Set();

    private constructor(config: TokenManagerConfig) {
        this.config = config;
    }

    public static getInstance(config?: TokenManagerConfig): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager(config || {
                maxRetryAttempts: 3,
                retryDelay: 10000, // 10秒
                refreshThreshold: 5 * 60 * 1000 // 5分钟
            });
        }
        return TokenManager.instance;
    }

    /**
     * 智能刷新token - 防止并发刷新
     */
    public async refreshToken(): Promise<boolean> {
        // 如果已经在刷新中，返回现有的Promise
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;
        this.refreshPromise = this.performRefresh();

        try {
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    /**
     * 执行token刷新
     */
    private async performRefresh(): Promise<boolean> {
        const currentAttempts = this.refreshAttempts.length;
        
        if (currentAttempts >= this.config.maxRetryAttempts) {
            console.error('Max refresh attempts reached');
            this.emitEvent(SessionEventType.REFRESH_FAILED, {
                reason: 'max_attempts_reached',
                attempts: currentAttempts
            });
            return false;
        }

        try {
            const attempt = await refreshTokens();
            this.refreshAttempts.push(attempt);

            if (attempt.success) {
                console.log('Token refresh successful');
                this.refreshAttempts = []; // 重置尝试记录
                this.emitEvent(SessionEventType.TOKEN_REFRESHED, { attempt });
                return true;
            } else {
                console.warn(`Token refresh failed (attempt ${currentAttempts + 1}):`, attempt.error);
                
                // 如果还有重试机会，延迟后重试
                if (currentAttempts + 1 < this.config.maxRetryAttempts) {
                    console.log(`Retrying in ${this.config.retryDelay / 1000} seconds...`);
                    await this.delay(this.config.retryDelay);
                    return this.performRefresh();
                } else {
                    this.emitEvent(SessionEventType.REFRESH_FAILED, {
                        reason: 'all_attempts_failed',
                        attempts: this.refreshAttempts
                    });
                    return false;
                }
            }
        } catch (error) {
            console.error('Unexpected error during token refresh:', error);
            this.emitEvent(SessionEventType.REFRESH_FAILED, {
                reason: 'unexpected_error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return false;
        }
    }

    /**
     * 检查是否需要刷新token
     */
    public async shouldRefresh(): Promise<boolean> {
        const tokenInfo = await getTokenInfo();
        return tokenInfo?.isExpiringSoon ?? false;
    }

    /**
     * 自动刷新检查
     */
    public async autoRefreshCheck(): Promise<void> {
        const shouldRefresh = await this.shouldRefresh();
        if (shouldRefresh && !this.isRefreshing) {
            await this.refreshToken();
        }
    }

    /**
     * 清理并重置
     */
    public async reset(): Promise<void> {
        this.isRefreshing = false;
        this.refreshPromise = null;
        this.refreshAttempts = [];
        await clearTokens();
    }

    /**
     * 获取刷新状态
     */
    public getRefreshStatus() {
        return {
            isRefreshing: this.isRefreshing,
            attempts: this.refreshAttempts.length,
            maxAttempts: this.config.maxRetryAttempts,
            lastAttempt: this.refreshAttempts[this.refreshAttempts.length - 1] || null
        };
    }

    /**
     * 🔄 重置重试计数 - 用于测试场景
     */
    public resetRetryCount(): void {
        this.refreshAttempts = [];
        this.isRefreshing = false;
        this.refreshPromise = null;
        console.log('🔄 TokenManager retry count reset for testing');
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
                console.error('Error in token manager event listener:', error);
            }
        });
    }

    /**
     * 延迟工具函数
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


