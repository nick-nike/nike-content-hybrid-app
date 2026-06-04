import React from 'react';
import { MessageSquare, Target, Zap, ShieldAlert, Award, Users, TrendingUp } from 'lucide-react';

const FEEDBACK_DATA = [
    {
        title: "SC & RA (Benchmark)",
        owner: "Phoebe",
        high: true,
        metrics: [
            { label: "Service Quality", val: 10, pct: 100, high: true },
            { label: "Communication", val: 10, pct: 100, high: true },
            { label: "Skills", val: 10, pct: 100, high: true },
            { label: "Stability", val: 10, pct: 100, high: true }
        ],
        voices: [
            {
                type: "positive",
                title: "卓越运营 (SME Group Excellence)",
                desc: "朱争光作为核心人员专业能过硬，尽心尽责；姗姗学习能力极强，短时间内快速上手并获好评。"
            }
        ],
        actions: [
            { title: "Lead by Example", desc: "继续保持高标准交付，并开始拓展至 SAP 领域（如姗姗与 Ken 配合）。" }
        ]
    },
    {
        title: "Finance (Perfect Delivery)",
        owner: "Sherry",
        high: true,
        metrics: [
            { label: "Service Quality", val: 10, pct: 100, high: true },
            { label: "Communication", val: 10, pct: 100, high: true },
            { label: "Skills", val: 10, pct: 100, high: true },
            { label: "Stability", val: 10, pct: 100, high: true }
        ],
        voices: [
            {
                type: "positive",
                title: "全维度满分表现",
                desc: "端姿表现完美，所有维度均为10分。不仅质量高，且在紧急问题及加班支持上配合度极好。"
            }
        ],
        actions: [
            { title: "Resilience", desc: "维持高负荷下的交付稳定性，通过内部 Weekly Huddle 确保持续成长。" }
        ]
    },
    {
        title: "DWP (Digital Workplace)",
        owner: "Torin",
        metrics: [
            { label: "Service Quality", val: 8, pct: 80 },
            { label: "Communication", val: 8, pct: 80 },
            { label: "Skills", val: 8, pct: 80 },
            { label: "Stability", val: 9, pct: 90, high: true }
        ],
        voices: [
            {
                type: "positive",
                title: "响应速度显著改善",
                desc: "周远的学习理解和沟通能力获高度认可，近期相对于 onboarding 初期已有明显改善。"
            },
            {
                type: "negative",
                title: "业务深度不足",
                desc: "仍需避免低级失误，提升泛微平台原生模块的配置能力。"
            }
        ],
        actions: [
            { title: "Skill Boost", desc: "明确 P1-P4 响应机制，提升复杂场景下的独立解决能力。" }
        ]
    },
    {
        title: "Brand (CSP & NCO)",
        owner: "William",
        metrics: [
            { label: "Service Quality", val: 7, pct: 70 },
            { label: "Communication", val: 7, pct: 70 },
            { label: "Skills", val: 7, pct: 70 },
            { label: "Stability", val: 6, pct: 60, low: true }
        ],
        voices: [
            {
                type: "positive",
                title: "过渡平稳 (Transition)",
                desc: "Jennie/Haixiao 工作积极，NCO 运行平稳无 P1 事故；Haixiao 在邮件切换项目中表现出色。"
            },
            {
                type: "negative",
                title: "沟通核心化 (AS Priority)",
                desc: "AS 团队是管货的，沟通协调能力特别重要。需提升与 PO、PM 及 L3 的反馈跟进频率。"
            }
        ],
        actions: [
            { title: "Independence", desc: "在泛微驻场撤出后，需确保能独挡一面处理 NCO 所有问题。" }
        ]
    },
    {
        title: "Data (Commercial)",
        owner: "Thomas",
        metrics: [
            { label: "Service Quality", val: 6, pct: 60, low: true },
            { label: "Communication", val: 8, pct: 80 },
            { label: "Skills", val: 7, pct: 70 },
            { label: "Stability", val: 4, pct: 40, low: true }
        ],
        voices: [
            {
                type: "negative",
                title: "静默排查风险",
                desc: "遇难题不首先响应而是直接调研，导致提单人认为没有跟进；人员稳定性差影响服务质量。"
            }
        ],
        actions: [
            { title: "Communication Loop", desc: "强制执行‘先反馈再调研’机制；明确 Data L2 职责划分及 Working Model。" }
        ]
    },
    {
        title: "PA (Platform Support)",
        owner: "Irene",
        metrics: [
            { label: "Service Quality", val: 7, pct: 70 },
            { label: "Communication", val: 7, pct: 70 },
            { label: "Skills", val: 7, pct: 70 },
            { label: "Stability", val: 4, pct: 40, low: true }
        ],
        voices: [
            {
                type: "negative",
                title: "稳定性与技术错配",
                desc: "已交接 2 次，成员不够稳定。急需具备 SQL、Dataworks 工具 and 编码能力的运维注入。"
            }
        ],
        actions: [
            { title: "Technical Upskilling", desc: "培养产品能力，同时稳定 L2 成员，避免持续的 KT 消耗。" }
        ]
    },
    {
        title: "HR (People Strategy)",
        owner: "Emma",
        metrics: [
            { label: "Service Quality", val: 6, pct: 60, low: true },
            { label: "Communication", val: 6, pct: 60, low: true },
            { label: "Skills", val: 5, pct: 50, low: true },
            { label: "Stability", val: 3, pct: 30, low: true }
        ],
        voices: [
            {
                type: "negative",
                title: "关键节点敏感度",
                desc: "月底 HC Plan 审批、月中薪资报告等关键节点需提高 SLA 敏感度。复杂代码排查耗时过长。"
            }
        ],
        actions: [
            { title: "Stable Transition", desc: "确保刘泉能独立处理运维，通过轮岗或备份计划消除突发人员更替风险。" }
        ]
    }
];

