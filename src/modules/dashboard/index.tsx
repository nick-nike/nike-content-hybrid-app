import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    CheckCircle2,
    Clock,
    BarChart3,
    Download,
    Lightbulb,
    Layers,
    Target,
    ShieldCheck,
    AlertCircle,
    Cpu,
    Calendar,
    Users,
    FileText,
    ExternalLink
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// ==========================================
// 1. DATA CONSTANTS (Based on Latest 'Jan 22 - Feb 4' Report)
// ==========================================

const TICKETS_BY_SYSTEM = [
    { name: 'China Data Portal', value: 52 },
    { name: 'China Data Platform', value: 24 },
    { name: 'GCC-SalesForce', value: 13 },
    { name: 'Control Tower', value: 10 },
    { name: 'CSR', value: 1 }
];

const ISSUE_CATEGORIES = [
    { name: 'OP-OperationTask', value: 31 },
    { name: 'Req-Account/Access', value: 27 },
    { name: 'Issue-Data Correction', value: 13 },
    { name: 'OP-MonitorTask', value: 10 },
    { name: 'Issue-RerunJob', value: 9 },
    { name: 'Req-Data Manual Operation', value: 5 },
    { name: 'Req-Information / FAQ', value: 4 },
    { name: 'Req-Configuration', value: 3 },
    { name: 'Issue-SystemIssue', value: 2 }
];

const AGING_TICKETS = [
    { assignee: 'Jerry Wang', date: 'Jan 28', subject: 'HRBI - L2 Data Support Catch Up', comment: '历史遗留问题' },
    { assignee: 'Kangsheng Shu', date: 'Jan 26', subject: 'Iris Liang 账号全线开通——Data Portal', comment: 'LM审批通过，但AS团队未审批通过，故未开通Commit报表权限，未关单' },
    { assignee: 'Kangsheng Shu', date: 'Jan 26', subject: '回复：【数据权限开通申请】Dataportal MSD数据权限开通-OR Chealsie', comment: '未给Report Owner获取审批邮件，已邮件催过' },
    { assignee: 'Kangsheng Shu', date: 'Jan 27', subject: 'CRM dashboard access for April Zhu', comment: 'Marketingportal CRM的权限未获取Report Owner审批' },
    { assignee: 'Kangsheng Shu', date: 'Jan 27', subject: 'MAC西区大柜长CHINA DATA PORTAL报表问题', comment: 'LM未审批，已告知' },
    { assignee: 'Kangsheng Shu', date: 'Jan 28', subject: 'Teams沟通：需要All Channel报表', comment: '需要All Channel报表，但未获取BGM审批' },
    { assignee: 'Kangsheng Shu', date: 'Jan 28', subject: 'RE: 【Need your approval】Daily Report 自动化报表权限申请', comment: 'Report Owner未审批' },
    { assignee: 'Kangsheng Shu', date: 'Jan 28', subject: '回复：申请开通Data Portal报表权限', comment: 'LM未审批，已告知' },
    { assignee: 'Kangsheng Shu', date: 'Jan 28', subject: '回复：申请新增marketing portal-CRM板块权限', comment: 'Report Owner未审批' },
    { assignee: 'Kangsheng Shu', date: 'Jan 29', subject: 'data portal开通权限申请', comment: '未获取LM和BGM审批' }
];

const ASSIGNEE_WORKLOAD = [
    {
        name: 'Kangsheng Shu', total: 92, details: [
            { status: 'Resolved', value: 47 },
            { status: 'Closed', value: 25 },
            { status: 'In Progress', value: 18 },
            { status: 'Assigned', value: 2 }
        ]
    },
    {
        name: 'Jerry Wang', total: 9, details: [
            { status: 'Resolved', value: 5 },
            { status: 'In Progress', value: 2 },
            { status: 'Closed', value: 1 },
            { status: 'Assigned', value: 1 }
        ]
    }
];

