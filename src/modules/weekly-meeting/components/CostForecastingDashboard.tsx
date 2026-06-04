import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingDown,
    TrendingUp,
    Users,
    DollarSign,
    Target,
    ShieldCheck,
    Briefcase,
    Activity,
    CheckCircle2,
    Download,
    FileText,
    ChevronRight,
    Search,
    MessageSquare,
    Zap,
    LayoutDashboard,
    Calendar,
    ArrowRightCircle,
    BarChart3,
    PieChart,
    Layers
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// ==========================================
// 1. DATA CONSTANTS
// ==========================================

const JAN_COST = 327400.48;
const FEB_COST = 219840.80;
const MAR_COST = 248449.28;
// 以3月为基准，4月起全量剔除：Suzy差额(2w), 冯明明(4.5w), Jerry(1.2w), 乔善(1.4w)
// 理论全月节省 ~9.1w。实际运营水位预估下调至 ~16w (按22天算)
const RUN_RATE_BASE = 160000;
const DAILY_RATE_NEW = RUN_RATE_BASE / 22;
const APR_DAYS = 21;
const MAY_DAYS = 19;
const APR_COST = DAILY_RATE_NEW * APR_DAYS;
const MAY_COST = DAILY_RATE_NEW * MAY_DAYS;

const COST_SUMMARY_DATA = [
    { month: '1月', cost: JAN_COST, days: 22, status: 'Actual' },
    { month: '2月', cost: FEB_COST, days: 16, status: 'Actual' },
    { month: '3月', cost: MAR_COST, days: 22, status: 'Budgeted' },
    { month: '4月', cost: APR_COST, days: APR_DAYS, status: 'Projected' },
    { month: '5月', cost: MAY_COST, days: MAY_DAYS, status: 'Projected' },
];

const SURPLUS_DATA = [
    { m: '3月', p: 64513.12, b: 23776.49, s: 40736.63 },
    { m: '4月', p: 64513.12, b: 23776.49, s: 40736.63 },
    { m: '5月', p: 64513.12, b: 23776.49, s: 40736.63 },
    { m: '6月', p: 64513.12, b: 23776.49, s: 40736.63 },
    { m: '7月', p: 58225.51, b: 23776.50, s: 34449.01 },
];

const PERSONNEL_CHANGES = [
    {
        role: 'L2 NCO Support',
        old: 'Suzy',
        new: 'Jennie + Nick',
        reduction: '¥4.4w/Mo',
        date: 'Mar 14',
        note: '由 Jennie 全职接手，Nick 提供过稳度技术支持与运维协同'
    },
    {
        role: 'L2 Data Support',
        old: 'Jerry',
        new: '海啸 + Nick',
        reduction: '¥2.6w/Mo',
        date: 'Mar 13',
        note: 'Jerry 离职后不增员，由 Nick 承担现场 Data 运维及对账工作'
    },
    {
        role: 'L3 Developer',
        old: '冯明明',
        new: 'Roll-off',
        reduction: '¥4.5w/Mo',
        date: 'Mid-Mar',
        note: '任务移交完成，成本全额削减'
    },
    {
        role: 'L2 DWP Support(50%)',
        old: '乔善',
        new: 'Nick + Qiao Shan',
        reduction: '¥1.4w/Mo',
        date: 'Mar 17 / Mid-Apr',
        note: 'Nick 介入 DWP 运维，实现 50% 的成本置换与影子培养'
    }
];

const REVENUE_PLANS = [
    {
        title: 'ELC HR L3: 三统方案设计',
        desc: '项目管理及全流程测试',
        value: '11.2w',
        icon: <Zap size={18} />
    },
    {
        title: 'ELC HR L3: 短信厂商更换',
        desc: '接口对接与业务逻辑迁移',
        value: '1.98w',
        icon: <Zap size={18} />
    },
    {
        title: 'ELC HR L3: Cost Center 拆分',
        desc: '底层财务核算维度重构',
        value: '5.03w',
        icon: <Zap size={18} />
    },
    {
        title: 'ELC 泛微竞标项目',
        desc: '重点跟进项目竞标产值',
        value: '300w',
        icon: <Target size={18} />
    },
    {
        title: 'CSP 系统重构',
        desc: '现有系统架构升级与功能重构',
        value: '20w',
        icon: <Layers size={18} />
    },
    {
        title: '仓库CRM repack 对账工具',
        desc: '1. 园区/优通供应商(SF/中通)运费规则逻辑校验；2. Repack/发运/快递业务逻辑全量核对',
        value: '3w',
        icon: <Briefcase size={18} />
    }
];

