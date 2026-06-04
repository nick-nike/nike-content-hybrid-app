import React from 'react';
import { FinalReportingDashboard } from './components/FinalReportingDashboard';

export const WeeklyMeetingPage: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-[#fcfcfc]">
            <FinalReportingDashboard />
        </div>
    );
};

// 2. Default Export (兼容其他可能的引用)
export default WeeklyMeetingPage;
