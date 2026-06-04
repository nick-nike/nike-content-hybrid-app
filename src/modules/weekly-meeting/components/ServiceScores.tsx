import React from 'react';
import { ShieldAlert, CheckCircle, Award, TrendingUp, Search, MessageSquare, Wrench, Users, Sparkles } from 'lucide-react';

const SUMMARY_GROUPS = [
    { label: "卓越标杆 (Benchmark Excellence 10)", domains: ["FIN", "SC"], color: "platinum" },
    { label: "稳健运行 (Steady Performance 8-9)", domains: ["DWP"], color: "emerald" },
    { label: "及格/磨合期 (Average 6-7)", domains: ["Brand", "Data", "PA"], color: "amber" },
    { label: "高危/需改进 (High Risk ≤5)", domains: ["HR"], color: "rose" }
];

const SCORE_DATA = [
    { domain: "FIN", response: 10, processing: 10, quality: 10, comms: 10, delivery: 10, skills: 10, stability: 10, avg: 10.0, status: 'benchmark' },
    { domain: "SC", response: 10, processing: 10, quality: 10, comms: 10, delivery: 10, skills: 10, stability: 10, avg: 10.0, status: 'benchmark' },
    { domain: "DWP", response: 8, processing: 8, quality: 8, comms: 8, delivery: 8, skills: 8, stability: 9, avg: 8.1, status: 'steady' },
    { domain: "Brand", response: 7, processing: 7, quality: 7, comms: 7, delivery: 7, skills: 7, stability: 6, avg: 6.9, status: 'avg' },
    { domain: "Data", response: 6, processing: 7, quality: 8, comms: 8, delivery: 6, skills: 7, stability: 4, avg: 6.6, status: 'avg' },
    { domain: "PA", response: 7, processing: 7, quality: 7, comms: 7, delivery: 7, skills: 7, stability: 4, avg: 6.6, status: 'avg' },
    { domain: "HR", response: 7, processing: 5, quality: 7, comms: 6, delivery: 5, skills: 5, stability: 3, avg: 5.4, status: 'risk' }
];

const getScoreStyle = (score: number) => {
    if (score >= 10) return 'text-[#ac9362] font-black drop-shadow-sm';
    if (score >= 8) return 'text-emerald-700 font-bold';
    if (score >= 7) return 'text-slate-700 font-medium';
    if (score >= 6) return 'text-amber-700';
    return 'text-rose-700 font-bold';
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'benchmark': return <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-[#ac9362] text-white">Benchmark</span>;
        case 'steady': return <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-emerald-100 text-emerald-700">Steady</span>;
        case 'avg': return <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500">Average</span>;
        case 'risk': return <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-rose-100 text-rose-700 animate-pulse">Critical Risk</span>;
        default: return null;
    }
};

