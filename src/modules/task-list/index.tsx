import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, CheckCircle2, Clock, Target, Layers, Cpu, Download, Users, Bot, Send, TerminalSquare, X, CornerDownRight
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

const ELC_COLORS = {
    NAVY: '#0a1e40', GOLD: '#d4af37', GOLD_LIGHT: '#fffcf0', BG_LIGHT: '#fcfcfc',
    WHITE: '#ffffff', BORDER: '#e2e8f0', TEXT_MAIN: '#0a1e40', TEXT_MUTE: '#64748b',
    SUCCESS: '#059669', RISK: '#be123c',
};

// ==========================================
// Agent 可自主使用的数据源与工具箱 (Data Store)
// ==========================================
const DATA_STORE: Record<string, any> = {
    'mar4-mar18': {
        titleDate: "MAR 4 - MAR 18",
        totalValid: "90",
        resolutionRate: "96%",
        pendingExclude: "4",
        TICKETS_BY_SYSTEM: [ { name: "China Data Portal", value: 41 }, { name: "China Data Platform", value: 22 }, { name: "Control Tower", value: 15 }, { name: "GCC-SalesForce", value: 12 } ],
        ISSUE_CATEGORIES: [ { name: "OP-OperationTask", value: 40 }, { name: "Req-Account/Access", value: 27 }, { name: "OP-MonitorTask", value: 8 }, { name: "Issue-Data Correction", value: 7 }, { name: "Req-Data Manual Operation", value: 4 }, { name: "Issue-SystemIssue", value: 2 }, { name: "Req-Information / FAQ", value: 1 }, { name: "Req-addReport", value: 1 } ],
        TOP_REQUESTERS: [ { name: "Kangsheng Shu (IT Ops)", value: 49 }, { name: "Guest Caller / System", value: 4 }, { name: "Chris Wang", value: 2 }, { name: "Alyssa Wei", value: 2 }, { name: "Weina Yu", value: 2 } ],
        AGING_TICKETS: [ { assignee: "Winni Luo", date: "2026-03-12", subject: "转发: 西安SKP 竞品数据问题反馈", comment: "用户邮件提供的门店号和实际门店对不上，确认中" } ],
        ASSIGNEE_WORKLOAD: [ { name: "Kangsheng Shu", total: 63, details: [{ status: "Closed", value: 16 }, { status: "Resolved", value: 45 }, { status: "In Progress", value: 2 }] }, { name: "Winni Luo", total: 27, details: [{ status: "Resolved", value: 17 }, { status: "Closed", value: 8 }, { status: "In Progress", value: 2 }] } ],
        CI_ASSIGNMENT: [ { ci: "China Data Portal", total: 41, assignees: [{ name: "Kangsheng Shu", val: 32 }, { name: "Winni Luo", val: 9 }] }, { ci: "China Data Platform", total: 22, assignees: [{ name: "Winni Luo", val: 18 }, { name: "Kangsheng Shu", val: 4 }] }, { ci: "Control Tower", total: 15, assignees: [{ name: "Kangsheng Shu", val: 15 }] }, { ci: "GCC-SalesForce", total: 12, assignees: [{ name: "Kangsheng Shu", val: 12 }] } ],
        EFFICIENCY_STATS: [ { name: "Kangsheng Shu", tickets: 16, totalHours: 227.71, avgTime: 14.23, topCategory: "Req-Account/Access (9单)" }, { name: "Winni Luo", tickets: 8, totalHours: 235.55, avgTime: 29.44, topCategory: "OP-OperationTask (6单)" } ],
        CATEGORY_TIME_COMPARE: [ { category: 'Account/Access', kangsheng: 14.23, winni: 0, includes: '权限申请, 账号及访问问题' }, { category: 'Operation Task', kangsheng: 11.50, winni: 29.44, includes: 'DataWorks重跑ETL, 日常维护操作' }, { category: 'Data Correction', kangsheng: 10.33, winni: 15.20, includes: '报表数据导出及问题' }, { category: 'Monitor Task', kangsheng: 8.50, winni: 12.10, includes: 'Control Tower Monitor, 日常对数' } ],
        insight_top_req: "在总计 90 单的有效积压与完成清单中，超过 54% (49单) 的来源发起人均为 Kangsheng Shu（IT Ops）... 真正来自于一线具体业务方的技术咨询处于“分散偶发”状态。团队应着手建立自动化巡检脚本。",
        insight_scale: "Kangsheng在此期间处理了 63单 tickets，平均单均耗时为 14.23h。相比之下，Winni 处理了 27单，由于涉及较多较重的手动Operation Task，停留时间约 29.44h。",
        insight_depth: "在 Operation Task 类工单中，Kangsheng 的单均耗时为 11.50h，而Winni的耗时为 29.44h。主要是 Winni 承接的大多属于复杂度较高的大量数据修正和校验任务。"
    },
    'feb6-mar3': {
        titleDate: "FEB 6 - MAR 3",
        totalValid: "132",
        resolutionRate: "95%",
        pendingExclude: "7",
        TICKETS_BY_SYSTEM: [ { name: "China Data Portal", value: 60 }, { name: "China Data Platform", value: 33 }, { name: "Control Tower", value: 22 }, { name: "GCC-SalesForce", value: 15 }, { name: "CSR", value: 1 } ],
        ISSUE_CATEGORIES: [ { name: "OP-OperationTask", value: 43 }, { name: "Req-Account/Access", value: 35 }, { name: "Issue-Data Correction", value: 14 }, { name: "OP-MonitorTask", value: 15 }, { name: "Req-Information / FAQ", value: 10 }, { name: "Req-Data Manual Operation", value: 7 }, { name: "Issue-SystemIssue", value: 4 } ],
        TOP_REQUESTERS: [ { name: "Business Line A", value: 35 }, { name: "Marketing Dept", value: 25 }, { name: "Kangsheng Shu (IT Ops)", value: 20 }, { name: "Finance User", value: 10 }, { name: "Data Engineer", value: 5 } ],
        AGING_TICKETS: [ { assignee: "Jerry Wang", date: "2026-02-08", subject: "China Data Portal网页窗口开通遗留", comment: "等待SME最终审批节点回归" }, { assignee: "Kangsheng Shu", date: "2026-02-26", subject: "测试VM环境阻断", comment: "底层网络团队排查中..." } ],
        ASSIGNEE_WORKLOAD: [ { name: "Kangsheng Shu", total: 96, details: [{ status: "Closed", value: 8 }, { status: "Resolved", value: 85 }, { status: "In Progress", value: 3 }] }, { name: "Winni Luo", total: 24, details: [{ status: "Resolved", value: 20 }, { status: "Closed", value: 2 }, { status: "In Progress", value: 2 }] }, { name: "Jerry Wang", total: 12, details: [{ status: "Resolved", value: 10 }, { status: "Closed", value: 1 }, { status: "In Progress", value: 1 }] } ],
        CI_ASSIGNMENT: [ { ci: "China Data Portal", total: 60, assignees: [{ name: "Kangsheng Shu", val: 40 }, { name: "Winni Luo", val: 15 }, { name: "Jerry Wang", val: 5 }] }, { ci: "China Data Platform", total: 33, assignees: [{ name: "Winni Luo", val: 18 }, { name: "Kangsheng Shu", val: 12 }, { name: "Jerry Wang", val: 3 }] }, { ci: "Control Tower", total: 22, assignees: [{ name: "Kangsheng Shu", val: 22 }] }, { ci: "GCC-SalesForce", total: 15, assignees: [{ name: "Kangsheng Shu", val: 15 }] } ],
        EFFICIENCY_STATS: [ { name: "Kangsheng Shu", tickets: 110, totalHours: 195.4, avgTime: 1.77, topCategory: "Req-Account/Access (50单)" }, { name: "Winni Luo", tickets: 12, totalHours: 98.5, avgTime: 8.20, topCategory: "OP-OperationTask (5单)" }, { name: "Jerry Wang", tickets: 10, totalHours: 120.5, avgTime: 12.05, topCategory: "Issue-Data Correction (6单)" } ],
        CATEGORY_TIME_COMPARE: [ { category: 'Account/Access', kangsheng: 1.50, winni: 0, includes: '权限申请与初始化' }, { category: 'Operation Task', kangsheng: 2.10, winni: 8.20, includes: 'DataWorks重跑ETL' }, { category: 'Data Correction', kangsheng: 5.33, winni: 4.20, includes: '报表数据导出重算' }, { category: 'Monitor Task', kangsheng: 0.50, winni: 5.10, includes: 'Control Tower Monitor' } ],
        insight_top_req: "在 2月的归档数据中，【业务直接提单】占绝对主力，商业线 A 与营销部门提单最为汹涌（合计超过 60单）。当时并没有大量依赖运维同学自行内建单。",
        insight_scale: "Kangsheng 在此期间由于主要处理极大量的标准化【账号申请】单（占比过半），整体平均耗时极低，达到了惊人的 1.77h。Jerry 则接手了较多历史积累的疑难数据修正案。",
        insight_depth: "对于数据修正（Data Correction）这一重灾区，Winni 在二月份处理的效率颇高（4.20h），此时数据尚未产生结构性变化，排查速度快于后期的 15.2h。"
    },
    // ==========================================
    // 🚀 【预留区】：下个汇报周期 (Mar 19 - Apr 1) 的数据插槽
    // 当您的 Python 跑完新鲜的 Excel 后，把生成好的 JSON 覆盖这里所有的 "0" 与 "TBD" 即可。
    // ==========================================
    'mar19-apr1': {
        "titleDate": "MAR 19 - APR 1",
        "totalValid": "107",
        "resolutionRate": "92%",
        "pendingExclude": "6",
        "TICKETS_BY_SYSTEM": [
                {
                        "name": "China Data Portal",
                        "value": 46
                },
                {
                        "name": "China Data Platform",
                        "value": 28
                },
                {
                        "name": "Control Tower",
                        "value": 16
                },
                {
                        "name": "GCC-SalesForce",
                        "value": 12
                },
                {
                        "name": "User Access System",
                        "value": 2
                },
                {
                        "name": "E-Approval",
                        "value": 1
                }
        ],
        "ISSUE_CATEGORIES": [
                {
                        "name": "OP-OperationTask",
                        "value": 28
                },
                {
                        "name": "Req-Account/Access",
                        "value": 27
                },
                {
                        "name": "Req-Data Manual Operation",
                        "value": 16
                },
                {
                        "name": "OP-MonitorTask",
                        "value": 10
                },
                {
                        "name": "Issue-Data Correction",
                        "value": 9
                },
                {
                        "name": "Req-Information / FAQ",
                        "value": 7
                },
                {
                        "name": "Issue-SourceFile",
                        "value": 3
                },
                {
                        "name": "Issue-SystemIssue",
                        "value": 3
                },
                {
                        "name": "Issue-RerunJob",
                        "value": 1
                },
                {
                        "name": "Req-addReport",
                        "value": 1
                },
                {
                        "name": "OP-Training and doc",
                        "value": 1
                },
                {
                        "name": "Req-Configuration",
                        "value": 1
                }
        ],
        "TOP_REQUESTERS": [
                {
                        "name": "Kangsheng Shu",
                        "value": 61
                },
                {
                        "name": "Winni Luo",
                        "value": 4
                },
                {
                        "name": "Sian Chen",
                        "value": 2
                },
                {
                        "name": "Scarlett Huang",
                        "value": 2
                },
                {
                        "name": "Winnie Wei",
                        "value": 2
                }
        ],
        "AGING_TICKETS": [
                {
                        "assignee": "Winni Luo",
                        "date": "2026-03-26",
                        "subject": "MC重庆来福士信息维护",
                        "comment": "nan"
                },
                {
                        "assignee": "Kangsheng Shu",
                        "date": "2026-03-26",
                        "subject": "回复: 企微版全触点权限更新申请",
                        "comment": "nan"
                }
        ],
        "ASSIGNEE_WORKLOAD": [
                {
                        "name": "Kangsheng Shu",
                        "total": 73,
                        "details": [
                                {
                                        "status": "Resolved",
                                        "value": 68
                                },
                                {
                                        "status": "Assigned",
                                        "value": 1
                                },
                                {
                                        "status": "In Progress",
                                        "value": 3
                                },
                                {
                                        "status": "Closed",
                                        "value": 1
                                }
                        ]
                },
                {
                        "name": "Winni Luo",
                        "total": 34,
                        "details": [
                                {
                                        "status": "Resolved",
                                        "value": 30
                                },
                                {
                                        "status": "In Progress",
                                        "value": 3
                                },
                                {
                                        "status": "Assigned",
                                        "value": 1
                                }
                        ]
                }
        ],
        "CI_ASSIGNMENT": [
                {
                        "ci": "China Data Portal",
                        "total": 46,
                        "assignees": [
                                {
                                        "name": "Kangsheng Shu",
                                        "val": 39
                                },
                                {
                                        "name": "Winni Luo",
                                        "val": 7
                                }
                        ]
                },
                {
                        "ci": "China Data Platform",
                        "total": 28,
                        "assignees": [
                                {
                                        "name": "Winni Luo",
                                        "val": 22
                                },
                                {
                                        "name": "Kangsheng Shu",
                                        "val": 6
                                }
                        ]
                },
                {
                        "ci": "Control Tower",
                        "total": 16,
                        "assignees": [
                                {
                                        "name": "Kangsheng Shu",
                                        "val": 16
                                }
                        ]
                },
                {
                        "ci": "GCC-SalesForce",
                        "total": 12,
                        "assignees": [
                                {
                                        "name": "Kangsheng Shu",
                                        "val": 12
                                }
                        ]
                },
                {
                        "ci": "User Access System",
                        "total": 2,
                        "assignees": [
                                {
                                        "name": "Winni Luo",
                                        "val": 2
                                }
                        ]
                },
                {
                        "ci": "Empty",
                        "total": 2,
                        "assignees": [
                                {
                                        "name": "Winni Luo",
                                        "val": 2
                                }
                        ]
                },
                {
                        "ci": "E-Approval",
                        "total": 1,
                        "assignees": [
                                {
                                        "name": "Winni Luo",
                                        "val": 1
                                }
                        ]
                }
        ],
        "EFFICIENCY_STATS": [
        {
                "name": "Kangsheng Shu",
                "tickets": 206,
                "totalHours": 43.05,
                "avgTime": 0.48,
                "topCategory": "Data Portal 权限申请 (34单)"
        },
        {
                "name": "Winni Luo (Haixiao)",
                "tickets": 68,
                "totalHours": 18.8,
                "avgTime": 0.39,
                "topCategory": "日常对数 (33单)"
        }
],
        "CATEGORY_TIME_COMPARE": [
        {
                "category": "China Data Portal",
                "kangsheng": 0.41,
                "winni": 1.05,
                "includes": "China Data Portal"
        },
        {
                "category": "Control Tower",
                "kangsheng": 0.99,
                "winni": 0.0,
                "includes": "Control Tower"
        },
        {
                "category": "GCC-SalesForce",
                "kangsheng": 0.22,
                "winni": 0.0,
                "includes": "GCC-SalesForce"
        },
        {
                "category": "China Data Platform",
                "kangsheng": 0.1,
                "winni": 0.12,
                "includes": "China Data Platform"
        }
],
        "insight_top_req": "经过3月下半旬追踪，可见用户需求类型逐渐稳定，自助化方案推行初见成效。",
        "insight_scale": "根据【260209】Raw Data更新：Kangsheng平均单均耗时为 0.48h，Winni（Haixiao）平均单均耗时 0.39h。Winni（Haixiao）的处理速度(0.39h) 优于 Kangsheng(0.48h)。 这反映了两人承接的任务复杂度存在显著差异。",
        "insight_depth": "在分类对比中，Winni 主要在高耗时区域（例如 Data Portal 账号&权限问题）花费了较多时间；而 Kangsheng 在（Data Portal 报表数据问题Ⅱ, Control Tower 重刷数据）等类别占据主流。建议对高耗时类别建立专门的自动化恢复预案来降低整体影响时长。"
}
};

