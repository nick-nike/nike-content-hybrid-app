import { USER_STORAGE_KEY } from '../constants/auth';
import type { UserInfo } from '../@types/auth';

export class StorageManager {
  // 保存用户信息
  static saveUser(user: UserInfo): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
  
  // 获取用户信息
  static getUser(): UserInfo | null {
    try {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
  
  // 清除用户信息
  static clearUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
  
  // 清除所有认证相关存储
  static clearAll(): void {
    this.clearUser();
    // 也可以清除其他相关的存储项
  }
}