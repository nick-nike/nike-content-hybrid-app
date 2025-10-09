export interface UserInfo {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    roles?: string[];
    permissions?: string[];
  }
  
  export interface TokenInfo {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    tokenType?: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    token: TokenInfo | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export enum AuthStatus {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    AUTHENTICATED = 'AUTHENTICATED',
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    REFRESH_FAILED = 'REFRESH_FAILED',
    ERROR = 'ERROR'
  }
  
  export interface OktaTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
  }
  
  export interface OktaErrorResponse {
    error: string;
    error_description: string;
  }
  
  export type OktaResponse = OktaTokenResponse | OktaErrorResponse;