import React from 'react';
import {
    TrendingDown,
    TrendingUp,
    Users,
    DollarSign,
    ChevronRight,
    Target,
    ShieldCheck,
    Briefcase
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend, AreaChart, Area
} from 'recharts';

// 数据准备：根据截图和描述整理
const COST_PROJECTION_DATA = [
    { month: '3月', originalCost: 64513.12, optimizationCost: 23776.49, savings: 40736.63, margin: 63.1 },
    { month: '4月', originalCost: 64513.12, optimizationCost: 23776.49, savings: 40736.63, margin: 63.1 },
    { month: '5月', originalCost: 64513.12, optimizationCost: 23776.49, savings: 40736.63, margin: 63.1 },
    { month: '6月', originalCost: 64513.12, optimizationCost: 23776.49, savings: 40736.63, margin: 63.1 },
    { month: '7月', originalCost: 58225.51, optimizationCost: 23776.50, savings: 34449.01, margin: 59.1 },
];

const PERSONNEL_CHANGES = [
    {
        role: 'L2 Support Lead',
        old: 'Suzy (Rate: 248.16)',
        new: 'Jennie (Rate: 133.63)',
        reduction: '46%',
        date: '3月1日',
        note: 'Jennie接替高成本资源，性价比提升1倍'
    },
    {
        role: 'L3 Developer',
        old: '冯明明 (Rate: 257.15)',
        new: 'Roll-off (出项)',
        reduction: '100%',
        date: '3月中上旬',
        note: '项目人员精简，功能进入维护期稳定化'
    },
    {
        role: 'Data Support',
        old: 'Jerry (Rate: 145.77)',
        new: 'Haixiao (Rate: 79.9)',
        reduction: '45%',
        date: '3月13日',
        note: 'Haixiao跨团队支持，成本降低2倍多'
    }
];

