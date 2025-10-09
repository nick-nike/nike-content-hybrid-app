import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  fallback = <div>Loading...</div> 
}) => {
  const { state, login } = useAuth();
  
  // 如果正在加载，显示加载状态
  if (state.isLoading) {
    return <>{fallback}</>;
  }
  
  // 如果未认证，重定向到登录
  if (!state.isAuthenticated) {
    login();
    return <>{fallback}</>;
  }
  
  // 已认证，渲染子组件
  return <>{children}</>;
};