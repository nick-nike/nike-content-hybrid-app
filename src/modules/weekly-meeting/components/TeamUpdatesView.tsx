import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, RefreshCw, UserPlus } from 'lucide-react';

export const TeamUpdatesView: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">

            {/* 1. Header Insight Banner - Pure ELC Style */}
            <div className="bg-[#0a1e40] rounded-2xl shadow-2xl border border-[#d4af37]/30 p-10 flex items-center justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d4af37]/5 rounded-full -ml-16 -mb-16"></div>

                <div className="flex gap-8 items-center z-10 relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8b7355] flex items-center justify-center shadow-lg border border-white/20 shrink-0">
                        <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-[10px] text-[#d4af37] uppercase tracking-[0.4em] font-black mb-3">Executive Summary • Workforce Intelligence</h2>
                        <h3 className="text-2xl text-white font-light leading-relaxed max-w-3xl" style={{ fontFamily: 'Optima, serif' }}>
                            Strategic resource allocation optimized: <span className="text-[#d4af37] font-medium">0.5 headcount</span> added for Data & Commercial domains, <span className="text-[#d4af37] font-medium">1.0 headcount</span> reinforcement for DWP & FIN, and <span className="text-[#d4af37] font-medium">1 Full Stack Developer</span> integrated into L3 team.
                        </h3>
                    </div>
                </div>
            </div>

            {/* 2. Main Updates Card (Refined Slim Style) */}
            <div className="bg-white rounded-3xl border border-[#d4af37]/20 p-12 shadow-xl relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0a1e40]"></div>

                <div className="flex items-center justify-between mb-16 pb-8 border-b border-slate-100">
                    <div>
                        <h3 className="text-2xl text-[#0a1e40] font-light tracking-[0.2em] uppercase" style={{ fontFamily: 'Optima, serif' }}>
                            L2 & L3 Resource Updates
                        </h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase font-black text-[#0a1e40] bg-slate-50 border border-slate-200 px-4 py-2 rounded-full tracking-widest shadow-sm">当前状态: 已趋于稳定</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-16">
                    {/* HR Transition Update */}
                    <div className="relative pl-12 border-l-2 border-[#d4af37]/30 transition-all hover:border-[#d4af37]">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#d4af37] shadow-sm"></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black text-[#8b7355] uppercase tracking-[0.3em]">HR 领域</span>
                        </div>
                        <h4 className="text-xl font-bold text-[#0a1e40] mb-4" style={{ fontFamily: 'Optima, serif' }}>Keen (12月13日离职) <ArrowRight className="inline mx-2 text-[#d4af37]" size={16} /> 刘泉 Rolo (12月16日入职)</h4>
                        <div className="text-sm text-slate-500 leading-relaxed grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <p className="flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
                                    <span>KT: <span className="font-bold text-slate-800">2周周期</span> — 已完成</span>
                                </p>
                                <p className="flex items-center gap-3">
                                    <RefreshCw className="text-blue-500 shrink-0" size={16} />
                                    <span>文档归档: <span className="font-bold text-slate-800">100% 资料已同步</span></span>
                                </p>
                            </div>
                            <div className="bg-[#fcfaf2] p-4 rounded-xl border border-[#d4af37]/10">
                                <p className="text-[10px] text-[#8b7355] font-black uppercase tracking-widest mb-2">连续性支持</p>
                                <p className="text-xs italic leading-snug"> Lena 作为 L2 备份支持了3周，确保在交接期间服务完全不中断。</p>
                            </div>
                        </div>
                    </div>

                    {/* L2 Updates */}
                    <div className="relative pl-12 border-l-2 border-[#d4af37]/30 transition-all hover:border-[#d4af37]">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#d4af37] shadow-sm"></div>
                        <div className="mb-8">
                            <span className="text-[10px] font-black text-[#8b7355] uppercase tracking-[0.3em]">L2 运维架构优化</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {[
                                { label: 'Data', val: '新增 0.5 个人', name: '海啸', icon: <Zap size={14} className="text-[#d4af37]" /> },
                                { label: 'Commercial', val: 'PA/CSP 整合', name: '俊磊', icon: <UserPlus size={14} className="text-[#d4af37]" /> },
                                { label: 'DWP', val: '新增 1 个人', name: '乔善', icon: <Sparkles size={14} className="text-[#d4af37]" /> },
                                { label: 'FIN', val: '新增 1 个人', name: '张燕', icon: <RefreshCw size={14} className="text-[#d4af37]" /> }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        {item.icon}
                                        <span className="text-[10px] font-black text-[#0a1e40] uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <p className="text-lg font-bold text-[#0a1e40] mb-1">{item.val}</p>
                                    <p className="text-[10px] text-[#8b7355] font-bold uppercase mb-2">{item.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* L3 Updates */}
                    <div className="relative pl-12 border-l-2 border-[#d4af37]/30 transition-all hover:border-[#d4af37]">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#d4af37] shadow-sm"></div>
                        <div className="mb-8">
                            <span className="text-[10px] font-black text-[#8b7355] uppercase tracking-[0.3em]">L3 工程与解决方案</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HR L3 整合</p>
                                <p className="text-lg font-bold text-[#0a1e40]">Eva Zhang</p>
                                <p className="text-xs text-slate-400">目前支持HR的BA & PM的工作</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">新入职</p>
                                <p className="text-lg font-bold text-[#0a1e40]">申演峰</p>
                                <p className="text-[10px] text-[#d4af37] font-black uppercase">全栈开发工程师</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center py-10">
                <p className="text-[10px] text-slate-300 uppercase tracking-[0.8em] italic">雅诗兰黛质量标准 • 全球 IT 运维集成</p>
            </footer>
        </div>
    );
};
