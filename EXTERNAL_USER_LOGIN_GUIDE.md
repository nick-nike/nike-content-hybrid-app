# 🌍 外部用户登录测试指南

## 📋 问题修复
✅ **已禁用Session Expired弹窗** - 不再干扰外部用户登录流程
✅ **简化认证逻辑** - 移除复杂的重新验证弹窗
✅ **添加详细调试日志** - 便于跟踪外部用户登录过程

---

## 🧪 测试步骤

### 步骤1: 退出当前Nike账号
1. 如果当前已登录Nike账号，先退出
2. 访问 `http://localhost:8080/auth-tester`
3. 点击 "Logout" 按钮 (如果显示的话)
4. 确认显示 "Authentication Required"

### 步骤2: 清理浏览器状态 (推荐)
```javascript
// 在浏览器控制台运行
sessionStorage.clear();
localStorage.clear();
```

### 步骤3: 使用外部账号登录
1. **访问** `http://localhost:8080/login`
2. **点击** "Login with Okta" 按钮
3. **在Okta登录页面输入**:
   ```
   Email: sunandy3@gmail.com
   Password: Gxfc.1234@
   ```
4. **完成Okta认证**

### 步骤4: 观察登录过程
**打开浏览器控制台 (F12 → Console)** 查看详细日志：

```javascript
🔧 === Okta 配置初始化 ===
🔧 Issuer: https://nike.okta.com/oauth2/aus27z7p76as9Dz0H1t7
🔧 Client ID: nike.martech.gcamt
🔧 Redirect URI: http://localhost:8080/authorize/callback

🎯 ===== Okta 登录成功回调 =====
👤 === 用户信息分析 ===
📧 邮箱: sunandy3@gmail.com
👤 姓名: [外部用户姓名]
🌍 是否外部用户: ✅ 是 (非Nike邮箱)
📊 Groups数量: [数量]
📋 Groups列表(前10个):
  1. [组名1]
  2. [组名2]
  ...

🎆 === 外部用户登录成功 ===
🎆 此用户为非Nike员工
🎆 已成功获取Okta Token和AD Groups
```

### 步骤5: 验证登录结果
1. **自动跳转** 到 `/assets/list` 页面
2. **或手动访问** `http://localhost:8080/auth-tester`
3. **查看认证状态**:
   - ✅ 绿色 "Authentication Successful" 卡片
   - 🌍 橙色 "External User" 卡片
   - 📊 用户信息和Groups列表

### 步骤6: 使用调试工具
在 `/auth-tester` 页面中：
1. **点击** "👤 Log User Info" - 查看详细用户信息
2. **点击** "🎫 Log Tokens" - 查看Token详情
3. **查看控制台** 获取完整的调试信息

---

## 🎯 预期结果

### ✅ 成功指标
1. **无弹窗干扰** - 不再出现 "Session Expired" 页面
2. **正常重定向** - 从Okta登录后正确返回应用
3. **外部用户识别** - 显示橙色 "External User" 标识  
4. **Token获取** - 成功获取Access Token和ID Token
5. **Groups信息** - 能够获取用户的AD Groups (如果有权限)

### 🔍 调试信息确认
- 📧 **邮箱**: `sunandy3@gmail.com`
- 🌍 **用户类型**: 外部用户 (✅ 是)
- 🎫 **Tokens**: Access Token 和 ID Token 都可用
- 📊 **Groups**: 显示用户所属的组列表

---

## 🐛 故障排除

### 如果仍然看到Session Expired页面:
1. **强制刷新** 页面 (Ctrl+F5)
2. **清理缓存** - 运行 `sessionStorage.clear()`
3. **重启开发服务器** - `pnpm dev`

### 如果登录重定向失败:
1. **检查控制台错误** - 查看详细错误信息
2. **确认Okta配置** - 验证redirect URI设置
3. **检查用户权限** - 确认外部账号有应用访问权限

### 如果无法获取Groups:
1. **这是正常现象** - 外部用户可能没有Groups权限
2. **检查Okta配置** - 确认Groups scope已包含
3. **联系管理员** - 验证外部用户的权限设置

---

## 📞 技术支持

如果遇到其他问题:
1. **查看浏览器控制台** - 获取详细错误日志
2. **检查Network标签** - 查看HTTP请求状态
3. **使用隐身模式** - 排除缓存问题
4. **联系Okta管理员** - 验证应用和用户配置

---

## 🎉 测试完成

外部用户登录测试成功的标志:
- ✅ 无Session Expired弹窗干扰
- ✅ 成功从Okta重定向回应用
- ✅ 显示外部用户身份标识  
- ✅ 获取到有效的认证Token
- ✅ 能够正常访问应用功能

**现在外部用户登录应该可以正常工作了！** 🚀