const EXECUTIVE_INSIGHTS = [
    {
        domain: "SC & RA",
        insight: "标杆交付，能力输出拓展至 SAP 领域。(Benchmark delivery, expanding expertise to SAP.)",
        icon: <Award className="text-[#ac9362]" size={16} />
    },
    {
        domain: "FIN",
        insight: "全维度满分，高质量支持关键节点。(Perfect score, providing high-quality support.)",
        icon: <TrendingUp className="text-emerald-600" size={16} />
    },
    {
        domain: "DWP",
        insight: "潜力巨大，需补齐原生配置短板。(High potential, bridging native platform gaps.)",
        icon: <Zap className="text-blue-600" size={16} />
    },
    {
        domain: "Brand",
        insight: "过渡平稳，需强化 AS 核心沟通。(Steady transition, prioritize AS team communication.)",
        icon: <Target className="text-indigo-600" size={16} />
    },
    {
        domain: "Data",
        insight: "杜绝静默，明确职责划分。(Eliminate silent investigation, clarify responsibilities.)",
        icon: <MessageSquare className="text-amber-600" size={16} />
    },
    {
        domain: "PA",
        insight: "提升稳定性，强化 SQL/编码能力。(Stabilize team, boost SQL/coding skills.)",
        icon: <Users className="text-rose-600" size={16} />
    },
    {
        domain: "HR",
        insight: "高危领域，急需完善 KT 与稳定性。(High risk, urgent KT & stability improvements.)",
        icon: <ShieldAlert className="text-rose-800" size={16} />
    }
];


export const POFeedback: React.FC = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-1000">

            {/* Strategic Theme Banner */}
            <div className="bg-[#0a1e40] py-6 px-10 rounded-2xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shrink-0">
                        <Target className="text-[#d4af37]" />
                    </div>
                    <p className="text-white text-lg font-light leading-relaxed tracking-wide italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                        "SC & RA set the benchmark for excellence; Immediate focus is required on Data stability; HR/Commercial need to strengthen business acumen; and FIN must improve delivery quality"
                    </p>
                </div>
            </div>

            {/* Executive Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {EXECUTIVE_INSIGHTS.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-slate-50 rounded-bl-xl flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                            {item.icon}
                        </div>
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-[#0a1e40]">{item.domain}</h5>
                        <p className="text-[11px] text-slate-500 leading-tight font-medium">
                            {item.insight}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-10">
                {FEEDBACK_DATA.map((domain, idx) => (
                    <div key={idx} className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 group hover:shadow-xl transition-all duration-300 ${domain.high ? 'border-t-4 border-t-[#d4af37]' : 'border-t-4 border-t-[#0a1e40]'}`}>

                        {/* 1. Metrics Area */}
                        <div className={`md:col-span-3 p-8 border-r border-slate-100 flex flex-col ${domain.high ? 'bg-emerald-50/20' : 'bg-slate-50/30'}`}>
                            <h3 className="text-2xl text-[#0a1e40] font-medium mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{domain.title}</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-8">Owner: {domain.owner}</p>

                            <div className="space-y-4">
                                {domain.metrics.map((m: any, midx) => (
                                    <div key={midx}>
                                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tighter text-slate-500 mb-1.5">
                                            <span>{m.label}</span>
                                            <span className={m.high ? 'text-emerald-600' : m.low ? 'text-rose-600' : 'text-[#0a1e40]'}>{m.val}</span>
                                        </div>
                                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${m.high ? 'bg-emerald-500' : m.low ? 'bg-rose-500' : 'bg-[#0a1e40]'}`}
                                                style={{ width: `${m.pct}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Feedback Area */}
                        <div className="md:col-span-5 p-8 border-r border-slate-100">
                            <h4 className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-6">Voice of PO</h4>
                            <div className="space-y-6">
                                {domain.voices.map((v, vidx) => (
                                    <div key={vidx} className="flex gap-4 group/item">
                                        <div className={`w-1 h-auto rounded-full ${v.type === 'positive' ? 'bg-emerald-400' : v.type === 'negative' ? 'bg-rose-400' : 'bg-[#d4af37]'}`}></div>
                                        <div>
                                            <h5 className="text-sm font-black text-slate-800 mb-1 group-hover/item:text-[#0a1e40] transition-colors">{v.title}</h5>
                                            <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Action Plan Area */}
                        <div className="md:col-span-4 p-8 bg-slate-50/10">
                            <h4 className="text-[10px] text-[#d4af37] uppercase tracking-widest font-black mb-6 flex items-center gap-2">
                                <Zap size={10} /> Action Plan
                            </h4>
                            <div className="space-y-6">
                                {domain.actions.map((a, aidx) => (
                                    <div key={aidx} className="relative pl-6 pb-6 border-l border-slate-200 last:pb-0 last:border-l-0">
                                        <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-[#d4af37] ring-4 ring-white"></div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <h5 className="text-sm font-black text-slate-800">{a.title}</h5>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">{a.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="text-center py-10 border-t border-slate-100">
                <p className="text-[10px] text-slate-300 uppercase tracking-[0.5em] italic">Service Excellence • Estée Lauder Continuous Improvement</p>
            </footer>
        </div>
    );
};
