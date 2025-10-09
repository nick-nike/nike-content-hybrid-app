import { oktaAuth, AUTH_CONFIG } from './config';
import type { OktaTokens, RefreshAttempt } from './auth';

/**
 * 获取当前token信息
 */
export const getTokenInfo = async (): Promise<OktaTokens | null> => {
    try {
        const accessToken = await oktaAuth.tokenManager.get('accessToken');
        const idToken = await oktaAuth.tokenManager.get('idToken');

        if (!accessToken || !idToken) {
            return null;
        }

        const now = Date.now() / 1000;
        const expiresAt = accessToken.expiresAt;
        const timeToExpire = expiresAt - now;
        const refreshThresholdSeconds = AUTH_CONFIG.refreshThreshold * 60;

        return {
            accessToken,
            idToken,
            expiresAt: expiresAt * 1000, // 转换为毫秒
            isExpired: timeToExpire <= 0,
            isExpiringSoon: timeToExpire <= refreshThresholdSeconds,
        };
    } catch (error) {
        console.error('Error getting token info:', error);
        return null;
    }
};

/**
 * 验证当前认证状态
 */
export const verifyAuthentication = async (): Promise<boolean> => {
    try {
        const tokenInfo = await getTokenInfo();
        if (!tokenInfo) {
            return false;
        }

        if (tokenInfo.isExpired) {
            console.warn('Token is expired');
            return false;
        }

        const isAuthenticated = await oktaAuth.isAuthenticated();
        return isAuthenticated;
    } catch (err) {
        console.error('Error verifying authentication:', err);
        return false;
    }
};

/**
 * 🔄 统一Token刷新方法 - 符合Tech Lead的闭环要求
 * 不管什么原因失败，都通过统一的重试机制处理
 */
export const refreshTokens = async (): Promise<RefreshAttempt> => {
    const attempt: RefreshAttempt = {
        attempt: 1,
        timestamp: Date.now(),
        success: false
    };

    try {
        // 检查是否有token可以刷新
        const accessToken = await oktaAuth.tokenManager.get('accessToken');
        if (!accessToken) {
            throw new Error('No access token available for refresh');
        }

        console.log('🔄 Attempting unified token refresh...');
        
        // 使用Okta SDK进行token刷新
        const newAccessToken = await oktaAuth.tokenManager.renew('accessToken');
        
        if (newAccessToken) {
            console.log('✅ Access token refreshed successfully');
            
            // 同时尝试刷新ID token（非关键操作）
            try {
                await oktaAuth.tokenManager.renew('idToken');
                console.log('✅ ID token refreshed successfully');
            } catch (idTokenError) {
                console.warn('⚠️ ID token refresh failed (non-critical):', idTokenError);
            }
            
            attempt.success = true;
            attempt.newToken = {
                accessToken: newAccessToken,
                timestamp: Date.now()
            };
            
            // 📡 广播刷新成功事件到闭环系统
            window.dispatchEvent(new CustomEvent('oktaTokenRenewed', {
                detail: { 
                    accessToken: newAccessToken,
                    timestamp: Date.now(),
                    method: 'unified_refresh'
                }
            }));
            
            return attempt;
        } else {
            throw new Error('Failed to obtain new access token from Okta');
        }
    } catch (error) {
        console.error('❌ Unified token refresh failed:', error);
        attempt.error = error instanceof Error ? error.message : 'Unknown error';
        
        // 📡 广播刷新失败事件到闭环系统
        window.dispatchEvent(new CustomEvent('oktaTokenError', {
            detail: { 
                error: attempt.error,
                timestamp: Date.now(),
                method: 'unified_refresh',
                reason: 'network_or_server_error' // Tech Lead要求：不管什么原因失败
            }
        }));
    }

    return attempt;
};

/**
 * 强制刷新所有tokens
 */
export const forceRefreshTokens = async (): Promise<boolean> => {
    try {
        // 清除当前tokens
        await oktaAuth.tokenManager.clear();
        
        // 触发重新认证
        oktaAuth.signInWithRedirect();
        return true;
    } catch (error) {
        console.error('Force refresh failed:', error);
        return false;
    }
};

/**
 * 检查Token是否需要刷新
 */
export const shouldRefreshToken = async (): Promise<boolean> => {
    const tokenInfo = await getTokenInfo();
    return tokenInfo?.isExpiringSoon ?? false;
};

/**
 * 清理所有token
 */
export const clearTokens = async (): Promise<void> => {
    try {
        await oktaAuth.tokenManager.clear();
        console.log('All tokens cleared');
    } catch (error) {
        console.error('Error clearing tokens:', error);
    }
};

/**
 * 获取Token剩余时间（分钟）
 */
export const getTokenTimeRemaining = async (): Promise<number> => {
    const tokenInfo = await getTokenInfo();
    if (!tokenInfo) return 0;
    
    const now = Date.now();
    const remaining = Math.max(0, tokenInfo.expiresAt - now);
    return Math.floor(remaining / (1000 * 60)); // 转换为分钟
};
