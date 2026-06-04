import { CalendarRange, Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import wbsTemplateData from '../../data/wbsTemplate.json';

type Size = 'Small CR' | 'Regular CR' | 'Full Intake';

type WbsItem = {
    id: string;
    stage: 'Intake' | 'Feasibility' | 'Development' | 'Deploy' | 'Handover';
    epic?: string;
    taskId?: string;
    item: string;
    output: string;
    owner: string;
    support: string;
    dependency: string;
    defaultStatus?: string;
    defaultScope?: string;
    riskAsk?: string;
    requiredFor: Size[];
    days: Record<Size, number>;
};

type RoleInfo = {
    id: string;
    role: string;
    name: string;
    email: string;
    responsibility: string;
};

type RowOverride = {
    owner?: string;
    support?: string;
    status?: string;
    manday?: string;
    start?: string;
    end?: string;
};

const sizes: Size[] = ['Small CR', 'Regular CR', 'Full Intake'];
const statuses = ['Not Started', 'In Progress', 'Done', 'Blocked', 'N/A'];
const defaultRoles: RoleInfo[] = [
    { id: 'domain-owner', role: 'Domain Owner', name: '', email: '', responsibility: 'Business domain decision and scope approval' },
    { id: 'program-manager', role: 'Program Manager', name: '', email: '', responsibility: 'Program-level coordination and priority alignment' },
    { id: 'project-manager', role: 'Project Manager', name: '', email: '', responsibility: 'WBS planning, schedule and delivery follow-up' },
    { id: 'ba', role: 'BA', name: '', email: '', responsibility: 'BRD, requirement clarification, TUAT / BUAT coordination' },
    { id: 'tl', role: 'TL', name: '', email: '', responsibility: 'Solution design and technical delivery ownership' },
    { id: 'qa', role: 'QA', name: '', email: '', responsibility: 'SIT / validation and defect follow-up' },
    { id: 'ops-ba', role: 'OPS BA', name: 'Jacky Zhong', email: '', responsibility: 'OPS-side BA support for CR clarification and review' },
    { id: 'ops-l15', role: 'OPS L1.5', name: 'Lucy Cao / Ruby Yang', email: '', responsibility: 'Emergency change support and OPS execution follow-up' },
    { id: 'delivery-team', role: 'Delivery Team', name: '', email: '', responsibility: 'CR execution and delivery handover' },
];

const templateItems: WbsItem[] = [
    { id: 'intake-record', stage: 'Intake', item: 'Create intake record', output: 'Intake record / request summary', owner: 'Nick', support: 'Jacky', dependency: 'Business request', requiredFor: sizes, days: { 'Small CR': 1, 'Regular CR': 1, 'Full Intake': 1 } },
    { id: 'scope-clarify', stage: 'Intake', item: 'Clarify scope, owner and ETA', output: 'Scope note + owner + ETA', owner: 'OPS Domain', support: 'Business / Delivery', dependency: 'Intake record', requiredFor: sizes, days: { 'Small CR': 1, 'Regular CR': 2, 'Full Intake': 3 } },
    { id: 'brd', stage: 'Intake', item: 'BRD / requirement list', output: 'BRD or requirement list', owner: 'BA', support: 'Business / OPS BA', dependency: 'Scope clarified', requiredFor: sizes, days: { 'Small CR': 2, 'Regular CR': 5, 'Full Intake': 10 } },
    { id: 'high-level-solution', stage: 'Feasibility', item: 'High-level solution', output: 'High-level solution doc', owner: 'Delivery Team', support: 'BA / TL / OPS BA', dependency: 'BRD', requiredFor: sizes, days: { 'Small CR': 2, 'Regular CR': 5, 'Full Intake': 10 } },
    { id: 'wbs', stage: 'Feasibility', item: 'WBS planning', output: 'WBS with owner, ETA and dependency', owner: 'PM', support: 'Nick / Jacky / Delivery', dependency: 'Solution direction', requiredFor: sizes, days: { 'Small CR': 1, 'Regular CR': 2, 'Full Intake': 3 } },
    { id: 'sre', stage: 'Feasibility', item: 'SRE / support model review', output: 'SRE / support model sign-off', owner: 'Delivery Team', support: 'OPS / Support Team', dependency: 'High-level solution', requiredFor: ['Regular CR', 'Full Intake'], days: { 'Small CR': 0, 'Regular CR': 3, 'Full Intake': 5 } },
    { id: 'fsd', stage: 'Feasibility', item: 'FSD / detailed solution', output: 'FSD if technical impact exists', owner: 'TL', support: 'BA / QA / OPS', dependency: 'High-level solution', requiredFor: ['Regular CR', 'Full Intake'], days: { 'Small CR': 0, 'Regular CR': 5, 'Full Intake': 10 } },
    { id: 'build', stage: 'Development', item: 'Build / configuration', output: 'Configured or developed change', owner: 'Delivery Team', support: 'QA / OPS', dependency: 'Solution sign-off', requiredFor: sizes, days: { 'Small CR': 3, 'Regular CR': 10, 'Full Intake': 20 } },
    { id: 'sit', stage: 'Development', item: 'SIT / technical validation', output: 'SIT result', owner: 'QA / TL', support: 'Delivery Team', dependency: 'Build complete', requiredFor: ['Regular CR', 'Full Intake'], days: { 'Small CR': 0, 'Regular CR': 3, 'Full Intake': 5 } },
    { id: 'tuat', stage: 'Development', item: 'TUAT', output: 'TUAT sign-off', owner: 'Business / BA', support: 'Delivery / OPS', dependency: 'SIT or build complete', requiredFor: sizes, days: { 'Small CR': 2, 'Regular CR': 5, 'Full Intake': 10 } },
    { id: 'buat', stage: 'Development', item: 'BUAT', output: 'BUAT sign-off if business process impact exists', owner: 'Business', support: 'BA / OPS', dependency: 'TUAT', requiredFor: ['Regular CR', 'Full Intake'], days: { 'Small CR': 0, 'Regular CR': 3, 'Full Intake': 5 } },
    { id: 'release-plan', stage: 'Deploy', item: 'Release plan / CAB check', output: 'Release plan, CAB or approval evidence', owner: 'PM / TL', support: 'OPS / Delivery', dependency: 'Test sign-off', requiredFor: sizes, days: { 'Small CR': 1, 'Regular CR': 2, 'Full Intake': 3 } },
    { id: 'deploy', stage: 'Deploy', item: 'Deployment', output: 'Production deployment result', owner: 'Delivery Team', support: 'OPS / Business', dependency: 'Release approval', requiredFor: sizes, days: { 'Small CR': 1, 'Regular CR': 2, 'Full Intake': 3 } },
    { id: 'hypercare', stage: 'Handover', item: 'Hypercare / validation', output: 'Post-release validation', owner: 'OPS', support: 'Delivery / Business', dependency: 'Deployment', requiredFor: sizes, days: { 'Small CR': 2, 'Regular CR': 5, 'Full Intake': 10 } },
    { id: 'handover', stage: 'Handover', item: 'Handover to OPS support', output: 'Handover notes / support SOP / known issue list', owner: 'Delivery Team', support: 'OPS', dependency: 'Hypercare stable', requiredFor: sizes, days: { 'Small CR': 1, 'Regular CR': 2, 'Full Intake': 3 } },
    { id: 'closure', stage: 'Handover', item: 'Business closure confirmation', output: 'Business confirmation and closure record', owner: 'Nick', support: 'Business / Jacky', dependency: 'Handover complete', requiredFor: sizes, days: { 'Small CR': 1, 'Regular CR': 1, 'Full Intake': 2 } },
];

const fullIntakeTemplateItems: WbsItem[] = wbsTemplateData.items
    .filter(item => ['Intake', 'Feasibility', 'Development', 'Deploy', 'Handover'].includes(item.stage))
    .map((item, index) => {
        const manday = Number(item.manday) || 1;
        return {
            id: `full-${item.taskId || index}`,
            stage: item.stage as WbsItem['stage'],
            epic: item.epic,
            taskId: item.taskId,
            item: item.task || item.epic || `WBS item ${index + 1}`,
            output: item.comment || item.gateway || item.epic || '',
            owner: item.owner || '',
            support: item.supporter || '',
            dependency: item.dependency || '',
            defaultStatus: item.status || 'Not Started',
            defaultScope: item.scope || 'In Scope',
            riskAsk: item.riskAsk || '',
            requiredFor: ['Full Intake'],
            days: { 'Small CR': 0, 'Regular CR': 0, 'Full Intake': manday },
        };
    });

const stageOrder = ['Intake', 'Feasibility', 'Development', 'Deploy', 'Handover'];

const addWorkdays = (start: string, days: number) => {
    const date = new Date(`${start}T00:00:00`);
    let remaining = Math.max(days, 1) - 1;
    while (remaining > 0) {
        date.setDate(date.getDate() + 1);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            remaining -= 1;
        }
    }
    return date.toISOString().slice(0, 10);
};

