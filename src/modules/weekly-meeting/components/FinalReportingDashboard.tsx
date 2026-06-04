import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Lightbulb, Activity, TrendingUp, Users, Info, ShieldAlert, MapPin, Globe, Clock, Award
} from 'lucide-react';
import { OrganizationStructure } from './OrganizationStructure';
import { BackupPlan } from './BackupPlan';
import { POFeedback } from './POFeedback';
import { ServiceScores } from './ServiceScores';
import { ExecutiveSummaryView } from './ExecutiveSummaryView';
import { L3RequirementsView } from './L3RequirementsView';
import { TeamUpdatesView } from './TeamUpdatesView';
import { WorkforceGapView } from './WorkforceGapView';
import { CostOptimizationReport } from './CostOptimizationReport';
import { SuccessCaseView } from './SuccessCaseView';

// ==========================================
// 1. DATA CONSTANTS
// ==========================================

const OVERALL_STATS = {
    total: 2979,
    activeHard: 26,
    avgResolveTime: '24.2h',
    healthScore: 94
};

const BU_DATA = [
    { bu: 'FIN', name: 'CN FIN Support', total: 366, Simple: 70.0, Medium: 20.0, Complex: 10.0 },
    { bu: 'HR', name: 'CN HR Support', total: 412, Simple: 20.0, Medium: 40.0, Complex: 40.0 },
    { bu: 'SCM', name: 'CN SCM Support', total: 507, Simple: 20.0, Medium: 70.0, Complex: 10.0 },
    { bu: 'Data', name: 'CN Data Support', total: 787, Simple: 60.0, Medium: 30.0, Complex: 10.0 },
    { bu: 'CSP', name: 'CN-CSP', total: 104, Simple: 60.0, Medium: 30.0, Complex: 10.0 },
    { bu: 'NCO', name: 'CN-NCO', total: 381, Simple: 70.0, Medium: 20.0, Complex: 10.0 },
    { bu: 'DWP', name: 'CN DWP Support', total: 422, Simple: 50.0, Medium: 30.0, Complex: 20.0 }
];

const PERSONNEL_GROWTH = [
    { name: "Jennie", Nov: 110, Dec: 143, change: "+30.0%", example: "INC10400847", reason: "PO审批流转延迟" },
    { name: "Haixiao", Nov: 31, Dec: 83, change: "+167.7%", example: "INC10455494", reason: "年底业务高峰处理" },
    { name: "Yan Zhang", Nov: 27, Dec: 71, change: "+163.0%", example: "INC10459594", reason: "全球跨时区协作同步" },
    { name: "Lena Zhou", Nov: 34, Dec: 54, change: "+58.8%", example: "INC10459265", reason: "业务需求确认滞后" },
    { name: "Ruizi Hu", Nov: 83, Dec: 28, change: "-66.3%", example: "INC10413186", reason: "重心转向复杂根因分析" },
    { name: "Haixiao", Nov: 161, Dec: 47, change: "-70.8%", example: "INC10424458", reason: "处理底层逻辑高难工单" },
    { name: "Rolo", Nov: 0, Dec: 15, change: "NEW", example: "INC10455299", reason: "入职培训及工具链熟悉" }
];

const COMMUNICATION_OUTLIERS = [
    { Number: "INC10390213", Assignee: "Haixiao", Difficulty: "Simple", Hours: 657, Context: "PO审批流转延迟" },
    { Number: "INC10409002", Assignee: "Ruizi Hu", Difficulty: "Medium", Hours: 1801, Context: "供应商技术对接对齐" },
    { Number: "INC10456029", Assignee: "Jennie", Difficulty: "Medium", Hours: 480, Context: "业务部门需求变更" }
];

