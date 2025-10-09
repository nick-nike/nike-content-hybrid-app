import './assets/css/global.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './components/AppRoutes';
import { config } from './config';
import { OktaProvider } from './modules/login';

console.log('Starting React app...');
console.log('Config:', config);

const root = createRoot(document.getElementById('root') as HTMLElement);

// 添加错误边界
const App = () => {
    try {
        return (
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true
                }}
            >
                <OktaProvider>
                    <AppRoutes />
                </OktaProvider>
            </BrowserRouter>
        );
    } catch (error) {
        console.error('App render error:', error);
        return (
            <div>
                Error loading app:
                {String(error)}
            </div>
        );
    }
};

root.render(<App />);

console.log(`React app is running on ${config.ENV} environment`);