const nextWorkday = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    do {
        date.setDate(date.getDate() + 1);
    } while (date.getDay() === 0 || date.getDay() === 6);
    return date.toISOString().slice(0, 10);
};

const escapeHtml = (value: string | number) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const WbsBuilderPage: React.FC = () => {
    const [projectName, setProjectName] = useState('Helios CR / Enhancement');
    const [projectCode, setProjectCode] = useState('CSCOP-');
    const [domain, setDomain] = useState('Corporate');
    const [size, setSize] = useState<Size>('Small CR');
    const [startDate, setStartDate] = useState('2026-06-08');
    const [roles, setRoles] = useState<RoleInfo[]>(defaultRoles);
    const [rowOverrides, setRowOverrides] = useState<Record<string, RowOverride>>({});
    const [selected, setSelected] = useState<Record<string, boolean>>(
        () => Object.fromEntries(templateItems.map(item => [item.id, item.requiredFor.includes('Small CR')])),
    );
    const activeTemplateItems = size === 'Full Intake' ? fullIntakeTemplateItems : templateItems;

    const rows = useMemo(() => {
        let cursor = startDate;
        return activeTemplateItems
            .filter(item => selected[item.id])
            .map((item, index) => {
                const override = rowOverrides[item.id] ?? {};
                const defaultDays = item.days[size] || 1;
                const days = Number(override.manday || defaultDays) || defaultDays;
                const start = index === 0 ? cursor : nextWorkday(cursor);
                const end = addWorkdays(start, days);
                const finalStart = override.start || start;
                const finalEnd = override.end || end;
                cursor = finalEnd;
                return {
                    ...item,
                    owner: override.owner ?? item.owner,
                    support: override.support ?? item.support,
                    status: override.status ?? item.defaultStatus ?? 'Not Started',
                    manday: days,
                    start: finalStart,
                    end: finalEnd,
                    scope: item.defaultScope || 'In Scope',
                };
            });
    }, [activeTemplateItems, rowOverrides, selected, size, startDate]);

    const stageCounts = stageOrder.map(stage => ({
        stage,
        count: rows.filter(row => row.stage === stage).length,
        days: rows.filter(row => row.stage === stage).reduce((sum, row) => sum + row.manday, 0),
    }));

    const resetBySize = (nextSize: Size) => {
        setSize(nextSize);
        const nextTemplateItems = nextSize === 'Full Intake' ? fullIntakeTemplateItems : templateItems;
        setSelected(Object.fromEntries(nextTemplateItems.map(item => [item.id, item.requiredFor.includes(nextSize)])));
        setRowOverrides({});
    };

    const updateRole = (index: number, field: keyof RoleInfo, value: string) => {
        setRoles(roles.map((role, roleIndex) => roleIndex === index ? { ...role, [field]: value } : role));
    };

    const updateRow = (id: string, field: keyof RowOverride, value: string) => {
        setRowOverrides({
            ...rowOverrides,
            [id]: {
                ...(rowOverrides[id] ?? {}),
                [field]: value,
            },
        });
    };

    const exportWorkbook = () => {
        const roleRows = roles.map(role => `
            <tr>
                <td>${escapeHtml(role.role)}</td>
                <td>${escapeHtml(role.name)}</td>
                <td>${escapeHtml(role.email)}</td>
                <td>${escapeHtml(role.responsibility)}</td>
            </tr>
        `).join('');
        const bodyRows = rows.map(row => `
            <tr>
                <td>${escapeHtml(row.stage)}</td>
                <td>${escapeHtml(row.epic || '')}</td>
                <td>${escapeHtml(row.taskId || '')}</td>
                <td>${escapeHtml(row.item)}</td>
                <td>${escapeHtml(row.scope)}</td>
                <td>${escapeHtml(row.dependency)}</td>
                <td>${escapeHtml(row.output)}</td>
                <td>${escapeHtml(row.owner)}</td>
                <td>${escapeHtml(row.support)}</td>
                <td>${escapeHtml(row.status)}</td>
                <td>${row.manday}</td>
                <td>${escapeHtml(row.start)}</td>
                <td>${escapeHtml(row.end)}</td>
                <td>${escapeHtml(row.riskAsk || '')}</td>
            </tr>
        `).join('');
        const html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8" />
                <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
                    <x:ExcelWorksheet><x:Name>R&R</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                    <x:ExcelWorksheet><x:Name>WBS Plan</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
            </head>
            <body>
                <table style="border-collapse:collapse;font-family:Arial;width:1000px;" x:Name="R&R">
                    <tr><td colspan="4" style="background:#111;color:white;font-size:22px;font-weight:700;padding:16px;">R&amp;R</td></tr>
                    <tr><td colspan="4" style="padding:10px;font-weight:700;">Project: ${escapeHtml(projectName)} / ${escapeHtml(projectCode)} / ${escapeHtml(domain)} / ${escapeHtml(size)}</td></tr>
                    <tr style="background:#344154;color:white;font-weight:700;">
                        <td>Role</td><td>Person</td><td>Email</td><td>Responsibility</td>
                    </tr>
                    ${roleRows}
                </table>
                <br style="mso-special-character:line-break;page-break-before:always" />
                <table style="border-collapse:collapse;font-family:Arial;width:1700px;" x:Name="WBS Plan">
                    <tr><td colspan="14" style="background:#111;color:white;font-size:22px;font-weight:700;padding:16px;">WBS Quick Plan</td></tr>
                    <tr><td colspan="14" style="padding:10px;font-weight:700;">Project: ${escapeHtml(projectName)} / ${escapeHtml(projectCode)} / ${escapeHtml(domain)} / ${escapeHtml(size)}</td></tr>
                    <tr style="background:#344154;color:white;font-weight:700;">
                        <td>Stage</td><td>Epic</td><td>Task ID</td><td>Task</td><td>Scope</td><td>Dependency</td><td>Output</td><td>Owner</td><td>Support</td><td>Status</td><td>Manday</td><td>Start</td><td>End</td><td>Risk & Ask</td>
                    </tr>
                    ${bodyRows}
                </table>
            </body></html>
        `;
        const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `wbs-quick-plan-${new Date().toISOString().slice(0, 10)}.xls`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#f6f3ee] text-[#111111]">
            <header className="border-b border-[#d8d0c5] bg-[#111111] text-white">
                <div className="mx-auto max-w-[1600px] px-6 py-7 lg:px-10">
                    <div className="inline-flex items-center gap-2 border border-white/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
                        <FileSpreadsheet size={14} />
                        WBS Builder
                    </div>
                    <h1 className="mt-4 text-4xl font-semibold md:text-5xl">WBS Quick Plan Builder</h1>
                    <p className="mt-4 max-w-5xl text-sm leading-6 text-white/72">
                        Start from the project type, keep the required CR items in scope, and generate a date-based WBS plan without manually filling the Excel template line by line.
                    </p>
                </div>
            </header>

            <main className="mx-auto grid max-w-[1600px] gap-5 px-6 py-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
                <aside className="space-y-4">
                    <section className="border border-[#d8d0c5] bg-[#fffdf8] p-4">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#655f57]">
                            <CalendarRange size={15} />
                            Project setup
                        </div>
                        <label className="mb-3 block text-xs font-bold">Project name<input value={projectName} onChange={event => setProjectName(event.target.value)} className="mt-1 h-10 w-full border border-[#d8d0c5] px-3 text-sm" /></label>
                        <label className="mb-3 block text-xs font-bold">Project code<input value={projectCode} onChange={event => setProjectCode(event.target.value)} className="mt-1 h-10 w-full border border-[#d8d0c5] px-3 text-sm" /></label>
                        <label className="mb-3 block text-xs font-bold">Domain<select value={domain} onChange={event => setDomain(event.target.value)} className="mt-1 h-10 w-full border border-[#d8d0c5] bg-white px-3 text-sm"><option>Corporate</option><option>Product</option><option>Fulfillment</option><option>Supply Chain & Upstreams</option></select></label>
                        <label className="mb-3 block text-xs font-bold">Start date<input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} className="mt-1 h-10 w-full border border-[#d8d0c5] px-3 text-sm" /></label>
                        <div className="grid grid-cols-1 gap-2">
                            {sizes.map(item => <button key={item} type="button" onClick={() => resetBySize(item)} className={`h-10 border text-xs font-bold uppercase tracking-[0.08em] ${size === item ? 'border-[#d31321] bg-[#d31321] text-white' : 'border-[#111111] bg-white text-[#111111]'}`}>{item}</button>)}
                        </div>
                    </section>

                    <section className="border border-[#d8d0c5] bg-[#fffdf8] p-4">
                        <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#655f57]">R&amp;R</div>
                        <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
                            {roles.map((role, index) => (
                                <div key={role.id} className="border border-[#e5ded5] bg-white p-3">
                                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#111111]">{role.role}</div>
                                    <input value={role.name} onChange={event => updateRole(index, 'name', event.target.value)} placeholder="Person" className="mb-2 h-9 w-full border border-[#d8d0c5] px-2 text-xs" />
                                    <input value={role.email} onChange={event => updateRole(index, 'email', event.target.value)} placeholder="Email" className="mb-2 h-9 w-full border border-[#d8d0c5] px-2 text-xs" />
                                    <textarea value={role.responsibility} onChange={event => updateRole(index, 'responsibility', event.target.value)} className="min-h-[58px] w-full resize-y border border-[#d8d0c5] px-2 py-2 text-xs leading-5" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="border border-[#d8d0c5] bg-[#fffdf8] p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#655f57]">Stage summary</div>
                            <button type="button" onClick={() => resetBySize(size)} className="inline-flex items-center gap-1 text-xs font-bold text-[#d31321]"><RefreshCw size={13} /> Reset</button>
                        </div>
                        <div className="space-y-2">
                            {stageCounts.map(item => <div key={item.stage} className="flex items-center justify-between border border-[#e5ded5] bg-white px-3 py-2 text-sm font-semibold"><span>{item.stage}</span><span>{item.count} items / {item.days}d</span></div>)}
                        </div>
                        <div className="mt-3 border border-[#e5ded5] bg-white px-3 py-2 text-xs font-semibold text-[#655f57]">
                            Current template: {size === 'Full Intake' ? `${fullIntakeTemplateItems.length} original XLS items` : 'CR quick checklist'}
                        </div>
                        <button type="button" onClick={exportWorkbook} className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 bg-[#111111] px-4 text-xs font-bold uppercase tracking-[0.1em] text-white">
                            <Download size={15} />
                            Export XLS
                        </button>
                    </section>
                </aside>

                <section className="border border-[#d8d0c5] bg-[#fffdf8]">
                    <div className="border-b border-[#d8d0c5] bg-[#111111] px-5 py-3 text-white">
                        <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Generated WBS Plan</h2>
                    </div>
                    <div className="max-h-[760px] overflow-auto">
                        <table className="w-full min-w-[1580px] border-collapse text-left text-sm">
                            <thead className="sticky top-0 bg-[#344154] text-white">
                                <tr>
                                    <th className="w-[120px] border border-[#d8d0c5] px-3 py-3">Stage</th>
                                    <th className="w-[160px] border border-[#d8d0c5] px-3 py-3">Epic</th>
                                    <th className="w-[90px] border border-[#d8d0c5] px-3 py-3">Task ID</th>
                                    <th className="w-[230px] border border-[#d8d0c5] px-3 py-3">Task</th>
                                    <th className="w-[90px] border border-[#d8d0c5] px-3 py-3">Scope</th>
                                    <th className="w-[220px] border border-[#d8d0c5] px-3 py-3">Output</th>
                                    <th className="w-[130px] border border-[#d8d0c5] px-3 py-3">Owner</th>
                                    <th className="w-[170px] border border-[#d8d0c5] px-3 py-3">Support</th>
                                    <th className="w-[130px] border border-[#d8d0c5] px-3 py-3">Status</th>
                                    <th className="w-[80px] border border-[#d8d0c5] px-3 py-3">Manday</th>
                                    <th className="w-[120px] border border-[#d8d0c5] px-3 py-3">Start</th>
                                    <th className="w-[120px] border border-[#d8d0c5] px-3 py-3">End</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTemplateItems.map(item => {
                                    const row = rows.find(plan => plan.id === item.id);
                                    return (
                                        <tr key={item.id} className={selected[item.id] ? 'bg-white' : 'bg-[#f1eee8] text-[#8d8378]'}>
                                            <td className="border border-[#d8d0c5] px-3 py-2 font-semibold">{item.stage}</td>
                                            <td className="border border-[#d8d0c5] px-3 py-2 text-xs">{item.epic || '-'}</td>
                                            <td className="border border-[#d8d0c5] px-3 py-2 text-xs">{item.taskId || '-'}</td>
                                            <td className="border border-[#d8d0c5] px-3 py-2 font-semibold">
                                                <label className="flex items-start gap-2">
                                                    <input type="checkbox" checked={selected[item.id]} onChange={event => setSelected({ ...selected, [item.id]: event.target.checked })} className="mt-1" />
                                                    <span>{item.item}</span>
                                                </label>
                                            </td>
                                            <td className="border border-[#d8d0c5] px-3 py-2">{selected[item.id] ? 'In Scope' : 'Out'}</td>
                                            <td className="border border-[#d8d0c5] px-3 py-2">{item.output}</td>
                                            <td className="border border-[#d8d0c5] px-2 py-2">
                                                {selected[item.id] ? <input value={row?.owner || item.owner} onChange={event => updateRow(item.id, 'owner', event.target.value)} className="h-9 w-full border border-[#d8d0c5] px-2 text-xs" /> : '-'}
                                            </td>
                                            <td className="border border-[#d8d0c5] px-2 py-2">
                                                {selected[item.id] ? <input value={row?.support || item.support} onChange={event => updateRow(item.id, 'support', event.target.value)} className="h-9 w-full border border-[#d8d0c5] px-2 text-xs" /> : '-'}
                                            </td>
                                            <td className="border border-[#d8d0c5] px-2 py-2">
                                                {selected[item.id] ? (
                                                    <select value={row?.status || 'Not Started'} onChange={event => updateRow(item.id, 'status', event.target.value)} className="h-9 w-full border border-[#d8d0c5] bg-white px-2 text-xs">
                                                        {statuses.map(status => <option key={status}>{status}</option>)}
                                                    </select>
                                                ) : '-'}
                                            </td>
                                            <td className="border border-[#d8d0c5] px-2 py-2">
                                                {selected[item.id] ? <input type="number" min="0" value={row?.manday || ''} onChange={event => updateRow(item.id, 'manday', event.target.value)} className="h-9 w-full border border-[#d8d0c5] px-2 text-xs" /> : '-'}
                                            </td>
                                            <td className="border border-[#d8d0c5] px-2 py-2">
                                                {selected[item.id] ? <input type="date" value={row?.start || ''} onChange={event => updateRow(item.id, 'start', event.target.value)} className="h-9 w-full border border-[#d8d0c5] px-2 text-xs" /> : '-'}
                                            </td>
                                            <td className="border border-[#d8d0c5] px-2 py-2">
                                                {selected[item.id] ? <input type="date" value={row?.end || ''} onChange={event => updateRow(item.id, 'end', event.target.value)} className="h-9 w-full border border-[#d8d0c5] px-2 text-xs" /> : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};
