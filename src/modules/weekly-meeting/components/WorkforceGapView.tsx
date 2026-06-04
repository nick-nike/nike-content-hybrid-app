import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, ComposedChart, Area, Cell
} from 'recharts';
import { Users, AlertTriangle, TrendingDown, Target, CheckCircle2, Rocket, ArrowRight, Zap, ShieldCheck, BookOpen, Settings, Share2, ClipboardList, Database, Info, HelpCircle } from 'lucide-react';

const ASSIGNEE_PRODUCTIVITY = [
    { "name": "Keen Xu", "m10_count": 143, "m10_weight": 214.2, "m11_count": 157, "m11_weight": 178.8, "m12_count": 42, "m12_weight": 40.0, "avg_weight": 144.33, "utilization": 222.1, "note": "核心专家 / Rolo 接手前" },
    { "name": "Zhengguang Zhu", "m10_count": 76, "m10_weight": 64.0, "m11_count": 81, "m11_weight": 71.4, "m12_count": 134, "m12_weight": 110.8, "avg_weight": 82.07, "utilization": 126.3, "note": "核心主力" },
    { "name": "Kangsheng Shu", "m10_count": 116, "m10_weight": 59.2, "m11_count": 182, "m11_weight": 86.0, "m12_count": 180, "m12_weight": 76.8, "avg_weight": 74.0, "utilization": 113.8, "note": "核心主力" },
    { "name": "Shanshan Huang", "m10_count": 77, "m10_weight": 54.4, "m11_count": 95, "m11_weight": 82.0, "m12_count": 69, "m12_weight": 68.0, "avg_weight": 68.13, "utilization": 104.8, "note": "核心主力" },
    { "name": "Mingming Feng", "m10_count": 72, "m10_weight": 79.8, "m11_count": 82, "m11_weight": 86.6, "m12_count": 43, "m12_weight": 19.4, "avg_weight": 61.93, "utilization": 95.3, "note": "核心主力" },
    { "name": "Lena Zhou", "m10_count": 31, "m10_weight": 49.0, "m11_count": 31, "m11_weight": 45.2, "m12_count": 49, "m12_weight": 74.8, "avg_weight": 56.33, "utilization": 86.7, "note": "" },
    { "name": "Haixiao", "m10_count": 0, "m10_weight": 0.0, "m11_count": 36, "m11_weight": 25.0, "m12_count": 81, "m12_weight": 60.2, "avg_weight": 42.6, "utilization": 65.5, "note": "" },
    { "name": "Shan Qian", "m10_count": 109, "m10_weight": 33.6, "m11_count": 138, "m11_weight": 52.0, "m12_count": 92, "m12_weight": 29.6, "avg_weight": 38.4, "utilization": 59.1, "note": "" },
    { "name": "Jennie", "m10_count": 123, "m10_weight": 31.0, "m11_count": 128, "m11_weight": 31.2, "m12_count": 154, "m12_weight": 39.6, "avg_weight": 33.93, "utilization": 52.2, "note": "" },
    { "name": "Ruizi Hu", "m10_count": 104, "m10_weight": 30.2, "m11_count": 77, "m11_weight": 37.2, "m12_count": 26, "m12_weight": 19.2, "avg_weight": 28.87, "utilization": 44.4, "note": "FIN Project Ops" },
    { "name": "Rolo", "m10_count": 0, "m10_weight": 0.0, "m11_count": 0, "m11_weight": 0.0, "m12_count": 24, "m12_weight": 23.6, "avg_weight": 23.6, "utilization": 36.3, "note": "Keen Substitution (12月)" },
    { "name": "Yan Zhang", "m10_count": 0, "m10_weight": 0.0, "m11_count": 31, "m11_weight": 8.6, "m12_count": 72, "m12_weight": 27.6, "avg_weight": 18.1, "utilization": 27.8, "note": "FIN Project Ops" },
    { "name": "Junlei", "m10_count": 0, "m10_weight": 0.0, "m11_count": 0, "m11_weight": 0.0, "m12_count": 22, "m12_weight": 15.6, "avg_weight": 15.6, "utilization": 24.0, "note": "支持 Junlei 协同" }
];

const EFFICIENCY_GOAL = [
    { stage: '当前状态 (Stabilization)', staff: 12, status: '盈余缓冲期', desc: '应对系统波动与知识沉淀', color: '#64748b' },
    { stage: '优化阶段 (Optimization)', staff: 10, status: '效能提升期', desc: 'SOP固化与自动化上线', color: '#d4af37' },
    { stage: '目标状态 (Target State)', staff: 8.5, status: '稳健交付期', desc: '全自动监控与极致人效', color: '#059669' },
];

