// import { CompleteAuthFlowDemo } from '@/modules/okta/utils/CompleteAuthFlowDemo'; // 已整合到login模块
import { useOktaAuth } from '@okta/okta-react';
import type { FC } from 'react';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { AssetsListPage } from '@/modules/assets-list';
import { ComboboxDemo } from '@/modules/combobox-demo/combobox-demo';
import { DashboardPage } from '@/modules/dashboard';
import { IngestionListPage } from '@/modules/ingestion-list';
import { InterviewKnowledgeBasePage } from '@/modules/interview-knowledge-base';
import { NewPDPPage } from '@/modules/pdp-page/new-pdp';
import { WeeklyMeetingPage } from '@/modules/weekly-meeting';
import { TaskListPage } from '@/modules/task-list';
import { DistributionListPage } from '@/modules/distribution-list';
import { ProjectCalendarPage } from '@/modules/project-calendar';
import { GatewayCalendarPage } from '@/modules/gateway-calendar';
import { BudgetProjectCalendarPage } from '@/modules/budget-project-calendar';
import { OpsCrFlowPage } from '@/modules/ops-cr-flow';
import { WbsBuilderPage } from '@/modules/wbs-builder';
import { DailySnapshotPage } from '@/modules/daily-snapshot';
import { GanttBuilderPage } from '@/modules/gantt-builder';
import { ResourceCapacityForecastPage } from '@/modules/resource-capacity-forecast';

import { Main as DocmentMain } from '../../modules/document';
import { Main as DocmentListMain } from '../../modules/document-list';
import { ImageToolkitPage } from '../../modules/image-toolkit-demo';
import { ImageWorkflowDemo } from '../../modules/image-workflow-demo';
import { Main as LoginMain, OktaCallback, readPmAuthSession } from '../../modules/login';
import { AppLayout } from '../AppLayout';

const UserListMain = lazy(() => import('../../modules/user-list').then(module => ({ default: module.Main })));

/**
 * Main application routing component
 * Handles route protection and authentication flow
 * NOTE: Authentication checks are currently disabled for development
 */
const AppRoutes: FC = () => {
    const { authState: _authState, oktaAuth: _oktaAuth } = useOktaAuth();

    // 认证相关逻辑已隐藏，直接跳过加载状态
    // const isAuthenticated = authState?.isAuthenticated ?? false;
    // const isLoading = authState?.isPending ?? false;

    /*
    // 已注释：超时处理逻辑
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
    */

    return (
        <>
            <Routes>
                {/* Root route - go to login first when no local PM session exists */}
                <Route path="/" element={<Navigate to={readPmAuthSession() ? '/budget-project-calendar' : '/login'} replace />} />

                {/* Okta callback route */}
                <Route path="/authorize/callback" element={<OktaCallback />} />

                <Route path="/login/*" element={<LoginMain />} />

                {/* Protected PM routes */}
                <Route
                    path="/*"
                    element={readPmAuthSession() ? (
                        <AppLayout>
                            <Suspense fallback={<div>Loading content...</div>}>
                                <Outlet />
                            </Suspense>
                        </AppLayout>
                    ) : <Navigate to="/login" replace />}
                >
                    {/* Dashboard route */}
                    <Route path="dashboard" element={<DashboardPage />} />

                    {/* Asset management routes */}
                    <Route path="assets/list" element={<AssetsListPage />} />
                    <Route path="assets/details" element={<div>This is asset details page</div>} />

                    {/* Ingestion management routes */}
                    <Route path="ingestion/list" element={<IngestionListPage />} />
                    <Route path="ingestion/details" element={<div>This is ingestion details page</div>} />

                    {/* Task management routes */}
                    <Route path="task/list" element={<TaskListPage />} />
                    <Route path="task/details" element={<div>This is task details page</div>} />

                    {/* Distribution management routes */}
                    <Route path="distribution/list" element={<DistributionListPage />} />
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

                    {/* Image Workflow Demo */}
                    <Route path="image-workflow" element={<ImageWorkflowDemo />} />

                    {/* PDP Page */}
                    <Route path="pdp-page" element={<NewPDPPage />} />

                    {/* Cost Forecasting Report */}
                    <Route path="cost-forecasting" element={<ComboboxDemo />} />

                    {/* Weekly Meeting Review */}
                    <Route path="weekly-meeting" element={<WeeklyMeetingPage />} />

                    {/* Project Calendar */}
                    <Route path="project-calendar" element={<ProjectCalendarPage />} />

                    {/* Gateway Calendar */}
                    <Route path="gateway-calendar" element={<GatewayCalendarPage />} />

                    {/* Budget Project Calendar */}
                    <Route path="budget-project-calendar" element={<BudgetProjectCalendarPage />} />

                    {/* OPS CR Flow */}
                    <Route path="ops-cr-flow" element={<OpsCrFlowPage />} />

                    {/* WBS Builder */}
                    <Route path="wbs-builder" element={<WbsBuilderPage />} />

                    {/* Daily Snapshot */}
                    <Route path="daily-snapshot" element={<DailySnapshotPage />} />

                    {/* Gantt Builder */}
                    <Route path="gantt-builder" element={<GanttBuilderPage />} />

                    {/* Resource & Capacity Forecast */}
                    <Route path="resource-capacity-forecast" element={<ResourceCapacityForecastPage />} />

                    {/* Interview Knowledge Base */}
                    <Route path="interview-knowledge-base" element={<InterviewKnowledgeBasePage />} />
                </Route>

                {/* Document detail page route - no auth check */}
                <Route
                    path="/document/:documentId"
                    element={<DocmentMain />}
                />

                {/* Catch-all route - 404 page */}
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>

        </>
    );
};

export { AppRoutes };
