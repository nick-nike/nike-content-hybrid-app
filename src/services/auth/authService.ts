import { refreshToken, revokeToken } from '../../utils/oktaAuth';
import { TokenManager } from '../../utils/tokenManager';
import { StorageManager } from '../../utils/storage';
import type { UserInfo, TokenInfo, OktaTokenResponse } from '../../@types/auth';

export class AuthService {
  // 获取用户信息（通过 API）
  static async fetchUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    return response.json();
  }
  
  // 刷新 Token
  static async refreshUserToken(refreshTokenValue: string): Promise<TokenInfo> {
    const response = await refreshToken(refreshTokenValue);
    
    if ('error' in response) {
      throw new Error(response.error_description || response.error);
    }
    
    const tokenInfo = TokenManager.createFromOktaResponse(response as OktaTokenResponse);
    TokenManager.saveToken(tokenInfo);
    
    return tokenInfo;
  }
  
  // 登出
  static async logout(): Promise<void> {
    const token = TokenManager.getToken();
    
    if (token?.accessToken) {
      try {
        // 撤销 Token
        await revokeToken(token.accessToken);
      } catch (error) {
        console.warn('Failed to revoke token:', error);
      }
    }
    
    // 清除本地存储
    TokenManager.clearToken();
    StorageManager.clearAll();
    
    // 可选：重定向到登出页面
    // window.location.href = '/login';
  }
  
  // 验证当前会话
  static async validateSession(): Promise<boolean> {
    const token = TokenManager.getToken();
    
    if (!token) {
      return false;
    }
    
    if (TokenManager.isTokenExpired(token)) {
      return false;
    }
    
    // 可选：向服务器验证 Token 是否有效
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}