import React from 'react';

interface SessionExpiredModalProps {
    isVisible: boolean;
    onResumeSession: () => void;
    onCancel?: () => void;
}

/**
 * Session Expired Modal - 小弹窗形式
 * 在当前页面弹出的模态框，不占满整个屏幕
 */
export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
    isVisible,
    onResumeSession,
    onCancel
}) => {
    if (!isVisible) return null;

    return (
        <>
            {/* 背景遮罩 */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
                data-modal="session-expired-overlay"
            />
            
            {/* 弹窗内容 */}
            <div 
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
                data-modal="session-expired"
                role="dialog"
                aria-modal="true"
                aria-labelledby="session-expired-title"
            >
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 pointer-events-auto transform transition-all duration-300 scale-100">
                    {/* 弹窗头部 */}
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center justify-center mb-4">
                            {/* 警告图标 */}
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <h1 
                            id="session-expired-title"
                            className="text-2xl font-semibold text-gray-900 text-center"
                        >
                            Session Expired
                        </h1>
                    </div>
                    
                    {/* 弹窗内容 */}
                    <div className="px-6 py-4">
                        <div className="text-center space-y-3">
                            <p className="text-gray-600 leading-relaxed">
                                Your session has expired. Click "Resume Session" to renew your session in a new tab.
                            </p>
                            <p className="text-sm text-gray-500">
                                Feel free to return to this window and continue where you left off.
                            </p>
                        </div>
                    </div>
                    
                    {/* 弹窗底部按钮 */}
                    <div className="px-6 pb-6 pt-2">
                        <div className="flex space-x-3">
                            {onCancel && (
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={onResumeSession}
                                className={`px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${onCancel ? 'flex-1' : 'w-full'}`}
                                aria-label="Resume Session"
                            >
                                Resume Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