const GROWTH_INSIGHTS = [
    {
        title: "业务饱和度与爆发力",
        desc: "12月工单总量较11月显著增长，Haixiao 和 Yan Zhang 在高并发场景下表现卓越，吞吐量大幅提升。",
        icon: <TrendingUp className="text-emerald-500" size={18} />
    },
    {
        title: "沟通成本税 (Communication Tax)",
        desc: "78%的工单延时主因非技术障碍，而是由于PO审批滞后及业务 logic 模糊导致。",
        icon: <Info className="text-[#d4af37]" size={18} />
    },
    {
        title: "技术梯队化转型",
        desc: "核心成员重心转向复杂架构优化，团队已形成‘新成员保基础、资深成员攻核心’的成熟梯队。",
        icon: <Activity className="text-[#0a1e40]" size={18} />
    }
];

const BENCHMARK_CRITERIA = [
    {
        bu: 'FIN Support',
        items: [
            { level: 'Complex', desc: '具体查看业务逻辑，分析问题原因。', example: '分析月结差异逻辑、排查复杂接口计算原因。' },
            { level: 'Medium', desc: '月结BI系统拉报表 / 线上账单处理报错分析 / 跨团队(SC/Global)处理 / 新门店配合测试 / 经分析后需要找L3', example: 'BI报表导出，线上账单处理失败分析，新门店测试，其他业务问题分析' },
            { level: 'Simple', desc: '非FIN问题转发邮件 / 账号权限系统操作 / 用户咨询告知步骤等 / 查询PO时间(历史PO) / 与业务沟通核对账单。', example: '解锁解绑账号、解答用户操作问题' }
        ]
    },
    {
        bu: 'HR Support',
        items: [
            { level: 'Complex', desc: '分析薪资计算逻辑漏洞，排查组织架构找疑难杂症问题原因，后台逻辑梳理和整理成文档 / 分析薪资计算逻辑漏洞，排查组织架构逻辑冲突原因', example: '溯源社保基数计算错误、解决多系统组织树同步逻辑冲突。' },
            { level: 'Medium', desc: '数据库查询考勤脱敏数据 / 薪资报表字段拼凑导出 / 历史合同数据页面恢复 / 跨部门流程核对 / 新假期规则配合测试', example: '拼接SQL提取上月加班数据、协助HR核对跨部门转岗流程。' },
            { level: 'Simple', desc: '非HR问题转发 / 账号创建，权限开通关闭 / 代理审批请假 / 拉取报表数据 / 个人信息咨询。', example: '创建账号，开通/关闭权限，代理审批/请假等' }
        ]
    },
    {
        bu: 'SCM Support',
        items: [
            { level: 'Complex', desc: '具体分析全链路跨系统集成逻辑，定位突发性的复杂业务根因或面临架构逻辑不一致需深度调整的情况。', example: '分析仓库拣货策略逻辑失效原因、排查WMS接口死锁根因。' },
            { level: 'Medium', desc: '集成接口数据同步及修复 (SF/SAP/TP) / 主数据配置修正 (SKU/MAPX/ZRTC) / 核心物流操作支持 (IBD/STO/PGI) / UAT发布、项目发版监控。', example: '批量订正ERP订单状态、协调第三方快递物流接口报错。' },
            { level: 'Simple', desc: '承运商/账号基础保障咨询 / 用户权限管理 (MMS/RMS/TMS/LMS) / 临时数据处理导服 (ZERV/SAP SD数据导出)。', example: '指导一线员工连接RF扫码枪、开通仓库系统账号。' }
        ]
    },
    {
        bu: 'Data Support',
        items: [
            { level: 'Complex', desc: 'Data Factory 管道分析 / Databricks 报表逻辑分析 / GCC 推送过程', example: '定位 ADF Pipeline 管道分析、Databricks 报表逻辑核对、GCC 推送过程排障。' },
            { level: 'Medium', desc: '报表逻辑分析 / DataWorks重跑ETL流程+报表刷新 / 报表复杂数据逻辑分析 / Control Tower报错重跑 / 报表同底表数据验证', example: 'ETL任务局部重试、报表口径订正、Control Tower 异常修复。' },
            { level: 'Simple', desc: '报表权限申请 / 报表访问记录导出 / 报表数据导出 / Tabula报表刷新 / 每日对数 / GCC数据导出 / 管道邮件日常Monitor / 主数据重推 / API Token更新 / SPM推数', example: '开通报表权限、导出日常访问日志、刷新 Tabula 报表数据。' }
        ]
    },
    {
        bu: 'CSP Support',
        items: [
            { level: 'Complex', desc: '终端CSP登录异常。', example: '双11大促前链路稳定性分析、排查支付接口潜在安全隐患。' },
            { level: 'Medium', desc: '竞品数据提交异常 / 月竞品数据修改 / 主体变更 / 新增门店 / 月竞品核对 / 审批人信息和品牌门店消息提供。', example: '核查天猫订单回调日志、处理积分墙残留脏数据。' },
            { level: 'Simple', desc: '增删品柜 / 月竞品数据补录 / 用户配置 / 竞品关注设置 / AC用户更新。', example: '更换官网活动Banner、指导用户如何激活线上会员。' }
        ]
    },
    {
        bu: 'NCO Support',
        items: [
            { level: 'Complex', desc: '具体查看业务逻辑，分析问题原因/订单下单咨询', example: '溯源促销叠加产生的负数订单逻辑、分析中间件并发瓶颈。' },
            { level: 'Medium', desc: '重跑失败的同步任务 /报表字段拼凑导出/订单放单重推等', example: '手动干预卡住的订单流转、协调Global团队解决跨国专线波动。' },
            { level: 'Simple', desc: '账号注册引导 / 订单权限创建/订单状态流转后端强制干预/门店审批流更改/密码重置/ship to同步状态/审批邮件重发', example: '协助查询历史订单流水、开通POS系统操作权限。' }
        ]
    },
    {
        bu: 'DWP Support',
        items: [
            { level: 'Complex', desc: '网络等infra问题 / 创建和修改新的流程 / 查找疑难杂症问题等', example: '网络问题，邮件延迟发送问题' },
            { level: 'Medium', desc: '重要流程节点人修改 / 门店 POS相关问题 / 季度审核', example: 'POPI问题，BGM等节点人调整等' },
            { level: 'Simple', desc: '创建账号 / 查找流程当前情况 / 增加基础信息 / 问题咨询 / 非DWP问题转发', example: '创建账号，查找流程当前节点人，增加供应商等基本信息' }
        ]
    }
];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

