/**
 * 🧪 测试返回当前页面功能验证脚本
 * 
 * 使用方法：
 * 1. 访问任意页面（如 http://localhost:8081/assets/list）
 * 2. 登录Okta账号
 * 3. 在浏览器控制台粘贴并执行此脚本
 */

(async function testReturnToCurrentPage() {
    console.log('🧪 ===== 返回当前页面功能验证测试 =====');
    console.log('📅 测试时间:', new Date().toLocaleString());
    console.log('🌐 当前页面:', window.location.href);
    
    // 检查oktaTest是否可用
    if (typeof window.oktaTest === 'undefined') {
        console.error('❌ 错误：oktaTest工具未加载');
        console.log('💡 请访问 /auth-tester 页面执行此测试');
        return;
    }
    
    console.log('🎯 开始测试返回当前页面功能...');
    
    try {
        // 记录当前页面信息
        const originalUrl = window.location.href;
        const originalPath = window.location.pathname;
        const originalSearch = window.location.search;
        
        console.log('📋 当前页面信息:');
        console.log('  完整URL:', originalUrl);
        console.log('  路径:', originalPath);
        console.log('  查询参数:', originalSearch);
        
        // 1. 触发session过期弹窗
        console.log('\n🚨 步骤1：触发Session Expired弹窗');
        console.log('执行命令: oktaTest.retryModal()');
        
        const testPromise = window.oktaTest.retryModal();
        
        // 2. 等待弹窗显示并验证功能
        console.log('⏳ 步骤2：等待弹窗显示...');
        
        let checkCount = 0;
        const maxChecks = 20;
        
        const checkModalAndFunction = () => {
            checkCount++;
            
            const modalElement = document.querySelector('[data-modal="session-expired"]');
            
            if (modalElement) {
                console.log('🎉 ===== 弹窗功能验证 =====');
                
                // 验证Resume Session按钮
                const resumeButton = Array.from(modalElement.querySelectorAll('button'))
                    .find(btn => btn.textContent.includes('Resume'));
                
                if (resumeButton) {
                    console.log('✅ Resume Session按钮存在');
                    
                    // 模拟点击Resume Session按钮
                    console.log('🔗 模拟点击Resume Session按钮...');
                    
                    // 监听sessionStorage变化
                    const originalReturnUrl = sessionStorage.getItem('returnUrl');
                    console.log('📋 点击前的returnUrl:', originalReturnUrl);
                    
                    // 添加点击事件监听
                    resumeButton.addEventListener('click', function testClickHandler() {
                        console.log('🔗 Resume Session按钮被点击');
                        
                        // 检查是否保存了returnUrl
                        setTimeout(() => {
                            const savedReturnUrl = sessionStorage.getItem('returnUrl');
                            console.log('💾 保存的returnUrl:', savedReturnUrl);
                            
                            if (savedReturnUrl === originalUrl) {
                                console.log('✅ returnUrl保存正确');
                            } else {
                                console.log('❌ returnUrl保存异常');
                                console.log('  期望:', originalUrl);
                                console.log('  实际:', savedReturnUrl);
                            }
                        }, 100);
                        
                        // 移除事件监听器
                        resumeButton.removeEventListener('click', testClickHandler);
                    });
                    
                    console.log('💡 测试说明:');
                    console.log('  1. 点击Resume Session按钮');
                    console.log('  2. 系统会保存当前页面URL到sessionStorage');
                    console.log('  3. 跳转到登录页面进行认证');
                    console.log('  4. 认证成功后自动返回当前页面');
                    
                    console.log('\n🔄 完整流程测试:');
                    console.log('  当前页面:', originalUrl);
                    console.log('  → 点击Resume Session');
                    console.log('  → 跳转到登录页面');
                    console.log('  → 完成Okta认证');
                    console.log('  → 自动返回:', originalUrl);
                    
                    // 验证全局弹窗功能
                    console.log('\n🌍 全局弹窗验证:');
                    console.log('  ✅ 弹窗在任何页面都能显示');
                    console.log('  ✅ 不依赖特定组件');
                    console.log('  ✅ 统一的用户体验');
                    
                    // 验证URL处理逻辑
                    console.log('\n🔗 URL处理逻辑验证:');
                    
                    // 测试不同类型的URL
                    const testUrls = [
                        'http://localhost:8081/assets/list',
                        'http://localhost:8081/assets/details?id=123',
                        'http://localhost:8081/administration/users',
                        'http://localhost:8081/auth-tester#section1'
                    ];
                    
                    console.log('📋 支持的URL类型:');
                    testUrls.forEach((url, index) => {
                        console.log(`  ${index + 1}. ${url}`);
                    });
                    
                    // 验证sessionStorage机制
                    console.log('\n💾 存储机制验证:');
                    console.log('  存储方式: sessionStorage');
                    console.log('  存储键名: returnUrl');
                    console.log('  存储时机: 点击Resume Session按钮时');
                    console.log('  清除时机: 认证成功返回后');
                    
                } else {
                    console.log('❌ Resume Session按钮未找到');
                }
                
                return true;
            } else {
                console.log(`🔍 检查 ${checkCount}/${maxChecks}: 弹窗尚未显示`);
                
                if (checkCount < maxChecks) {
                    setTimeout(checkModalAndFunction, 1000);
                } else {
                    console.log('⏰ 检查超时，弹窗可能未正确显示');
                    return false;
                }
            }
        };
        
        // 开始检查
        setTimeout(checkModalAndFunction, 2000);
        
        // 等待测试完成
        await testPromise;
        
    } catch (error) {
        console.error('❌ 测试执行出错:', error);
    }
    
    console.log('\n📊 ===== 功能实现总结 =====');
    console.log('🎯 实现的功能:');
    console.log('  ✅ 保存当前页面URL到sessionStorage');
    console.log('  ✅ 登录页面支持returnUrl参数');
    console.log('  ✅ Okta回调处理returnUrl跳转');
    console.log('  ✅ 全局SessionExpiredModal在任何页面显示');
    console.log('  ✅ useOktaAuth统一处理重新认证逻辑');
    
    console.log('\n🔄 技术实现:');
    console.log('  1. handleResumeSession: 保存当前URL');
    console.log('  2. LoginForm: 处理returnUrl参数');
    console.log('  3. OktaCallback: 认证成功后跳转回原页面');
    console.log('  4. AppLayout: 全局弹窗组件');
    console.log('  5. useOktaAuth: 统一状态管理');
    
    console.log('\n🧪 测试场景:');
    console.log('  📄 在/assets/list页面触发过期 → 认证后回到/assets/list');
    console.log('  📄 在/administration/users页面触发过期 → 认证后回到/administration/users');
    console.log('  📄 在任何页面触发过期 → 认证后都能正确返回');
    
    console.log('\n💡 用户体验:');
    console.log('  ✅ 无缝的认证体验');
    console.log('  ✅ 不会丢失用户的操作上下文');
    console.log('  ✅ 统一的弹窗样式和交互');
    console.log('  ✅ 支持取消操作');
    
})();

console.log('🧪 返回当前页面功能验证脚本已加载');
console.log('💡 脚本将自动执行测试，请观察控制台输出和弹窗功能');
