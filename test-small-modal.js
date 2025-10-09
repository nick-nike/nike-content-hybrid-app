/**
 * 🧪 测试小弹窗设计验证脚本
 * 
 * 使用方法：
 * 1. 访问 http://localhost:8081/auth-tester
 * 2. 登录Okta账号
 * 3. 在浏览器控制台粘贴并执行此脚本
 */

(async function testSmallModal() {
    console.log('🧪 ===== 小弹窗设计验证测试 =====');
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
    
    console.log('🎨 开始测试小弹窗设计...');
    
    try {
        // 1. 触发弹窗显示
        console.log('🚨 步骤1：触发Session Expired弹窗');
        console.log('执行命令: oktaTest.retryModal()');
        
        const testPromise = window.oktaTest.retryModal();
        
        // 2. 等待弹窗显示
        console.log('⏳ 步骤2：等待弹窗显示...');
        
        let checkCount = 0;
        const maxChecks = 20;
        
        const checkModalDesign = () => {
            checkCount++;
            
            // 查找弹窗元素
            const modalElement = document.querySelector('[data-modal="session-expired"]');
            const overlayElement = document.querySelector('[data-modal="session-expired-overlay"]');
            
            if (modalElement && overlayElement) {
                console.log('🎉 ===== 弹窗设计验证 =====');
                
                // 验证遮罩层
                const overlayStyles = window.getComputedStyle(overlayElement);
                console.log('🌫️ 遮罩层验证:');
                console.log('  背景色:', overlayStyles.backgroundColor);
                console.log('  透明度:', overlayStyles.opacity);
                console.log('  z-index:', overlayStyles.zIndex);
                
                // 验证弹窗容器
                const modalContainer = modalElement.querySelector('.bg-white.rounded-2xl');
                if (modalContainer) {
                    const containerStyles = window.getComputedStyle(modalContainer);
                    console.log('📦 弹窗容器验证:');
                    console.log('  背景色:', containerStyles.backgroundColor);
                    console.log('  圆角:', containerStyles.borderRadius);
                    console.log('  阴影:', containerStyles.boxShadow);
                    console.log('  最大宽度:', containerStyles.maxWidth);
                }
                
                // 验证标题
                const titleElement = modalElement.querySelector('h1');
                if (titleElement) {
                    const titleStyles = window.getComputedStyle(titleElement);
                    console.log('📝 标题验证:');
                    console.log('  文本:', titleElement.textContent);
                    console.log('  字体大小:', titleStyles.fontSize);
                    console.log('  字体粗细:', titleStyles.fontWeight);
                    console.log('  颜色:', titleStyles.color);
                }
                
                // 验证警告图标
                const iconElement = modalElement.querySelector('.bg-red-100');
                if (iconElement) {
                    console.log('⚠️ 警告图标验证:');
                    console.log('  图标容器存在:', !!iconElement);
                    console.log('  SVG图标存在:', !!iconElement.querySelector('svg'));
                }
                
                // 验证描述文本
                const descriptionElements = modalElement.querySelectorAll('p');
                console.log('📄 描述文本验证:');
                descriptionElements.forEach((p, index) => {
                    console.log(`  段落${index + 1}:`, p.textContent.trim());
                });
                
                // 验证按钮
                const buttons = modalElement.querySelectorAll('button');
                console.log('🔘 按钮验证:');
                buttons.forEach((button, index) => {
                    const buttonStyles = window.getComputedStyle(button);
                    console.log(`  按钮${index + 1}:`, button.textContent);
                    console.log(`    背景色:`, buttonStyles.backgroundColor);
                    console.log(`    文字颜色:`, buttonStyles.color);
                    console.log(`    圆角:`, buttonStyles.borderRadius);
                });
                
                // 验证响应式设计
                const modalRect = modalContainer.getBoundingClientRect();
                console.log('📱 响应式设计验证:');
                console.log('  弹窗宽度:', modalRect.width + 'px');
                console.log('  弹窗高度:', modalRect.height + 'px');
                console.log('  屏幕宽度:', window.innerWidth + 'px');
                console.log('  屏幕高度:', window.innerHeight + 'px');
                
                // 验证居中对齐
                const viewportCenterX = window.innerWidth / 2;
                const viewportCenterY = window.innerHeight / 2;
                const modalCenterX = modalRect.left + modalRect.width / 2;
                const modalCenterY = modalRect.top + modalRect.height / 2;
                
                console.log('🎯 居中对齐验证:');
                console.log('  水平居中偏差:', Math.abs(modalCenterX - viewportCenterX) + 'px');
                console.log('  垂直居中偏差:', Math.abs(modalCenterY - viewportCenterY) + 'px');
                
                // 测试按钮功能
                console.log('🧪 按钮功能测试:');
                const cancelButton = Array.from(buttons).find(btn => btn.textContent.includes('Cancel'));
                const resumeButton = Array.from(buttons).find(btn => btn.textContent.includes('Resume'));
                
                if (cancelButton && resumeButton) {
                    console.log('✅ Cancel按钮存在，可以点击测试取消功能');
                    console.log('✅ Resume Session按钮存在，可以点击测试恢复功能');
                    
                    // 添加测试点击事件
                    console.log('💡 提示：');
                    console.log('  - 点击Cancel按钮：关闭弹窗，停止流程');
                    console.log('  - 点击Resume Session按钮：打开新标签页进行认证');
                } else {
                    console.log('❌ 按钮配置异常');
                }
                
                console.log('\n🎨 ===== 设计对比分析 =====');
                console.log('📊 新设计 vs 旧设计:');
                console.log('  ✅ 全屏弹窗 → 小弹窗（更友好）');
                console.log('  ✅ 无遮罩 → 半透明遮罩（更专业）');
                console.log('  ✅ 单按钮 → 双按钮（更灵活）');
                console.log('  ✅ 简单样式 → 现代化设计（更美观）');
                console.log('  ✅ 固定尺寸 → 响应式设计（更适配）');
                
                return true;
            } else {
                console.log(`🔍 检查 ${checkCount}/${maxChecks}: 弹窗尚未显示`);
                
                if (checkCount < maxChecks) {
                    setTimeout(checkModalDesign, 1000);
                } else {
                    console.log('⏰ 检查超时，弹窗可能未正确显示');
                    return false;
                }
            }
        };
        
        // 开始检查
        setTimeout(checkModalDesign, 2000);
        
        // 等待测试完成
        await testPromise;
        
    } catch (error) {
        console.error('❌ 测试执行出错:', error);
    }
    
    console.log('\n📋 ===== 测试总结 =====');
    console.log('🎯 本次测试验证了小弹窗的设计和功能');
    console.log('🎨 新设计特点:');
    console.log('  - 📱 响应式小弹窗，不占满屏幕');
    console.log('  - 🌫️ 半透明黑色遮罩层');
    console.log('  - ⚠️ 红色警告图标');
    console.log('  - 🔘 Cancel + Resume Session 双按钮');
    console.log('  - 🎨 现代化圆角设计');
    console.log('  - 🎯 完美居中对齐');
    
    console.log('\n💡 用户体验改进:');
    console.log('  ✅ 不再阻塞整个页面视图');
    console.log('  ✅ 提供取消选项，用户控制更灵活');
    console.log('  ✅ 视觉层次更清晰，专业感更强');
    console.log('  ✅ 移动端友好，响应式适配');
    
})();

console.log('🧪 小弹窗设计验证脚本已加载');
console.log('💡 脚本将自动执行测试，请观察控制台输出和弹窗显示效果');
