# 🔐 Okta模块使用指南

## 📋 概述

这是一个世界级的企业级Okta认证模块，提供完整的身份验证、会话管理和安全功能。

## 🚀 快速开始

### 1. 基础导入方式

```tsx
// 方式1: 默认导入（推荐）
import OktaModule from '@/modules/okta';

// 方式2: 命名导入
import { 
  OktaProvider, 
  OktaCallback, 
  useOktaAuth,
  SessionExpiredModal 
} from '@/modules/okta';

// 方式3: 混合导入
import OktaModule, { 
  useOktaAuth, 
  SessionExpiredModal 
} from '@/modules/okta';
```

### 2. 应用根组件设置

```tsx
// App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import OktaModule from '@/modules/okta';

function App() {
  // 初始化Okta模块
  const oktaConfig = OktaModule.initialize({
    clientId: 'your-client-id',
    issuer: 'https://your-domain.okta.com',
    redirectUri: window.location.origin + '/authorize/callback'
  });

  return (
    <BrowserRouter>
      <OktaModule.Provider restoreOriginalUri={() => {}}>
        <AppRoutes />
      </OktaModule.Provider>
    </BrowserRouter>
  );
}
```

### 3. 路由配置

```tsx
// AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OktaModule from '@/modules/okta';

function AppRoutes() {
  return (
    <Routes>
      {/* Okta回调路由 */}
      <Route path="/authorize/callback" element={<OktaModule.Callback />} />
      
      {/* 其他路由 */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
```

## 🎣 Hook使用

### useOktaAuth Hook

```tsx
import React from 'react';
import { useOktaAuth } from '@/modules/okta';

function UserProfile() {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    error,
    login,
    logout,
    showAuthModal,
    closeAuthModal 
  } = useOktaAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return (
      <button onClick={login}>
        Login with Okta
      </button>
    );
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
      
      {/* 显示错误信息 */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

## 🛡️ 路由守卫

### 使用认证守卫

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOktaAuth, verifyAuthentication } from '@/modules/okta';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useOktaAuth();

  if (isLoading) return <div>Verifying authentication...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// 使用方式
function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

## 🚨 会话过期处理

### 全局弹窗配置

```tsx
// AppLayout.tsx
import React from 'react';
import { useOktaAuth, SessionExpiredModal } from '@/modules/okta';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { 
    showAuthModal, 
    closeAuthModal, 
    handleReauthorize 
  } = useOktaAuth();

  const handleResumeSession = () => {
    handleReauthorize(); // 自动保存当前页面并跳转认证
  };

  const handleCancelSession = () => {
    closeAuthModal(); // 关闭弹窗
  };

  return (
    <div className="app-layout">
      <header>App Header</header>
      <main>{children}</main>
      
      {/* 全局会话过期弹窗 */}
      <SessionExpiredModal 
        isVisible={showAuthModal}
        onResumeSession={handleResumeSession}
        onCancel={handleCancelSession}
      />
    </div>
  );
}
```

## 🧪 测试和开发

### 使用测试工具

```tsx
// 在开发环境中添加测试组件
import React from 'react';
import { CompleteAuthFlowDemo, SimpleAuthTester } from '@/modules/okta';

function DevTools() {
  return (
    <div className="dev-tools">
      <h2>Okta开发工具</h2>
      
      {/* 完整认证流程演示 */}
      <CompleteAuthFlowDemo />
      
      {/* 简单认证测试器 */}
      <SimpleAuthTester />
    </div>
  );
}
```

### 控制台测试命令

```javascript
// 在浏览器控制台中使用
// 检查模块健康状态
const health = await OktaModule.getHealth();
console.log('模块健康状态:', health);

// 查看模块信息
console.log('模块信息:', OktaModule.info);

// 使用测试工具
oktaTest.help(); // 显示所有可用命令
oktaTest.status(); // 检查当前状态
oktaTest.retryModal(); // 测试重试失效弹窗
```

## ⚙️ 高级配置

### 自定义配置

```tsx
import { initializeOktaModule, AUTH_CONFIG } from '@/modules/okta';

// 自定义配置
const customConfig = initializeOktaModule({
  refreshThreshold: 10, // 10分钟提前刷新
  maxRefreshAttempts: 5, // 最多重试5次
  retryInterval: 15, // 重试间隔15秒
  modalTimeout: 120 // 弹窗超时120秒
});

console.log('自定义配置:', customConfig);
```

### 事件监听

```tsx
import { SessionMonitor, SessionEventType } from '@/modules/okta';

