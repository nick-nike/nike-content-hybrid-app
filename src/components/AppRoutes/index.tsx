import type { FC } from 'react';
import React, { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Main as DocmentMain } from '../../modules/document';
import { Main as DocmentListMain } from '../../modules/document-list';
import { ImageToolkitPage } from '../../modules/image-toolkit-demo';
import { ImageWorkflowDemo } from '../../modules/image-workflow-demo';
import { Main as LoginMain } from '../../modules/login';
import { OktaCallback } from '../../modules/login';
import { AppLayout } from '../AppLayout';
import { ComboboxDemo } from '@/modules/combobox-demo/combobox-demo';
import { NewPDPPage } from '@/modules/pdp-page/new-pdp';
// import { CompleteAuthFlowDemo } from '@/modules/okta/utils/CompleteAuthFlowDemo'; // 已整合到login模块
import { useOktaAuth } from '@okta/okta-react';
import { useOktaAuth as useCustomOktaAuth } from '@/modules/login/services/useOktaAuth';

const UserListMain = lazy(() => import('../../modules/user-list').then(module => ({ default: module.Main })));

/**
 * Main application routing component
 * Handles route protection and authentication flow
 */
const AppRoutes: FC = () => {
    const { authState, oktaAuth } = useOktaAuth();
    const { 
        showAuthModal, 
        authModalReason, 
        authModalAttempts, 
        closeAuthModal, 
        handleReauthorize 
    } = useCustomOktaAuth();
    
    // 改进认证状态处理逻辑
    const isAuthenticated = authState?.isAuthenticated ?? false;
    const isLoading = authState?.isPending ?? false;
    
    // 添加超时处理，避免无限等待
    const [initTimeout, setInitTimeout] = React.useState(false);
    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (!authState) {
                console.warn('Okta initialization timeout, falling back to login page');
                setInitTimeout(true);
            }
        }, 3000); // 3秒超时
        
        return () => clearTimeout(timer);
    }, [authState]);
    
    // 可选：添加调试信息（生产环境中应移除）
    if (process.env.NODE_ENV === 'development') {
        console.log('AuthState Debug:', { 
            authState, 
            isAuthenticated, 
            isLoading, 
            initTimeout,
            hasOktaAuth: !!oktaAuth,
            hasAuthState: !!authState 
        });
    }

    // 如果超时或者确实在加载中，显示加载状态
    if ((isLoading || (!authState && !initTimeout))) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        {!authState ? 'Initializing authentication...' : 'Verifying authentication...'}
                    </p>
                    {!authState && (
                        <p className="mt-2 text-sm text-gray-500">
                            If this takes too long, please refresh the page
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
        <Routes>
            {/* Root route - redirects based on auth status */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/assets/list" /> : <Navigate to="/login" />} />

            {/* Okta callback route */}
            <Route path="/authorize/callback" element={<OktaCallback />} />

            {/* Login page route */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/assets/list" /> : <LoginMain />}
            />

            {/* Protected routes */}
            <Route
                path="/*"
                element={
                    isAuthenticated
                        ? (
                            <AppLayout>
                                <Suspense fallback={<div>Loading content...</div>}>
                                    <Outlet />
                                </Suspense>
                            </AppLayout>
                        )
                        : (
                            <Navigate to="/login" />
                        )
                }
            >
                {/* Asset management routes */}
                <Route path="assets/list" element={<div>This is assets list page</div>} />
                <Route path="assets/details" element={<div>This is asset details page</div>} />

                {/* Ingestion management routes */}
                <Route path="ingestion/list" element={<div>This is ingestion list page</div>} />
                <Route path="ingestion/details" element={<div>This is ingestion details page</div>} />

                {/* Task management routes */}
                <Route path="task/list" element={<div>This is task list page</div>} />
                <Route path="task/details" element={<div>This is task details page</div>} />

                {/* Distribution management routes */}
                <Route path="distribution/list" element={<div>This is distribution list page</div>} />
                <Route path="distribution/details" element={<div>This is distribution details page</div>} />

                {/* Tracking list route */}
                <Route path="tracking/list" element={<div>This is tracking list page</div>} />

                {/* Administration routes */}
                <Route path="administration" element={<div>This is administration page</div>} />
                <Route path="administration/users" element={<UserListMain />} />

                {/* Existing module routes */}
                <Route path="document-list" element={<DocmentListMain />} />

                {/* Image Toolkit Demo */}
                <Route path="image-toolkit" element={<ImageToolkitPage />} />

                {/* 新的完整闭环Demo */}
                <Route path="image-workflow" element={<ImageWorkflowDemo />} />

                {/* PDP页面 */}
                <Route path="pdp-page" element={<NewPDPPage />} />

                {/* Combobox 组件演示 */}
                <Route path="combobox-demo" element={<ComboboxDemo />} />

                {/* Complete Okta Session Lifecycle Management Demo */}
                {/* <Route path="auth-tester" element={<CompleteAuthFlowDemo />} /> */}

            </Route>

            {/* Document detail page route */}
            <Route
                path="/document/:documentId"
                element={isAuthenticated ? <DocmentMain /> : <Navigate to="/login" />}
            />

            {/* Catch-all route - 404 page */}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
        
        
        </>
    );
};

export { AppRoutes };