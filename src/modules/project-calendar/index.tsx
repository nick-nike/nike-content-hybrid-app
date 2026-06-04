import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    Filter,
    Flag,
    Layers3,
    Search,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

import projectCalendar from '@/data/projectCalendar.json';

type MonthMilestone = {
    month: string;
    raw: string;
    tokens: string[];
};

type TaskDetail = {
    milestone: string;
    deliverable: string;
    calendarToken: string;
    start: string;
    end: string;
    months: string[];
    matchMethod: string;
    timesheetProjectName: string;
};

type ProjectCalendarItem = {
    businessDomain: string;
    projectName: string;
    cscopNo: string;
    owner: string;
    issueKey: string;
    jiraStatus: string;
    statusTrend: string;
    startDate: string;
    goLiveDate: string;
    dueDate: string;
    timesheetTaskCount: number;
    timesheetMatch: string;
    taskStart: string;
    taskEnd: string;
    calendarMilestones: string[];
    taskMilestones: string[];
    deliverables: string[];
    monthMilestones: MonthMilestone[];
    tasks: TaskDetail[];
    risks: string[];
};

const data = projectCalendar as {
    summary: {
        projectCount: number;
        taskCount: number;
        withTaskDetail: number;
        withoutTaskDetail: number;
        handoverProjects: number;
        missingCscop: number;
        noCalendarMilestone: number;
        domains: Record<string, number>;
        statuses: Record<string, number>;
        milestones: Record<string, number>;
        matchMethods: Record<string, number>;
    };
    projects: ProjectCalendarItem[];
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ALL_DOMAINS = ['All', ...Object.keys(data.summary.domains)];
const ALL_STATUSES = ['All', ...Object.keys(data.summary.statuses)];

const compactDate = (value: string) => (value ? value.slice(5).replace('-', '/') : 'TBD');

const getStatusClass = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('completed')) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (lower.includes('track')) return 'border-lime-200 bg-lime-50 text-lime-700';
    if (lower.includes('hold')) return 'border-stone-300 bg-stone-100 text-stone-700';
    return 'border-zinc-200 bg-white text-zinc-700';
};

const getRiskClass = (risk: string) => {
    if (risk.includes('Fuzzy')) return 'border-amber-200 bg-amber-50 text-amber-800';
    if (risk.includes('No task')) return 'border-red-200 bg-red-50 text-red-700';
    return 'border-zinc-200 bg-zinc-50 text-zinc-700';
};

