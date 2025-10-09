import { useOktaAuth } from '@okta/okta-react';
import type { FC } from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '../../components/AppLayout';
import { Main as DocmentMain } from '../../modules/document';
import { Main as DocmentListMain } from '../../modules/document-list';
import { ImageToolkitPage } from '../../modules/image-toolkit-demo';
import { Main as LoginMain } from '../../modules/login';
import { OktaCallback } from '../../modules/login';
import { verifyAuthentication } from '../../modules/login/services/authGuard';
import { NewPDPPage } from '@/modules/pdp-page/new-pdp';

const UserListMain = lazy(() => import('../../modules/user-list').then(module => ({ default: module.Main })));

/**
 * Main application routing component
 * Handles route protection and authentication flow
 */
const AppRoutes: FC = () => {
    const { authState } = useOktaAuth();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const isAuthenticated = authState?.isAuthenticated && isTokenValid;
    const navigate = useNavigate();
    const location = useLocation();

    // Verify authentication status when authState changes
    useEffect(() => {
        const verifyAuth = async () => {
            if (!authState?.isPending) {
                setIsVerifying(true);
                try {
                    // Only verify if Okta says we're authenticated
                    if (authState?.isAuthenticated) {
                        const isValid = await verifyAuthentication();
                        setIsTokenValid(isValid);

                        // If token is invalid but Okta thinks we're authenticated,
                        // we need to redirect to login
                        if (!isValid && location.pathname !== '/login') {
                            navigate('/login');
                        }
                    } else {
                        setIsTokenValid(false);
                    }
                } catch (error) {
                    console.error('Authentication verification error:', error);
                    setIsTokenValid(false);
                } finally {
                    setIsVerifying(false);
                }
            }
        };

        verifyAuth();
    }, [authState?.isPending, authState?.isAuthenticated, navigate, location.pathname]);

    // Show loading indicator while authentication state is being determined
    if (authState?.isPending || isVerifying) {
        console.log('Authentication state:', {
            isPending: authState?.isPending,
            isVerifying,
            isAuthenticated: authState?.isAuthenticated,
            isTokenValid,
        });
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <div className="text-center text-white">
                    <p className="mb-4 text-xl">Verifying authentication...</p>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-700">
                        <div className="h-full animate-pulse bg-white" />
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                        Debug: isPending=
                        {String(authState?.isPending)}
                        ,
                        isVerifying=
                        {String(isVerifying)}
                        ,
                        isAuth=
                        {String(authState?.isAuthenticated)}
                    </p>
                </div>
            </div>
        );
    }

    return (
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
            </Route>

            {/* Document detail page route */}
            <Route
                path="/document/:documentId"
                element={isAuthenticated ? <DocmentMain /> : <Navigate to="/login" />}
            />

            {/* Catch-all route - 404 page */}
            <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    );
};

/**
 * Image Workflow Demo component
 * Contains image processing workflow demonstration
 */
export const ImageWorkflowDemo: React.FC = () => {
    return (
        <div className="container mx-auto space-y-6 p-6">
            <h1 className="mb-4 text-3xl font-bold">Image Workflow Demo</h1>
            <p className="mb-6 text-gray-600">This page demonstrates image processing workflows.</p>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold">Image Processing Workflow</h2>
                    <p>Select options and start processing</p>
                </div>
            </div>
        </div>
    );
};

export { AppRoutes };
