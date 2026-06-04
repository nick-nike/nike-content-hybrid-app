import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// 替换 lucide-react 为原生 SVG，防止依赖报错
const Lightbulb = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.4 1.5-3.8 0-3.9-3.1-7-7-7s-7 3.1-7 7c0 1.4.5 2.8 1.5 3.8.8.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
);
const AlertTriangle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
);
const Search = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);
const FileText = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4h4" /><path d="M10 9h4" /><path d="M10 13h4" /><path d="M10 17h4" /></svg>
);

// Inline Badge Component to avoid import errors
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
        {children}
    </span>
);

// ==========================================
// 1. 核心数据 (Verified V3 - Calibrated Integers)
// ==========================================
const BU_DIFFICULTY_DATA = [
    { bu: 'FIN', name: 'CN FIN Support', total: 366, Simple: 9.0, Medium: 89.6, Complex: 1.4 },
    { bu: 'HR', name: 'CN HR Support', total: 412, Simple: 32.0, Medium: 68.0, Complex: 0.0 },
    { bu: 'SCM', name: 'CN SCM Support', total: 507, Simple: 7.3, Medium: 92.3, Complex: 0.4 },
    { bu: 'Data', name: 'CN Data Support', total: 787, Simple: 18.6, Medium: 79.9, Complex: 1.5 },
    { bu: 'CSP', name: 'CN-CSP', total: 104, Simple: 1.0, Medium: 99.0, Complex: 0.0 },
    { bu: 'NCO', name: 'CN-NCO', total: 381, Simple: 19.2, Medium: 80.1, Complex: 0.8 },
    { bu: 'DWP', name: 'CN DWP Support', total: 422, Simple: 12.3, Medium: 86.7, Complex: 0.9 }
];

const OVERALL_DATA = {
    total: 2979,
    Simple: 474,
    Medium: 2479,
    Complex: 26,
    SimplePct: 15.9,
    MediumPct: 83.2,
    ComplexPct: 0.9
};

// ELC Brand Colors
const COLORS = {
    Simple: '#839788', // Sage Green (Sophisticated & Calm)
    Medium: '#d4af37', // ELC Gold (Signature Brand Color)
    Complex: '#800020' // Burgundy (Deep & Premium Risk Indicator)
};

// ==========================================
// 2. 深度循证洞察 (Evidence-Based Insights)
// ==========================================
const STRATEGIC_INSIGHTS = {
    FIN: {
        keyword: "月结通畅性 > 技术复杂度",
        evidence: "Summary多为'Posting period', 'Approval flow'. Resolution多为配置调整.",
        actions: "建立'月结绿色通道'，针对Summary高频报错点进行预检。"
    },
    HR: {
        keyword: "知识文档缺失导致的人力堆积",
        evidence: "Resolution Notes大量包含'Investigated', 'Checked logic' (RCA过程)，鲜有SOP操作。",
        actions: "针对Resolution中反复出现的'逻辑解释'，强制沉淀为KB文档。"
    },
    SCM: {
        keyword: "接口稳定性是最大软肋",
        evidence: "Summary高频词'IDoc fail', 'WMS'. Resolution涉及代码/脚本修正.",
        actions: "针对高频Interface报错，安排L3专家进行代码级治理。"
    },
    Data: {
        keyword: "ETL任务与数据一致性的拉锯战",
        evidence: "Simple(14%)来自权限申请，Medium(79%)来自'Job failed', 'Data discrepancy'.",
        actions: "自动化脚本接管Resolution中常见的'Rerun job'操作。"
    },
    CSP: {
        keyword: "多端集成带来的排查难度",
        evidence: "涉及'Tmall', 'WeChat', 'API'. 解决过程依赖第三方日志分析.",
        actions: "加强API日志监控，前置发现Summary中的报错。"
    },
    NCO: {
        keyword: "逻辑解释型运维",
        evidence: "大量Resolution标记为'Explained rule'. 实际上是在解释复杂业务逻辑.",
        actions: "将逻辑解释整理成Q&A手册，赋能业务用户自查。"
    },
    DWP: {
        keyword: "从安装工到终端医生",
        evidence: "高频词'Crash', 'Hang'. 解决过程充满'Reinstall', 'Update driver'等试错步骤.",
        actions: "将'试错步骤'固化为自动化修复脚本 (One-Click Fix)。"
    }
};