const ELC_COLORS = {
    NAVY: '#0a1e40',
    GOLD: '#d4af37',
    GOLD_LIGHT: '#fffcf0',
    BG_LIGHT: '#fcfcfc',
    WHITE: '#ffffff',
    BORDER: '#e2e8f0',
    TEXT_MAIN: '#0a1e40',
    TEXT_MUTE: '#64748b',
    SUCCESS: '#059669',
    RISK: '#be123c',
};

// ==========================================
// 2. MAIN COMPONENT (STORYTELLING FLOW)
// ==========================================

export const CostForecastingDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const exportToPDF = async () => {
        const element = document.getElementById('cost-story-root');
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#fcfcfc' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`ELC-Cost-Transformation-Report.pdf`);
    };

    const getTrendOption = () => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            data: COST_SUMMARY_DATA.map(d => d.month),
            axisLabel: { color: ELC_COLORS.TEXT_MUTE, fontSize: 14 }
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed', opacity: 0.1 } },
            axisLabel: { color: ELC_COLORS.TEXT_MUTE, fontSize: 12 }
        },
        series: [{
            name: '月度总成本',
            type: 'line',
            data: COST_SUMMARY_DATA.map(d => d.cost.toFixed(0)),
            smooth: true,
            symbolSize: 8,
            lineStyle: { width: 4, color: ELC_COLORS.NAVY },
            itemStyle: { color: ELC_COLORS.GOLD, borderWidth: 2, borderColor: ELC_COLORS.NAVY },
            areaStyle: {
                color: {
                    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [{ offset: 0, color: 'rgba(10, 30, 64, 0.1)' }, { offset: 1, color: 'rgba(10, 30, 64, 0)' }]
                }
            }
        }]
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1e40]"></div>
            </div>
        );
    }

    return (
        <div id="cost-story-root" className="min-h-screen bg-[#fcfcfc] pb-32 font-sans text-slate-800 selection:bg-[#d4af37]/30">

            {/* PPT Cover Header */}
            <header className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#0a1e40]">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10"
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-12 h-px bg-white/30" />
                        <Activity className="text-[#d4af37]" size={28} />
                        <div className="w-12 h-px bg-white/30" />
                    </div>
                    <h1 className="text-[56px] text-white font-light tracking-[0.15em] uppercase leading-tight mb-6" style={{ fontFamily: 'Optima, serif' }}>
                        Cost Forecasting & Optimization
                    </h1>
                    <h2 className="text-[20px] text-[#d4af37] font-bold tracking-[0.4em] uppercase mb-12">
                        成本预测与优化战略汇报 • FY2026
                    </h2>
                    <div className="flex gap-4 justify-center">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white/70 text-xs tracking-widest uppercase">
                            Presenter: Nick (PM)
                        </div>
                    </div>
                </motion.div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <ArrowRightCircle className="text-white/20 rotate-90" size={32} />
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 pt-20 relative z-20">

                {/* 1. 成本改进计划 */}
                <section className="mb-24">
                    <SectionHeader number="01" title="1. 成本改进计划 (Cost Improvement)" subtitle="人员结构优化与服务模式转型" />
                    <div className="grid grid-cols-12 gap-10">
                        <div className="col-span-12 lg:col-span-7 space-y-6">
                            {PERSONNEL_CHANGES.map((item, idx) => (
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    key={idx}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group"
                                >
                                    <div className="flex gap-6 items-center">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0a1e40] font-black text-lg shadow-inner">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-[18px] font-bold text-[#0a1e40]">{item.role}</h4>
                                            <div className="flex items-center gap-3 text-slate-400 text-sm mt-1">
                                                <span className="line-through">{item.old}</span>
                                                <ArrowRightCircle size={14} className="text-[#d4af37]" />
                                                <span className="text-slate-800 font-bold">{item.new}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[20px] font-black text-emerald-600 mb-1">-{item.reduction}</div>
                                        <div className="text-[12px] text-slate-400 uppercase tracking-widest font-bold">{item.note}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="col-span-12 lg:col-span-5">
                            <div className="bg-[#0a1e40] text-white p-10 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                                <div>
                                    <h3 className="text-[#d4af37] text-[14px] font-black uppercase tracking-[0.3em] mb-8">PM 效能倍增与岗位复合化</h3>
                                    <div className="space-y-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                                                <span className="text-[16px] font-bold">全域运维支持 (一人多岗)</span>
                                            </div>
                                            <p className="text-slate-300 text-[14px] leading-relaxed font-light pl-5">
                                                Nick 主动承接 Jerry 离职后的<b>现场 Data 运维</b>工作（Data L2 均为远程），并同步在过渡期内支持 Jennie 的 NCO 运维，实现了“减员不减产”。
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                                                <span className="text-[16px] font-bold">成本利用最大化</span>
                                            </div>
                                            <p className="text-slate-300 text-[14px] leading-relaxed font-light pl-5">
                                                PM 的成本已完全内化为<b>“PM + 高级运维员”</b>的双重产出，通过 Nick 的现场覆盖能力，成功对冲了 L2/L3 离职带来的服务断档风险。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 收入提升计划 */}
                <section className="mb-24">
                    <SectionHeader number="02" title="2. 收入提升计划 (Revenue Enhancement) (总计: ¥341.21w)" subtitle="业务增量挖掘与价值溢价 • 独立L3开发项目" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {REVENUE_PLANS.map((plan, idx) => (
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                key={idx}
                                className="bg-white p-10 rounded-[32px] shadow-sm border border-[#d4af37]/20 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"></div>
                                <div className="w-16 h-16 rounded-2xl bg-[#0a1e40]/5 flex items-center justify-center text-[#d4af37] mb-6 shadow-inner">
                                    {plan.icon}
                                </div>
                                <h4 className="text-[18px] font-bold text-[#0a1e40] mb-3">{plan.title}</h4>
                                <p className="text-[14px] text-slate-500 leading-relaxed mb-6 font-medium">{plan.desc}</p>
                                <div className="mt-auto px-6 py-2 bg-[#d4af37] text-white rounded-full font-black text-[18px] shadow-lg shadow-[#d4af37]/20">
                                    ¥{plan.value}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 3. 未来预测 - Phase 03 Logic */}
                <section className="mb-24">
                    <SectionHeader number="03" title="3. 未来三个月的成本的具体数字预测" subtitle="基于法定工作日的精确化预测模型 (FY2026)" />

                    {/* Monthly Cost Table (Working Day Logic) */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                        <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-[18px] font-bold text-[#0a1e40]">1月-5月月度总成本明细 (Monthly Operating Cost Detail)</h3>
                            <span className="text-[12px] font-mono text-slate-400">UNIT: RMB (¥)</span>
                        </div>
                        <div className="p-12">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100">
                                            <th className="pb-6 text-[12px] text-slate-400 uppercase tracking-widest font-black">月份</th>
                                            <th className="pb-6 text-[12px] text-slate-400 uppercase tracking-widest font-black">工作天数</th>
                                            <th className="pb-6 text-[12px] text-slate-400 uppercase tracking-widest font-black">状态</th>
                                            <th className="pb-6 text-[12px] text-slate-400 uppercase tracking-widest font-black text-[#0a1e40]">月度总成本 (Total Cost)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-[16px]">
                                        {COST_SUMMARY_DATA.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-6 font-bold text-[#0a1e40]">{row.month}</td>
                                                <td className="py-6 font-mono text-slate-500">{row.days} 天</td>
                                                <td className="py-6">
                                                    <span className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${row.status === 'Actual' ? 'bg-slate-100 text-slate-400' :
                                                        row.status === 'Budgeted' ? 'bg-navy-50 text-[#0a1e40] border border-[#0a1e40]/10' :
                                                            'bg-amber-50 text-[#d4af37] border border-[#d4af37]/10'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="py-6 font-mono font-black text-[#0a1e40]">¥{row.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Surplus Table from Screenshot */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-12">
                        <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-[18px] font-bold text-[#0a1e40]">财务盈余明细 (Financial Surplus Detail)</h3>
                            <span className="text-[12px] font-mono text-slate-400">UNIT: RMB (¥)</span>
                        </div>
                        <div className="p-12">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-100">
                                            <th className="pb-6 text-[12px] text-slate-400 uppercase tracking-widest font-black">月份</th>
                                            <th className="pb-6 text-[12px] text-slate-400 uppercase tracking-widest font-black">项目计划成本 (Plan Cost)</th>
                                            <th className="pb-6 text-[12px] text-slate-400 uppercase tracking-widest font-black">2月份预借金额 (Advanced)</th>
                                            <th className="pb-6 text-[12px] text-white uppercase tracking-widest font-black bg-[#059669] rounded-t-xl px-4">项目计划结余 (Remaining)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-[16px]">
                                        {SURPLUS_DATA.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-6 font-bold text-[#0a1e40]">{row.m}</td>
                                                <td className="py-6 font-mono text-slate-400">¥{row.p.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="py-6 font-mono text-[#0a1e40]">¥{row.b.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="py-6 font-mono font-black text-emerald-600 bg-emerald-50/30 px-4">¥{row.s.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-[#0a1e40] text-white font-bold">
                                            <td className="p-8 rounded-bl-3xl">总计 (H1 Total)</td>
                                            <td className="p-8 font-mono">¥316,277.99</td>
                                            <td className="p-8 font-mono">¥118,882.46</td>
                                            <td className="p-8 font-mono text-[#d4af37] text-[22px]">¥197,395.53</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 3月资金缺口精算 - New Story Logic */}
                    <div className="bg-white rounded-[40px] shadow-2xl border-2 border-[#0a1e40]/5 overflow-hidden mb-12">
                        <div className="bg-[#0a1e40] p-10 text-white">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="text-[#d4af37] text-[12px] font-black uppercase tracking-[0.3em] mb-4">3月月度资金缺口精算 (MARCH GAP ANALYSIS)</h3>
                                    <p className="text-[24px] font-light">如何利用历史结余与存量预算覆盖核心支出？</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/40 text-[12px] mb-1">MARCH DEMAND</p>
                                    <p className="text-[32px] font-mono font-bold text-[#d4af37]">¥248,449.28</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-[14px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                        一、 历史成本执行偏差盘活
                                    </h4>
                                    <div className="space-y-4 pl-4 border-l border-slate-100">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">历史实际总成本 (25.09 - 26.02)</span>
                                            <span className="font-mono font-bold text-[#0a1e40]">¥727,438.42</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">历史计划总成本</span>
                                            <span className="font-mono font-bold text-[#0a1e40]">¥711,426.32</span>
                                        </div>
                                        <div className="flex justify-between p-4 bg-emerald-50 rounded-xl">
                                            <span className="text-emerald-700 font-bold">历史沉淀结余 (已用于冲抵3月)</span>
                                            <span className="font-mono font-black text-emerald-600">¥16,012.10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-[14px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        二、 3月减项与计划结余
                                    </h4>
                                    <div className="space-y-4 pl-4 border-l border-slate-100">
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-slate-500">3月原预算计划拨入</span>
                                            <span className="font-mono font-bold text-[#0a1e40]">¥40,736.63</span>
                                        </div>
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-slate-500">L3专项可用余额 (扣除已耗)</span>
                                            <span className="font-mono font-bold text-[#0a1e40]">¥23,760.72</span>
                                        </div>
                                        <div className="mt-8 p-6 bg-[#0a1e40] rounded-2xl text-white">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-white/60 text-[12px] uppercase">3月最终净缺口 (Net Gap)</span>
                                                <Target size={16} className="text-[#d4af37]" />
                                            </div>
                                            <div className="text-[32px] font-mono font-black text-[#d4af37]">
                                                ¥167,939.83
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-[11px]">
                                                <div className="flex items-center gap-2 text-[#d4af37]/80">
                                                    <div className="w-1 h-1 rounded-full bg-[#d4af37]"></div>
                                                    对冲A：由¥38.21w L3新增营收利润直接抵扣
                                                </div>
                                                <div className="flex items-center gap-2 text-[#d4af37]/80">
                                                    <div className="w-1 h-1 rounded-full bg-[#d4af37]"></div>
                                                    对冲B：由4-7月预估¥15.6w运营结余全额覆盖
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4-5月 成本覆盖逻辑 (COST COVERAGE LOGIC) */}
                        <div className="p-10 bg-[#0a1e40]/5 border-t border-slate-200">
                            <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">4-5月 成本覆盖与 ROI 转化结构 (APR/MAY ROI STRUCTURE)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Zap size={18} />
                                        </div>
                                        <span className="font-bold text-[#0a1e40] text-[15px]">L3 增项即时冲抵</span>
                                    </div>
                                    <p className="text-[12px] text-slate-500 leading-relaxed px-2">
                                        直接通过当前已锁定的 <span className="text-emerald-600 font-bold">¥38.21w</span> L3 开发项目合同额，实时冲销 4-5 月产生的额外人力成本。
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Target size={18} />
                                        </div>
                                        <span className="font-bold text-[#0a1e40] text-[15px]">竞标项目池蓄能</span>
                                    </div>
                                    <p className="text-[12px] text-slate-500 leading-relaxed px-2">
                                        重点突破 <span className="text-blue-600 font-bold">¥300w</span> 泛微竞标大单。一旦落位，将为全年人员开支提供超过 300% 的财务安全垫。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart logic preserved from Phase 03 */}
                    <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                            <div className="lg:col-span-8">
                                <div className="h-[400px]">
                                    <ReactECharts option={getTrendOption()} style={{ height: '100%' }} />
                                </div>
                            </div>
                            <div className="lg:col-span-4 space-y-10">
                                <div>
                                    <h4 className="text-[14px] font-black uppercase tracking-widest text-[#0a1e40] mb-4">预测模型说明</h4>
                                    <p className="text-[15px] text-slate-600 leading-relaxed">
                                        由于人员架构已于3月完成置换，4-5月的成本波动完全受**法定工作天数**驱动。
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                        <span className="text-slate-500 font-bold">3月基准</span>
                                        <span className="font-mono text-[#0a1e40] font-black">22 工作日</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                        <span className="text-slate-500 font-bold">4月预测</span>
                                        <span className="font-mono text-[#0a1e40] font-black">21 工作日</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border-l-4 border-[#d4af37]">
                                        <span className="text-slate-500 font-bold">5月预测</span>
                                        <span className="font-mono text-[#0a1e40] font-black">19 工作日</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. 管理层支持 */}
                <section className="mb-24">
                    <SectionHeader number="04" title="4. 希望管理层提供的支持" subtitle="确保转型方案的高效落实与业务连续性" />
                    <div className="flex justify-center">
                        <div className="max-w-3xl w-full">
                            <AskCard
                                title="Presales Support"
                                subtitle="售前挖掘支持"
                                icon={<Search className="text-[#0a1e40]" />}
                                content="重点请求售前团队协助支持新 L3 项目的挖掘机会"
                            />
                        </div>
                    </div>
                </section>




                {/* Thank You Section */}
                <div className="flex flex-col items-center justify-center py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="text-center"
                    >
                        <h2 className="text-[80px] text-[#0a1e40] font-light tracking-[0.2em] mb-4" style={{ fontFamily: 'Optima, serif' }}>
                            Thank You!
                        </h2>
                        <div className="w-24 h-px bg-[#d4af37] mx-auto mb-8"></div>
                        <p className="text-[14px] text-slate-400 font-bold uppercase tracking-[0.5em]">
                            End of Presentation
                        </p>
                    </motion.div>
                </div>

            </main>

            <footer className="mt-32 h-64 bg-slate-50 flex items-center justify-center">
                <div className="text-center opacity-30">
                    <div className="w-12 h-1 bg-[#d4af37] mx-auto mb-6"></div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#0a1e40]">THE ESTÉE LAUDER COMPANIES | FY26 COST STRATEGY</p>
                </div>
            </footer>
        </div >
    );
};

const SectionHeader = ({ number, title, subtitle }: any) => (
    <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
            <span className="text-[14px] font-black text-[#d4af37] tracking-[0.3em] uppercase">SECTION {number}</span>
            <div className="h-px flex-grow bg-slate-100"></div>
        </div>
        <h2 className="text-[36px] font-light text-[#0a1e40] uppercase tracking-tight mb-2" style={{ fontFamily: 'Optima, serif' }}>{title}</h2>
        <p className="text-[14px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>
    </div>
);

const StoryKPICard = ({ step, title, value, desc, icon }: any) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-[80px] font-black leading-none">{step}</span>
        </div>
        <div className="mb-8">{icon}</div>
        <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.3em] mb-3">{title}</p>
        <div className="text-[48px] font-light text-[#0a1e40] leading-none mb-6">{value}</div>
        <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
);

const AskCard = ({ title, subtitle, icon, content }: any) => (
    <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all h-full flex flex-col">
        <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <div>
                <h4 className="text-[14px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
                <p className="text-[20px] font-bold text-[#0a1e40]">{subtitle}</p>
            </div>
        </div>
        <p className="text-[16px] text-slate-500 leading-relaxed italic flex-grow">"{content}"</p>
    </div>
);