export const FinalReportingDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('SUMMARY');
    const [buData, setBuData] = useState<any[]>(BU_DATA);
    const [orgData, setOrgData] = useState<{ domains: any[], resources: any[] }>({ domains: [], resources: [] });
    const [loading, setLoading] = useState(false);

    // 1. 从数据库抽取数据
    const fetchData = async () => {
        try {
            const [buRes, orgRes] = await Promise.all([
                axios.get('http://localhost:5000/api/bu-data'),
                axios.get('http://localhost:5000/api/org-data')
            ]);

            if (buRes.data && buRes.data.length > 0) setBuData(buRes.data);
            if (orgRes.data) setOrgData(orgRes.data);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. 一键创建/重置数据库数据 (满足用户"做个简单的抽取/创建表方式"的要求)
    const handleSeedData = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/bu-data/seed');
            await fetchData();
            alert('数据库表已成功创建，组织架构数据已同步！');
        } catch (err) {
            alert('数据库连接失败，请检查 Docker MongoDB 容器端口映射是否正确');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-800 pb-20">
            {/* Header / Nav */}
            <nav className="sticky top-0 z-50 bg-[#0a1e40] shadow-xl border-b border-[#d4af37]/30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col xl:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-[#d4af37]/30 group hover:border-[#d4af37] transition-all duration-500">
                            <Activity className="text-[#d4af37] w-5 h-5 group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h1 className="text-xl font-light text-white tracking-[0.1em] uppercase" style={{ fontFamily: 'Optima, serif' }}>
                                Estée Lauder Companies
                            </h1>
                            <p className="text-[9px] text-slate-400 tracking-[0.2em] mt-0.5 uppercase">
                                Global IT Operations Dashboard
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap bg-black/30 p-1 rounded-xl backdrop-blur-md border border-white/5 justify-center">
                        {['SUMMARY', 'SUCCESS_STORY', 'COST_OPT', 'L3_REQ', 'TEAM', 'SATURATION', 'GROWTH', 'WORKFORCE', 'BENCHMARK', 'ORGANIZATION', 'BACKUP', 'FEEDBACK', 'SERVICE'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-tight uppercase transition-all duration-500 ${activeTab === tab
                                    ? 'bg-[#d4af37] text-[#0a1e40] shadow-lg scale-105'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab === 'L3_REQ' ? 'L3 REQ' : tab === 'COST_OPT' ? 'COST OPT' : tab === 'SUCCESS_STORY' ? 'Success Story' : tab}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSeedData}
                        disabled={loading}
                        className="ml-4 px-4 py-2 bg-[#d4af37] text-[#0a1e40] text-[10px] font-bold rounded-lg hover:bg-white transition-all shadow-lg"
                    >
                        {loading ? '处理中...' : '初始化/同步数据库'}
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-10 mt-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                {/* 1. Executive Insight Banner - Hidden for L3 REQ tab */}
                {activeTab !== 'L3_REQ' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-700">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] via-[#0a1e40] to-[#d4af37]"></div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#fffcf0] rounded-full blur-3xl opacity-50"></div>

                        <div className="flex gap-8 items-center z-10">
                            <div className="w-16 h-16 rounded-full bg-[#fffcf0] flex items-center justify-center border border-[#d4af37]/30 shrink-0 shadow-inner">
                                <Lightbulb className="w-8 h-8 text-[#d4af37]" />
                            </div>
                            <div>
                                <h2 className="text-2xl text-[#0a1e40] font-medium mb-1" style={{ fontFamily: 'Optima, serif' }}>
                                    Executive Intelligence Summary
                                </h2>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                                    Analysis of <span className="text-[#0a1e40] font-bold">2,979 tickets</span> confirms L2's pivotal role: Complexity has stabilized at <span className="text-[#0a1e40] font-bold">95% Medium & Simple</span>.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-12 text-center z-10 border-l border-slate-100 pl-16">
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Processed</div>
                                <div className="text-4xl font-light text-[#0a1e40]">{OVERALL_STATS.total.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Active High-Risk</div>
                                <div className="text-4xl font-bold text-[#be123c]">{OVERALL_STATS.activeHard}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Dynamic Content Views */}
                {activeTab === 'SUMMARY' && <ExecutiveSummaryView />}
                {activeTab === 'SUCCESS_STORY' && <SuccessCaseView />}
                {activeTab === 'COST_OPT' && <CostOptimizationReport />}
                {activeTab === 'L3_REQ' && <L3RequirementsView />}
                {activeTab === 'SATURATION' && <SaturationView data={buData} />}
                {activeTab === 'GROWTH' && <GrowthView />}
                {activeTab === 'BENCHMARK' && <BenchmarkView data={buData} />}
                {activeTab === 'TEAM' && <TeamUpdatesView />}
                {activeTab === 'WORKFORCE' && <WorkforceGapView />}
                {activeTab === 'ORGANIZATION' && <OrganizationStructure domains={orgData.domains} resourcePool={orgData.resources} />}
                {activeTab === 'BACKUP' && <BackupPlan />}
                {activeTab === 'FEEDBACK' && <POFeedback />}
                {activeTab === 'SERVICE' && <ServiceScores />}

            </main>

            <footer className="mt-20 py-10 border-t border-slate-200 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em]">
                    © 2025 THE ESTÉE LAUDER COMPANIES INC. | CONFIDENTIAL IT REPORTING
                </p>
            </footer>
        </div>
    );
};

// ==========================================
// VIEW COMPONENTS
// ==========================================

const SaturationView = ({ data }: { data: any[] }) => (
    <div className="grid grid-cols-12 gap-10 lg:h-[550px]">
        <div className="col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-10 flex flex-col h-full">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h3 className="text-xl text-[#0a1e40]" style={{ fontFamily: 'Optima, serif' }}>System Complexity Profile</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Resource allocation by Business Unit</p>
                </div>
                <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#059669]"></div> Simple</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#d97706]"></div> Medium</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#be123c]"></div> Complex</span>
                </div>
            </div>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" barSize={32} margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="bu"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#0a1e40', fontSize: 13, fontWeight: 700 }}
                            width={50}
                        />
                        <Tooltip cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="Simple" stackId="a" fill="#059669" radius={[4, 0, 0, 4]} />
                        <Bar dataKey="Medium" stackId="a" fill="#d97706" />
                        <Bar dataKey="Complex" stackId="a" fill="#be123c" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="col-span-4 space-y-8 flex flex-col h-full">
            <div className="bg-[#0a1e40] rounded-2xl p-8 text-white flex-1 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldAlert size={80} />
                </div>
                <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-6" style={{ fontFamily: 'Optima, serif' }}>Risk Outliers</h3>
                <div className="space-y-4">
                    {COMMUNICATION_OUTLIERS.map((outlier, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-[#d4af37] tracking-widest">{outlier.Number}</span>
                                <span className="text-[11px] font-bold text-rose-400">{outlier.Hours}h Delay</span>
                            </div>
                            <p className="text-xs text-slate-300 italic">"{outlier.Context}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const GrowthView = () => (
    <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GROWTH_INSIGHTS.map((insight, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                            {insight.icon}
                        </div>
                        <h4 className="text-sm font-black text-[#0a1e40] tracking-tight">{insight.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{insight.desc}</p>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                    <h3 className="text-xl text-[#0a1e40]" style={{ fontFamily: 'Optima, serif' }}>个人能效增长矩阵 (Personnel Matrix)</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">11月 v.s. 12月 效能比对分析</p>
                </div>
                <Users className="text-[#0a1e40] opacity-20" size={32} />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[#0a1e40] text-slate-400 text-[10px] uppercase tracking-widest">
                        <tr>
                            <th className="px-10 py-5">运维人员</th>
                            <th className="px-10 py-5 text-center">11月工单</th>
                            <th className="px-10 py-5 text-center">12月工单</th>
                            <th className="px-10 py-5 text-center">增长率</th>
                            <th className="px-10 py-5">能效洞察 / 典型案例</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {PERSONNEL_GROWTH.map((row) => (
                            <tr key={row.name} className="hover:bg-slate-50/80 transition-all duration-300">
                                <td className="px-10 py-6 font-bold text-[#0a1e40]">{row.name}</td>
                                <td className="px-10 py-6 text-center text-slate-400">{row.Nov}</td>
                                <td className="px-10 py-6 text-center font-bold text-[#0a1e40]">{row.Dec}</td>
                                <td className="px-10 py-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tight ${row.change.startsWith('+') || row.change === 'NEW' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-500'
                                        }`}>
                                        {row.change}
                                    </span>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-black">{row.example}</div>
                                            <div className="text-xs text-slate-500 italic truncate max-w-[200px]">关键影响因子定位</div>
                                        </div>
                                        <div className="text-[11px] text-[#0a1e40] font-medium flex items-center gap-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></div> {row.reason}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const BenchmarkView = ({ data }: { data: any[] }) => (
    <div className="bg-white rounded-3xl shadow-2xl border border-[#d4af37]/20 overflow-hidden transform-gpu">
        {/* Header Section */}
        <div className="relative p-10 bg-[#0a1e40] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-light tracking-[0.3em] uppercase text-white mb-3" style={{ fontFamily: 'Optima, serif' }}>
                        Standard Classification Matrix
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-12 bg-[#d4af37]"></div>
                        <p className="text-[10px] text-[#d4af37] uppercase font-bold tracking-[0.2em]">Analysis of 2,979 tickets confirms L2's pivotal role: Complexity has stabilized at 95% Medium & Simple</p>
                    </div>
                </div>
                <div className="p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <Award className="text-[#d4af37]" size={36} strokeWidth={1.5} />
                </div>
            </div>
        </div>

        <div className="p-0">
            <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-[#fcfaf2] border-b border-[#d4af37]/10">
                    <tr>
                        <th className="px-8 py-8 w-[15%] text-[11px] uppercase font-black tracking-[0.2em] text-[#8b7355]">Business Unit</th>
                        <th className="px-8 py-8 w-[25%] text-center text-[11px] uppercase font-black tracking-[0.2em] text-[#8b7355]">Difficulty & %</th>
                        <th className="px-8 py-8 w-[60%] text-[11px] uppercase font-black tracking-[0.2em] text-[#8b7355]">Classification Criteria</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#d4af37]/5">
                    {BENCHMARK_CRITERIA.map((group, groupIdx) => (
                        <React.Fragment key={groupIdx}>
                            {group.items.map((item, itemIdx) => (
                                <tr key={`${groupIdx}-${itemIdx}`} className="group hover:bg-[#fcfaf2]/50 transition-all duration-500">
                                    {itemIdx === 0 && (
                                        <td className="px-8 py-12 align-top bg-white border-r border-[#d4af37]/5" rowSpan={group.items.length}>
                                            <div className="relative">
                                                <span className="absolute -top-6 -left-2 text-4xl font-serif italic text-[#d4af37]/10 pointer-events-none">BU</span>
                                                <div className="text-xl font-light tracking-tight text-[#0a1e40] leading-tight" style={{ fontFamily: 'Optima, serif' }}>
                                                    {group.bu}
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-4 py-8">
                                        <div className="flex items-center justify-center gap-4">
                                            {/* Percentage */}
                                            {(() => {
                                                const buCode = group.bu.split(' ')[0];
                                                const stats = data.find((b: any) => b.bu === buCode);
                                                const pct = stats ? stats[item.level as keyof typeof stats] : 0;
                                                const val = typeof pct === 'number' ? pct : 0;
                                                return (
                                                    <span className={`w-12 text-right text-[12px] font-bold tabular-nums tracking-wider ${val > 0 ? 'text-[#0a1e40]' : 'text-slate-200'}`}>
                                                        {val.toFixed(0)}%
                                                    </span>
                                                );
                                            })()}

                                            {/* Badge */}
                                            <div className={`w-28 text-center text-[10px] font-bold py-2 rounded-full uppercase tracking-[0.1em] shadow-sm transform group-hover:scale-105 transition-all duration-300 ${item.level === 'Complex' ? 'bg-[#7f1d1d] text-white' :
                                                item.level === 'Medium' ? 'bg-[#92400e] text-white' :
                                                    'bg-[#065f46] text-white'
                                                }`}>
                                                {item.level}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-[14px] text-[#1e293b] font-normal leading-relaxed group-hover:text-[#0a1e40]">
                                        {item.desc}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Legend Footer */}
        <footer className="bg-white border-t border-[#d4af37]/10 p-10 flex justify-center items-center space-x-16">
            <LegendItem color="#7f1d1d" label="High Impact Logic" />
            <LegendItem color="#92400e" label="Cross-Team Coordination" />
            <LegendItem color="#065f46" label="Standard Procedure" />
        </footer>
    </div>
);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-4 group cursor-default">
        <div className="relative">
            <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: color }}></div>
            <div className="absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-20" style={{ backgroundColor: color }}></div>
        </div>
        <span className="text-[11px] font-bold text-[#8b7355] uppercase tracking-[0.2em] group-hover:text-[#0a1e40] transition-colors">{label}</span>
    </div>
);
