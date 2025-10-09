import { TOKEN_STORAGE_KEY, TOKEN_REFRESH_THRESHOLD } from '../constants/auth';
import type { TokenInfo } from '../@types/auth';

export class TokenManager {
  // 保存 Token 到本地存储
  static saveToken(tokenInfo: TokenInfo): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenInfo));
  }
  
  // 从本地存储获取 Token
  static getToken(): TokenInfo | null {
    try {
      const tokenStr = localStorage.getItem(TOKEN_STORAGE_KEY);
      return tokenStr ? JSON.parse(tokenStr) : null;
    } catch {
      return null;
    }
  }
  
  // 清除 Token
  static clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  
  // 检查 Token 是否存在
  static hasToken(): boolean {
    return !!this.getToken();
  }
  
  // 检查 Token 是否过期
  static isTokenExpired(token: TokenInfo): boolean {
    return Date.now() >= token.expiresAt;
  }
  
  // 检查 Token 是否即将过期（需要刷新）
  static shouldRefreshToken(token: TokenInfo): boolean {
    return Date.now() >= (token.expiresAt - TOKEN_REFRESH_THRESHOLD);
  }
  
  // 获取 Token 剩余有效时间（毫秒）
  static getTokenTimeLeft(token: TokenInfo): number {
    return Math.max(0, token.expiresAt - Date.now());
  }
  
  // 从 OKTA 响应创建 TokenInfo
  static createFromOktaResponse(response: any): TokenInfo {
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt: Date.now() + (response.expires_in * 1000),
      tokenType: response.token_type || 'Bearer'
    };
  }
}