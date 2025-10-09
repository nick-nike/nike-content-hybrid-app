import { zodResolver } from '@hookform/resolvers/zod';
import { useOktaAuth } from '@okta/okta-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Form schema
const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    rememberMe: z.boolean(),
});

export function LoginForm() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { oktaAuth, authState } = useOktaAuth();
    // Use the inferred type from the schema
    type FormData = z.infer<typeof formSchema>;
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '', rememberMe: false },
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (authState?.isAuthenticated) navigate('/assets/list');
    }, [authState?.isAuthenticated, navigate]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErrorMessage(null);
        setTimeout(() => {
            console.log('Form login:', values);
            setIsLoading(false);
            navigate('/assets/list');
        }, 1000);
    };

    const handleOktaLogin = async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            
            console.log('🔐 === 开始 Okta 登录 ===');
            console.log('🔐 当前时间:', new Date().toLocaleString());
            console.log('🔐 当前 URL:', window.location.href);
            console.log('🔐 Redirect URI:', `${window.location.origin}/authorize/callback`);
            
            // 检查URL参数中的returnUrl
            const urlParams = new URLSearchParams(window.location.search);
            const returnUrl = urlParams.get('returnUrl');
            
            let originalUri = '/assets/list'; // 默认跳转页面
            
            if (returnUrl) {
                console.log('🔙 检测到返回URL参数:', returnUrl);
                originalUri = returnUrl;
                // 同时保存到sessionStorage作为备份
                sessionStorage.setItem('returnUrl', returnUrl);
            }
            
            console.log('🎯 认证成功后将跳转到:', originalUri);
            
            await oktaAuth.signInWithRedirect({ 
                originalUri: originalUri,
                // 添加额外参数进行调试
                prompt: 'login' // 强制显示登录页面
            });
            
            console.log('🔐 Okta 重定向已启动');
            
        } catch (error: any) {
            console.error('💥 === Okta 登录错误详情 ===');
            console.error('💥 错误对象:', error);
            console.error('💥 错误类型:', typeof error);
            console.error('💥 错误消息:', error.message);
            console.error('💥 错误代码:', error.errorCode);
            console.error('💥 错误摘要:', error.errorSummary);
            console.error('💥 错误堆栈:', error.stack);
            
            let errorMessage = 'Failed to connect to Okta. Please try again.';
            
            if (error.errorCode) {
                errorMessage = `Okta Error (${error.errorCode}): ${error.errorSummary || error.message}`;
            } else if (error.message) {
                errorMessage = `Connection Error: ${error.message}`;
            }
            
            console.error('💥 用户显示错误:', errorMessage);
            
            setErrorMessage(errorMessage);
            setIsLoading(false);
        }
    };

    const renderHeader = () => (
        <CardHeader className="space-y-2">
            {errorMessage && (
                <div className="mb-4 rounded border border-red-400 bg-red-900/20 p-3 text-sm text-red-400">
                    {errorMessage}
                </div>
            )}
            <Button
                type="button"
                onClick={handleOktaLogin}
                disabled={isLoading}
                className="mt-2 w-full bg-white text-black hover:bg-gray-200"
            >
                {isLoading ? 'Connecting to Okta...' : 'Login with Okta'}
            </Button>
            <div className="relative my-4 flex items-center">
                <div className="flex-grow border-t border-gray-700" />
                <span className="mx-4 bg-black px-2 text-sm text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-700" />
            </div>
        </CardHeader>
    );

    return (
        <Card className="w-full border-none bg-black text-white shadow-lg">
            {renderHeader()}
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="your.email@example.com"
                                            className="border-gray-800 bg-gray-900 text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            className="border-gray-800 bg-gray-900 text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-between">
                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-gray-600 data-[state=checked]:bg-white data-[state=checked]:text-black"
                                            />
                                        </FormControl>
                                        <FormLabel className="cursor-pointer text-sm text-gray-400">Remember me</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="link"
                                className="h-auto p-0 text-sm text-blue-500 hover:text-blue-400"
                            >
                                Forgot password?
                            </Button>
                        </div>
                        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
                <p className="text-sm text-gray-400">
                    Don&apos;t have an account?
                    {' '}
                    <Button type="button" variant="link" className="h-auto p-0 text-blue-500 hover:text-blue-400">
                        Contact administrator
                    </Button>
                </p>
            </CardFooter>
        </Card>
    );
}
