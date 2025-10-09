/**
 * 🧪 测试SessionExpiredModal修复验证脚本
 * 
 * 使用方法：
 * 1. 访问 http://localhost:8081/auth-tester
 * 2. 登录Okta账号
 * 3. 在浏览器控制台粘贴并执行此脚本
 */

(async function testModalFix() {
    console.log('🧪 ===== SessionExpiredModal修复验证测试 =====');
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
    
    console.log('🔍 开始测试SessionExpiredModal修复...');
    
    try {
        // 1. 检查DOM中是否已经有弹窗元素
        console.log('📋 步骤1：检查DOM中的弹窗元素');
        let modalElement = document.querySelector('[data-modal="session-expired"]');
        console.log('初始弹窗状态:', modalElement ? '存在但隐藏' : '不存在');
        
        // 2. 触发重试失效测试
        console.log('🚨 步骤2：触发3次重试失效测试');
        console.log('执行命令: oktaTest.retryModal()');
        
        const testPromise = window.oktaTest.retryModal();
        
        // 3. 监听弹窗状态变化
        console.log('👀 步骤3：监听弹窗状态变化...');
        
        let checkCount = 0;
        const maxChecks = 30; // 最多检查30次（30秒）
        
        const checkModal = () => {
            checkCount++;
            modalElement = document.querySelector('[data-modal="session-expired"]');
            
            if (modalElement) {
                const isVisible = modalElement.style.display !== 'none' && 
                                modalElement.offsetParent !== null;
                
                console.log(`🔍 检查 ${checkCount}/${maxChecks}: 弹窗元素存在, 可见性: ${isVisible}`);
                
                if (isVisible) {
                    console.log('🎉 ===== 弹窗显示成功！ =====');
                    console.log('✅ SessionExpiredModal已正确显示');
                    
                    // 验证弹窗内容
                    const title = modalElement.querySelector('h1');
                    const button = modalElement.querySelector('button');
                    
                    console.log('📋 弹窗内容验证:');
                    console.log('  标题:', title ? title.textContent : '未找到');
                    console.log('  按钮:', button ? button.textContent : '未找到');
                    
                    // 验证样式
                    const styles = window.getComputedStyle(modalElement);
                    console.log('🎨 弹窗样式验证:');
                    console.log('  背景色:', styles.backgroundColor);
                    console.log('  z-index:', styles.zIndex);
                    console.log('  position:', styles.position);
                    
                    console.log('🎯 测试Resume Session按钮功能...');
                    if (button) {
                        console.log('💡 提示：您可以手动点击"Resume Session"按钮测试功能');
                        console.log('💡 预期：点击后弹窗关闭，跳转到验证页面');
                    }
                    
                    return true; // 测试成功
                }
            } else {
                console.log(`🔍 检查 ${checkCount}/${maxChecks}: 弹窗元素不存在`);
            }
            
            if (checkCount < maxChecks) {
                setTimeout(checkModal, 1000); // 1秒后再检查
            } else {
                console.log('⏰ 检查超时，弹窗可能未正确显示');
                console.log('🔧 故障排除建议:');
                console.log('  1. 检查控制台是否有错误信息');
                console.log('  2. 确认已登录Okta账号');
                console.log('  3. 尝试刷新页面后重新测试');
                return false;
            }
        };
        
        // 开始检查
        setTimeout(checkModal, 2000); // 2秒后开始检查，给测试时间执行
        
        // 等待测试完成
        await testPromise;
        
    } catch (error) {
        console.error('❌ 测试执行出错:', error);
        console.log('🔧 错误处理建议:');
        console.log('  1. 检查网络连接');
        console.log('  2. 确认Okta服务正常');
        console.log('  3. 重新登录后再试');
    }
    
    console.log('\n📊 ===== 测试总结 =====');
    console.log('🎯 本次测试验证了SessionExpiredModal的修复效果');
    console.log('🔄 修复内容：同步useOktaAuth的showAuthModal状态到组件内部');
    console.log('✅ 如果看到弹窗显示，说明修复成功');
    console.log('❌ 如果弹窗未显示，可能需要进一步调试');
    
    console.log('\n💡 后续测试建议:');
    console.log('1. 点击Resume Session按钮测试功能');
    console.log('2. 验证弹窗关闭和页面跳转');
    console.log('3. 确认验证成功后的状态恢复');
    
})();

console.log('🧪 SessionExpiredModal修复验证脚本已加载');
console.log('💡 脚本将自动执行测试，请观察控制台输出');
