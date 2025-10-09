# 🧪 Okta Token生命周期测试 - 世界级解决方案

## 🎯 概述

基于你的需求，我为你设计了一个完整的Okta token生命周期测试解决方案，支持两种验证方式：

1. **🖥️ 前端控制台测试** - 适合开发调试和快速验证
2. **🔧 Bruno API测试** - 适合自动化测试和CI/CD集成

## 🔄 完整闭环逻辑

```
用户通过 Login with Okta 登录成功
           ↓
Access token 剩余5分钟开始 refresh token  
           ↓
   Refresh 成功继续倒计时等下一次即将过期
           ↓
如果失败，延迟10秒retry，retry 3次后弹窗提示需要重新授权
           ↓
         结束闭环逻辑
```

## 🚀 方式一：前端控制台测试（推荐用于开发）

### 快速开始

1. **登录应用并打开控制台**
   ```javascript
   // 浏览器开发者工具 (F12) -> Console
   
   // 查看可用命令
   oktaTest.help()
   ```

2. **基础测试命令**
   ```javascript
   // 检查当前token状态
   oktaTest.status()
   
   // 模拟5分钟后过期
   oktaTest.expire5min()
   
   // 模拟立即过期  
   oktaTest.expireNow()
   
   // 测试token刷新
   oktaTest.refresh()
   
   // 运行完整生命周期测试
   oktaTest.fullTest()
   
   // 获取测试报告
   oktaTest.report()
   ```

### 典型测试场景

#### 🔍 场景1：验证正常刷新机制
```javascript
// 1. 检查当前状态
await oktaTest.status()

// 2. 模拟即将过期（5分钟）
await oktaTest.expire5min()

// 3. 观察自动刷新
await oktaTest.refresh()
```

#### ❌ 场景2：测试失败重试逻辑
```javascript
// 1. 直接运行完整测试（包含失败场景）
await oktaTest.fullTest()

// 结果会显示：
// - 重试次数：3次
// - 重试间隔：10秒
// - 弹窗触发：是/否
```

#### ⚡ 场景3：快速过期测试
```javascript
// 立即触发过期
await oktaTest.expireNow()

// 观察系统反应时间
```

## 🔧 方式二：Bruno API测试（推荐用于CI/CD）

### 环境准备

1. **安装Bruno CLI**
   ```bash
   npm install -g @usebruno/cli
   ```

2. **配置环境变量**
   ```bash
   cd bruno-tests/okta-token-lifecycle
   
   # 在 environments/local.bru 中设置：
   # ACCESS_TOKEN=your_actual_access_token
   # REFRESH_TOKEN=your_actual_refresh_token
   ```

3. **获取Token值**
   ```javascript
   // 在应用中登录后，控制台运行：
   oktaTest.status()
   // 复制显示的token值到环境配置
   ```

### 运行测试

```bash
# 运行单个测试
bruno run 01-check-token-status.bru

# 运行完整测试套件
bruno run --env local

# 生成JSON报告
bruno run --env local --output test-results.json
```

### 测试集合包含

1. **01-check-token-status** - Token状态检查
2. **02-simulate-token-expiry** - 模拟Token过期  
3. **03-test-auto-refresh** - 自动刷新机制测试
4. **04-test-retry-logic** - 重试逻辑测试（10秒×3次）
5. **05-test-modal-trigger** - 弹窗触发测试
6. **06-complete-lifecycle-test** - 完整闭环测试

## 📊 测试验证点

### ✅ 核心功能验证

- **Token状态检查**：准确识别过期时间和状态
- **5分钟预警**：在剩余5分钟时触发refresh
- **自动刷新**：成功刷新并继续监控循环
- **重试机制**：失败后10秒重试，最多3次
- **弹窗触发**：3次失败后显示重新授权弹窗

### 📈 性能指标

