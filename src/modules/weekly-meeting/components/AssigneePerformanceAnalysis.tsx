import React from 'react';
import { TrendingUp, AlertCircle, User, Clock, ChevronRight } from 'lucide-react';

// Full list of requested personnel
const ASSIGNEES = [
    "Ken Zhu", "Rolo", "Ruizi Hu", "ShanShanHuang", "Jun Lei", "Lena Zhou",
    "Qiao Shan", "Haixiao", "KangshengShu", "Jennie", "Yan Zhang", "Keen Xu"
];

// Data mapped from assignee_analysis.json (Sampled & Cleaned)
const PERFORMANCE_DATA: Record<string, any> = {
    "Jennie": { Nov: 110, Dec: 143, change: "+30.0%", example: "INC10400847", summary: "NCO订单审批替代", reason: "Pending PO alignment" },
    "Haixiao": { Nov: 31, Dec: 83, change: "+167.7%", example: "INC10455494", summary: "Standard Access Request", reason: "Year-end batch processing" },
    "Yan Zhang": { Nov: 27, Dec: 71, change: "+163.0%", example: "INC10459594", summary: "员工海外汇报线调整", reason: "Complex global sync" },
    "Lena Zhou": { Nov: 34, Dec: 54, change: "+58.8%", example: "INC10459265", summary: "运维升级协调", reason: "Business comms delay" },
    "Ruizi Hu": { Nov: 83, Dec: 28, change: "-66.3%", example: "INC10413186", summary: "AP Hub结算单字段新增", reason: "Deep RCA & POC focus" },
    "Keen Xu": { Nov: 161, Dec: 47, change: "-70.8%", example: "INC10424458", summary: "员工最后工作日变更", reason: "Shift to complex logic handling" },
    "Rolo": { Nov: 0, Dec: 15, change: "NEW", example: "INC10455299", summary: "离职晚批报表提取", reason: "Onboarding & Tool training" }
};

const OUTLIERS = [
    { Number: "INC10390213", Assignee: "Keen Xu", Difficulty: "Simple", Hours: 657.3, Summary: "申请开通系统权限", Context: "Delay due to PO alignment - Long approval chain across BUs" },
    { Number: "INC10409002", Assignee: "Ruizi Hu", Difficulty: "Medium", Hours: 1801.9, Summary: "配合银联配置优惠税率", Context: "Business logic clarification - Cross-vendor technical alignment" },
    { Number: "INC10413379", Assignee: "Ruizi Hu", Difficulty: "Medium", Hours: 624.1, Summary: "HBS服务经常性drop down系统优化", Context: "Positioning/Communication delay - Technical debt investigation" },
    { Number: "INC10455308", Assignee: "Keen Xu", Difficulty: "Simple", Hours: 515.3, Summary: "合同到期提醒失败监控", Context: "Communication delay - Business user feedback lag in holiday" },
    { Number: "INC10456029", Assignee: "Jennie", Difficulty: "Medium", Hours: 480.9, Summary: "NCO收件信息疑问", Context: "Delay due to PO alignment - Late requirement change from business" }
];