export const ProjectCalendarPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [domain, setDomain] = useState('All');
    const [status, setStatus] = useState('All');
    const [mode, setMode] = useState<'all' | 'jira' | 'handover' | 'risk'>('all');
    const [selectedName, setSelectedName] = useState(data.projects[0]?.projectName ?? '');

    const filteredProjects = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return data.projects.filter((project) => {
            const matchesQuery = !needle || [
                project.projectName,
                project.cscopNo,
                project.issueKey,
                project.businessDomain,
                project.owner,
            ].some(value => value.toLowerCase().includes(needle));
            const matchesDomain = domain === 'All' || project.businessDomain === domain;
            const matchesStatus = status === 'All' || project.statusTrend === status;
            const hasHandover = project.monthMilestones.some(month => (
                month.tokens.includes('Handover') || month.raw.toLowerCase().includes('handover')
            ));
            const matchesMode = mode === 'all'
                || (mode === 'jira' && project.timesheetMatch !== 'Project Name + CSCOP No')
                || (mode === 'handover' && hasHandover)
                || (mode === 'risk' && project.risks.length > 0);

            return matchesQuery && matchesDomain && matchesStatus && matchesMode;
        });
    }, [domain, mode, query, status]);

    const selectedProject = useMemo(
        () => filteredProjects.find(project => project.projectName === selectedName) ?? filteredProjects[0] ?? data.projects[0],
        [filteredProjects, selectedName],
    );

    const selectedTasksByMilestone = useMemo(() => {
        const groups = new Map<string, TaskDetail[]>();
        selectedProject?.tasks.forEach((task) => {
            const key = task.milestone || 'Unassigned';
            groups.set(key, [...(groups.get(key) ?? []), task]);
        });
        return Array.from(groups.entries());
    }, [selectedProject]);

    return (
        <div className="min-h-screen bg-[#f5f1ea] text-[#171412]">
            <section className="border-b border-[#dfd6cb] bg-[#f8f5ef] px-6 py-8 lg:px-10">
                <div className="mx-auto max-w-[1500px]">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-4xl">
                            <div className="mb-5 inline-flex items-center gap-2 border border-[#171412] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
                                <Flag size={14} />
                                Jira migration control room
                            </div>
                            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-[#171412] md:text-6xl">
                                2026 Project Milestone Calendar
                            </h1>
                            <p className="mt-5 max-w-3xl text-sm leading-7 text-[#655f57]">
                                Full Calendar 是当前主数据源。这个页面把 135 个项目的月度 milestone、task deliverables、
                                start / end 和 Jira 校对状态放在一个 PM 视图里，先盘点，再切 EPIC，再 move to Jira。
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:w-[620px]">
                            <MetricCard label="Projects" value={data.summary.projectCount} sub="Full Calendar" />
                            <MetricCard label="Task rows" value={data.summary.taskCount} sub="Task Detail" />
                            <MetricCard label="Jira ready" value={data.summary.withTaskDetail} sub="strict matched" tone="good" />
                            <MetricCard label="Need check" value={data.summary.withoutTaskDetail} sub="before Jira" tone="risk" />
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(420px,0.9fr)] lg:px-10">
                <section className="space-y-5">
                    <div className="border border-[#dfd6cb] bg-[#fffdf8] p-4">
                        <div className="space-y-4">
                            <div className="flex min-w-0 items-center gap-3 border border-[#dfd6cb] bg-white px-3 py-2">
                                <Search size={18} className="shrink-0 text-[#8a8176]" />
                                <input
                                    value={query}
                                    onChange={event => setQuery(event.target.value)}
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#a99f92]"
                                    placeholder="Search project, CSCOP, issue key, owner"
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Select value={domain} values={ALL_DOMAINS} onChange={setDomain} />
                                    <Select value={status} values={ALL_STATUSES} onChange={setStatus} />
                                </div>
                                <SegmentedMode value={mode} onChange={setMode} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        <InsightCard icon={CalendarDays} label="Handover projects" value={data.summary.handoverProjects} />
                        <InsightCard icon={AlertTriangle} label="Missing CSCOP" value={data.summary.missingCscop} />
                        <InsightCard icon={ClipboardList} label="No calendar milestone" value={data.summary.noCalendarMilestone} />
                        <InsightCard icon={Layers3} label="Visible rows" value={filteredProjects.length} />
                    </div>

                    <div className="overflow-hidden border border-[#dfd6cb] bg-[#fffdf8]">
                        <div className="flex items-center justify-between border-b border-[#dfd6cb] px-5 py-4">
                            <div>
                                <h2 className="text-lg font-semibold">Milestone Inventory</h2>
                                <p className="text-xs text-[#7f766b]">Project by project, month by month.</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#7f766b]">
                                <Filter size={15} />
                                {filteredProjects.length} / {data.summary.projectCount}
                            </div>
                        </div>

                        <div className="max-h-[760px] overflow-auto">
                            <table className="w-full min-w-[1180px] border-collapse text-left">
                                <thead className="sticky top-0 z-10 bg-[#171412] text-white">
                                    <tr>
                                        <th className="w-[330px] px-4 py-3 text-[11px] uppercase tracking-[0.16em]">Project</th>
                                        <th className="px-4 py-3 text-[11px] uppercase tracking-[0.16em]">Status</th>
                                        <th className="px-4 py-3 text-[11px] uppercase tracking-[0.16em]">Tasks</th>
                                        {MONTHS.map(month => (
                                            <th key={month} className="w-[58px] px-2 py-3 text-center text-[11px] uppercase tracking-[0.12em]">
                                                {month}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProjects.map(project => (
                                        <ProjectRow
                                            key={`${project.projectName}-${project.cscopNo}`}
                                            project={project}
                                            active={selectedProject?.projectName === project.projectName}
                                            onSelect={() => setSelectedName(project.projectName)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {selectedProject && (
                    <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
                        <div className="border border-[#171412] bg-[#171412] p-5 text-white">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d8cfc4]">
                                        Selected Project
                                    </p>
                                    <h2 className="mt-3 text-2xl font-semibold leading-tight">{selectedProject.projectName}</h2>
                                </div>
                                <CheckCircle2 className="mt-1 shrink-0 text-[#d31321]" size={24} />
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                                <InfoCell label="Domain" value={selectedProject.businessDomain} />
                                <InfoCell label="CSCOP" value={selectedProject.cscopNo} />
                                <InfoCell label="Issue" value={selectedProject.issueKey || 'TBD'} />
                                <InfoCell label="Owner" value={selectedProject.owner || 'TBD'} />
                                <InfoCell label="Task window" value={`${compactDate(selectedProject.taskStart)} - ${compactDate(selectedProject.taskEnd)}`} />
                                <InfoCell label="Jira status" value={selectedProject.jiraStatus} />
                            </div>
                        </div>

                        <Panel title="Jira Readiness">
                            <div className="space-y-3">
                                <div className={`inline-flex border px-3 py-1 text-xs font-semibold ${getStatusClass(selectedProject.statusTrend)}`}>
                                    {selectedProject.statusTrend}
                                </div>
                                <p className="text-sm leading-6 text-[#655f57]">
                                    Match rule: <span className="font-semibold text-[#171412]">{selectedProject.timesheetMatch}</span>.
                                    Task detail rows: <span className="font-semibold text-[#171412]">{selectedProject.timesheetTaskCount}</span>.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.risks.length > 0
                                        ? selectedProject.risks.map(risk => (
                                                <span key={risk} className={`border px-2 py-1 text-[11px] font-semibold ${getRiskClass(risk)}`}>
                                                    {risk}
                                                </span>
                                            ))
                                        : (
                                                <span className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                                                    Ready for Jira check
                                                </span>
                                            )}
                                </div>
                            </div>
                        </Panel>

                        <Panel title="Calendar Milestones">
                            <div className="grid grid-cols-3 gap-2">
                                {selectedProject.monthMilestones.map(month => (
                                    <div key={month.month} className="min-h-20 border border-[#e6ded4] bg-[#fbf8f1] p-2">
                                        <div className="mb-2 text-[11px] font-bold uppercase text-[#8a8176]">{month.month}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {month.tokens.length > 0
                                                ? month.tokens.map(token => (
                                                        <span key={`${month.month}-${token}`} className="bg-[#171412] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                            {token}
                                                        </span>
                                                    ))
                                                : <span className="text-[11px] text-[#b1a79b]">blank</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="Task Deliverables">
                            <div className="max-h-[460px] space-y-4 overflow-auto pr-1">
                                {selectedTasksByMilestone.length > 0
                                    ? selectedTasksByMilestone.map(([milestone, tasks]) => (
                                            <div key={milestone} className="border-l-2 border-[#d31321] pl-4">
                                                <div className="mb-2 flex items-center justify-between gap-3">
                                                    <h3 className="text-sm font-bold">{milestone}</h3>
                                                    <span className="text-[11px] font-semibold text-[#7f766b]">{tasks.length} tasks</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {tasks.map((task, index) => (
                                                        <div key={`${task.deliverable}-${index}`} className="border border-[#e6ded4] bg-[#fffdf8] p-3">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <p className="text-sm font-semibold leading-5">{task.deliverable || task.calendarToken}</p>
                                                                <ChevronRight size={15} className="mt-0.5 shrink-0 text-[#d31321]" />
                                                            </div>
                                                            <p className="mt-2 text-xs text-[#7f766b]">
                                                                {compactDate(task.start)} - {compactDate(task.end)} · {task.months.join(', ') || 'No month'}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    : (
                                            <div className="border border-dashed border-[#cfc5ba] p-5 text-sm leading-6 text-[#655f57]">
                                                No task detail is matched yet. This project should be checked before EPIC slicing and Jira migration.
                                            </div>
                                        )}
                            </div>
                        </Panel>
                    </aside>
                )}
            </main>
        </div>
    );
};

const MetricCard = ({ label, value, sub, tone = 'neutral' }: { label: string; value: number; sub: string; tone?: 'neutral' | 'good' | 'risk' }) => (
    <div className="border border-[#dfd6cb] bg-[#fffdf8] p-4">
        <div className={`text-3xl font-semibold ${tone === 'risk' ? 'text-[#d31321]' : tone === 'good' ? 'text-[#276749]' : 'text-[#171412]'}`}>
            {value.toLocaleString()}
        </div>
        <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#655f57]">{label}</div>
        <div className="mt-1 text-xs text-[#8a8176]">{sub}</div>
    </div>
);

const InsightCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) => (
    <div className="flex items-center gap-4 border border-[#dfd6cb] bg-[#fffdf8] p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#171412] text-white">
            <Icon size={18} />
        </div>
        <div>
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-xs font-semibold text-[#7f766b]">{label}</div>
        </div>
    </div>
);

const Select = ({ value, values, onChange }: { value: string; values: string[]; onChange: (next: string) => void }) => (
    <select
        value={value}
        onChange={event => onChange(event.target.value)}
        className="h-10 border border-[#dfd6cb] bg-white px-3 text-sm font-semibold text-[#171412] outline-none"
    >
        {values.map(item => <option key={item}>{item}</option>)}
    </select>
);

const SegmentedMode = ({ value, onChange }: { value: 'all' | 'jira' | 'handover' | 'risk'; onChange: (next: 'all' | 'jira' | 'handover' | 'risk') => void }) => {
    const modes = [
        { key: 'all', label: 'All' },
        { key: 'jira', label: 'Jira check' },
        { key: 'handover', label: 'Handover' },
        { key: 'risk', label: 'Risk' },
    ] as const;

    return (
        <div className="flex border border-[#171412] bg-white">
            {modes.map(mode => (
                <button
                    key={mode.key}
                    type="button"
                    onClick={() => onChange(mode.key)}
                    className={`h-10 px-3 text-xs font-bold uppercase tracking-[0.08em] ${value === mode.key ? 'bg-[#171412] text-white' : 'text-[#171412] hover:bg-[#f5f1ea]'}`}
                >
                    {mode.label}
                </button>
            ))}
        </div>
    );
};

const ProjectRow = ({ project, active, onSelect }: { project: ProjectCalendarItem; active: boolean; onSelect: () => void }) => (
    <tr
        className={`cursor-pointer border-b border-[#ebe3d9] transition-colors ${active ? 'bg-[#f0e7dd]' : 'bg-[#fffdf8] hover:bg-[#f8f2ea]'}`}
        onClick={onSelect}
    >
        <td className="px-4 py-4 align-top">
            <div className="max-w-[320px] text-sm font-semibold leading-5">{project.projectName}</div>
            <div className="mt-2 flex flex-wrap gap-2">
                <span className="border border-[#dfd6cb] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#655f57]">{project.businessDomain}</span>
                <span className="border border-[#dfd6cb] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#655f57]">{project.cscopNo}</span>
            </div>
        </td>
        <td className="px-4 py-4 align-top">
            <span className={`inline-flex border px-2 py-1 text-[11px] font-semibold ${getStatusClass(project.statusTrend)}`}>
                {project.statusTrend}
            </span>
            {project.risks.length > 0 && <div className="mt-2 text-[11px] font-semibold text-[#d31321]">{project.risks.length} checks</div>}
        </td>
        <td className="px-4 py-4 align-top">
            <div className="text-sm font-semibold">{project.timesheetTaskCount}</div>
            <div className="mt-1 text-[11px] text-[#7f766b]">{compactDate(project.taskStart)} - {compactDate(project.taskEnd)}</div>
        </td>
        {project.monthMilestones.map(month => (
            <td key={month.month} className="px-2 py-4 align-top">
                <div className={`mx-auto h-11 w-11 border text-center ${month.tokens.length ? 'border-[#171412] bg-[#171412]' : 'border-[#e7ded3] bg-[#f7f2eb]'}`}>
                    <div className={`pt-2 text-[10px] font-bold ${month.tokens.length ? 'text-white' : 'text-[#b1a79b]'}`}>
                        {month.tokens.length || '-'}
                    </div>
                    {month.tokens.includes('Handover') && <div className="mx-auto mt-1 h-1 w-5 bg-[#d31321]" />}
                </div>
            </td>
        ))}
    </tr>
);

const InfoCell = ({ label, value }: { label: string; value: string }) => (
    <div className="border border-white/15 p-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#bfb5aa]">{label}</div>
        <div className="mt-1 break-words text-sm font-semibold text-white">{value}</div>
    </div>
);

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="border border-[#dfd6cb] bg-[#fffdf8] p-5">
        <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.16em] text-[#171412]">{title}</h2>
        {children}
    </section>
);