const CI_ASSIGNMENT = [
    { ci: 'China Data Portal', total: 52, assignees: [{ name: 'Kangsheng Shu', val: 46 }, { name: 'Jerry Wang', val: 6 }] },
    { ci: 'China Data Platform', total: 24, assignees: [{ name: 'Kangsheng Shu', val: 22 }, { name: 'Jerry Wang', val: 2 }] },
    { ci: 'GCC-SalesForce', total: 13, assignees: [{ name: 'Kangsheng Shu', val: 13 }] },
    { ci: 'Control Tower', total: 10, assignees: [{ name: 'Kangsheng Shu', val: 10 }] },
    { ci: 'CSR', total: 1, assignees: [{ name: 'Jerry Wang', val: 1 }] }
];

// ==========================================
// 2. THEME & STYLES
// ==========================================

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
// 3. MAIN COMPONENT
// ==========================================

export const DashboardPage: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const exportToPDF = async () => {
        const element = document.getElementById('dashboard-root');
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#fcfcfc' });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Lululemon-Executive-Data-Report-Feb5.pdf`);
    };

    const getSystemDistOption = () => ({
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '10%', bottom: '3%', top: '5%', containLabel: true },
        xAxis: { type: 'value', axisLabel: { show: false }, splitLine: { show: false } },
        yAxis: {
            type: 'category',
            data: TICKETS_BY_SYSTEM.map(i => i.name).reverse(),
            axisLabel: { color: ELC_COLORS.TEXT_MAIN, fontSize: 11, fontWeight: 500 },
            axisLine: { show: false }
        },
        series: [{
            name: 'Tickets',
            type: 'bar',
            data: TICKETS_BY_SYSTEM.map(i => i.value).reverse(),
            itemStyle: { color: ELC_COLORS.NAVY, borderRadius: [0, 4, 4, 0] },
            label: { show: true, position: 'right', color: ELC_COLORS.TEXT_MAIN, fontSize: 11, fontWeight: 'bold' }
        }]
    });

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
                itemStyle: { color: idx === 0 ? ELC_COLORS.NAVY : idx === 1 ? ELC_COLORS.GOLD : `rgba(10, 30, 64, ${0.7 - idx * 0.08})` }
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
            { name: 'In Progress', type: 'bar', stack: 'total', data: ASSIGNEE_WORKLOAD.map(a => a.details.find(d => d.status === 'In Progress')?.value || 0), itemStyle: { color: '#d4af37' } },
            { name: 'Assigned', type: 'bar', stack: 'total', data: ASSIGNEE_WORKLOAD.map(a => a.details.find(d => d.status === 'Assigned')?.value || 0), itemStyle: { color: '#94a3b8' } }
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
        <div id="dashboard-root" className="min-h-screen bg-[#fcfcfc] pb-24 font-sans text-slate-800 focus:outline-none">

            {/* --- MAIN HEADER TITLE --- */}
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
                    BI-WEEKLY REVIEW (JAN 22 - FEB 4) • DATA OPERATIONS
                </p>
            </div>

            {/* --- TWO KPI SUB-CARDS --- */}
            <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <KPICardSmall title="VOLUME HEALTH" value="102" subtext="Total Valid Tickets" icon={<Layers size={20} />} />
                <KPICardSmall title="RESOLUTION RATE" value="88%" subtext="Excluding 10 tickets ≥ 5 Days" icon={<CheckCircle2 size={20} />} iconColor="#059669" />
            </div>

            {/* --- CORE ANALYSIS SECTION --- */}
            <div className="max-w-[1240px] mx-auto px-6 space-y-12">

                {/* 1. Category & Workload Row */}
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

                {/* 2. CI Assignment Matrix (New Section from Pivot1) */}
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

                {/* 3. Aging Tickets List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#0a1e40] px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="text-white w-4 h-4" />
                            <h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Tickets Unresolved for ≥ 5 Days</h3>
                        </div>
                        <span className="text-white/70 text-[10px] uppercase tracking-widest font-black border border-white/20 px-3 py-1 rounded-full">10 TICKETS IDENTIFIED</span>
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

                {/* --- EXPORT BUTTON --- */}
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

const KPICardSmall = ({ title, value, subtext, icon, iconColor }: any) => (
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
