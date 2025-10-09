# 🧪 控制台验证测试指南

## 🎯 测试目标

根据要求进行两次验证测试，类似auth-tester的测试方式：

1. **第一次验证**：正常认证流程测试
2. **第二次验证**：3次重试失效，弹出Session Expired弹窗

## 🚀 快速开始

### 1. 准备工作

```bash
# 1. 启动开发服务器（如果未启动）
npm run dev

# 2. 访问测试页面
# 浏览器打开: http://localhost:8080/auth-tester
```

### 2. 登录测试账号

```
邮箱: sunandy3@gmail.com
密码: Gxfc.1234@
```

### 3. 打开浏览器控制台

- 按 `F12` 打开开发者工具
- 切换到 `Console` 标签页

## 🔍 第一次验证：正常认证流程

### 执行步骤

```javascript
// 1. 查看可用命令
oktaTest.help()

// 2. 检查当前token状态
oktaTest.status()

// 3. 模拟5分钟后过期
oktaTest.expire5min()

// 4. 测试token刷新
oktaTest.refresh()

// 5. 获取测试报告
oktaTest.report()
```

### 预期结果

✅ **成功标准：**
- Token状态检查正常
- 5分钟过期模拟成功
- Token刷新机制正常工作
- 无异常错误信息

## 🚨 第二次验证：3次重试失效测试

### 执行步骤

```javascript
// 推荐方法：正确重试逻辑验证
oktaTest.retryModal()

// 或者快速方法：简化重试验证
oktaTest.simpleRetry()

// 或者完整方法：验证完整重试失败流程
oktaTest.quickModal()
```

### 预期执行流程

1. 🔄 Token过期检测
2. ❌ 第1次刷新失败 → 等待10秒
3. ❌ 第2次刷新失败 → 等待10秒  
4. ❌ 第3次刷新失败 → 触发弹窗
5. 🚨 显示Session Expired弹窗

### 弹窗验证要点

弹窗应该**完全符合附件设计**：

✅ **设计要求：**
- 白色全屏背景
- 超大"Session Expired"标题
- 大字体描述文本，分行显示：
  ```
  Your session has expired. Click "Resume Session" to renew your
  session in a new tab.
  
  Feel free to return to this window and continue where you left off.
  ```
- 黑色圆角"Resume Session"按钮
- 页面完全锁定，无法操作背景

✅ **功能要求：**
- 点击"Resume Session"按钮跳转到新标签页
- 完成认证后弹窗自动检测新token
- 检测成功后弹窗自动关闭
- 返回auth-tester页面继续操作

## 🎯 一键测试脚本

如果需要自动化执行两次验证，可以使用以下脚本：

```javascript
// 复制粘贴到控制台执行
(async function() {
    console.log('🧪 开始两次验证测试...');
    
    // 第一次验证
    console.log('🔍 第一次验证：正常认证流程');
    await oktaTest.status();
    await oktaTest.expire5min();
    await oktaTest.refresh();
    console.log('✅ 第一次验证完成');
    
    // 等待2秒
    await new Promise(r => setTimeout(r, 2000));
    
    // 第二次验证
    console.log('🚨 第二次验证：3次重试失效');
    await oktaTest.retryModal();
    console.log('✅ 第二次验证完成，请观察弹窗');
})();
```

## 📊 测试结果验证

### 控制台输出示例

```javascript
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
```

## 🔧 故障排除

### 常见问题

1. **oktaTest命令不存在**
   ```
   解决：刷新页面，确保在auth-tester页面执行
   ```

2. **弹窗未显示**
   ```
   解决：确保已登录，使用oktaTest.retryModal()命令
   ```

3. **测试超时**
   ```
   解决：检查网络连接，使用oktaTest.simpleRetry()快速测试
   ```

4. **Token获取失败**
   ```
   解决：重新登录，运行oktaTest.status()检查状态
   ```

## 📋 测试检查清单

### 第一次验证 ✅
- [ ] oktaTest.status() 执行成功
- [ ] oktaTest.expire5min() 执行成功
- [ ] oktaTest.refresh() 执行成功
- [ ] 无异常错误信息

### 第二次验证 ✅
- [ ] oktaTest.retryModal() 执行成功
- [ ] 显示3次重试过程（每次间隔10秒）
- [ ] 弹出Session Expired弹窗
- [ ] 弹窗设计符合附件要求
- [ ] Resume Session按钮功能正常

### 弹窗设计验证 ✅
- [ ] 白色全屏背景
- [ ] 超大"Session Expired"标题
- [ ] 正确的描述文本内容和格式
- [ ] 黑色圆角"Resume Session"按钮
- [ ] 页面完全锁定

## 🎉 测试完成

当两次验证都通过后，说明：

✅ **认证系统工作正常**
✅ **重试机制符合要求**  
✅ **弹窗设计完全一致**
✅ **用户体验符合预期**

---

## 📞 技术支持

如遇问题，请：
1. 检查控制台错误信息
2. 确认网络连接正常
3. 验证Okta服务状态
4. 参考本文档故障排除部分