function setupSessionMonitoring() {
  const sessionMonitor = SessionMonitor.getInstance();
  
  sessionMonitor.addEventListener((event) => {
    switch (event.type) {
      case SessionEventType.TOKEN_REFRESHED:
        console.log('Token已刷新');
        break;
      case SessionEventType.SESSION_EXPIRED:
        console.log('会话已过期');
        break;
      case SessionEventType.REFRESH_FAILED:
        console.log('刷新失败');
        break;
    }
  });
}
```

## 📊 类型支持

### TypeScript类型

```tsx
import type { 
  OktaTokens, 
  RefreshAttempt, 
  SessionEvent,
  UseOktaAuthReturn 
} from '@/modules/okta';

// 自定义Hook示例
function useCustomAuth(): UseOktaAuthReturn {
  const auth = useOktaAuth();
  
  // 添加自定义逻辑
  return {
    ...auth,
    // 自定义方法
  };
}

// Token信息处理
function handleTokenInfo(tokens: OktaTokens) {
  if (tokens.isExpired) {
    console.log('Token已过期');
  } else if (tokens.isExpiringSoon) {
    console.log('Token即将过期');
  }
}
```

## 🔧 服务使用

### 直接使用服务

```tsx
import { 
  SessionMonitor, 
  TokenManager, 
  getTokenInfo,
  refreshTokens 
} from '@/modules/okta';

async function manualTokenManagement() {
  // 获取当前token信息
  const tokenInfo = await getTokenInfo();
  console.log('Token信息:', tokenInfo);
  
  // 手动刷新token
  const refreshResult = await refreshTokens();
  console.log('刷新结果:', refreshResult);
  
  // 获取会话监控实例
  const sessionMonitor = SessionMonitor.getInstance();
  sessionMonitor.startMonitoring();
}
```

## 📱 响应式设计

### 移动端适配

```tsx
import React from 'react';
import { SessionExpiredModal } from '@/modules/okta';

function MobileLayout() {
  return (
    <div className="mobile-layout">
      {/* SessionExpiredModal自动适配移动端 */}
      <SessionExpiredModal 
        isVisible={true}
        onResumeSession={() => {}}
        onCancel={() => {}}
      />
    </div>
  );
}
```

## 🚀 性能优化

### 懒加载

```tsx
import { lazy, Suspense } from 'react';

// 懒加载测试组件
const CompleteAuthFlowDemo = lazy(() => 
  import('@/modules/okta').then(module => ({ 
    default: module.CompleteAuthFlowDemo 
  }))
);

function DevPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteAuthFlowDemo />
    </Suspense>
  );
}
```

## 📋 最佳实践

### 1. 错误处理

```tsx
import { useOktaAuth } from '@/modules/okta';

function ErrorBoundaryExample() {
  const { error, warning } = useOktaAuth();
  
  return (
    <div>
      {error && (
        <div className="error-banner">
          ❌ {error}
        </div>
      )}
      
      {warning && (
        <div className="warning-banner">
          ⚠️ {warning}
        </div>
      )}
    </div>
  );
}
```

### 2. 加载状态

```tsx
function LoadingStateExample() {
  const { isLoading, isAuthenticated } = useOktaAuth();
  
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
        <p>Verifying authentication...</p>
      </div>
    );
  }
  
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
```

### 3. 条件渲染

```tsx
function ConditionalRenderingExample() {
  const { isAuthenticated, user } = useOktaAuth();
  
  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </nav>
  );
}
```

## 🔍 调试和故障排除

### 开发者工具

```javascript
// 控制台调试命令
console.log('Okta模块信息:', OktaModule.info);
console.log('模块文档:', OktaModule.docs);

// 健康检查
OktaModule.getHealth().then(health => {
  console.log('模块健康状态:', health);
});

// 测试工具
oktaTest.help(); // 查看所有测试命令
oktaTest.fullTest(); // 运行完整测试
```

### 常见问题

1. **认证失败**
   ```javascript
   // 检查配置
   console.log('Okta配置:', OktaModule.config);
   
   // 检查token状态
   oktaTest.status();
   ```

2. **弹窗不显示**
   ```javascript
   // 检查弹窗状态
   const { showAuthModal } = useOktaAuth();
   console.log('弹窗状态:', showAuthModal);
   ```

3. **Token刷新失败**
   ```javascript
   // 测试刷新机制
   oktaTest.refresh();
   ```

## 📚 更多资源

- [Token管理验证总结](/TOKENMANAGER_VERIFICATION_SUMMARY.md)
- [控制台验证指南](/CONSOLE_VERIFICATION_GUIDE.md)
- [完整认证流程指南](/COMPLETE_AUTH_FLOW_GUIDE.md)
- [Okta官方文档](https://developer.okta.com/)

---

这个专业级的Okta模块提供了完整的企业级认证解决方案，支持现代化的开发模式和最佳实践。
