import { Security } from '@okta/okta-react';
import type { ReactNode } from 'react';
import { oktaAuth, restoreOriginalUri } from '../services/config';

interface OktaProviderProps {
    children: ReactNode;
}

// Okta authentication provider component - wraps the entire application
export const OktaProvider = ({ children }: OktaProviderProps) => {
    return (
        <Security
            oktaAuth={oktaAuth}
            restoreOriginalUri={restoreOriginalUri}
        >
            {children}
        </Security>
    );
};
