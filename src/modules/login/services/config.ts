import { OktaAuth } from '@okta/okta-auth-js';

// 🔄 完整Token管理闭环配置 - 一个不可分割的完整流程
export const AUTH_CONFIG = {
    refreshThreshold: 5, // Token即将过期检测阈值（分钟）- 5分钟前开始刷新
    maxRefreshAttempts: 3, // 刷新失败最大重试次数 - 失败后重试3次
    refreshInterval: 30, // 监控循环检查间隔（秒）- 每30秒检查Token状态
    retryInterval: 10, // 刷新失败重试间隔（秒）- 延迟10秒重试
    modalTimeout: 100, // 认证过期弹窗自动检测时长（秒）- 100秒自动检测新Token
    sessionTimeout: 60, // 会话超时时间（分钟）
    activityTimeout: 10, // 用户活动超时（分钟）
};

// Okta configuration - 简化配置，专注登录功能
const oktaConfig = {
    issuer: 'https://nike.okta.com/oauth2/aus27z7p76as9Dz0H1t7',
    clientId: 'nike.martech.gcamt',
    redirectUri: `${window.location.origin}/authorize/callback`,
    scopes: ['openid', 'profile', 'email', 'groups', 'offline_access'],
    pkce: true,
    tokenManager: {
        storage: 'sessionStorage',
    },
};

// Create OktaAuth instance
export const oktaAuth = new OktaAuth(oktaConfig);

// 添加调试信息
console.log('🔧 === Okta 配置初始化 ===');
console.log('🔧 Issuer:', oktaConfig.issuer);
console.log('🔧 Client ID:', oktaConfig.clientId);
console.log('🔧 Redirect URI:', oktaConfig.redirectUri);
console.log('🔧 Scopes:', oktaConfig.scopes);
console.log('🔧 当前域名:', window.location.origin);

// Restore original URI function - called after successful login
export const restoreOriginalUri = async (oktaAuth: OktaAuth, originalUri: string) => {
    console.log('🎯 ===== Okta 登录成功回调 =====');
    console.log('🎯 Original URI:', originalUri || '/assets/list');
    
    try {
        // 获取用户信息
        const authState = await oktaAuth.authStateManager.getAuthState();
        console.log('👤 用户认证状态:', authState);
        
        if (authState?.user) {
            const userEmail = authState.user.email || '未知';
            const userName = authState.user.name || '未知';
            const userGroups = authState.user.groups || [];
            const isExternal = !userEmail.includes('@nike.com');
            
            console.log('👤 === 用户信息分析 ===');
            console.log('📧 邮箱:', userEmail);
            console.log('👤 姓名:', userName);
            console.log('🌍 是否外部用户:', isExternal ? '✅ 是 (非Nike邮箱)' : '❌ 否 (Nike内部邮箱)');
            console.log('📊 Groups数量:', userGroups.length);
            
            if (userGroups.length > 0) {
                console.log('📋 Groups列表(前10个):');
                userGroups.slice(0, 10).forEach((group: string, index: number) => {
                    console.log(`  ${index + 1}. ${group}`);
                });
                if (userGroups.length > 10) {
                    console.log(`  ... 还有 ${userGroups.length - 10} 个组`);
                }
                
                // 分析AD组
                const adGroups = userGroups.filter((group: string) => 
                    group.toLowerCase().includes('ad_') || 
                    group.toLowerCase().includes('admin') ||
                    group.toLowerCase().includes('role_')
                );
                console.log('🔒 AD/Role Groups (管理相关):', adGroups.length);
                if (adGroups.length > 0) {
                    adGroups.forEach((group: string, index: number) => {
                        console.log(`  AD${index + 1}. ${group}`);
                    });
                }
            } else {
                console.warn('⚠️ 未获取到任何Groups信息');
            }
            
            // 特别针对外部用户的提示
            if (isExternal) {
                console.log('🎆 === 外部用户登录成功 ===');
                console.log('🎆 此用户为非Nike员工');
                console.log('🎆 已成功获取Okta Token和AD Groups');
                console.log('🎆 可以访问 /auth-tester 查看详细信息');
            } else {
                console.log('🏢 === Nike内部用户登录 ===');
                console.log('🏢 此用户为Nike员工');
            }
        }
        
        // 检查tokens
        const accessToken = await oktaAuth.tokenManager.get('accessToken');
        const idToken = await oktaAuth.tokenManager.get('idToken');
        console.log('🎫 === Token状态 ===');
        console.log('🎫 Access Token:', !!accessToken);
        console.log('🎫 ID Token:', !!idToken);
        if (accessToken) {
            console.log('🎫 Token过期时间:', new Date((accessToken as any).expiresAt * 1000).toLocaleString());
        }
        
    } catch (error) {
        console.error('❌ 获取用户信息失败:', error);
    }
    
    console.log('🎯 正在跳转到:', originalUri || '/assets/list');
    // Navigate to assets list or original requested page
    window.location.href = originalUri || '/assets/list';
};
