import React from 'react';
import {
    Flag,
    Zap,
    ShieldAlert,
    CheckCircle2,
    History,
    Target,
    Award,
    Mail,
    Clock,
    Terminal,
    ArrowRight,
    Search,
    Lightbulb
} from 'lucide-react';

export const SuccessCaseView: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-5xl mx-auto pb-20" style={{ fontFamily: 'Optima, serif' }}>

            {/* Project Header */}
            <div className="relative overflow-hidden bg-[#0a1e40] rounded-[2rem] p-12 text-white shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full">
                            <Zap size={14} className="text-[#d4af37]" />
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#d4af37]">Global Technology Upgrade</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight">
                            Global Log System <br />
                            <span className="font-bold text-[#d4af37]">Migration Success</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl font-light leading-relaxed">
                            A high-stakes transition of 80+ services from Splunk to Grafana, executed with zero buffer and high external uncertainty.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[120px]">
                            <h3 className="text-3xl font-black text-[#d4af37] mb-1">80+</h3>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400">Services</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[120px]">
                            <h3 className="text-3xl font-black text-emerald-400 mb-1">Q1</h3>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400">Completion</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* STAR Content Grid */}
            <div className="grid grid-cols-1 gap-10">

                {/* 1. Situation & Challenge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 flex flex-col relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <History size={80} />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0a1e40]">
                                <Flag size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#0a1e40]">Situation</h2>
                                <p className="text-[10px] uppercase tracking-widest text-[#ac9362]">Contextual Background</p>
                            </div>
                        </div>
                        <div className="space-y-6 text-slate-600 leading-relaxed text-[15px]">
                            <p>
                                负责 <span className="font-bold text-[#0a1e40]">Nike GC MarTech</span> 全球技术升级，迁移涉及 80 多个核心服务（包括 **EC2、ECS 和 Lambda**）。
                            </p>
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-[#0a1e40]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock size={14} className="text-[#0a1e40]" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Constraint</span>
                                    </div>
                                    <p className="text-xs">Splunk License 2025年2月到期</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-rose-500">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ShieldAlert size={14} className="text-rose-500" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Critical Warning</span>
                                    </div>
                                    <p className="text-xs text-rose-700 font-bold">必须在 RCW (Restrict Critical Warning) 封板期前上线</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 flex flex-col relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldAlert size={80} />
                        </div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                                <Search size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#0a1e40]">Challenge</h2>
                                <p className="text-[10px] uppercase tracking-widest text-[#ac9362]">The Obstacles</p>
                            </div>
                        </div>
                        <div className="space-y-6 text-slate-600 leading-relaxed text-[15px]">
                            <p className="font-medium text-rose-800 bg-rose-50/50 p-4 rounded-xl border border-rose-100 italic">
                                "External dependency 极不稳定，Global 方案反复变更，导致进度 **Delay 了 4.5 周**。"
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 mt-1">
                                        <ArrowRight size={12} />
                                    </div>
                                    <p className="text-sm"><span className="font-bold">12月5日：</span> 方案突然要求全部 **re-assess**</p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 mt-1">
                                        <ArrowRight size={12} />
                                    </div>
                                    <p className="text-sm"><span className="font-bold">12月9日：</span> 临时要求集成 **Token Manager**</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 2. Action - Full Width Horizontal */}
                <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-slate-100 relative group overflow-hidden">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Target size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-[#0a1e40]">Strategic Action</h2>
                            <p className="text-[10px] uppercase tracking-widest text-[#ac9362]">Passive Waiting → Proactive Control</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ActionCard
                            num="01"
                            title="Evidence-based Call Out"
                            desc="Weekly report 量化耗时，明确变更带来的 Risk，确保所有 Stakeholders 理解延迟根源。"
                        />
                        <ActionCard
                            num="02"
                            title="Formal Protocol"
                            desc="与 Global 约定：只有收到 Final Solution 正式邮件才开启生产操作，杜绝 Endless Rework。"
                        />
                        <ActionCard
                            num="03"
                            title="Proactive Preparation"
                            desc="等待期间提前进行大量 Performance Test，验证低风险服务，拉满后续执行效率。"
                        />
                        <ActionCard
                            num="04"
                            title="Scale the Methodology"
                            desc="将验证成功的标准流程（SOP）分享给其他团队，带动整个部门整体提速。"
                        />
                    </div>
                </div>

                {/* 3. Result - Premium Banner */}
                <div className="bg-emerald-900 rounded-[2rem] p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                    <Award size={24} className="text-emerald-400" />
                                </div>
                                <h2 className="text-3xl font-bold">The Result</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xl text-emerald-50/80 font-light leading-relaxed">
                                    不仅追回了 4.5 周的延误，还 <span className="text-emerald-300 font-bold underline decoration-emerald-500/50">提前一个月</span> 完成了所有迁移任务。
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                                    项目最终完美避开了 RCW 封板期，实现平滑上线。由于交付质量卓越，在 6 月获得了 **Global Leadership 公开表扬**。
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircle2 size={40} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-1">Status</p>
                                <h3 className="text-2xl font-black uppercase">Excellence</h3>
                                <p className="text-xs text-emerald-100/60 mt-2">Certified Global Success</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Quote / Professional Footer */}
                <div className="flex justify-center pt-8">
                    <div className="text-center max-w-2xl px-8">
                        <div className="w-12 h-1 bg-[#d4af37] mx-auto mb-6 opacity-30"></div>
                        <p className="text-slate-400 italic text-sm leading-relaxed">
                            "This project demonstrated that when PMs shift from passive execution to proactive risk management, even severe external delays can be overcome through strategic methodology."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ActionCard = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500 group">
        <div className="text-3xl font-black text-slate-200 group-hover:text-[#d4af37]/20 transition-colors mb-4">{num}</div>
        <h3 className="text-lg font-bold text-[#0a1e40] mb-3 group-hover:text-[#0a1e40]">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
);