- **弹窗响应时间** < 5秒：🚀 优秀
- **刷新响应时间** < 10秒：✅ 良好  
- **系统完成率** > 80%：✅ 通过

## 🛠️ 手动Token过期方法

### 方法1：使用测试工具
```javascript
// 模拟4分钟后过期
oktaTest.expire5min()

// 立即过期
oktaTest.expireNow()
```

### 方法2：直接修改Token（高级）
```javascript
// 获取测试套件实例
const testSuite = TokenLifecycleTestSuite.getInstance()

// 模拟不同场景
await testSuite.simulateExpiringSoon(1, 'immediate')     // 立即过期
await testSuite.simulateExpiringSoon(5, 'normal')        // 5分钟后过期  
await testSuite.simulateExpiringSoon(2, 'refresh_fail')  // 刷新失败场景
```

## 🔄 CI/CD集成示例

### GitHub Actions
```yaml
name: Okta Token Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Bruno CLI
        run: npm install -g @usebruno/cli
      - name: Run Token Tests
        env:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          REFRESH_TOKEN: ${{ secrets.REFRESH_TOKEN }}
        run: |
          cd bruno-tests/okta-token-lifecycle
          bruno run --env ci --output results.json
```

## 📋 测试报告示例

```
🧪 Okta Token生命周期测试结果
================================================

📊 各阶段执行结果:
  1. 获取初始状态: ✅
  2. 模拟5分钟即将过期: ✅  
  3. 测试自动刷新机制: ✅
  4. 测试失败重试逻辑(10s × 3): ✅
  5. 测试重新授权弹窗: ✅
  6. 验证恢复状态: ✅

📈 测试完整性分析:
  - 成功阶段: 6/6
  - 完成率: 100%
  - 系统健康度: 🌟 优秀

⏱️ 性能分析:
  - 总测试时长: 45秒
  - 弹窗响应时间: 3.2秒
  - 重试间隔准确性: 10.1秒 (误差1%)

🔄 闭环逻辑验证:
  - 登录状态检查: ✅ 通过
  - 自动刷新机制: ✅ 正常
  - 重试逻辑执行: ✅ 正常  
  - 弹窗触发机制: ✅ 正常
```

## 💡 最佳实践建议

### 开发阶段
- 每次修改认证相关代码后运行 `oktaTest.fullTest()`
- 使用单个测试快速验证特定功能
- 关注控制台输出的详细日志

### 测试阶段
- 集成Bruno测试到CI/CD流程
- 设置性能阈值和质量门禁
- 定期更新测试用例覆盖新场景

### 生产监控
- 定期执行健康检查
- 监控关键指标趋势
- 建立告警机制

## 🔍 问题排查

### 常见问题

1. **Token获取失败**
   ```
   ❌ 错误: 未检测到有效的access token
   💡 解决: 确保已登录，运行 oktaTest.status() 检查
   ```

2. **刷新测试超时**
   ```
   ❌ 错误: Token refresh test timed out  
   💡 解决: 检查网络连接和Okta服务状态
   ```

3. **弹窗未触发**
   ```
   ❌ 错误: Auth modal not shown
   💡 解决: 确保前置条件满足（3次重试失败）
   ```

## 🎯 测试目标达成

通过这个解决方案，你可以：

✅ **验证完整闭环逻辑** - 从登录到弹窗的全流程  
✅ **测试手动过期场景** - 支持多种过期时间设置  
✅ **Bruno自动化测试** - 适合CI/CD和批量验证  
✅ **性能指标收集** - 响应时间、成功率等数据  
✅ **问题快速定位** - 详细日志和错误信息  

这是一个世界级的token生命周期测试解决方案，既满足你的开发调试需求，也支持自动化测试要求！

---

## 📞 使用支持

如果在使用过程中遇到问题：

1. 查看控制台详细日志
2. 运行 `oktaTest.help()` 获取帮助
3. 检查网络和Okta服务状态
4. 参考本文档的问题排查部分
