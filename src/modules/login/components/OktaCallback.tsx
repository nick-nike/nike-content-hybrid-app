import { LoginCallback, useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const OktaCallback = () => {
    const { authState } = useOktaAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('🔍 === OktaCallback 状态更新 ===');
        console.log('🔍 authState:', authState);
        console.log('🔍 当前 URL:', window.location.href);
        console.log('🔍 URL 参数:', new URLSearchParams(window.location.search).toString());
        
        // 检查URL中的错误参数
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (errorParam) {
            console.error('💥 URL中包含错误参数:');
            console.error('💥 Error:', errorParam);
            console.error('💥 Description:', errorDescription);
            
            let userFriendlyError = 'Authentication failed.';
            
            if (errorParam === 'access_denied') {
                userFriendlyError = '访问被拒绝。您可能没有此应用的访问权限。';
            } else if (errorParam === 'invalid_client') {
                userFriendlyError = '应用配置错误。请联系管理员。';
            } else if (errorParam === 'invalid_request') {
                userFriendlyError = '请求参数错误。请重试。';
            }
            
            setError(`${userFriendlyError} (${errorParam}: ${errorDescription || 'No description'})`);
            return;
        }
        
        if (!code && !authState?.isPending) {
            console.warn('⚠️ 没有获取到授权码，可能是配置问题');
        }
        
        // Handle authentication state changes
        if (authState && !authState.isPending) {
            if (!authState.isAuthenticated) {
                console.error('❌ === Okta 认证失败 ===');
                console.error('❌ 认证状态:', authState);
                console.error('❌ 可能原因:');
                console.error('  1. 用户没有此应用的访问权限');
                console.error('  2. Okta应用配置错误');
                console.error('  3. 用户取消了登录');
                console.error('  4. Redirect URI不匹配');
                
                setError('认证失败。可能原因:用户没有此应用访问权限或配置错误。');
                // Redirect to login after a delay
                const timer = setTimeout(() => navigate('/login'), 5000);
                return () => clearTimeout(timer);
            } else {
                console.log('✅ === Okta 认证成功 ===');
                console.log('✅ 认证状态:', authState);
                console.log('✅ 用户信息:', authState.user);
                
                // 检查是否有返回URL参数
                const urlParams = new URLSearchParams(window.location.search);
                const returnUrl = urlParams.get('returnUrl') || sessionStorage.getItem('returnUrl');
                
                if (returnUrl) {
                    console.log('🔙 检测到返回URL:', returnUrl);
                    console.log('🔙 正在跳转回原页面...');
                    
                    // 清除存储的返回URL
                    sessionStorage.removeItem('returnUrl');
                    
                    // 跳转回原页面
                    window.location.href = returnUrl;
                } else {
                    console.log('✅ 没有返回URL，跳转到默认页面 assets list...');
                    // Navigate to the default page after successful authentication
                    navigate('/assets/list', { replace: true });
                }
            }
        }
    }, [authState, navigate]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
            {error
                ? (
                    <div className="text-center">
                        <h2 className="mb-4 text-2xl font-bold text-red-400">Login Failed</h2>
                        <p className="mb-6">{error}</p>
                        <p>Redirecting to login page...</p>
                    </div>
                )
                : (
                    <div className="text-center">
                        <h2 className="mb-4 text-2xl font-bold">Processing Login</h2>
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                        <p className="mt-4">Please wait while we verify your credentials...</p>

                        <LoginCallback
                            errorComponent={(error: any) => {
                                console.error('💥 LoginCallback 错误:', error);
                                setError(`LoginCallback error: ${error?.message || error}`);
                                return (
                                    <div className="mt-4 text-red-400">
                                        ❌ Authentication error. Redirecting to login...
                                    </div>
                                );
                            }}
                        />
                    </div>
                )}
        </div>
    );
};