import type { FC, FormEvent } from 'react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import iconLululemon from '@/assets/images/lululemon-logo.svg';
import { LoginForm } from './components/LoginForm';
import { OktaProvider } from './components/OktaProvider';
import { OktaCallback } from './components/OktaCallback';

export { LoginForm } from './components/LoginForm';
export { OktaProvider } from './components/OktaProvider';
export { OktaCallback } from './components/OktaCallback';
export { SessionExpiredModal } from './components/SessionExpiredModal';

export { useOktaAuth } from './services/useOktaAuth';
export type { UseOktaAuthReturn } from './services/useOktaAuth';
export { SessionMonitor } from './services/SessionMonitor';
export { TokenManager } from './services/TokenManager';

export {
    getTokenInfo,
    verifyAuthentication,
    refreshTokens,
    clearTokens,
    getTokenTimeRemaining
} from './services/authGuard';

export { oktaAuth, AUTH_CONFIG } from './services/config';

export type {
    OktaTokens,
    RefreshAttempt,
    SessionEvent,
    SessionEventType,
    AuthConfig
} from './services/auth';

export const PM_AUTH_STORAGE_KEY = 'pm-hands-on-auth-v1';
const DELETE_ADMIN_STORAGE_KEY = 'budget-project-calendar-delete-admin-v1';

type PmRole = 'admin' | 'user';

export type PmAuthSession = {
    role: PmRole;
    name: string;
    signedInAt: string;
};

const demoAccounts: Array<{ username: string; password: string; role: PmRole; name: string }> = [
    { username: 'admin', password: '102938', role: 'admin', name: 'Admin' },
    { username: 'user', password: 'user', role: 'user', name: 'User' },
];

export const readPmAuthSession = (): PmAuthSession | null => {
    try {
        const value = window.localStorage.getItem(PM_AUTH_STORAGE_KEY);
        if (!value) {
            return null;
        }

        const session = JSON.parse(value) as PmAuthSession;
        return session?.role === 'admin' || session?.role === 'user' ? session : null;
    }
    catch {
        window.localStorage.removeItem(PM_AUTH_STORAGE_KEY);
        window.localStorage.removeItem(DELETE_ADMIN_STORAGE_KEY);
        return null;
    }
};

export const signOutPmSession = () => {
    window.localStorage.removeItem(PM_AUTH_STORAGE_KEY);
    window.localStorage.removeItem(DELETE_ADMIN_STORAGE_KEY);
};

export const Main: FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (readPmAuthSession()) {
        return <Navigate to="/budget-project-calendar" replace />;
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const account = demoAccounts.find(item => (
            item.username.toLowerCase() === username.trim().toLowerCase()
            && item.password === password
        ));

        if (!account) {
            setError('Incorrect username or password.');
            return;
        }

        const session: PmAuthSession = {
            role: account.role,
            name: account.name,
            signedInAt: new Date().toISOString(),
        };

        window.localStorage.setItem(PM_AUTH_STORAGE_KEY, JSON.stringify(session));
        if (account.role === 'admin') {
            window.localStorage.setItem(DELETE_ADMIN_STORAGE_KEY, '1');
        }
        else {
            window.localStorage.removeItem(DELETE_ADMIN_STORAGE_KEY);
        }

        navigate('/budget-project-calendar', { replace: true });
    };

    return (
        <main className="flex min-h-screen items-start justify-center bg-[#0d1117] px-6 py-12 text-[#f0f6fc]">
            <div className="w-full max-w-[352px]">
                <div className="mb-5 flex justify-center">
                    <img src={iconLululemon} alt="lululemon" className="h-14 w-14" />
                </div>

                <h1 className="mb-7 text-center text-2xl font-semibold tracking-[-0.01em] text-[#f0f6fc]">
                    Sign in Project Calendar Hub
                </h1>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <label className="grid gap-2 text-sm font-semibold text-[#f0f6fc]">
                        Username or email address
                        <input
                            autoFocus
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            className="h-10 rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-base text-[#f0f6fc] outline-none transition focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb]"
                        />
                    </label>

                    <label className="grid gap-2 text-sm font-semibold text-[#f0f6fc]">
                        <span className="flex items-center justify-between">
                            Password
                            <button type="button" className="text-xs font-normal text-[#2f81f7]">
                                Forgot password?
                            </button>
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            className="h-10 rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-base text-[#f0f6fc] outline-none transition focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb]"
                        />
                    </label>

                    {error && (
                        <div className="rounded-md border border-[#f85149] bg-[#2d1117] px-3 py-2 text-sm text-[#ffb3ad]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-1 h-10 rounded-md bg-[#238636] text-sm font-semibold text-white transition hover:bg-[#2ea043]"
                    >
                        Sign in
                    </button>
                </form>

                <div className="mt-6 rounded-md border border-[#30363d] px-4 py-4 text-center text-sm text-[#8b949e]">
                    Admin and viewer access are separated for project calendar control.
                </div>
            </div>
        </main>
    );
};

export const LOGIN_MODULE_INFO = {
    name: 'Login & Authentication Module',
    version: '3.1.0',
    description: 'Lightweight role login for PM project calendar access.',
    features: [
        'Simple admin and viewer login',
        'Budget calendar maintenance permission control',
        'Okta callback compatibility',
    ]
} as const;

export default { Main, LoginForm, OktaProvider, OktaCallback };
