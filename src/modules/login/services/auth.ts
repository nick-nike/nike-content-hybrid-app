export interface OktaTokens {
    accessToken: any;
    idToken: any;
    refreshToken?: any;
    expiresAt: number;
    isExpired: boolean;
    isExpiringSoon: boolean;
  }
  
  export interface UserProfile {
    sub: string;
    name: string;
    email: string;
    preferred_username?: string;
    groups?: string[];
    [key: string]: any;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserProfile | null;
    tokens: OktaTokens | null;
    error: string | null;
    lastActivity: number;
    sessionExpired: boolean;
  }
  
  export interface AuthConfig {
    refreshThreshold: number; // Token刷新提前时间（分钟）
    sessionTimeout: number; // 会话超时时间（分钟）
    maxRefreshAttempts: number; // 最大刷新尝试次数
    refreshInterval: number; // 刷新检查间隔（秒）
    activityTimeout: number; // 用户活动超时（分钟）
    retryInterval: number; // 重试间隔（秒）
  }
  
  export enum SessionEventType {
    TOKEN_REFRESHED = 'TOKEN_REFRESHED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    USER_ACTIVITY = 'USER_ACTIVITY',
    REFRESH_FAILED = 'REFRESH_FAILED',
    SESSION_WARNING = 'SESSION_WARNING',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGOUT = 'LOGOUT'
  }
  
  export interface SessionEvent {
    type: SessionEventType;
    payload?: any;
    timestamp: number;
  }
  
  export interface RefreshAttempt {
    attempt: number;
    timestamp: number;
    success: boolean;
    error?: string;
    newToken?: {
        accessToken: any;
        timestamp: number;
    };
  }