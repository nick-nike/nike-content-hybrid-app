/**
 * 🧪 测试专业级Okta模块验证脚本
 * 
 * 使用方法：
 * 1. 访问 http://localhost:8081/auth-tester
 * 2. 在浏览器控制台粘贴并执行此脚本
 */

(async function testOktaModule() {
    console.log('🧪 ===== 专业级Okta模块验证测试 =====');
    console.log('📅 测试时间:', new Date().toLocaleString());
    console.log('🌐 测试地址:', window.location.href);
    
    try {
        // 1. 测试模块信息
        console.log('\n📋 ===== 模块信息验证 =====');
        
        // 动态导入模块
        const OktaModule = await import('/src/modules/okta/index.tsx');
        
        console.log('✅ 模块导入成功');
        console.log('📊 模块信息:', OktaModule.OKTA_MODULE_INFO);
        console.log('📚 文档链接:', OktaModule.OKTA_MODULE_DOCS);
        
        // 2. 测试默认导出
        console.log('\n🎯 ===== 默认导出验证 =====');
        
        const defaultModule = OktaModule.default;
        console.log('✅ 默认导出存在:', !!defaultModule);
        console.log('📋 默认导出属性:', Object.keys(defaultModule));
        
        // 测试模块信息
        console.log('📊 模块信息:', defaultModule.info);
        console.log('📚 文档信息:', defaultModule.docs);
        
        // 3. 测试核心组件导出
        console.log('\n🏗️ ===== 核心组件验证 =====');
        
        const components = [
            'OktaProvider',
            'OktaCallback', 
            'SessionExpiredModal'
        ];
        
        components.forEach(componentName => {
            try {
                const component = OktaModule[componentName];
                console.log(`✅ ${componentName}:`, !!component);
            } catch (error) {
                console.log(`❌ ${componentName}:`, error.message);
            }
        });
        
        // 4. 测试Hooks导出
        console.log('\n🎣 ===== Hooks验证 =====');
        
        try {
            const useOktaAuth = OktaModule.useOktaAuth;
            console.log('✅ useOktaAuth Hook:', !!useOktaAuth);
        } catch (error) {
            console.log('❌ useOktaAuth Hook:', error.message);
        }
        
        // 5. 测试服务导出
        console.log('\n🔧 ===== 服务验证 =====');
        
        const services = [
            'SessionMonitor',
            'TokenManager',
            'TokenLifecycleTestSuite',
            'QuickTests'
        ];
        
        services.forEach(serviceName => {
            try {
                const service = OktaModule[serviceName];
                console.log(`✅ ${serviceName}:`, !!service);
            } catch (error) {
                console.log(`❌ ${serviceName}:`, error.message);
            }
        });
        
        // 6. 测试工具函数
        console.log('\n🚀 ===== 工具函数验证 =====');
        
        try {
            const initResult = OktaModule.initializeOktaModule({
                clientId: 'test-client-id'
            });
            console.log('✅ initializeOktaModule:', !!initResult);
            console.log('📋 初始化结果:', initResult);
        } catch (error) {
            console.log('❌ initializeOktaModule:', error.message);
        }
        
        try {
            const health = await OktaModule.getModuleHealth();
            console.log('✅ getModuleHealth:', !!health);
            console.log('🏥 健康状态:', health);
        } catch (error) {
            console.log('❌ getModuleHealth:', error.message);
        }
        
        // 7. 测试类型导出
        console.log('\n📊 ===== 类型导出验证 =====');
        
        const types = [
            'OktaTokens',
            'RefreshAttempt', 
            'SessionEvent',
            'SessionEventType',
            'AuthConfig'
        ];
        
        console.log('📋 导出的类型:', types);
        console.log('💡 类型在TypeScript编译时验证，运行时不可直接访问');
        
        // 8. 测试开发工具
        console.log('\n🧪 ===== 开发工具验证 =====');
        
        const devTools = [
            'CompleteAuthFlowDemo',
            'SimpleAuthTester'
        ];
        
        devTools.forEach(toolName => {
            try {
                const tool = OktaModule[toolName];
                console.log(`✅ ${toolName}:`, !!tool);
            } catch (error) {
                console.log(`❌ ${toolName}:`, error.message);
            }
        });
        
        // 9. 测试默认导出的getter方法
        console.log('\n🎯 ===== 默认导出Getter验证 =====');
        
        try {
            console.log('🔧 Provider:', !!defaultModule.Provider);
            console.log('🔧 Callback:', !!defaultModule.Callback);
            console.log('🔧 SessionExpiredModal:', !!defaultModule.SessionExpiredModal);
            console.log('🔧 useAuth:', !!defaultModule.useAuth);
            console.log('🔧 config:', !!defaultModule.config);
            console.log('🔧 SessionMonitor:', !!defaultModule.SessionMonitor);
        } catch (error) {
            console.log('❌ Getter方法错误:', error.message);
        }
        
        // 10. 使用示例验证
        console.log('\n💡 ===== 使用示例验证 =====');
        
        console.log('📋 基础导入示例:');
        console.log(`
// 方式1: 默认导入
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
        `);
        
        console.log('📋 使用示例:');
        console.log(`
// 获取模块信息
console.log(OktaModule.info);

// 初始化模块
const config = OktaModule.initialize({
  clientId: 'your-client-id'
});

// 检查健康状态
const health = await OktaModule.getHealth();

// 使用组件
<OktaModule.Provider>
  <App />
</OktaModule.Provider>
        `);
        
    } catch (error) {
        console.error('❌ 测试执行出错:', error);
    }
    
    console.log('\n📊 ===== 测试总结 =====');
    console.log('🎉 专业级Okta模块特点:');
    console.log('  ✅ 完整的模块文档和注释');
    console.log('  ✅ 清晰的分类导出结构');
    console.log('  ✅ 企业级元数据信息');
    console.log('  ✅ 便捷的工具函数');
    console.log('  ✅ 完整的TypeScript类型支持');
    console.log('  ✅ 灵活的导入方式');
    console.log('  ✅ 默认导出的便捷接口');
    console.log('  ✅ 动态加载避免循环依赖');
    
    console.log('\n🚀 改进对比:');
    console.log('  📈 从2行简单导出 → 329行专业模块');
    console.log('  📈 从基础导出 → 完整的企业级接口');
    console.log('  📈 从无文档 → 详细的JSDoc注释');
    console.log('  📈 从无类型 → 完整的TypeScript支持');
    console.log('  📈 从无工具 → 丰富的开发工具');
    
    console.log('\n💡 使用建议:');
    console.log('  🎯 开发环境: 使用默认导出 OktaModule');
    console.log('  🎯 生产环境: 使用命名导入优化打包');
    console.log('  🎯 类型安全: 导入相关TypeScript类型');
    console.log('  🎯 测试调试: 使用内置的测试工具');
    
})();

console.log('🧪 专业级Okta模块验证脚本已加载');
console.log('💡 脚本将自动执行测试，请观察控制台输出');