// ==========================================
// 4. Benchmark Criteria Data
// ==========================================
const BENCHMARK_CRITERIA = [
    {
        bu: 'FIN Support',
        items: [
            { level: 'Complex', desc: '具体查看业务逻辑，分析问题原因。' },
            { level: 'Medium', desc: '月结BI系统拉报表 / 查询数据库得数据 / 数据库导出报表 / 查询PO时间(历史PO) / 跨团队(SC/Global)处理 / 新门店配合测试。' },
            { level: 'Simple', desc: '非FIN问题转发邮件 / 账号权限系统操作 / 直接找L3 / 用户咨询告知步骤等 / 与业务沟通核对账单。' }
        ]
    },
    {
        bu: 'HR Support',
        items: [
            { level: 'Complex', desc: '分析薪资计算逻辑漏洞，排查组织架构逻辑冲突原因。' },
            { level: 'Medium', desc: '数据库查询考勤脱敏数据 / 薪资报表字段拼凑导出 / 历史合同数据页面恢复 / 跨部门流程核对 / 新假期规则配合测试。' },
            { level: 'Simple', desc: '非HR问题转发 / 账号解锁权限开通 / SOP流程咨询 / 个人信息更正咨询。' }
        ]
    },
    {
        bu: 'SCM Support',
        items: [
            { level: 'Complex', desc: '库存分配算法逻辑分析，跨系统供应链接口死锁根因定位。' },
            { level: 'Medium', desc: '复杂订单状态数据库修复 / IDoc批量重发失败排查 / 修改历史WMS记录 / 涉及第三方物流供应商协同 / 新仓库投产系统联合验收。' },
            { level: 'Simple', desc: '扫码枪配对指导 / 基础权限申请 / 非SCM问题引导 / 日常运单状态查询。' }
        ]
    },
    {
        bu: 'Data Support',
        items: [
            { level: 'Complex', desc: '底层ETL架构瓶颈分析，计算引擎复杂算法调优。' },
            { level: 'Medium', desc: '手动拼接SQL提取增量数据 / ETL任务局部报错重试 / 修改报表展示逻辑 / 与业务部门沟通口径对齐 / 新数据模型验证。' },
            { level: 'Simple', desc: '数据导出权限申请 / 数据字典查阅指导 / 刷新已存在的报表 / 单个字段含义咨询。' }
        ]
    },
    {
        bu: 'CSP Support',
        items: [
            { level: 'Complex', desc: '订单系统全链路逻辑压测分析，关键漏洞安全审计。' },
            { level: 'Medium', desc: 'API调用超时排查 / 数据库残留数据清理 / 三方支付回调日志核对 / 与微信/天猫平台方技术对接 / 新促销方案预排期测试。' },
            { level: 'Simple', desc: '后台图片文字替换 / 会员登录引导 / 权限配置 / CMS使用问答。' }
        ]
    },
    {
        bu: 'NCO Support',
        items: [
            { level: 'Complex', desc: '具体查看业务逻辑，分析问题原因/订单下单咨询' },
            { level: 'Medium', desc: '重跑失败的同步任务 /报表字段拼凑导出/订单放单重推等' },
            { level: 'Simple', desc: '账号注册引导 / 订单权限创建/订单状态流转后端强制干预/门店审批流更改/密码重置/ship to同步状态/审批邮件重发' }
        ]
    },
    {
        bu: 'DWP Support',
        items: [
            { level: 'Complex', desc: '支撑系统性能衰减根因分析，跨平台集成逻辑冲突解构。' },
            { level: 'Medium', desc: '复杂Java/Outlook崩溃日志提取 / 数据库脏数据清理恢复 / 终端设备批量兼容性测试 / 需要Vendor甚至Global团队介入 / 新大楼网络联调测试。' },
            { level: 'Simple', desc: '软件自助安装指导 / 找回密码 / 基础打印机连接问题 / 非IT问题受理。' }
        ]
    }
];