export const CostOptimizationReport: React.FC = () => {
    return (
        <div className="bg-[#fcfcfc] min-h-screen text-[#0a1e40] font-sans pb-20">
            <main className="max-w-6xl mx-auto py-12 px-6 space-y-12">
                {/* 核心指标概览 */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="预计月度结余 (AVG)"
                        value="￥40,736"
                        sub="较原计划降低 63%"
                        icon={<TrendingDown className="text-emerald-500" />}
                    />
                    <StatCard
                        title="关键资源替换"
                        value="3人次"
                        sub="高成本资源平滑切换"
                        icon={<Users className="text-[#d4af37]" />}
                    />
                    <StatCard
                        title="管理边际优化"
                        value="15%+"
                        sub="PM接管技术沟通成本"
                        icon={<ShieldCheck className="text-indigo-500" />}
                    />
                    <StatCard
                        title="累计节省预测 (H1)"
                        value="￥197,395"
                        sub="至7月累计盈余"
                        icon={<DollarSign className="text-emerald-600" />}
                    />
                </section>

                {/* 1. 成本改进计划 */}
                <section className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-2xl font-medium flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-[#d4af37]"></div> 1. 成本改进计划 (Cost Improvement)
                        </h2>
                        <Briefcase className="opacity-20 text-[#0a1e40]" size={32} />
                    </div>
                    <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Personnel Structure Optimization</h3>
                            {PERSONNEL_CHANGES.map((item, i) => (
                                <div key={i} className="group relative pl-6 border-l-2 border-slate-100 hover:border-[#d4af37] transition-colors">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-[#d4af37]"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-lg font-semibold">{item.role}</span>
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">-{item.reduction}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                                        <span className="line-through">{item.old}</span>
                                        <ChevronRight size={14} />
                                        <span className="text-[#0a1e40] font-medium">{item.new}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 italic font-light">{item.note} ({item.date})</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#0a1e40] rounded-2xl p-8 text-white">
                            <h3 className="text-lg font-light tracking-widest uppercase mb-6 text-[#d4af37]">管理与技术协同优化</h3>
                            <div className="space-y-6">
                                <ManagementPoint
                                    title="NCO 业务深度沉淀"
                                    desc="PM (Nick) 直接负责沟通与技术类Case跟进，减少L3/高级技术顾问资源投入，变相削减高单价工时。"
                                />
                                <ManagementPoint
                                    title="远程服务模型化"
                                    desc="L2 康胜、海啸远程弹性支持 + PM现场快速响应及数据分析，实现‘低单价远程+高效率Local’的最优解。"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. 财务预测图表 */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10">
                            <h2 className="text-xl font-medium mb-10 flex items-center gap-3">
                                <TrendingUp className="text-[#d4af37]" /> 未来月度趋势分析 (Financial Trend)
                            </h2>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={COST_PROJECTION_DATA}>
                                        <defs>
                                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0a1e40" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#0a1e40" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorSaving" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <YAxis hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                        <Area name="优化后成本" type="monotone" dataKey="optimizationCost" stroke="#0a1e40" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                                        <Area name="每月结余" type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSaving)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 具体数字表格 */}
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a1e40]">3. 未来三个月收入成本具体数字预测</h3>
                                <div className="text-[10px] text-slate-400 font-mono">CURRENCY: CNY (¥)</div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#0a1e40] text-slate-300 text-[10px] uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">月份</th>
                                        <th className="px-6 py-4">原计划成本</th>
                                        <th className="px-6 py-4">优化后预测</th>
                                        <th className="px-6 py-4 text-emerald-400">预计结余 (Margin)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {COST_PROJECTION_DATA.slice(0, 3).map((row) => (
                                        <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-[#0a1e40]">{row.month}</td>
                                            <td className="px-6 py-4 text-slate-400 font-mono">¥{row.originalCost.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-[#0a1e40]">¥{row.optimizationCost.toLocaleString()}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-emerald-600">¥{row.savings.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-slate-50 font-bold border-t-2 border-[#d4af37]/20">
                                        <td className="px-6 py-4 text-[#0a1e40]">三个月累计</td>
                                        <td className="px-6 py-4 text-slate-400 font-mono">¥193,539</td>
                                        <td className="px-6 py-4 font-mono text-[#0a1e40]">¥71,329</td>
                                        <td className="px-6 py-4 font-mono text-emerald-700">¥122,210</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-light uppercase tracking-widest text-[#0a1e40] mb-6">2. 收入提升计划</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 shrink-0"></div>
                                    <p className="text-sm font-medium">L3 额外增项挖掘：针对现有稳定性提升后的业务新需求做单独SOW转化。</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] mt-2 shrink-0"></div>
                                    <p className="text-sm font-medium">服务费溢价：通过更高频率的数据周报/月报价值交付，锁定续约金额。</p>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h3 className="text-lg font-light uppercase tracking-widest text-[#0a1e40] mb-6">4. 管理层支持</h3>
                            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Target size={16} className="text-[#d4af37]" />
                                    <span className="text-xs font-bold text-[#0a1e40]">人员稳定性认可</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                    "申请确认当前'轻量化、高效率'的人员架构，并支持PM接管核心沟通主权，确保转型期业务过渡平滑。"
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mt-20 text-center">
                <div className="inline-block px-8 py-3 bg-[#0a1e40] text-white rounded-full">
                    <p className="text-xs tracking-[0.2em] font-light">CONFIDENTIAL | ELCA(SH) IT OPERATIONS IMPROVEMENT</p>
                </div>
            </footer>
        </div>
    );
};

const StatCard = ({ title, value, sub, icon }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:scale-105 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        </div>
        <div className="text-2xl font-bold text-[#0a1e40] mb-1">{value}</div>
        <div className="text-xs text-slate-500 font-medium">{sub}</div>
    </div>
);

const ManagementPoint = ({ title, desc }: any) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
        <h4 className="text-[#d4af37] text-sm font-bold mb-2 flex items-center gap-2">
            <div className="w-1 h-1 bg-[#d4af37] rounded-full"></div> {title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-light">{desc}</p>
    </div>
);
