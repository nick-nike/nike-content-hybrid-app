// Token 相关常量
export const TOKEN_STORAGE_KEY = 'app_auth_token';
export const USER_STORAGE_KEY = 'app_user_info';
export const CODE_VERIFIER_KEY = 'code_verifier';

// 时间相关常量
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5分钟，Token 即将过期时提前刷新
export const AUTH_CHECK_INTERVAL = 3 * 60 * 1000;    // 3分钟，定期检查认证状态
export const RETRY_DELAY = 10 * 1000;                // 10秒，重试间隔
export const MAX_RETRY_ATTEMPTS = 3;                 // 最大重试次数

// OKTA 配置 (这些应该来自环境变量)
export const OKTA_CONFIG = {
  DOMAIN: process.env.REACT_APP_OKTA_DOMAIN || 'your-okta-domain.okta.com',
  CLIENT_ID: process.env.REACT_APP_OKTA_CLIENT_ID || 'your-client-id',
  REDIRECT_URI: `${window.location.origin}/auth/callback`,
  SCOPE: 'openid profile email groups phone offline_access',
  AUTH_URL: process.env.REACT_APP_OKTA_AUTH_URL || 'https://your-okta-domain.okta.com/oauth2/default'
};

// 认证事件
export const AUTH_EVENTS = {
  TOKEN_EXPIRED: 'auth:token-expired',
  REFRESH_SUCCESS: 'auth:refresh-success',
  REFRESH_FAILED: 'auth:refresh-failed',
  LOGOUT: 'auth:logout'
} as const;