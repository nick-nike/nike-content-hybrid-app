import './assets/css/global.css';

import { createRoot } from 'react-dom/client';

import { BudgetProjectCalendarPage } from './modules/budget-project-calendar';

createRoot(document.getElementById('root') as HTMLElement).render(<BudgetProjectCalendarPage />);