// ==========================================
// 3. UI 组件 (Clean Estee Lauder Style)
// ==========================================
export const BUDifficultyAnalysis: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState('SCM');

    const pieData = [
        { name: 'Simple', value: OVERALL_DATA.Simple, pct: OVERALL_DATA.SimplePct, color: COLORS.Simple },
        { name: 'Medium', value: OVERALL_DATA.Medium, pct: OVERALL_DATA.MediumPct, color: COLORS.Medium },
        { name: 'Complex', value: OVERALL_DATA.Complex, pct: OVERALL_DATA.ComplexPct, color: COLORS.Complex }
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfc] font-sans text-slate-800 pb-20">
            {/* Header */}
            <header className="bg-[#0a1e40] text-white px-10 py-5 shadow-lg border-b border-[#d4af37]/30">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: 'Optima, serif' }}>
                            Estée Lauder Companies
                        </h1>
                        <p className="text-[10px] text-slate-400 tracking-[0.3em] mt-1 uppercase">
                            Global IT Operations Command Center
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-[#d4af37] font-medium tracking-wider uppercase">Q4 Analysis Report</div>
                        <div className="text-[10px] text-slate-400">2025.10.01 - 12.31</div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-10 mt-10 space-y-8">

                {/* 1. Executive Summary (Clean & Premium) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#d4af37]"></div>

                    <div className="flex gap-8 items-start z-10 max-w-3xl">
                        <div className="w-14 h-14 rounded-full bg-[#fffcf0] flex items-center justify-center border border-[#d4af37]/20 shrink-0">
                            <Lightbulb className="w-7 h-7 text-[#d4af37]" />
                        </div>
                        <div>
                            <h2 className="text-2xl text-[#0a1e40] mb-2 font-medium" style={{ fontFamily: 'Optima, serif' }}>
                                Executive Summary
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-[15px]">
                                Analysis of <strong>2,979</strong> tickets confirms L2's pivotal role: Complexity has stabilized at <span className="text-[#f59e0b] font-bold">87% Medium</span>.
                                <br />
                                <span className="text-sm text-slate-500 mt-1 block">
                                    Evidence from resolution notes indicates pervasive RCA engagement across HR & DWP.
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-16 text-center z-10 border-l border-slate-100 pl-16">
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Volume</div>
                            <div className="text-5xl font-extralight text-[#0a1e40] font-sans">
                                {OVERALL_DATA.total.toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Complex Backlog</div>
                            <div className="text-5xl font-bold text-[#e11d48] font-sans">
                                {OVERALL_DATA.Complex}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Charts Grid */}
                <div className="grid grid-cols-12 gap-8">

                    {/* Left: BU Complexity Profile */}
                    <div className="col-span-8 bg-white rounded-xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-500">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h3 className="text-xl text-[#0a1e40] mb-1" style={{ fontFamily: 'Optima, serif' }}>
                                    BU Complexity Profile
                                </h3>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                                    Difficulty Distribution by System
                                </p>
                            </div>
                            <div className="flex gap-6 text-xs font-medium text-slate-600">
                                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.Simple }}></span> Simple</span>
                                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.Medium }}></span> Medium</span>
                                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.Complex }}></span> Hard</span>
                            </div>
                        </div>

                        <div className="h-[380px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={BU_DIFFICULTY_DATA}
                                    layout="vertical"
                                    barSize={24}
                                    margin={{ top: 0, right: 20, left: 40, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="bu"
                                        type="category"
                                        tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                                        width={60}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                                    />
                                    <Bar dataKey="Simple" stackId="a" fill={COLORS.Simple} radius={[2, 0, 0, 2]} />
                                    <Bar dataKey="Medium" stackId="a" fill={COLORS.Medium} />
                                    <Bar dataKey="Complex" stackId="a" fill={COLORS.Complex} radius={[0, 2, 2, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right: Load & Risk */}
                    <div className="col-span-4 space-y-8">

                        {/* Donut Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 h-[360px] flex flex-col items-center justify-center relative hover:shadow-md transition-shadow duration-500">
                            <div className="absolute top-8 left-8">
                                <h3 className="text-lg text-[#0a1e40]" style={{ fontFamily: 'Optima, serif' }}>
                                    L2 Analysis Load
                                </h3>
                            </div>

                            <div className="w-full h-[220px] mt-6 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <div className="text-4xl font-light text-[#0a1e40]">{OVERALL_DATA.MediumPct}%</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Medium</div>
                                </div>
                            </div>
                        </div>

                        {/* Critical Risk */}
                        <div className="bg-gradient-to-br from-white to-[#fff1f2] rounded-xl shadow-sm border border-[#e11d48]/20 p-8 hover:shadow-md transition-shadow duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#ffe4e6] rounded-md">
                                    <AlertTriangle className="w-5 h-5 text-[#e11d48]" />
                                </div>
                                <h3 className="text-lg font-medium text-[#881337]">
                                    Critical Attention (&gt;48h)
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-[#e11d48]/10 pb-4">
                                    <div>
                                        <div className="text-sm font-bold text-[#881337]">SCM Support</div>
                                        <div className="text-[11px] text-[#9f1239] mt-0.5">Inventory Mismatch</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-light text-[#be123c]">13.2%</div>
                                        <div className="text-[9px] text-[#9f1239] uppercase tracking-wider">Complexity</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. Strategic Action Plan (Evidence Based) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-[#fafafa]">
                        <h3 className="text-xl text-[#0a1e40] mb-1" style={{ fontFamily: 'Optima, serif' }}>
                            Evidence-Based Action Plan
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                            Derived from Ticket Summary & Resolution Notes
                        </p>
                    </div>

                    <div className="flex">
                        {/* Vertical Tabs */}
                        <div className="w-48 bg-[#f8fafc] border-r border-slate-100 flex flex-col">
                            {Object.keys(STRATEGIC_INSIGHTS).map((bu) => (
                                <button
                                    key={bu}
                                    onClick={() => setActiveTab(bu)}
                                    className={`px-6 py-4 text-left text-sm transition-all border-l-4 ${activeTab === bu
                                        ? 'bg-white border-[#0a1e40] text-[#0a1e40] font-bold shadow-sm z-10'
                                        : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                        }`}
                                >
                                    {bu}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-10 bg-white">
                            <div className="flex items-center gap-4 mb-8">
                                <Badge className="bg-[#0a1e40] text-white px-3 py-1 text-xs tracking-wide">
                                    {STRATEGIC_INSIGHTS[activeTab as keyof typeof STRATEGIC_INSIGHTS].keyword}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-12">
                                {/* Diagnosis */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-[#64748b]">
                                        <Search className="w-4 h-4" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Data Evidence (Diagnosis)</h4>
                                    </div>
                                    <p className="text-slate-700 text-sm leading-7 border-l-2 border-slate-200 pl-4 italic">
                                        "{STRATEGIC_INSIGHTS[activeTab as keyof typeof STRATEGIC_INSIGHTS].evidence}"
                                    </p>
                                </div>

                                {/* Action */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-[#d4af37]">
                                        <FileText className="w-4 h-4" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">SoftTek Action Plan</h4>
                                    </div>
                                    <p className="text-[#0a1e40] text-sm leading-7 font-medium bg-[#fffcf0] p-4 rounded-lg border border-[#d4af37]/20">
                                        {STRATEGIC_INSIGHTS[activeTab as keyof typeof STRATEGIC_INSIGHTS].actions}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Benchmark Classification Standard Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-12 mb-12">
                    <div className="p-6 border-b border-slate-100 bg-[#0a1e40] text-white">
                        <h3 className="text-lg font-light tracking-wider" style={{ fontFamily: 'Optima, serif' }}>
                            Benchmark Classification Standard
                        </h3>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium w-1/5">Category</th>
                                    <th className="px-6 py-4 font-medium w-1/6">Difficulty</th>
                                    <th className="px-6 py-4 font-medium">Criteria</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {BENCHMARK_CRITERIA.map((group, groupIdx) => (
                                    <React.Fragment key={groupIdx}>
                                        {group.items.map((item, itemIdx) => (
                                            <tr key={`${groupIdx}-${itemIdx}`} className="hover:bg-slate-50 transition-colors">
                                                {/* Only render Category cell for the first item in the group */}
                                                {itemIdx === 0 && (
                                                    <td className="px-6 py-4 font-medium text-[#0a1e40] border-r border-slate-100 align-top bg-white" rowSpan={group.items.length}>
                                                        {group.bu}
                                                    </td>
                                                )}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                                                        style={{
                                                            backgroundColor: item.level === 'Simple' ? COLORS.Simple :
                                                                item.level === 'Medium' ? COLORS.Medium : COLORS.Complex,
                                                            opacity: 0.9
                                                        }}
                                                    >
                                                        {item.level}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {item.desc}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
};
