import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    CheckCircle2,
    Clock,
    Target,
    Layers,
    Cpu,
    Download
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// ==========================================
// 1. DATA CONSTANTS (Based on Feb 6 - Mar 3 Report)
// ==========================================

const TICKETS_BY_SYSTEM = [
    { name: 'China Data Portal', value: 60 },
    { name: 'China Data Platform', value: 33 },
    { name: 'Control Tower', value: 22 },
    { name: 'GCC-SalesForce', value: 15 },
    { name: 'CSR', value: 1 }
];

const ISSUE_CATEGORIES = [
    { name: 'OP-OperationTask', value: 43 },
    { name: 'Req-Account/Access', value: 35 },
    { name: 'Issue-Data Correction', value: 14 },
    { name: 'OP-MonitorTask', value: 15 },
    { name: 'Req-Information / FAQ', value: 10 },
    { name: 'Req-Data Manual Operation', value: 7 },
    { name: 'Issue-SystemIssue', value: 4 },
    { name: 'Issue-SourceFile', value: 3 },
    { name: 'Req-Configuration', value: 1 }
];

const AGING_TICKETS = [
    { assignee: 'Kangsheng Shu', date: 'Feb 08', subject: 'China Data Portal网页窗口开通', comment: '用户邮件回复：“仍需要开通此权限，我先催下Line进行审批，之后进行申请，此ticket目前无需关闭”' },
    { assignee: 'Kangsheng Shu', date: 'Feb 26', subject: '测试VM工具ready', comment: '用户需开通Commit报表权限，但是未获取SCM_AS团队审批' }
];

const ASSIGNEE_WORKLOAD = [
    {
        name: 'Kangsheng Shu', total: 96, details: [
            { status: 'Resolved', value: 88 },
            { status: 'In Progress', value: 5 },
            { status: 'Closed', value: 3 }
        ]
    },
    {
        name: 'Winni Luo', total: 24, details: [
            { status: 'Resolved', value: 22 },
            { status: 'In Progress', value: 2 }
        ]
    },
    {
        name: 'Jerry Wang', total: 11, details: [
            { status: 'Resolved', value: 10 },
            { status: 'Closed', value: 1 }
        ]
    }
];

const CI_ASSIGNMENT = [
    { ci: 'China Data Portal', total: 60, assignees: [{ name: 'Kangsheng Shu', val: 47 }, { name: 'Winni Luo', val: 8 }, { name: 'Jerry Wang', val: 5 }] },
    { ci: 'China Data Platform', total: 33, assignees: [{ name: 'Winni Luo', val: 16 }, { name: 'Kangsheng Shu', val: 12 }, { name: 'Jerry Wang', val: 5 }] },
    { ci: 'Control Tower', total: 22, assignees: [{ name: 'Kangsheng Shu', val: 22 }] },
    { ci: 'GCC-SalesForce', total: 15, assignees: [{ name: 'Kangsheng Shu', val: 15 }] },
    { ci: 'CSR', total: 1, assignees: [{ name: 'Jerry Wang', val: 1 }] }
];

const EFFICIENCY_STATS = [
    { name: 'Kangsheng Shu', tickets: 323, totalHours: 202.9, avgTime: 0.63, topCategory: 'Data Portal 权限申请 (98单)' },
    { name: 'Jerry Wang', tickets: 50, totalHours: 123.7, avgTime: 2.47, topCategory: 'Data Portal 报表数据问题 I (7单)' }
];

