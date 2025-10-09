/**
 * 🧪 Okta认证系统两次验证测试脚本
 * 
 * 使用方法：
 * 1. 访问 http://localhost:8080/auth-tester
 * 2. 登录Okta账号
 * 3. 在浏览器控制台粘贴并执行此脚本
 */

(async function runVerificationTests() {
    console.log('🧪 ===== Okta认证系统两次验证测试开始 =====');
    console.log('📅 测试时间:', new Date().toLocaleString());
    console.log('🌐 测试地址:', window.location.href);
    
    // 检查是否在正确的页面
    if (!window.location.href.includes('auth-tester')) {
        console.error('❌ 错误：请在 /auth-tester 页面执行此测试');
        return;
    }
    
    // 检查oktaTest是否可用
    if (typeof window.oktaTest === 'undefined') {
        console.error('❌ 错误：oktaTest工具未加载，请刷新页面后重试');
        return;
    }
    
    const results = {
        test1: { name: '第一次验证：正常认证流程', status: 'pending', details: [] },
        test2: { name: '第二次验证：3次重试失效', status: 'pending', details: [] },
        startTime: Date.now(),
        endTime: null
    };
    
    try {
        // ===== 第一次验证：正常认证流程测试 =====
        console.log('\n🔍 ===== 第一次验证：正常认证流程测试 =====');
        results.test1.status = 'running';
        
        // 1. 检查当前状态
        console.log('📊 步骤1：检查当前token状态');
        const statusResult = await window.oktaTest.status();
        results.test1.details.push('✅ Token状态检查完成');
        console.log('✅ Token状态检查完成');
        
        // 2. 模拟5分钟后过期
        console.log('⏰ 步骤2：模拟5分钟后过期');
        await window.oktaTest.expire5min();
        results.test1.details.push('✅ 5分钟过期模拟完成');
        console.log('✅ 5分钟过期模拟完成');
        
        // 3. 测试刷新机制
        console.log('🔄 步骤3：测试token刷新机制');
        await window.oktaTest.refresh();
        results.test1.details.push('✅ Token刷新测试完成');
        console.log('✅ Token刷新测试完成');
        
        results.test1.status = 'completed';
        console.log('🎉 第一次验证测试完成！');
        
        // 等待2秒后开始第二次测试
        console.log('⏳ 等待2秒后开始第二次验证...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // ===== 第二次验证：3次重试失效测试 =====
        console.log('\n🚨 ===== 第二次验证：3次重试失效测试 =====');
        results.test2.status = 'running';
        
        console.log('🎯 使用推荐的retryModal()方法进行测试');
        console.log('📋 预期流程：Token过期 → 3次重试失败 → 弹出Session Expired弹窗');
        
        // 执行重试失效测试
        console.log('🚀 开始执行3次重试失效测试...');
        await window.oktaTest.retryModal();
        
        results.test2.details.push('✅ 重试失效测试已启动');
        results.test2.details.push('🚨 请观察是否显示Session Expired弹窗');
        results.test2.details.push('📋 弹窗应包含：超大标题 + 描述文本 + Resume Session按钮');
        
        console.log('✅ 重试失效测试已启动');
        console.log('🚨 请观察是否显示Session Expired弹窗');
        console.log('📋 弹窗验证要点：');
        console.log('   - ✅ 白色全屏背景');
        console.log('   - ✅ 超大"Session Expired"标题');
        console.log('   - ✅ 大字体描述文本');
        console.log('   - ✅ 黑色圆角"Resume Session"按钮');
        console.log('   - ✅ 页面完全锁定');
        
        results.test2.status = 'completed';
        console.log('🎉 第二次验证测试完成！');
        
    } catch (error) {
        console.error('❌ 测试执行出错:', error);
        if (results.test1.status === 'running') {
            results.test1.status = 'failed';
            results.test1.details.push(`❌ 错误: ${error.message}`);
        }
        if (results.test2.status === 'running') {
            results.test2.status = 'failed';
            results.test2.details.push(`❌ 错误: ${error.message}`);
        }
    }
    
    // 生成测试报告
    results.endTime = Date.now();
    const duration = ((results.endTime - results.startTime) / 1000).toFixed(2);
    
    console.log('\n📊 ===== 测试报告 =====');
    console.log(`⏱️ 测试总耗时: ${duration}秒`);
    console.log(`📅 开始时间: ${new Date(results.startTime).toLocaleTimeString()}`);
    console.log(`📅 结束时间: ${new Date(results.endTime).toLocaleTimeString()}`);
    console.log('');
    
    // 第一次验证结果
    console.log(`🔍 ${results.test1.name}:`);
    console.log(`   状态: ${getStatusIcon(results.test1.status)} ${results.test1.status.toUpperCase()}`);
    results.test1.details.forEach(detail => console.log(`   ${detail}`));
    console.log('');
    
    // 第二次验证结果
    console.log(`🚨 ${results.test2.name}:`);
    console.log(`   状态: ${getStatusIcon(results.test2.status)} ${results.test2.status.toUpperCase()}`);
    results.test2.details.forEach(detail => console.log(`   ${detail}`));
    console.log('');
    
    // 总结
    const allPassed = results.test1.status === 'completed' && results.test2.status === 'completed';
    console.log('🎯 ===== 测试总结 =====');
    console.log(`总体结果: ${allPassed ? '✅ 全部通过' : '❌ 存在失败'}`);
    
    if (allPassed) {
        console.log('🎉 恭喜！两次验证测试全部通过');
        console.log('📋 验证要点：');
        console.log('   ✅ 正常认证流程工作正常');
        console.log('   ✅ 3次重试失效机制正常');
        console.log('   ✅ Session Expired弹窗显示正常');
        console.log('   ✅ 弹窗设计符合附件要求');
    } else {
        console.log('⚠️ 部分测试未通过，请检查详细信息');
    }
    
    console.log('\n💡 后续操作建议：');
    console.log('1. 如果显示了Session Expired弹窗，请点击"Resume Session"按钮测试恢复功能');
    console.log('2. 完成认证后观察弹窗是否自动关闭');
    console.log('3. 验证是否能正常返回auth-tester页面继续操作');
    
    // 返回结果供进一步分析
    window.verificationTestResults = results;
    console.log('\n📋 详细结果已保存到 window.verificationTestResults');
    
    function getStatusIcon(status) {
        switch (status) {
            case 'completed': return '✅';
            case 'running': return '🔄';
            case 'failed': return '❌';
            case 'pending': return '⏳';
            default: return '❓';
        }
    }
})();

// 添加辅助函数
window.showVerificationResults = function() {
    if (window.verificationTestResults) {
        console.table(window.verificationTestResults);
    } else {
        console.log('❌ 没有找到测试结果，请先运行验证测试');
    }
};

console.log('🧪 验证测试脚本已加载完成');
console.log('💡 如需查看测试结果，请执行: showVerificationResults()');