const TRANSFORMATION_STRATEGY = [
    {
        title: "知识库补齐 (KB Enrichment)",
        icon: <BookOpen className="text-blue-500" />,
        desc: "对 10-12 月 2,979 个工单进行特征提取，将隐性经验显性化。目标：将复杂工单的『查阅与确认时间』降低 30%。",
        points: ["建立 CSP/DWP 疑难案例库", "专家协同处理流程记录"]
    },
    {
        title: "SOP 标准化 (Standardization)",
        icon: <ClipboardList className="text-emerald-500" />,
        desc: "针对高频出现的『重跑、配置、审批』类 1137 个工单，制定 100% 覆盖的 SOP。减少因操作不规范导致的反复。",
        points: ["ETL 失败重跑标准化脚本", "门店权限申请秒级闭环"]
    },
    {
        title: "系统级优化 (Root Cause Fix)",
        icon: <Settings className="text-amber-500" />,
        desc: "通过 Data Factory 自动监控与 CT 报错自动修复，从系统层面『消灭』重复性工单。减少业务总 Weight 分母。",
        points: ["自动化 Pipeline 预警", "典型 Bug 系统级补丁"]
    },
    {
        title: "单枪能效倍增 (Capability Tiering)",
        icon: <Share2 className="text-purple-500" />,
        desc: "通过 Backup Plan 与模块轮换，培养具备全栈 L2 能力的多面手，实现人员从 12 到 8.5 的高质量平替。",
        points: ["跨模块联合保障机制", "核心成员重心向架构倾斜"]
    }
];

