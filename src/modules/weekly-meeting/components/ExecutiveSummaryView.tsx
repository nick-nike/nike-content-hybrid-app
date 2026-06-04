import React from 'react';
import {
    Sparkles,
    Activity,
    BarChart2,
    Layers,
    AlertCircle,
    ClipboardList,
    AlertTriangle,
    ShieldCheck,
    GraduationCap,
    BookOpenCheck,
    Users,
    HeartHandshake,
    ChevronRight,
    Info,
    Award
} from 'lucide-react';

export const ExecutiveSummaryView: React.FC = () => {
    return (
        <div className="text-[#0b1f42] py-4 animate-in fade-in duration-1000" style={{ fontFamily: "'Optima', 'Candara', 'Noto Sans SC', sans-serif" }}>

            {/* Header section moved to parent if needed, but keeping it as a full view integration */}
            <header className="text-center mb-10">
                <div className="flex justify-center mb-4">
                    <Sparkles className="text-[#ac9362] w-6 h-6" strokeWidth={1} />
                </div>
                <h1 className="text-3xl md:text-4xl tracking-[0.15em] uppercase font-medium mb-2 text-[#0b1f42]">
                    Service Delivery Executive Summary
                </h1>
                <p className="text-sm tracking-widest text-[#ac9362] uppercase font-medium border-t border-[#ac9362] pt-2 inline-block px-8">
                    Q4 (Oct - Dec) Review & Recovery Plan
                </p>
            </header>

            {/* Core Metrics Cards - Full Width for Volume Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Benchmark Card */}
                <div className="bg-white p-6 shadow-sm border-t-2 border-[#ac9362] flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#ac9362] font-bold mb-2">Benchmark Status</p>
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-4xl font-serif text-[#0b1f42]">2</h2>
                            <span className="text-xs text-[#595959]">Domains (FIN, SC)</span>
                        </div>
                    </div>
                    <div className="p-4 bg-[#fbfaf8] rounded-full border border-[#e6dcc5]">
                        <Award className="text-[#ac9362] w-6 h-6" />
                    </div>
                </div>

                {/* Volume Health Card */}
                <div className="bg-white p-6 shadow-sm border-t-2 border-[#0b1f42] flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#0b1f42] font-bold mb-2">Volume Health</p>
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-4xl font-serif text-[#0b1f42]">95%</h2>
                            <span className="text-xs text-[#595959]">Standard Tickets</span>
                        </div>
                    </div>
                    <div className="p-4 bg-[#fbfaf8] rounded-full border border-slate-200">
                        <BarChart2 className="text-[#0b1f42] w-6 h-6" />
                    </div>
                </div>

                {/* SLA Stability Card */}
                <div className="bg-white p-6 shadow-sm border-t-2 border-emerald-500 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold mb-2">SLA Consistency</p>
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-4xl font-serif text-[#0b1f42]">98%</h2>
                            <span className="text-xs text-[#595959]">Avg. Reliability</span>
                        </div>
                    </div>
                    <div className="p-4 bg-[#fbfaf8] rounded-full border border-emerald-100">
                        <ShieldCheck className="text-emerald-500 w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Main Table: Issues & Actions */}
            <div className="w-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-[#e6dcc5] mb-8 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#0b1f42]">
                                <th className="py-5 px-6 text-white font-normal text-xs uppercase tracking-[0.15em] border-r border-[#2a4570] w-[15%]">
                                    <div className="flex items-center gap-2">
                                        <Layers className="text-[#ac9362] w-3.5 h-3.5" />
                                        Category
                                    </div>
                                </th>
                                <th className="py-5 px-6 text-white font-normal text-xs uppercase tracking-[0.15em] border-r border-[#2a4570] w-[35%]">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="text-[#ac9362] w-3.5 h-3.5" />
                                        Root Cause Analysis
                                    </div>
                                </th>
                                <th className="py-5 px-6 text-white font-normal text-xs uppercase tracking-[0.15em] w-[50%]">
                                    <div className="flex items-center gap-2">
                                        <ClipboardList className="text-[#ac9362] w-3.5 h-3.5" />
                                        Strategic Action Plan
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {/* Row 1: Resource Stability */}
                            <tr className="hover:bg-[#fbfaf8] transition-colors border-b border-[#f0f0f0]">
                                <td className="py-6 px-6 align-top border-r border-dashed border-[#e6dcc5]">
                                    <span className="font-semibold text-[#0b1f42] text-base block mb-1">资源稳定性</span>
                                    <span className="text-xs text-[#ac9362] uppercase tracking-wider">Resource Stability</span>
                                </td>
                                <td className="py-6 px-6 align-top text-[#595959] border-r border-dashed border-[#e6dcc5] leading-relaxed">
                                    <ul className="list-disc pl-4 space-y-3">
                                        <li>
                                            <strong className="text-[#0b1f42]">人员断层:</strong> HR / Data / PA 领域稳定性评分仅为 3-4 分。3个月内高频次更替导致 KT 知识损耗严重。
                                        </li>
                                        <li>
                                            <strong className="text-[#0b1f42]">技能错配:</strong> PA 领域急需具备 SQL/Dataworks 能力的成员，而非基础功能支持。
                                        </li>
                                    </ul>
                                </td>
                                <td className="py-6 px-6 align-top text-[#0b1f42] leading-relaxed space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-1 bg-[#ac9362] rounded-full mt-1 shrink-0 h-auto"></div>
                                        <div>
                                            <strong className="block uppercase text-xs tracking-wider mb-1 text-[#ac9362]">Knowledge Continuity</strong>
                                            <p className="text-[#595959]">对 HR (刘泉) 实施闭环 KT，并在软通内部建立‘备选资源池’，确保突发离职时有 Shadowing 补足。</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1 bg-[#0b1f42] rounded-full mt-1 shrink-0 h-auto"></div>
                                        <div>
                                            <strong className="block uppercase text-xs tracking-wider mb-1 text-[#ac9362]">Technical Upskilling</strong>
                                            <p className="text-[#595959]">针对 PA/Data 领域开启 SQL 与 编码专项培训，由标杆组 (SC) 成员担任 Mentor 进行技术指导。</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            {/* Row 2: Operational Discipline */}
                            <tr className="hover:bg-[#fbfaf8] transition-colors border-b border-[#f0f0f0]">
                                <td className="py-6 px-6 align-top border-r border-dashed border-[#e6dcc5]">
                                    <span className="font-semibold text-[#0b1f42] text-base block mb-1">执行透明度</span>
                                    <span className="text-xs text-[#ac9362] uppercase tracking-wider">Execution Discipline</span>
                                </td>
                                <td className="py-6 px-6 align-top text-[#595959] border-r border-dashed border-[#e6dcc5] leading-relaxed">
                                    <ul className="list-disc pl-4 space-y-3">
                                        <li>
                                            <strong className="text-[#0b1f42]">静默风险 (Silent Investigation):</strong> Data 领域存在“闷头调研不反馈”的问题，导致 PO 认为丢单。
                                        </li>
                                        <li>
                                            <strong className="text-[#0b1f42]">响应延迟:</strong> 部分复杂工单未能在 30 分钟内给予“初步确认”反馈。
                                        </li>
                                    </ul>
                                </td>
                                <td className="py-6 px-6 align-top text-[#0b1f42] leading-relaxed space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-1 bg-[#ac9362] rounded-full mt-1 shrink-0 h-auto"></div>
                                        <div>
                                            <strong className="block uppercase text-xs tracking-wider mb-1 text-[#ac9362]">Response Loop Protocol</strong>
                                            <p className="text-[#595959]">强制执行‘先反馈再调研’。即使无方案，也必须在 30min 内同步“已接收并开始处理”状态。</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1 bg-[#0b1f42] rounded-full mt-1 shrink-0 h-auto"></div>
                                        <div>
                                            <strong className="block uppercase text-xs tracking-wider mb-1 text-[#ac9362]">Daily Triple-Check</strong>
                                            <p className="text-[#595959]">下班前强制自查 SNOW/Email/Teams，杜绝因多渠道沟通导致的任何漏单。 (Nickel & Haixiao 执行中)</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                {/* Critical Challenges */}
                <div className="bg-white p-8 border-t-4 border-rose-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-x border-b border-[#e6dcc5]">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-rose-800 w-5 h-5" />
                        <h3 className="text-lg font-medium tracking-wide text-rose-900 uppercase">Critical Risks</h3>
                    </div>
                    <ul className="space-y-4 text-sm text-[#595959]">
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-rose-800 shrink-0"></span>
                            <span><strong className="text-[#0b1f42]">高危领域 (HR/PA/Data):</strong> 稳定性评分均低于 5 分。人员流失直接威胁业务连续性，需从 PM 层面注入‘备份机制’。</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-rose-800 shrink-0"></span>
                            <span><strong className="text-[#0b1f42]">低级失误率:</strong> DWP 与 Brand 领域虽表现尚可，但仍存在低级失误 (Bad logic)，需建立‘双人 Review’机制。</span>
                        </li>
                    </ul>
                </div>

                {/* Performance Benchmarks */}
                <div className="bg-white p-8 border-t-4 border-emerald-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-x border-b border-[#e6dcc5]">
                    <div className="flex items-center gap-3 mb-4">
                        <Award className="text-emerald-700 w-5 h-5" />
                        <h3 className="text-lg font-medium tracking-wide text-green-800 uppercase">Benchmark Excellence</h3>
                    </div>
                    <ul className="space-y-4 text-sm text-[#595959]">
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-emerald-700 shrink-0"></span>
                            <span><strong className="text-[#0b1f42]">FIN & SC 完美交付:</strong> 所有维度 10 分满分，朱争光、端姿等核心成员已成为全团队的服务标杆。</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="block w-1.5 h-1.5 mt-2 rounded-full bg-emerald-700 shrink-0"></span>
                            <span><strong className="text-[#0b1f42]">学习能效提升:</strong> 周远 (DWP) 在 onboarding 后进步神速，其‘快速上手’的经验正在全组推广。</span>
                        </li>
                    </ul>
                </div>
            </div>


            {/* Roadmap & Priorities */}
            <div className="w-full mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-px bg-[#e6dcc5] flex-grow"></div>
                    <h2 className="text-xl md:text-2xl tracking-[0.1em] uppercase font-medium text-[#0b1f42] text-center px-4">
                        Roadmap & Priorities for Q3 FY26
                    </h2>
                    <div className="h-px bg-[#e6dcc5] flex-grow"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pillar 1: Talent Readiness */}
                    <div className="bg-[#fcfbf9] p-6 border border-[#e6dcc5] hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6dcc5]">
                            <GraduationCap className="text-[#ac9362] w-5 h-5" />
                            <h3 className="font-semibold text-[#0b1f42] uppercase tracking-wide text-sm">培训与能力建设 (Talent Readiness)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-[#595959]">
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Onboarding Optimization:</strong> 完善新人KT Confluence文档，设定每月SOP产出指标。</div>
                            </li>
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Internal Buffer:</strong> 确保New Hire 正式接手处理Tickets之前，在软通内部完成至少2 周的内部KT。</div>
                            </li>
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Cross-KT:</strong> 制定团队内部交叉培训计划，提升单兵多能。</div>
                            </li>
                        </ul>
                    </div>

                    {/* Pillar 2: Knowledge Assets */}
                    <div className="bg-[#fcfbf9] p-6 border border-[#e6dcc5] hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6dcc5]">
                            <BookOpenCheck className="text-[#ac9362] w-5 h-5" />
                            <h3 className="font-semibold text-[#0b1f42] uppercase tracking-wide text-sm">知识库建设 (Knowledge Assets)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-[#595959]">
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">KPI Driven:</strong> 设定 Confluence 指标，每周至少产出/更新 <span className="font-bold text-[#ac9362]">7</span> 篇case文档。</div>
                            </li>
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Peer Review:</strong> 建立同一组L2双人互检机制，配合管理层定期抽查，确保文档的准确性与时效性。</div>
                            </li>
                        </ul>
                    </div>

                    {/* Pillar 3: Operational Resilience */}
                    <div className="bg-[#fcfbf9] p-6 border border-[#e6dcc5] hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6dcc5]">
                            <Users className="text-[#ac9362] w-5 h-5" />
                            <h3 className="font-semibold text-[#0b1f42] uppercase tracking-wide text-sm">资源优化 (Resource Optimization)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-[#595959]">
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Data Team Boost:</strong> Dec 20 起增加 0.5 FTE (共 2.5 FTE)，强化 Data 组交付能力。</div>
                            </li>
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Goal:</strong> 通过每日下班前 "Email/Teams/SNOW" 三查，实现零漏单。</div>
                            </li>
                        </ul>
                    </div>

                    {/* Pillar 4: Governance & Culture */}
                    <div className="bg-[#fcfbf9] p-6 border border-[#e6dcc5] hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#e6dcc5]">
                            <HeartHandshake className="text-[#ac9362] w-5 h-5" />
                            <h3 className="font-semibold text-[#0b1f42] uppercase tracking-wide text-sm">管理与文化 (Governance & Culture)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-[#595959]">
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Ticket Review:</strong> 自 Dec 6起，每隔 2-3 天，管理者主导进行跟每个L2的深度复盘，识别共性问题，提供针对性解决方案。</div>
                            </li>
                            <li className="flex gap-2">
                                <ChevronRight className="w-4 h-4 text-[#ac9362] shrink-0 mt-0.5" />
                                <div><strong className="text-[#0b1f42]">Bi-Weekly Huddle:</strong> 自Dec 6起，及时暴露问题并提供团队关怀。</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer info */}
            <div className="bg-[#fcfbf9] w-full px-6 py-4 border-t border-[#e6dcc5] flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Info className="text-[#ac9362] w-3 h-3" />
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Confidential - Internal Use Only
                    </div>
                </div>
                <div className="text-[10px] text-[#ac9362] font-serif italic hidden md:block">
                    Make Beautiful Technology Together.
                </div>
            </div>
        </div>
    );
};