const CATEGORY_TIME_COMPARE = [
    {
        category: 'Data Portal (Data/Report)',
        kangsheng: 1.57,
        jerry: 3.12,
        includes: '报表数据问题 I/II/III, 报表刷新, 报表数据导出及问题'
    },
    {
        category: 'Daily Ops / Monitoring',
        kangsheng: 0.20,
        jerry: 3.19,
        includes: 'Control Tower Monitor, Rerun Job, 日常对数'
    },
    {
        category: 'Other Project Support',
        kangsheng: 1.37,
        jerry: 2.10,
        includes: 'DataWorks重跑ETL, FIN文件上传, API Token更新, 主数据维护'
    },
    {
        category: 'Control Tower (Merged)',
        kangsheng: 0.66,
        jerry: 0,
        includes: '账号权限申请, 报表问题排查, 重刷数据, 其他'
    },
    {
        category: 'GCC Case (Merged)',
        kangsheng: 0.76,
        jerry: 0,
        includes: '数据导出, 问题排查, 问题排查 I/II/III'
    },
    {
        category: 'Data Portal (Access)',
        kangsheng: 0.18,
        jerry: 0,
        includes: '权限申请, 账号&权限问题, 填报问题'
    },
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

export const AssetsListPage: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const exportToPDF = async () => {
        const element = document.getElementById('report-root');
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#fcfcfc' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Lululemon-BiWeekly-Report-Feb6-Mar3.pdf`);
    };

    const getCategoryOption = () => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'item' },
        series: [{
            name: 'Issue Category',
            type: 'pie',
            radius: ['45%', '70%'],
            itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
            label: { show: true, color: ELC_COLORS.TEXT_MAIN, fontSize: 10, position: 'outside' },
            data: ISSUE_CATEGORIES.map((item, idx) => ({
                ...item,
                itemStyle: { color: idx === 0 ? ELC_COLORS.NAVY : idx === 1 ? ELC_COLORS.GOLD : `rgba(10, 30, 64, ${0.7 - idx * 0.06})` }
            }))
        }]
    });

    const getWorkloadOption = () => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { bottom: 0, textStyle: { fontSize: 10 } },
        grid: { top: '5%', left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: ASSIGNEE_WORKLOAD.map(a => a.name) },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } } },
        series: [
            { name: 'Resolved', type: 'bar', stack: 'total', data: ASSIGNEE_WORKLOAD.map(a => a.details.find(d => d.status === 'Resolved')?.value || 0), itemStyle: { color: '#059669' } },
            { name: 'Closed', type: 'bar', stack: 'total', data: ASSIGNEE_WORKLOAD.map(a => a.details.find(d => d.status === 'Closed')?.value || 0), itemStyle: { color: '#0a1e40' } },
            { name: 'In Progress', type: 'bar', stack: 'total', data: ASSIGNEE_WORKLOAD.map(a => a.details.find(d => d.status === 'In Progress')?.value || 0), itemStyle: { color: '#d4af37' } }
        ]
    });

    const getEfficiencyOption = () => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { bottom: 0 },
        grid: { top: '10%', left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: { type: 'category', data: EFFICIENCY_STATS.map(s => s.name) },
        yAxis: { type: 'value', name: 'Avg Resolution Time (Hrs)', splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } } },
        series: [
            {
                name: 'Average Time per Ticket',
                type: 'bar',
                data: EFFICIENCY_STATS.map(s => s.avgTime),
                itemStyle: {
                    color: (params: any) => params.dataIndex === 0 ? ELC_COLORS.NAVY : ELC_COLORS.GOLD,
                    borderRadius: [4, 4, 0, 0]
                },
                label: { show: true, position: 'top', formatter: '{c}h' }
            }
        ]
    });

    const getCategoryTimeOption = () => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        legend: { bottom: 0 },
        grid: { top: '15%', left: '3%', right: '4%', bottom: '20%', containLabel: true },
        xAxis: {
            type: 'category',
            data: CATEGORY_TIME_COMPARE.map(d => d.category),
            axisLabel: { interval: 0, rotate: 15, fontSize: 9 }
        },
        yAxis: { type: 'value', name: 'Avg Hours', splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } } },
        series: [
            { name: 'Kangsheng Shu', type: 'bar', data: CATEGORY_TIME_COMPARE.map(d => d.kangsheng), itemStyle: { color: ELC_COLORS.NAVY } },
            { name: 'Jerry Wang', type: 'bar', data: CATEGORY_TIME_COMPARE.map(d => d.jerry), itemStyle: { color: ELC_COLORS.GOLD } }
        ]
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-vh-100 bg-white">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0a1e40]"></div>
            </div>
        );
    }

    return (
        <div id="report-root" className="min-h-screen bg-[#fcfcfc] pb-24 font-sans text-slate-800 focus:outline-none">
            {/* Header */}
            <div className="text-center py-20 px-6">
                <div className="flex items-center justify-center gap-5 mb-5">
                    <div className="w-12 h-px bg-[#d4af37]/30" />
                    <Activity className="text-[#d4af37]" size={24} />
                    <div className="w-12 h-px bg-[#d4af37]/30" />
                </div>
                <h1 className="text-[40px] text-[#0a1e40] font-normal tracking-[0.25em] uppercase leading-none" style={{ fontFamily: 'Optima, serif' }}>
                    DATA SERVICE DELIVERY EXECUTIVE
                </h1>
                <p className="text-[12px] text-[#c5a059] font-bold tracking-[0.4em] uppercase mt-4">
                    BI-WEEKLY REVIEW (FEB 6 - MAR 3) • DATA OPERATIONS
                </p>
            </div>

            {/* KPIs */}
            <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <KPICard title="VOLUME HEALTH" value="132" subtext="Total Valid Tickets" icon={<Layers size={20} />} />
                <KPICard title="RESOLUTION RATE" value="95%" subtext="Excluding 7 tickets currently in progress" icon={<CheckCircle2 size={20} />} iconColor="#059669" />
            </div>

            {/* Main Content */}
            <div className="max-w-[1240px] mx-auto px-6 space-y-12">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-[#0a1e40] px-6 py-4 flex items-center gap-3">
                            <Target className="text-white w-4 h-4" />
                            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Issue Category Breakdown</h3>
                        </div>
                        <div className="p-8 h-[380px]">
                            <ReactECharts option={getCategoryOption()} style={{ height: '100%' }} />
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-[#0a1e40] px-6 py-4 flex items-center gap-3">
                            <Cpu className="text-white w-4 h-4" />
                            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Team Workload Distribution</h3>
                        </div>
                        <div className="p-8 h-[380px]">
                            <ReactECharts option={getWorkloadOption()} style={{ height: '100%' }} />
                        </div>
                    </div>
                </div>

                {/* Service Matrix */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#0a1e40] px-6 py-4 flex items-center gap-3">
                        <Activity className="text-white w-4 h-4" />
                        <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Service Assignment Matrix (Affected CI / Service)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-0 divide-x divide-y divide-slate-100">
                        {CI_ASSIGNMENT.map((item, idx) => (
                            <div key={idx} className="p-6 hover:bg-slate-50/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-[13px] font-bold text-[#0a1e40]">{item.ci}</h4>
                                    <span className="text-[10px] font-black bg-[#fcfaf2] border border-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded-full">{item.total}</span>
                                </div>
                                <div className="space-y-2">
                                    {item.assignees.map((as, aIdx) => (
                                        <div key={aIdx} className="flex justify-between items-center text-[12px]">
                                            <span className="text-slate-500">{as.name}</span>
                                            <span className="font-medium text-[#0a1e40]">{as.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Efficiency Analysis Section */}
                <div className="bg-[#f8fafc] rounded-2xl p-12 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-1.5 h-8 bg-[#0a1e40] rounded-full" />
                        <div>
                            <h2 className="text-2xl font-bold text-[#0a1e40] tracking-tight">Resolution Efficiency Deep-Dive</h2>
                            <p className="text-slate-500 text-sm mt-1">Comparative analysis based on Ticket Category and Actual Resolution Time (Jan-Feb 373 Raw Data)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 mb-12">
                        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-[400px]">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-400">Avg Resolution Speed (Total)</h3>
                            <ReactECharts option={getEfficiencyOption()} style={{ height: '300px' }} />
                        </div>
                        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-400">Head-to-Head Category Comparison (Avg Hours)</h3>
                            <div className="h-[300px]">
                                <ReactECharts option={getCategoryTimeOption()} style={{ height: '100%' }} />
                            </div>
                            {/* Drill-down Legend */}
                            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                                {CATEGORY_TIME_COMPARE.map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-[#0a1e40] uppercase tracking-tighter">{item.category}</span>
                                        <span className="text-[9px] text-slate-400 leading-tight italic truncate hover:whitespace-normal" title={item.includes}>
                                            包含：{item.includes}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Expert Conclusion */}
                    <div className="bg-white rounded-xl border border-[#d4af37]/20 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Target size={120} className="text-[#d4af37]" />
                        </div>
                        <h4 className="flex items-center gap-2 text-[#c5a059] font-bold text-sm uppercase tracking-widest mb-6">
                            <Activity size={16} /> Category-Based Performance Insight
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <h5 className="text-[#0a1e40] font-bold text-xs uppercase">1. Scale vs. Speed</h5>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Kangsheng在处理 <b>323单</b> 的tickets，平均每单耗时仅为 <b>0.63h</b>。相比之下，Jerry 处理了 <b>50单</b>，平均耗时为 <b>2.47h</b>。经分析，Jerry 的 case 复杂度较高，其中包含了大量的 Special Case 导致单均耗时增加。
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h5 className="text-[#0a1e40] font-bold text-xs uppercase">2. Comparative Depth</h5>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    在 <b>Data Portal (Data/Report)</b> 类深度工单中，Kangsheng 的单均耗时为 <b>1.57h</b>。Jerry 的耗时为 <b>3.12h</b>，主要由于其承接的 Case 大多属于逻辑较为复杂的 <b>Special Case</b>。建议由 Kangsheng 总结通用排查方案，进一步赋能团队处理非标复杂工单，后续跟海啸（Hai Xiao）互为 Backup。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Aging Tickets List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#0a1e40] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="text-white w-4 h-4" />
                            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Tickets Unresolved for ≥ 5 Days</h3>
                        </div>
                        <span className="text-white/70 text-[10px] uppercase tracking-widest font-black border border-white/20 px-3 py-1 rounded-full">2 TICKETS IDENTIFIED</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-[10px] text-slate-400 uppercase tracking-widest font-black">Assignee / Date</th>
                                    <th className="px-8 py-4 text-[10px] text-slate-400 uppercase tracking-widest font-black">Ticket Subject</th>
                                    <th className="px-8 py-4 text-[10px] text-slate-400 uppercase tracking-widest font-black">Status / Comments</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {AGING_TICKETS.map((ticket, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {ticket.assignee[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-700">{ticket.assignee}</p>
                                                    <p className="text-[10px] text-slate-400">{ticket.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-xs text-slate-600 font-medium group-hover:text-[#0a1e40] transition-colors">{ticket.subject}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0" />
                                                <p className="text-xs text-slate-500 italic leading-relaxed">{ticket.comment}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Export */}
                <div className="flex justify-center pt-8">
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-3 px-10 py-5 bg-white border border-[#d4af37] text-[#c5a059] font-bold rounded-full hover:bg-[#d4af37] hover:text-white transition-all shadow-lg uppercase tracking-[0.2em] text-[12px]"
                    >
                        <Download size={18} /> Download Executive Report
                    </button>
                </div>

                <footer className="pt-20 text-center">
                    <p className="text-[10px] text-slate-300 uppercase tracking-[0.5em]">
                        © 2025 THE ESTÉE LAUDER COMPANIES INC. | CONFIDENTIAL IT OPERATIONS
                    </p>
                </footer>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, subtext, icon, iconColor }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center group hover:shadow-md transition-all">
        <div className="text-slate-400 group-hover:text-[#d4af37] transition-colors mb-4" style={{ color: iconColor }}>
            {icon}
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
        <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[42px] font-light text-[#0a1e40] leading-none">{value}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium">{subtext}</p>
    </div>
);