export const WorkforceGapView: React.FC = () => {
    const [showFormula, setShowFormula] = useState(false);

    return (
        <div className="space-y-10 pb-10">
            {/* 1. Executive Verdict - 核心结论 */}
            <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-[#0a1e40] p-10 text-white relative">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <ShieldCheck size={180} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-light tracking-widest mb-4" style={{ fontFamily: 'Optima, serif' }}>EXECUTIVE VERDICT</h2>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex-1">
                                <p className="text-xl leading-relaxed text-slate-100">
                                    目前 12 人配置处于 <span className="text-[#d4af37] font-bold">“资源投入与能效转化期” (Resource Investment Phase)</span>。
                                </p>
                                <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-3xl">
                                    数据实证：团队产出呈现明显的**梯队化**特征。那 5 名核心成员解决了 Q4 约 **67%** 的总业务分值。
                                    这意味着剩下的 7 名成员（包含后期进场保障 FIN 项目的成员）目前主要在进行**知识沉淀与项目保障**，存在巨大的效能释放空间。
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center shrink-0">
                                <div className="text-[10px] uppercase tracking-widest text-[#d4af37] mb-1">人力资源评估</div>
                                <div className="text-4xl font-light text-white uppercase">Over</div>
                                <div className="text-[10px] text-slate-400 mt-1 uppercase">Investment Padding</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1.1 Data Evidence Matrix - 生产力证据矩阵 */}
                <div className="p-8 bg-white overflow-x-auto">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <div className="flex items-center gap-2">
                            <Database className="text-[#0a1e40]" size={20} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#0a1e40]">Productivity Evidence Matrix (Q4 详细数据)</h3>
                        </div>
                        <button
                            onClick={() => setShowFormula(!showFormula)}
                            className="flex items-center gap-2 text-[10px] bg-slate-100 px-3 py-1.5 rounded-full font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                        >
                            <HelpCircle size={14} /> {showFormula ? '收起公式' : '查看计算公式'}
                        </button>
                    </div>

                    {showFormula && (
                        <div className="mb-6 mx-2 p-6 bg-[#fcfaf2] rounded-2xl border border-[#d4af37]/20 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8b7355] mb-3">公式 1: 工单加权权重 (Weight)</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        基于难度系数计算：<br />
                                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-100 text-[#0a1e40]">
                                            Weight = Simple(0.2) + Medium(1.0) + Complex(4.0)
                                        </span>
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-2 italic">示例：Keen 10月处理了 28 个 Complex (28*4=112) 和 99 个 Medium (99*1=99)，合计即为 214.2。</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8b7355] mb-3">公式 2: 利用率基准 (65 Units)</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                        核心基准由 Senior Lead 基于行业标准设定：<br />
                                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-100 text-[#0a1e40]">
                                            Monthly Capacity = 65 Weight Units
                                        </span>
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-2 italic">依据：22个工作日/月，每日稳健产出约 3.0-3.5 权重（相当于处理 3 个中等工单），此为 L2 高质量持续交付的红线。</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400">
                                <th className="px-6 py-4 rounded-tl-xl">运维人员 / 所属角色</th>
                                <th className="px-6 py-4 text-center">10月 (Count/Weight)</th>
                                <th className="px-6 py-4 text-center">11月 (Count/Weight)</th>
                                <th className="px-6 py-4 text-center">12月 (Count/Weight)</th>
                                <th className="px-6 py-4 text-center">月均分值 (Weight)</th>
                                <th className="px-6 py-4 text-center rounded-tr-xl">利用率 (Vs 65)</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-slate-100">
                            {ASSIGNEE_PRODUCTIVITY.map((person, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[#0a1e40]">{person.name}</div>
                                        <div className="text-[9px] text-slate-400 uppercase font-medium">{person.note || '\u00A0'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500">
                                        {person.m10_count || '-'} / <span className="font-medium text-slate-800">{person.m10_weight ? person.m10_weight.toFixed(1) : '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500">
                                        {person.m11_count || '-'} / <span className="font-medium text-slate-800">{person.m11_weight ? person.m11_weight.toFixed(1) : '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-500">
                                        {person.m12_count || '-'} / <span className="font-medium text-slate-800">{person.m12_weight ? person.m12_weight.toFixed(1) : '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-black text-[#0a1e40] bg-slate-50/30">
                                        {person.avg_weight}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${person.utilization > 100 ? 'bg-indigo-600' : person.utilization > 80 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                                    style={{ width: `${Math.min(person.utilization, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`font-bold w-10 text-right ${person.utilization > 80 ? 'text-slate-800' : 'text-slate-400'}`}>
                                                {person.utilization}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl flex items-start gap-4 border border-blue-100">
                        <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
                        <div className="text-[11px] text-blue-700 leading-relaxed font-medium">
                            <span className="font-bold">深度论证：</span>
                            Q4 累计产出显示团队贡献呈 **Pareto (帕累托) 分布**：仅 5 名核心效能专家（占比 38% 的人数）完成了全队 **67%** 的业务分值。
                            这证明了目前的 12 人配置并非“均衡产出”，而是典型的“以老带新、以人补口”模式。
                            随着后期进场保障 FIN 项目的成员（如 Yan Zhang, Ruizi）及替补成员（如 Rolo）完成知识闭环，团队具备缩减至 8.5 人并保持同等产出的**客观潜力**。
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-slate-100/30">
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-lg font-bold text-[#0a1e40] flex items-center gap-2">
                                <Rocket className="text-[#d4af37]" size={20} /> 优化愿景：从 12 到 8.5 的人效飞跃
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {EFFICIENCY_GOAL.map((step, i) => (
                                    <div key={i} className={`p-6 rounded-3xl border transition-all duration-500 ${i === 2 ? 'bg-[#fffdf5] border-[#d4af37] shadow-lg scale-105' : 'bg-white border-slate-200 opacity-70'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black" style={{ backgroundColor: step.color }}>
                                                {step.staff}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b7355]">{step.status}</span>
                                        </div>
                                        <h4 className="text-sm font-black text-[#0a1e40] mb-2">{step.stage}</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Transformation Strategy - 具体落地手段 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TRANSFORMATION_STRATEGY.map((item, i) => (
                    <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h4 className="text-sm font-black text-[#0a1e40] mb-3">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-6 h-16">{item.desc}</p>
                        <ul className="space-y-2">
                            {item.points.map((p, pi) => (
                                <li key={pi} className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                    <div className="w-1 h-1 bg-[#d4af37] rounded-full"></div>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 3. Seasonality Context - 补充支撑论证 */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-[#fcfaf2] flex justify-between items-center">
                    <div>
                        <h3 className="text-xl text-[#0a1e40] font-medium" style={{ fontFamily: 'Optima, serif' }}>
                            支撑论证：为何现在多出的 3.5 人是“必要投入”
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                            Current Inefficiency vs Support Resilience
                        </p>
                    </div>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-rose-600 mb-2">
                            <AlertTriangle size={20} />
                            <span className="text-sm font-bold">新项目切换“沟通税”</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Q4 期间，尤其是新进保障 FIN 项目的成员，在业务逻辑不清晰的情况下，单张工单沟通时长高出平均 25%。多出的人力正在“肉搏”沟通缺口。
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-amber-600 mb-2">
                            <Zap size={20} />
                            <span className="text-sm font-bold">知识断层补偿 (Learning Curve)</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            由于 Rolo 为 12 月新入职替补 Keen，Yan Zhang 也处于项目磨合期，目前的 12 名成员中约 1/3 处于“生产代培训”状态，这种冗余确保了交接期的系统稳定。
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-600 mb-2">
                            <ShieldCheck size={20} />
                            <span className="text-sm font-bold">Q4 高风险期弹性保障</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            双 11、双 12 及年底财务月结周期叠加，多出的人力确保了在核心成员满载时，长尾工单依然能得到及时响应，守住了 SLA 100% 达成。
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