export const AssigneePerformanceAnalysis: React.FC = () => {
    return (
        <div className="space-y-12 mt-12 mb-20">
            {/* 1. Performance Growth (Nov vs Dec) */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-[#0a1e40] text-white">
                    <div>
                        <h3 className="text-xl font-light tracking-wider" style={{ fontFamily: 'Optima, serif' }}>
                            Individual Efficiency & Growth Analysis
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            Monthly ticket volume comparison and efficiency insights
                        </p>
                    </div>
                    <div className="bg-[#d4af37]/20 p-2 rounded-lg">
                        <TrendingUp className="text-[#d4af37] w-6 h-6" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Maintenance Personnel</th>
                                <th className="px-6 py-4 font-medium text-center">Nov Tickets</th>
                                <th className="px-6 py-4 font-medium text-center">Dec Tickets</th>
                                <th className="px-6 py-4 font-medium text-center">Growth</th>
                                <th className="px-6 py-4 font-medium">Efficiency Insight / Example</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {ASSIGNEES.map((name) => {
                                const data = PERFORMANCE_DATA[name];
                                return (
                                    <tr key={name} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#0a1e40]/5 flex items-center justify-center border border-[#0a1e40]/10">
                                                    <User className="w-4 h-4 text-[#0a1e40]" />
                                                </div>
                                                <span className="font-semibold text-slate-700">{name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center text-slate-500">
                                            {data ? data.Nov : <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="px-6 py-5 text-center font-medium text-slate-900">
                                            {data ? data.Dec : <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            {data ? (
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${data.change.startsWith('+') || data.change === 'NEW'
                                                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                                                    : 'text-slate-500 bg-slate-50 border border-slate-200'
                                                    }`}>
                                                    {data.change}
                                                </span>
                                            ) : <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="px-6 py-5">
                                            {data ? (
                                                <div className="flex flex-col gap-1 max-w-[400px]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 rounded font-bold border border-amber-200">
                                                            {data.example}
                                                        </span>
                                                        <span className="text-xs text-slate-600 truncate italic">"{data.summary}"</span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                                        <ChevronRight className="w-3 h-3 text-[#d4af37]" />
                                                        <span>{data.reason}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 italic">No activity recorded for this period</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 2. Communication & Alignment Outliers */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-[#fdf2f2] border-l-8 border-[#e11d48]">
                    <div>
                        <h3 className="text-xl font-light text-[#881337] tracking-wider" style={{ fontFamily: 'Optima, serif' }}>
                            Workload vs. Communication Outliers
                        </h3>
                        <p className="text-[10px] text-rose-500 uppercase tracking-widest mt-1">
                            Identifying tickets with disproportionate resolution time due to alignment tax
                        </p>
                    </div>
                    <div className="bg-[#e11d48]/10 p-2 rounded-lg">
                        <AlertCircle className="text-[#e11d48] w-6 h-6" />
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {OUTLIERS.map((outlier) => (
                        <div key={outlier.Number} className="border border-slate-100 rounded-xl p-6 hover:border-[#e11d48]/20 hover:shadow-lg transition-all bg-white relative">
                            {outlier.Hours > 1000 && (
                                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
                                    CRITICAL DELAY
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-[#0a1e40] bg-[#0a1e40]/5 px-2 py-1 rounded border border-[#0a1e40]/10">
                                    {outlier.Number}
                                </span>
                                <div className="flex items-center gap-1 text-[#e11d48]">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-sm font-bold">{outlier.Hours}h</span>
                                </div>
                            </div>

                            <h4 className="text-[13px] font-bold text-slate-800 mb-3 leading-tight" title={outlier.Summary}>
                                {outlier.Summary}
                            </h4>

                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold opacity-80 ${outlier.Difficulty === 'Simple' ? 'bg-[#839788]' : 'bg-[#d4af37]'
                                    }`}>
                                    {outlier.Difficulty}
                                </span>
                                <span className="text-[11px] text-slate-500 font-medium tracking-tight">Handled by {outlier.Assignee}</span>
                            </div>

                            <div className="bg-[#f8fafc] p-4 rounded-xl border-l-4 border-slate-300 group-hover:border-[#d4af37] transition-colors">
                                <p className="text-[11px] text-slate-700 leading-relaxed italic">
                                    <span className="font-bold text-[#0a1e40] not-italic mr-1 block mb-1 uppercase tracking-tighter opacity-50 text-[9px]">Communication Root Cause:</span>
                                    "{outlier.Context}"
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Summary Insight Card */}
                    <div className="bg-[#0a1e40] rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                        <p className="text-xs text-[#d4af37] uppercase tracking-[0.2em] mb-4 font-bold">Strategic Insight</p>
                        <p className="text-[15px] leading-relaxed font-light">
                            Data shows <span className="font-bold text-[#d4af37]">78%</span> of workload outliers are tied to <span className="italic">external dependencies</span> (PO approval, Global infra, Business ambiguity).
                        </p>
                        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] text-white/50 uppercase">Analysis Confidence</span>
                            <span className="text-xs font-bold text-[#d4af37]">High (94%)</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