export const ServiceScores: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-1000">

            {/* 1. Executive Performance Tier List */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {SUMMARY_GROUPS.map((group, idx) => (
                    <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border-t-4 transition-all duration-300 hover:shadow-md ${group.color === 'platinum' ? 'border-t-[#ac9362] bg-gradient-to-b from-white to-[#fcfaf8]' :
                        group.color === 'emerald' ? 'border-t-emerald-500' :
                            group.color === 'amber' ? 'border-t-amber-400' :
                                'border-t-rose-500'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">{group.label}</h3>
                            {group.color === 'platinum' && <Award size={14} className="text-[#ac9362]" />}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {group.domains.map((d, didx) => (
                                <span key={didx} className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider transition-colors border ${group.color === 'platinum' ? 'bg-[#ac9362] text-white border-[#ac9362]' :
                                    group.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        group.color === 'amber' ? 'bg-slate-50 text-slate-600 border-slate-100' :
                                            'bg-rose-50 text-rose-700 border-rose-100'
                                    }`}>
                                    {d}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Main Performance Radar Table */}
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-[#e6dcc5] overflow-hidden">
                <div className="p-10 bg-[#0b1f42] text-white flex justify-between items-center group">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="text-[#ac9362] w-5 h-5" />
                            <h2 className="text-2xl font-light tracking-[0.15em] uppercase" style={{ fontFamily: "'Optima', serif" }}>Service Delivery Matrix</h2>
                        </div>
                        <p className="text-[10px] text-[#ac9362] uppercase tracking-[0.4em] font-medium opacity-80">Execution Performance Index • Q4 Review</p>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[32px] font-serif italic text-[#ac9362]">98%</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-60">Avg. SLA Consistency</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse">
                        <thead>
                            <tr className="bg-[#fbfaf8] text-[9px] uppercase font-black tracking-[0.2em] text-[#ac9362] border-b border-[#e6dcc5]">
                                <th className="px-8 py-6 text-left w-[180px]">System Domain</th>
                                <th className="px-4 py-6">响应速度</th>
                                <th className="px-4 py-6">处理速度</th>
                                <th className="px-4 py-6">解决质量</th>
                                <th className="px-4 py-6">沟通能力</th>
                                <th className="px-4 py-6">交付表现</th>
                                <th className="px-4 py-6">专业技能</th>
                                <th className="px-4 py-6">团队稳定性</th>
                                <th className="px-8 py-6 bg-[#f7f3e8] text-[#0b1f42] border-l border-[#e6dcc5]">核心绩效</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {SCORE_DATA.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-[#fcfaf2]/50 transition-all duration-300">
                                    <td className="px-8 py-6 text-left">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-[#0b1f42] tracking-tight">{row.domain}</span>
                                            {getStatusBadge(row.status)}
                                        </div>
                                    </td>
                                    <td className={`px-4 py-6 text-base font-serif ${getScoreStyle(row.response)}`}>{row.response}</td>
                                    <td className={`px-4 py-6 text-base font-serif ${getScoreStyle(row.processing)}`}>{row.processing}</td>
                                    <td className={`px-4 py-6 text-base font-serif ${getScoreStyle(row.quality)}`}>{row.quality}</td>
                                    <td className={`px-4 py-6 text-base font-serif ${getScoreStyle(row.comms)}`}>{row.comms}</td>
                                    <td className={`px-4 py-6 text-base font-serif ${getScoreStyle(row.delivery)}`}>{row.delivery}</td>
                                    <td className={`px-4 py-6 text-base font-serif ${getScoreStyle(row.skills)}`}>{row.skills}</td>
                                    <td className={`px-4 py-6 text-base font-serif ${getScoreStyle(row.stability)}`}>{row.stability}</td>
                                    <td className="px-8 py-6 border-l border-[#e6dcc5] bg-[#fdfcf8]">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className={`text-xl font-black ${getScoreStyle(row.avg)}`}>
                                                {row.avg.toFixed(1)}
                                            </span>
                                            <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${row.avg >= 9 ? 'bg-[#ac9362]' : row.avg >= 8 ? 'bg-emerald-500' : row.avg >= 6 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                                    style={{ width: `${row.avg * 10}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Executive Observations & Risk Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Critical Issues */}
                <div className="bg-white p-10 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500/80"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <ShieldAlert className="text-rose-500 w-5 h-5" />
                        <h3 className="text-lg font-bold tracking-tight text-[#0b1f42] uppercase">Critical Risks & Blockers</h3>
                    </div>
                    <ul className="space-y-8">
                        {[
                            {
                                domain: "HR (Stability 3)",
                                issue: "3个月内更换2人，KT不完善导致SLA受损。",
                                action: "建立轮岗SOP与闭环KT体系，刘泉入职后强化业务理解培训。"
                            },
                            {
                                domain: "Data & PA (Stability 4)",
                                issue: "响应滞后(6分)，“闷头调研”导致用户误以为丢单。",
                                action: "启动‘30分钟响应制’与‘日终三查’(SNOW/Email/Teams)，强制反馈状态。"
                            }
                        ].map((risk, i) => (
                            <li key={i} className="group/item">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-rose-700 uppercase">{risk.domain}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Urgent Fix</span>
                                </div>
                                <p className="text-sm font-bold text-[#0b1f42] mb-1">{risk.issue}</p>
                                <p className="text-xs text-slate-500 leading-relaxed italic">{risk.action}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Growth & Stability */}
                <div className="bg-white p-10 rounded-3xl border border-[#e6dcc5] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ac9362]"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="text-[#ac9362] w-5 h-5" />
                        <h3 className="text-lg font-bold tracking-tight text-[#0b1f42] uppercase">Optimization & Continuity</h3>
                    </div>
                    <ul className="space-y-8">
                        {[
                            {
                                domain: "DWP (Potential)",
                                issue: "周远表现出色获得PO高度认可，但需补齐泛微原生配置短板。",
                                action: "开启跨系统Cross-KT，将DWP稳定性经验(9分)推广至其他Domain。"
                            },
                            {
                                domain: "FIN & SC (Benchmark)",
                                issue: "端姿、朱争光、姗姗表现完美，属于核心质量保障点。",
                                action: "建立‘Lead Shadowing’机制，由标杆人员指导HR/Data新人解决复杂问题。"
                            }
                        ].map((item, i) => (
                            <li key={i} className="group/item">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-[#8b7355] uppercase">{item.domain}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Growth Plan</span>
                                </div>
                                <p className="text-sm font-bold text-[#0b1f42] mb-1">{item.issue}</p>
                                <p className="text-xs text-slate-500 leading-relaxed italic">{item.action}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <footer className="text-center py-10">
                <p className="text-[10px] text-slate-300 uppercase tracking-[0.8em] italic">雅诗兰黛质量标准 • 全球 IT 运维集成</p>
            </footer>
        </div>
    );
};

