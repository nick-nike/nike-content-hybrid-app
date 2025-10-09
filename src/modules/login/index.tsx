/**
 * 🔐 Login & Authentication Module
 * 
 * 企业级登录认证模块，整合Okta认证功能
 * 
 * @author World-Class Frontend Team
 * @version 3.0.0
 */

import type { FC } from 'react';
import iconNike from '@/assets/images/nike-filled.svg';
import { LoginForm } from './components/LoginForm';
import { OktaProvider } from './components/OktaProvider';
import { OktaCallback } from './components/OktaCallback';

// ============================================================================
// 🏗️ Components Export - 组件导出
// ============================================================================

export { LoginForm } from './components/LoginForm';
export { OktaProvider } from './components/OktaProvider';
export { OktaCallback } from './components/OktaCallback';
export { SessionExpiredModal } from './components/SessionExpiredModal';

// ============================================================================
// 🔧 Services Export - 服务导出
// ============================================================================

export { useOktaAuth } from './services/useOktaAuth';
export type { UseOktaAuthReturn } from './services/useOktaAuth';
export { SessionMonitor } from './services/SessionMonitor';
export { TokenManager } from './services/TokenManager';

// ============================================================================
// 🛡️ Auth Guards Export - 认证守卫导出
// ============================================================================

export {
    getTokenInfo,
    verifyAuthentication,
    refreshTokens,
    clearTokens,
    getTokenTimeRemaining
} from './services/authGuard';

// ============================================================================
// ⚙️ Config Export - 配置导出
// ============================================================================

export { oktaAuth, AUTH_CONFIG } from './services/config';

// ============================================================================
// 📊 Types Export - 类型导出
// ============================================================================

export type {
    OktaTokens,
    RefreshAttempt,
    SessionEvent,
    SessionEventType,
    AuthConfig
} from './services/auth';

// ============================================================================
// 🎯 Main Component - 主登录组件
// ============================================================================

export const Main: FC = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black p-6 md:p-10">
            <div className="mb-8 flex flex-col items-center">
                <img src={iconNike} alt="Nike Logo" className="mb-4 h-16 w-16 invert" />
                <h1 className="text-2xl font-bold text-white">Sign in to GC CONTENT HUB</h1>
            </div>
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    );
};

// ============================================================================
// 🌟 Module Info - 模块信息
// ============================================================================

export const LOGIN_MODULE_INFO = {
    name: 'Login & Authentication Module',
    version: '3.0.0',
    description: '企业级登录认证模块，整合Okta认证功能',
    features: [
        '🔐 统一身份认证',
        '📝 登录表单',
        '🔄 自动token刷新',
        '🚨 会话过期提醒',
        '🌍 全局状态管理'
    ]
} as const;

export default { Main, LoginForm, OktaProvider, OktaCallback };