type Message = { id: string; role: 'user' | 'agent' | 'tool'; content: React.ReactNode; isTyping?: boolean };

// ==========================================
// 主页面组件
// ==========================================
export const TaskListPage: React.FC = () => {
    // ---- 真正的 Dashboard 页面状态 ----
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [viewKey, setViewKey] = useState<string>('mar19-apr1'); // 当前看板绑定的大脑神经元状态
    const [customTitle, setCustomTitle] = useState('DATA SERVICE DELIVERY EXECUTIVE'); // 让大模型可以随意控制的标题
    const data = DATA_STORE[viewKey]; // 按照状态实时读取渲染的数据

    // ---- 上帝模式：动态操控前端 DOM 结构的权力 ----
    const [pageConfig, setPageConfig] = useState<{hiddenSections: string[], injectedHtml: string, bgColor: string}>({
        hiddenSections: [],
        injectedHtml: '',
        bgColor: 'bg-[#fcfcfc]'
    });

    // ---- Agent Copilot 对话框状态 ----
    const [isAgentOpen, setIsAgentOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'agent', content: '您好！我是您的智能数据分析 Agent助手。您可以用自然语言吩咐我查阅历史数据、切换看板时间段、或者解读图表。由于我们已经具备了"自主调用工具"的能力，您试试对我说："帮我把看板切到二月份的数据看看"！' }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isAgentOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAgentOpen]);

    // ==========================================
    // 🤖 Agent 中枢神经系统（ReAct 循环模拟）
    // ==========================================
    const handleAgentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);

        const thoughtId = Date.now().toString() + '_thought';

        if (!apiKey) {
            setMessages(prev => [...prev, { id: thoughtId, role: 'agent', content: '请先在上方输入栏绑定您的 Gemini API Key 测试凭证，否则正式大模型无法启动哦！' }]);
            return;
        }

        setMessages(prev => [...prev, { id: thoughtId, role: 'agent', isTyping: true, content: '正在与云端 Gemini 双向通讯...' }]);

        try {
            // 获取聊天上下文，让大模型拥有记忆（彻底解决单轮对话“听不懂连贯指令”的问题）
            const historyContents = messages
                .filter(m => (m.role === 'user' || m.role === 'agent') && typeof m.content === 'string')
                .map(m => ({
                    role: m.role === 'agent' ? 'model' : 'user', // 注意 Gemini 要求角色是 user 和 model
                    parts: [{ text: m.content as string }]
                }));
            historyContents.push({ role: "user", parts: [{ text: userMsg }] });

            // ===================================
            // 【硬核核心】最原汁原味的 Gemini API 调用请求构建
            // ===================================
            const requestBody = {
                systemInstruction: { parts: [{ text: "你是一个极其强大的全能 AI 副驾（拥有完整的 Gemini 2.5 纯血智力），你不仅可以写代码、生成任意网页、解答科普问题。更重要是，你拥有超级权限工具，能够直接【操纵和重绘当前 React 页面状态】！\n1. 当用户觉得某个图表多余，要求\"删掉\"或\"隐藏\"某块内容（如隐藏饼图、表格、卡片）时，这在原本是做不到的，但你现在有了神级工具 `modify_page_structure`，毫不犹豫调用它填入需要隐藏的区块！\n2. 当用户要求你在页面上\"增加一段通告\"、\"加点新年祝福\"、\"画一个红底绿字的卡片\"时，立刻调用 `modify_page_structure` 往里面填合法的 Tailwind HTML 代码去新增内容！\n3. 当用户嫌弃背景颜色难看时，调用 `modify_page_structure` 帮他改掉 bg-xxx！\n4. 当涉及切换大盘历史时间数据和标题时，调用原有的相关工具。\n记住：你是活的，你的手脚直接插在 React 渲染引擎的心脏上！不要回答'我不能直接改代码'，你可以做到！" }] },
                contents: historyContents,
                tools: [
                    {
                        functionDeclarations: [
                            {
                                name: "switch_dashboard_data_tool",
                                description: "强行篡改React底层的周期状态，如果用户提到的意思是二月份则传入 feb6-mar3；如果是三月初中旬则传入 mar4-mar18；如果是最新的一期/三月底/四月初，则传入 mar19-apr1。",
                                parameters: {
                                    type: "OBJECT",
                                    properties: { target_period: { type: "STRING", enum: ["feb6-mar3", "mar4-mar18", "mar19-apr1"] } }, // ⚠️ 已为您开启了 mar19-apr1 大模型白名单权限
                                    required: ["target_period"]
                                }
                            },
                            {
                                name: "change_page_title_tool",
                                description: "由于页面默认的大标题是 DATA SERVICE DELIVERY EXECUTIVE，调用该工具可以将 React State 里的标题改为用户想改成的任意字符串。",
                                parameters: {
                                    type: "OBJECT",
                                    properties: { new_title: { type: "STRING", description: "提取出的新标题，例如 DATA123 SERVICE DELIVERY EXECUTIVE" } },
                                    required: ["new_title"]
                                }
                            },
                            {
                                name: "modify_page_structure",
                                description: "物理页面外挂级修改器！当你被要求【隐藏/删除页面指定图表区块】、【向页面注入新增的前端 HTML 代码块】或【更改大背景】时一定要调用！",
                                parameters: {
                                    type: "OBJECT",
                                    properties: { 
                                        hide_sections: { type: "ARRAY", items: { type: "STRING", enum: ["section_kpis", "section_category", "section_workload", "section_assignment", "section_top_reqs", "section_aging", "section_efficiency"] }, description: "你想让其从物理上消失的模块ID（kpi代表顶层指标区；category代表饼图区；workload指多分类柱状图区；assignment是格子矩阵；top_reqs是用户画像排名榜单；aging是长时效工单表格区；efficiency是深潜时间分析区）。例如用户说删了KPI和饼图，你就填入这俩id！" },
                                        inject_html: { type: "STRING", description: "你向页面注入的带有丰富 Tailwind 样式的合法 React/HTML <div>块（由于不支持双引号，请用单引号包围class）。" },
                                        page_bg_color: { type: "STRING", description: "改变整个页面外围包装区的背景类 tailwind class，比如用户想要新年红直接写 bg-red-600，夜晚黑直接 bg-slate-900 。默认是 bg-[#fcfcfc]。" }
                                    }
                                }
                            }
                        ]
                    }
                ]
            };

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody)
            });

            const data = await res.json();
            if (data.error) {
                setMessages(prev => prev.map(m => m.id === thoughtId ? { id: m.id, role: 'agent', content: `【Gemini API 抛错】：${data.error.message}` } : m));
                return;
            }

            const candidate = data.candidates?.[0];
            const parts = candidate?.content?.parts || [];
            let handledTool = false;

            // 真正的大模型意图提取 (检查是否有 Function Call 被触发)
            for (const part of parts) {
                if (part.functionCall) {
                    handledTool = true;

                    if (part.functionCall.name === "switch_dashboard_data_tool") {
                        const args = part.functionCall.args;
                        const targetKey = args.target_period;

                        setMessages(prev => prev.map(m => m.id === thoughtId ? { id: m.id, role: 'agent', content: 
                            <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded border border-gray-200">
                                <div className="font-bold flex items-center gap-1 text-slate-700">🧠 Gemini 回传信号:</div>
                                大语言模型自主判定当前应当动用物理工具箱！完全精准定位了传入环境参数变量：【{targetKey}】！即将夺取页面重算控制权！
                            </div>
                        } : m));

                        const toolId = Date.now().toString() + '_tool';
                        await new Promise(r => setTimeout(r, 600));
                        setMessages(prev => [...prev, { id: toolId, role: 'tool', content: 
                            <div className="text-xs font-mono bg-[#0D1117] text-green-400 p-2 rounded mt-2 border border-blue-900 shadow-inner p-3">
                                <div className="font-bold text-blue-400 mb-1">=== NATIVE TOOL EXECUTION ===</div>
                                <div>🚀 System State Override...</div>
                                <div className="mt-1 text-yellow-300">{`> tool.call(switch_dashboard_data_tool, { target_period: "${targetKey}" })`}</div>
                            </div>
                        }]);

                        // 系统底层真正执行：修改 React 的 ViewKey！！！
                        await new Promise(r => setTimeout(r, 800));
                        setViewKey(targetKey);

                        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'agent', content: 
                            <div>
                                <strong className="text-emerald-700 border-b border-emerald-200 pb-1 mb-2 flex items-center gap-2"><CheckCircle2 size={16}/> 真正的大模型任务闭环！</strong>
                                真实的云端模型已经成功发回了指令截停系统渲染，将仪表盘强行拖至 <b>{targetKey}</b> 档案！
                            </div>
                        }]);
                    } 
                    else if (part.functionCall.name === "change_page_title_tool") {
                        const newTitle = part.functionCall.args.new_title;
                        
                        // 【最核心】：在这里真正调用 React Hook 去修改页面的渲染值！
                        setCustomTitle(newTitle); 

                        setMessages(prev => prev.map(m => m.id === thoughtId ? { id: m.id, role: 'agent', content: 
                            <div className="text-xs text-green-700 bg-green-50 p-2 rounded border border-green-300">
                                <div><strong className="text-emerald-800">✅ 物理魔法被触发: </strong> `change_page_title_tool` 成功被模型召唤。</div>
                                <div className="mt-2 text-sm font-medium">看！网页最顶部那个大黑体字的 H1 标题已经被我改成了：<br/><span className="bg-white px-1 text-emerald-900 border font-bold">"{newTitle}"</span></div>
                            </div>
                        } : m));
                    }
                    else if (part.functionCall.name === "modify_page_structure") {
                        const args = part.functionCall.args;
                        
                        // 高级权限解锁：接管 React 的页面 DOM 映射树！
                        setPageConfig(prev => ({
                            hiddenSections: args.hide_sections || prev.hiddenSections,
                            injectedHtml: args.inject_html !== undefined ? args.inject_html : prev.injectedHtml,
                            bgColor: args.page_bg_color || prev.bgColor
                        }));

                        setMessages(prev => prev.map(m => m.id === thoughtId ? { id: m.id, role: 'agent', content: 
                            <div className="text-xs text-purple-700 bg-purple-50 p-2 rounded border border-purple-300">
                                <div><strong className="text-purple-800 uppercase tracking-widest font-black">🛠 终极权限：DOM Override</strong></div>
                                <div className="mt-1">✅ 隐藏区块拦截: {JSON.stringify(args.hide_sections || [])}</div>
                                <div className="mt-1">✅ 新增注入代码: {args.inject_html ? '已经以 AST 语法书写进本地引擎' : '无拦截规则'}</div>
                                <div className="mt-1">✅ 壁纸风格重载: {args.page_bg_color || '维持原状'}</div>
                            </div>
                        } : m));
                    }
                    break;
                }
            }

            // 如果没有发生任何系统调用，那就是纯日常文本聊天：
            if (!handledTool) {
                const textReply = parts.find((p:any) => p.text)?.text || "（大模型好像走神了没理我）";
                setMessages(prev => prev.map(m => m.id === thoughtId ? { id: m.id, role: 'agent', content: textReply } : m));
            }

        } catch (error:any) {
            setMessages(prev => prev.map(m => m.id === thoughtId ? { id: m.id, role: 'agent', content: `【网络失败】：无法请求到外网 API，请检查代理环境或 Key。${error.message}` } : m));
        }
    };

    // 原有的 PDF 导出底层逻辑
    const exportToPDF = async () => {
        if (isExporting) return;
        try {
            setIsExporting(true);
            const element = document.getElementById('report-root');
            if (!element) return;
            const canvas = await toJpeg(element, { quality: 0.95, backgroundColor: '#fcfcfc', pixelRatio: 1.5, filter: (node) => (node as HTMLElement).id !== 'pdf-download-btn' && (node as HTMLElement).id !== 'agent-copilot-container' });
            const pdfDummy = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdfDummy.getImageProperties(canvas);
            const pdfWidth = pdfDummy.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
            pdf.addImage(canvas, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Lululemon-Report-${data.titleDate}.pdf`);
        } catch (error) { console.error(error); alert('导出失败'); } finally { setIsExporting(false); }
    };

    // 图表生成函数动态读取 `data` 即可
    const getCategoryOption = () => ({ backgroundColor: 'transparent', tooltip: { trigger: 'item' }, series: [{ name: 'Issue Category', type: 'pie', radius: ['45%', '70%'], itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 }, label: { show: true, color: ELC_COLORS.TEXT_MAIN, fontSize: 10, position: 'outside' }, data: data.ISSUE_CATEGORIES.map((item:any, idx:number) => ({ ...item, itemStyle: { color: idx === 0 ? ELC_COLORS.NAVY : idx === 1 ? ELC_COLORS.GOLD : `rgba(10, 30, 64, ${0.7 - idx * 0.06})` } })) }] });
    const getWorkloadOption = () => ({ backgroundColor: 'transparent', tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: { bottom: 0, textStyle: { fontSize: 10 } }, grid: { top: '5%', left: '3%', right: '4%', bottom: '15%', containLabel: true }, xAxis: { type: 'category', data: data.ASSIGNEE_WORKLOAD.map((a:any) => a.name) }, yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } } }, series: [ { name: 'Resolved', type: 'bar', stack: 'total', data: data.ASSIGNEE_WORKLOAD.map((a:any) => a.details.find((d:any) => d.status === 'Resolved')?.value || 0), itemStyle: { color: '#059669' } }, { name: 'Closed', type: 'bar', stack: 'total', data: data.ASSIGNEE_WORKLOAD.map((a:any) => a.details.find((d:any) => d.status === 'Closed')?.value || 0), itemStyle: { color: '#0a1e40' } }, { name: 'In Progress', type: 'bar', stack: 'total', data: data.ASSIGNEE_WORKLOAD.map((a:any) => a.details.find((d:any) => d.status === 'In Progress')?.value || 0), itemStyle: { color: '#d4af37' } } ] });
    const getEfficiencyOption = () => ({ backgroundColor: 'transparent', tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, legend: { bottom: 0 }, grid: { top: '10%', left: '3%', right: '4%', bottom: '15%', containLabel: true }, xAxis: { type: 'category', data: data.EFFICIENCY_STATS.map((s:any) => s.name) }, yAxis: { type: 'value', name: 'Avg Resolution Time (Hrs)', splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } } }, series: [ { name: 'Average Time per Ticket', type: 'bar', data: data.EFFICIENCY_STATS.map((s:any) => s.avgTime), itemStyle: { color: (params: any) => params.dataIndex === 0 ? ELC_COLORS.NAVY : ELC_COLORS.GOLD, borderRadius: [4, 4, 0, 0] }, label: { show: true, position: 'top', formatter: '{c}h' } } ] });
    const getTopRequestersOption = () => ({ backgroundColor: 'transparent', tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } }, grid: { top: '5%', left: '3%', right: '10%', bottom: '5%', containLabel: true }, xAxis: { type: 'value', show: false, splitLine: { show: false } }, yAxis: { type: 'category', data: [...data.TOP_REQUESTERS].reverse().map(d => d.name), axisTick: { show: false }, axisLine: { show: false }, axisLabel: { color: ELC_COLORS.TEXT_MAIN, fontWeight: 'bold' } }, series: [ { type: 'bar', data: [...data.TOP_REQUESTERS].reverse().map(d => d.value), label: { show: true, position: 'right', color: ELC_COLORS.TEXT_MAIN, fontWeight: 'bold' }, itemStyle: { color: (params: any) => params.dataIndex === data.TOP_REQUESTERS.length - 1 ? ELC_COLORS.NAVY : 'rgba(212, 175, 55, 0.6)', borderRadius: [0, 4, 4, 0] }, barWidth: '40%' } ] });
    const getCategoryTimeOption = () => ({ backgroundColor: 'transparent', tooltip: { trigger: 'axis' }, legend: { bottom: 0 }, grid: { top: '15%', left: '3%', right: '4%', bottom: '20%', containLabel: true }, xAxis: { type: 'category', data: data.CATEGORY_TIME_COMPARE.map((d:any) => d.category), axisLabel: { interval: 0, rotate: 15, fontSize: 9 } }, yAxis: { type: 'value', name: 'Avg Hours', splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } } }, series: [ { name: 'Kangsheng Shu', type: 'bar', data: data.CATEGORY_TIME_COMPARE.map((d:any) => d.kangsheng), itemStyle: { color: ELC_COLORS.NAVY } }, { name: 'Winni Luo', type: 'bar', data: data.CATEGORY_TIME_COMPARE.map((d:any) => d.winni), itemStyle: { color: ELC_COLORS.GOLD } } ] });

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-white"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0a1e40]"></div></div>;

    return (
        <div id="report-root" className={`min-h-screen ${pageConfig.bgColor} pb-24 font-sans text-slate-800 focus:outline-none relative transition-colors duration-1000`}>
            {/* Header */}
            <div className="text-center py-20 px-6">
                <div className="flex items-center justify-center gap-5 mb-5"><div className="w-12 h-px bg-[#d4af37]/30" /><Activity className="text-[#d4af37]" size={24} /><div className="w-12 h-px bg-[#d4af37]/30" /></div>
                <h1 className="text-[40px] text-[#0a1e40] font-normal tracking-[0.25em] uppercase leading-none" style={{ fontFamily: 'Optima, serif' }}>{customTitle}</h1>
                <p className="text-[12px] text-[#c5a059] font-bold tracking-[0.4em] uppercase mt-4 animate-pulse">BI-WEEKLY REVIEW ({data.titleDate}) • INGESTION OPERATIONS</p>
            </div>

            {/* Injected HTML Placeholder (上帝模式动态新增内容渲染区) */}
            <AnimatePresence>
                {pageConfig.injectedHtml && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-[1240px] mx-auto px-6 mb-12 shadow-2xl rounded-2xl overflow-hidden pt-4 pb-4 bg-white/50 backdrop-blur-xl border border-blue-500 text-slate-800">
                        <div dangerouslySetInnerHTML={{ __html: pageConfig.injectedHtml }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* KPIs */}
            {!pageConfig.hiddenSections.includes('section_kpis') && (
            <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 transition-all duration-700 hover:scale-[1.01]">
                <KPICard title="VOLUME HEALTH" value={data.totalValid} subtext="Total Valid Tickets" icon={<Layers size={20} />} />
                <KPICard title="RESOLUTION RATE" value={data.resolutionRate} subtext={`Excluding ${data.pendingExclude} tickets currently in progress`} icon={<CheckCircle2 size={20} />} iconColor="#059669" />
            </div>
            )}

            <div className="max-w-[1240px] mx-auto px-6 space-y-12">
                <div className="grid grid-cols-12 gap-8">
                    {!pageConfig.hiddenSections.includes('section_category') && (
                    <div className="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="bg-[#0a1e40] px-6 py-4 flex items-center gap-3"><Target className="text-white w-4 h-4" /><h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Issue Category Breakdown</h3></div><div className="p-8 h-[380px]"><ReactECharts option={getCategoryOption()} style={{ height: '100%' }} /></div></div>
                    )}
                    {!pageConfig.hiddenSections.includes('section_workload') && (
                    <div className="col-span-12 lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="bg-[#0a1e40] px-6 py-4 flex items-center gap-3"><Cpu className="text-white w-4 h-4" /><h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Team Workload Distribution</h3></div><div className="p-8 h-[380px]"><ReactECharts option={getWorkloadOption()} style={{ height: '100%' }} /></div></div>
                    )}
                </div>

                {!pageConfig.hiddenSections.includes('section_assignment') && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#0a1e40] px-6 py-4 flex items-center gap-3"><Activity className="text-white w-4 h-4" /><h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Service Assignment Matrix (Affected CI / Service)</h3></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-0 divide-x divide-y divide-slate-100">
                        {data.CI_ASSIGNMENT.map((item:any, idx:number) => (
                            <div key={idx} className="p-6 hover:bg-slate-50/50 transition-all">
                                <div className="flex justify-between items-start mb-4"><h4 className="text-[13px] font-bold text-[#0a1e40]">{item.ci}</h4><span className="text-[10px] font-black bg-[#fcfaf2] border border-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded-full">{item.total}</span></div>
                                <div className="space-y-2">{item.assignees.map((as:any, aIdx:number) => (<div key={aIdx} className="flex justify-between items-center text-[12px]"><span className="text-slate-500">{as.name}</span><span className="font-medium text-[#0a1e40]">{as.val}</span></div>))}</div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {!pageConfig.hiddenSections.includes('section_top_reqs') && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-12 mb-12">
                    <div className="bg-[#0a1e40] px-6 py-4 flex items-center gap-3"><Users className="text-white w-4 h-4" /><h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Top Requesters Source Analysis <span className="text-[#d4af37] lowercase tracking-normal font-medium opacity-80 ml-2">(Business vs System impact)</span></h3></div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="h-[280px]"><ReactECharts option={getTopRequestersOption()} style={{ height: '100%' }} /></div>
                        <div className="bg-[#fcfaf2] border border-[#d4af37]/20 p-8 rounded-xl flex flex-col justify-center h-full relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 opacity-5"><Users size={160} className="text-[#d4af37]" /></div>
                            <h4 className="flex items-center gap-2 text-[#c5a059] font-bold text-sm uppercase tracking-widest mb-6"><Target size={18} /> Volume Concentration Insight</h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4 relative z-10" dangerouslySetInnerHTML={{ __html: data.insight_top_req }}></p>
                        </div>
                    </div>
                </div>
                )}

                {!pageConfig.hiddenSections.includes('section_aging') && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#0a1e40] px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-3"><Clock className="text-white w-4 h-4" /><h3 className="text-white text-[11px] font-bold uppercase tracking-[0.2em]">Tickets Unresolved for ≥ 5 Days</h3></div><span className="text-white/70 text-[10px] uppercase tracking-widest font-black border border-white/20 px-3 py-1 rounded-full">{data.AGING_TICKETS.length} TICKETS IDENTIFIED</span></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead><tr className="bg-slate-50 border-b border-slate-100"><th className="px-8 py-4 text-[10px] text-slate-400 uppercase tracking-widest font-black">Assignee / Date</th><th className="px-8 py-4 text-[10px] text-slate-400 uppercase tracking-widest font-black">Ticket Subject</th><th className="px-8 py-4 text-[10px] text-slate-400 uppercase tracking-widest font-black">Status / Comments</th></tr></thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.AGING_TICKETS.map((ticket:any, idx:number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{ticket.assignee[0]}</div><div><p className="text-xs font-bold text-slate-700">{ticket.assignee}</p><p className="text-[10px] text-slate-400">{ticket.date}</p></div></div></td>
                                        <td className="px-8 py-5"><p className="text-xs text-slate-600 font-medium group-hover:text-[#0a1e40] transition-colors">{ticket.subject}</p></td>
                                        <td className="px-8 py-5"><div className="flex items-start gap-3"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0" /><p className="text-xs text-slate-500 italic leading-relaxed">{ticket.comment}</p></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {!pageConfig.hiddenSections.includes('section_efficiency') && (
                <div className="bg-[#f8fafc] rounded-2xl p-12 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-10"><div className="w-1.5 h-8 bg-[#0a1e40] rounded-full" /><div><h2 className="text-2xl font-bold text-[#0a1e40] tracking-tight">Resolution Efficiency Deep-Dive</h2><p className="text-slate-500 text-sm mt-1">Comparative analysis based on Mar 1 - Mar 31 Actual Resolution Time (Analyzing a total of 274 tickets)</p></div></div>
                    <div className="grid grid-cols-12 gap-8 mb-12">
                        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-[400px]"><h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-400">Avg Resolution Speed (Total)</h3><ReactECharts option={getEfficiencyOption()} style={{ height: '300px' }} /></div>
                        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col"><h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-400">Head-to-Head CI/Service Comparison (Avg Hours)</h3><div className="h-[300px]"><ReactECharts option={getCategoryTimeOption()} style={{ height: '100%' }} /></div><div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 bg-slate-50/50 p-4 rounded-lg border border-slate-100">{data.CATEGORY_TIME_COMPARE.map((item:any, idx:number) => (<div key={idx} className="flex flex-col gap-1"><span className="text-[10px] font-bold text-[#0a1e40] uppercase tracking-tighter">{item.category}</span><span className="text-[9px] text-slate-400 leading-tight italic truncate hover:whitespace-normal" title={item.includes}>包含：{item.includes}</span></div>))}</div></div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#d4af37]/20 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={120} className="text-[#d4af37]" /></div>
                        <h4 className="flex items-center gap-2 text-[#c5a059] font-bold text-sm uppercase tracking-widest mb-6"><Activity size={16} /> Category-Based Performance Insight</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3"><h5 className="text-[#0a1e40] font-bold text-xs uppercase">1. Scale vs. Speed</h5><p className="text-xs text-slate-600 leading-relaxed">{data.insight_scale}</p></div>
                            <div className="space-y-3"><h5 className="text-[#0a1e40] font-bold text-xs uppercase">2. Comparative Depth</h5><p className="text-xs text-slate-600 leading-relaxed">{data.insight_depth}</p></div>
                        </div>
                    </div>
                </div>
                )}

                <div id="pdf-download-btn" className="hidden justify-center pt-8">
                    <button onClick={exportToPDF} disabled={isExporting} className={`flex items-center gap-3 px-10 py-5 font-bold rounded-full transition-all shadow-lg uppercase tracking-[0.2em] text-[12px] ${isExporting ? 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed' : 'bg-white border border-[#d4af37] text-[#c5a059] hover:bg-[#d4af37] hover:text-white'}`}>
                        {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div> : <Download size={18} />}
                        {isExporting ? 'GENERATING PDF (MAY TAKE 10s)...' : 'Download Executive Report'}
                    </button>
                </div>
                <footer className="pt-20 text-center"><p className="text-[10px] text-slate-300 uppercase tracking-[0.5em]">© 2026 THE ESTÉE LAUDER COMPANIES INC. | CONFIDENTIAL IT OPERATIONS</p></footer>
            </div>

            {/* ========================================== */}
            {/* 🤖 Agent Copilot 对接展示区域 (Floating Chat) */}
            {/* ========================================== */}
            <div id="agent-copilot-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                <AnimatePresence>
                    {isAgentOpen && (
                        <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="mb-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex justify-between items-center shadow-md">
                                <div className="flex items-center gap-2"><div className="relative"><span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span><Bot size={22} className="text-white" /></div><span className="font-bold tracking-wider text-sm">Dashboard Agent Gemini</span></div>
                                <button onClick={() => setIsAgentOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={18} /></button>
                            </div>

                            {/* Chat History and optionally API key input */}
                            {!apiKey && (
                                <div className="p-4 bg-orange-50 border-b border-orange-200">
                                    <p className="text-xs font-bold text-orange-800 mb-2">🔑 等待连接大模型，当前需要一个真实 Gemini API 测试密匙才能起飞！</p>
                                    <div className="flex gap-2">
                                        <input type="password" id="gemini-key-input" placeholder="输入 AIzaSy... (放心,仅存浏览器本地)" className="flex-1 p-1.5 px-3 text-xs border border-orange-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                        <button onClick={() => {
                                            const val = (document.getElementById('gemini-key-input') as HTMLInputElement).value;
                                            if (val) { localStorage.setItem('gemini_api_key', val); setApiKey(val); }
                                        }} className="bg-orange-600 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-orange-700">接管大脑</button>
                                    </div>
                                    <p className="text-[10px] text-orange-600 mt-2 font-medium">您可以前往 Google AI Studio 点击 [Get API key] 免费一键获取。</p>
                                </div>
                            )}

                            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : msg.role === 'tool' ? 'self-center w-full' : 'self-start items-start'}`}>
                                        <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : msg.role === 'tool' ? 'bg-transparent text-gray-800 w-full p-0 shadow-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleAgentSubmit} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="告诉 Agent 需要切换什么数据..." className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" />
                                <button type="submit" disabled={!chatInput.trim()} className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Send size={16} /></button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Button */}
                <button onClick={() => setIsAgentOpen(!isAgentOpen)} className="hidden bg-[#0a1e40] text-white p-4 rounded-full shadow-2xl hover:bg-[#0a1e40]/90 transition-transform transform hover:scale-105 active:scale-95 flex items-center gap-2 group relative">
                    <TerminalSquare size={24} className="group-hover:animate-bounce" />
                    {!isAgentOpen && <span className="font-bold px-1 whitespace-nowrap">Ask Agent</span>}
                </button>
            </div>
            
        </div>
    );
};

const KPICard = ({ title, value, subtext, icon, iconColor }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center group hover:shadow-md transition-all"><div className="text-slate-400 group-hover:text-[#d4af37] transition-colors mb-4" style={{ color: iconColor }}>{icon}</div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">{title}</p><div className="flex items-baseline gap-2 mb-1"><span className="text-[42px] font-light text-[#0a1e40] leading-none">{value}</span></div><p className="text-[11px] text-slate-500 font-medium">{subtext}</p></div>
);
