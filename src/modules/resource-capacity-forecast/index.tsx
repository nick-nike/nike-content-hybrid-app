import {
    AlertTriangle,
    CalendarDays,
    Download,
    RefreshCw,
    Save,
    TrendingUp,
} from 'lucide-react';
import type { FC } from 'react';
import { useMemo, useState } from 'react';

type ForecastStatus = 'To Do' | 'WIP' | 'Done' | 'Blocked' | 'On Hold';
type AlertLevel = 'Green' | 'Amber' | 'Red';

type ForecastItem = {
    id: string;
    project: string;
    domain: string;
    gateway: 'GW1/2' | 'GW3/4/5' | 'WBS' | 'Go Live';
    wbsPhase: 'Intake' | 'Feasibility' | 'Development' | 'Deploy' | 'Handover';
    owner: string;
    supporter: string;
    plannedMd: number;
    timesheetMd: number;
    dueDate: string;
    weekKey: string;
    status: ForecastStatus;
    action: string;
};

type ResourceCapacity = {
    owner: string;
    weeklyCapacity: number;
};

type ForecastState = {
    items: ForecastItem[];
    resources: ResourceCapacity[];
};

const STORAGE_KEY = 'resource-capacity-forecast-v1';

const WEEKS = [
    { key: '2026-W30', label: 'W30', range: 'Jul 20-24' },
    { key: '2026-W31', label: 'W31', range: 'Jul 27-31' },
    { key: '2026-W32', label: 'W32', range: 'Aug 03-07' },
    { key: '2026-W33', label: 'W33', range: 'Aug 10-14' },
];

const defaultState: ForecastState = {
    resources: [
        { owner: 'Nick', weeklyCapacity: 5 },
        { owner: 'Jacky', weeklyCapacity: 5 },
        { owner: 'Lucy', weeklyCapacity: 5 },
        { owner: 'Ruby', weeklyCapacity: 5 },
        { owner: 'Jenny', weeklyCapacity: 4 },
        { owner: 'Product Delivery', weeklyCapacity: 5 },
        { owner: 'Fulfillment Delivery', weeklyCapacity: 5 },
        { owner: 'Corporate Delivery', weeklyCapacity: 5 },
        { owner: 'SC&U Delivery', weeklyCapacity: 5 },
    ],
    items: [
        {
            id: 'price-portal-md',
            project: 'Price Portal enhancement: MD pricing Phase 1 Retail MD',
            domain: 'Product',
            gateway: 'GW3/4/5',
            wbsPhase: 'Handover',
            owner: 'Nick',
            supporter: 'Product Delivery',
            plannedMd: 4,
            timesheetMd: 3,
            dueDate: '2026-07-24',
            weekKey: '2026-W30',
            status: 'WIP',
            action: 'Confirm delivery evidence and business sign-off owner.',
        },
        {
            id: 'sfs-low-roi',
            project: 'SFS Enhancement: Low ROI Item-discovery',
            domain: 'Fulfillment',
            gateway: 'GW3/4/5',
            wbsPhase: 'Handover',
            owner: 'Jacky',
            supporter: 'Fulfillment Delivery',
            plannedMd: 3,
            timesheetMd: 1.5,
            dueDate: '2026-07-24',
            weekKey: '2026-W30',
            status: 'WIP',
            action: 'Lock handover checklist and close remaining documents.',
        },
        {
            id: 'ip-protection',
            project: 'IP Protection Phase 1 & 2',
            domain: 'Corporate',
            gateway: 'WBS',
            wbsPhase: 'Development',
            owner: 'Nick',
            supporter: 'Corporate Delivery',
            plannedMd: 8,
            timesheetMd: 7.5,
            dueDate: '2026-07-31',
            weekKey: '2026-W31',
            status: 'WIP',
            action: 'Align payment forecast with Quinny and update WBS effort.',
        },
        {
            id: 'reprice',
            project: 'Reprice',
            domain: 'Product',
            gateway: 'WBS',
            wbsPhase: 'Intake',
            owner: 'Lucy',
            supporter: 'Product Delivery',
            plannedMd: 4,
            timesheetMd: 0.5,
            dueDate: '2026-07-25',
            weekKey: '2026-W30',
            status: 'To Do',
            action: 'Confirm request owner and split Tech SCM validation tasks.',
        },
        {
            id: 'regional-store-portal',
            project: 'Regional Organization Accuracy in Store Portal',
            domain: 'Supply Chain & Upstream',
            gateway: 'GW3/4/5',
            wbsPhase: 'Handover',
            owner: 'Ruby',
            supporter: 'SC&U Delivery',
            plannedMd: 5,
            timesheetMd: 0,
            dueDate: '2026-08-07',
            weekKey: '2026-W32',
            status: 'To Do',
            action: 'Prepare capacity before handover package arrives.',
        },
        {
            id: 'mfp-data-source',
            project: 'MFP Data Source Change',
            domain: 'Product',
            gateway: 'WBS',
            wbsPhase: 'Feasibility',
            owner: 'Nick',
            supporter: 'Product Delivery',
            plannedMd: 10,
            timesheetMd: 2,
            dueDate: '2026-08-14',
            weekKey: '2026-W33',
            status: 'WIP',
            action: 'Challenge vendor effort and confirm split by system owner.',
        },
    ],
};

const statusOptions: ForecastStatus[] = ['To Do', 'WIP', 'Done', 'Blocked', 'On Hold'];
const gatewayOptions: ForecastItem['gateway'][] = ['GW1/2', 'GW3/4/5', 'WBS', 'Go Live'];
const phaseOptions: ForecastItem['wbsPhase'][] = ['Intake', 'Feasibility', 'Development', 'Deploy', 'Handover'];

const loadInitialState = (): ForecastState => {
    if (typeof window === 'undefined') {
        return defaultState;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) as ForecastState : defaultState;
    }
    catch {
        return defaultState;
    }
};

const formatNumber = (value: number) => (
    Number.isInteger(value) ? String(value) : value.toFixed(1)
);

const getAlertLevel = (item: ForecastItem): AlertLevel => {
    if (item.status === 'Blocked') {
        return 'Red';
    }

    if (item.status === 'Done' || item.status === 'On Hold') {
        return 'Green';
    }

    const burnRate = item.plannedMd > 0 ? item.timesheetMd / item.plannedMd : 0;
    const due = new Date(`${item.dueDate}T00:00:00`);
    const today = new Date('2026-07-17T00:00:00');
    const daysToDue = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);

    if (burnRate >= 1.1 || daysToDue <= 3) {
        return 'Red';
    }

    if (burnRate >= 0.9 || daysToDue <= 5) {
        return 'Amber';
    }

    return 'Green';
};

const alertClass: Record<AlertLevel, string> = {
    Green: 'border-[#0f7a5a] bg-[#e5f3ed] text-[#0f7a5a]',
    Amber: 'border-[#b16a00] bg-[#fff0cc] text-[#8a5200]',
    Red: 'border-[#d31321] bg-[#fde7e9] text-[#d31321]',
};

const statusClass: Record<ForecastStatus, string> = {
    'To Do': 'border-[#8f8174] bg-[#fffdf8] text-[#4f463d]',
    WIP: 'border-[#2f6fed] bg-[#eaf2ff] text-[#1d57b8]',
    Done: 'border-[#0f7a5a] bg-[#e5f3ed] text-[#0f7a5a]',
    Blocked: 'border-[#d31321] bg-[#fde7e9] text-[#d31321]',
    'On Hold': 'border-[#b16a00] bg-[#fff0cc] text-[#8a5200]',
};

const ResourceCapacityForecastPage: FC = () => {
    const [state, setState] = useState<ForecastState>(() => loadInitialState());
    const [selectedWeek, setSelectedWeek] = useState(WEEKS[0].key);
    const [savedMessage, setSavedMessage] = useState('Local draft active');

    const activeItems = useMemo(
        () => state.items.filter(item => item.status !== 'Done' && item.status !== 'On Hold'),
        [state.items],
    );

    const resourceRows = useMemo(() => (
        state.resources.map((resource) => {
            const weeklyLoads = WEEKS.map((week) => {
                const load = activeItems
                    .filter(item => item.owner === resource.owner && item.weekKey === week.key)
                    .reduce((sum, item) => sum + Math.max(item.plannedMd - item.timesheetMd, 0), 0);
                const usage = resource.weeklyCapacity > 0 ? load / resource.weeklyCapacity : 0;

                return { week, load, usage };
            });

            return { resource, weeklyLoads };
        })
    ), [activeItems, state.resources]);

    const alerts = useMemo(() => (
        activeItems
            .map(item => ({ item, level: getAlertLevel(item) }))
            .filter(entry => entry.level !== 'Green')
            .sort((a, b) => (a.level === 'Red' ? -1 : 1) - (b.level === 'Red' ? -1 : 1))
    ), [activeItems]);

    const totalCapacity = state.resources.reduce((sum, item) => sum + item.weeklyCapacity, 0);
    const totalRemaining = activeItems.reduce((sum, item) => sum + Math.max(item.plannedMd - item.timesheetMd, 0), 0);
    const selectedWeekItems = activeItems.filter(item => item.weekKey === selectedWeek);
    const selectedWeekLoad = selectedWeekItems.reduce((sum, item) => sum + Math.max(item.plannedMd - item.timesheetMd, 0), 0);

    const updateItem = (id: string, patch: Partial<ForecastItem>) => {
        setState(prev => ({
            ...prev,
            items: prev.items.map(item => (item.id === id ? { ...item, ...patch } : item)),
        }));
        setSavedMessage('Unsaved local changes');
    };

    const updateResourceCapacity = (owner: string, weeklyCapacity: number) => {
        setState(prev => ({
            ...prev,
            resources: prev.resources.map(item => (item.owner === owner ? { ...item, weeklyCapacity } : item)),
        }));
        setSavedMessage('Unsaved local changes');
    };

    const saveState = () => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setSavedMessage('Saved locally');
    };

    const resetState = () => {
        setState(defaultState);
        window.localStorage.removeItem(STORAGE_KEY);
        setSavedMessage('Reset to baseline');
    };

    const exportCsv = () => {
        const header = ['Project', 'Domain', 'Gateway', 'WBS Phase', 'Owner', 'Supporter', 'Planned MD', 'Timesheet MD', 'Remaining MD', 'Due Date', 'Forecast Week', 'Status', 'Alert', 'Action'];
        const rows = state.items.map((item) => {
            const remaining = Math.max(item.plannedMd - item.timesheetMd, 0);
            return [
                item.project,
                item.domain,
                item.gateway,
                item.wbsPhase,
                item.owner,
                item.supporter,
                formatNumber(item.plannedMd),
                formatNumber(item.timesheetMd),
                formatNumber(remaining),
                item.dueDate,
                WEEKS.find(week => week.key === item.weekKey)?.range ?? item.weekKey,
                item.status,
                getAlertLevel(item),
                item.action,
            ];
        });
        const csv = [header, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resource-capacity-forecast.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="min-h-screen bg-[#f4f0e8] px-8 py-8 text-[#111111]">
            <section className="mb-6 bg-[#111111] px-8 py-7 text-white">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 border border-white/35 px-3 py-1 text-xs font-bold tracking-[0.2em] uppercase">
                            <TrendingUp className="size-4" />
                            Resource & Capacity Forecast
                        </div>
                        <h1 className="text-4xl font-black tracking-[0.08em]">
                            Project / Gateway / WBS Capacity Control
                        </h1>
                        <p className="mt-3 max-w-4xl text-sm leading-6 text-white/75">
                            Connect project gateway, WBS effort, planned mandays, timesheet actuals, weekly resource load, and early warning actions.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={saveState} className="inline-flex items-center gap-2 bg-[#d31321] px-4 py-3 text-sm font-black tracking-[0.12em] text-white uppercase">
                            <Save className="size-4" />
                            Save
                        </button>
                        <button onClick={exportCsv} className="inline-flex items-center gap-2 border border-white/40 px-4 py-3 text-sm font-black tracking-[0.12em] uppercase">
                            <Download className="size-4" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </section>

            <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
                {[
                    { label: 'Active Projects', value: activeItems.length, note: 'excluding Done / On Hold' },
                    { label: 'Remaining MD', value: formatNumber(totalRemaining), note: 'planned - timesheet actual' },
                    { label: 'Weekly Capacity', value: totalCapacity, note: 'current team baseline' },
                    { label: 'Selected Week Load', value: formatNumber(selectedWeekLoad), note: WEEKS.find(week => week.key === selectedWeek)?.range ?? '' },
                    { label: 'Alerts', value: alerts.length, note: 'red / amber warnings' },
                ].map(card => (
                    <div key={card.label} className="border border-[#d8d0c5] bg-[#fffdf8] p-5">
                        <div className="text-3xl font-black">{card.value}</div>
                        <div className="mt-2 text-xs font-black tracking-[0.18em] text-[#5b5147] uppercase">{card.label}</div>
                        <div className="mt-2 text-xs text-[#6f6257]">{card.note}</div>
                    </div>
                ))}
            </section>

            <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.9fr]">
                <div className="border border-[#d8d0c5] bg-[#fffdf8]">
                    <div className="flex items-center justify-between border-b border-[#d8d0c5] px-5 py-4">
                        <div>
                            <h2 className="text-lg font-black">Weekly Resource Load</h2>
                            <p className="text-xs text-[#6f6257]">Alert threshold: 80% amber, 100% red. Load is based on remaining mandays assigned to each forecast week.</p>
                        </div>
                        <span className="text-xs font-black tracking-[0.16em] text-[#5b5147] uppercase">{savedMessage}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse text-sm">
                            <thead>
                                <tr className="bg-[#334155] text-white">
                                    <th className="w-52 border-r border-white/30 px-4 py-3 text-left">Resource</th>
                                    <th className="w-32 border-r border-white/30 px-4 py-3 text-left">Capacity</th>
                                    {WEEKS.map(week => (
                                        <th key={week.key} className="border-r border-white/30 px-4 py-3 text-left">
                                            <button onClick={() => setSelectedWeek(week.key)} className="text-left">
                                                <div>{week.label}</div>
                                                <div className="text-xs font-normal text-white/70">{week.range}</div>
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {resourceRows.map(({ resource, weeklyLoads }) => (
                                    <tr key={resource.owner} className="border-b border-[#d8d0c5]">
                                        <td className="border-r border-[#d8d0c5] px-4 py-3 font-black">{resource.owner}</td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={resource.weeklyCapacity}
                                                onChange={event => updateResourceCapacity(resource.owner, Number(event.target.value))}
                                                className="w-20 border border-[#cfc6bb] bg-white px-2 py-1 font-bold"
                                            />
                                        </td>
                                        {weeklyLoads.map(({ week, load, usage }) => {
                                            const tone = usage >= 1 ? 'border-[#d31321] bg-[#fde7e9]' : usage >= 0.8 ? 'border-[#b16a00] bg-[#fff0cc]' : 'border-[#d8d0c5] bg-white';
                                            return (
                                                <td key={week.key} className={`border-r px-4 py-3 ${tone}`}>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className="font-black">{formatNumber(load)} MD</span>
                                                        <span className="text-xs font-bold">{Math.round(usage * 100)}%</span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="border border-[#d8d0c5] bg-[#fffdf8]">
                    <div className="border-b border-[#d8d0c5] px-5 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-black">
                            <AlertTriangle className="size-5 text-[#d31321]" />
                            Alert Board
                        </h2>
                        <p className="text-xs text-[#6f6257]">Use this as the weekly huddle action list.</p>
                    </div>
                    <div className="grid gap-3 p-5">
                        {alerts.length === 0 ? (
                            <div className="border border-[#0f7a5a] bg-[#e5f3ed] px-4 py-3 text-sm font-bold text-[#0f7a5a]">
                                No capacity or delivery alert.
                            </div>
                        ) : alerts.map(({ item, level }) => (
                            <div key={item.id} className={`border px-4 py-3 ${alertClass[level]}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-xs font-black tracking-[0.14em] uppercase">{level} Alert</div>
                                    <div className="text-xs font-bold">Due {item.dueDate}</div>
                                </div>
                                <div className="mt-2 font-black text-[#111111]">{item.project}</div>
                                <div className="mt-1 text-xs text-[#4f463d]">{item.action}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mb-6 border border-[#d8d0c5] bg-[#fffdf8]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d8d0c5] px-5 py-4">
                    <div>
                        <h2 className="text-lg font-black">Project Forecast Control Table</h2>
                        <p className="text-xs text-[#6f6257]">Editable source for Gateway / WBS / manday / timesheet actual / warning owner.</p>
                    </div>
                    <button onClick={resetState} className="inline-flex items-center gap-2 border border-[#111111] px-3 py-2 text-xs font-black tracking-[0.12em] uppercase">
                        <RefreshCw className="size-4" />
                        Reset Demo Data
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1450px] border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#111111] text-white">
                                <th className="w-64 border-r border-white/30 px-4 py-3 text-left">Project</th>
                                <th className="w-40 border-r border-white/30 px-4 py-3 text-left">Domain</th>
                                <th className="w-32 border-r border-white/30 px-4 py-3 text-left">Gateway</th>
                                <th className="w-36 border-r border-white/30 px-4 py-3 text-left">WBS Phase</th>
                                <th className="w-40 border-r border-white/30 px-4 py-3 text-left">Owner</th>
                                <th className="w-44 border-r border-white/30 px-4 py-3 text-left">Supporter</th>
                                <th className="w-28 border-r border-white/30 px-4 py-3 text-left">Plan MD</th>
                                <th className="w-32 border-r border-white/30 px-4 py-3 text-left">Timesheet</th>
                                <th className="w-28 border-r border-white/30 px-4 py-3 text-left">Remain</th>
                                <th className="w-36 border-r border-white/30 px-4 py-3 text-left">Due</th>
                                <th className="w-36 border-r border-white/30 px-4 py-3 text-left">Week</th>
                                <th className="w-32 border-r border-white/30 px-4 py-3 text-left">Status</th>
                                <th className="w-28 border-r border-white/30 px-4 py-3 text-left">Alert</th>
                                <th className="min-w-80 px-4 py-3 text-left">Next Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.items.map((item) => {
                                const remaining = Math.max(item.plannedMd - item.timesheetMd, 0);
                                const level = getAlertLevel(item);

                                return (
                                    <tr key={item.id} className="border-b border-[#d8d0c5] align-top">
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <textarea
                                                value={item.project}
                                                onChange={event => updateItem(item.id, { project: event.target.value })}
                                                className="min-h-16 w-full resize-none border border-[#d8d0c5] bg-white px-2 py-2 font-bold"
                                            />
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <input value={item.domain} onChange={event => updateItem(item.id, { domain: event.target.value })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2" />
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <select value={item.gateway} onChange={event => updateItem(item.id, { gateway: event.target.value as ForecastItem['gateway'] })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2 font-bold">
                                                {gatewayOptions.map(option => <option key={option}>{option}</option>)}
                                            </select>
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <select value={item.wbsPhase} onChange={event => updateItem(item.id, { wbsPhase: event.target.value as ForecastItem['wbsPhase'] })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2">
                                                {phaseOptions.map(option => <option key={option}>{option}</option>)}
                                            </select>
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <select value={item.owner} onChange={event => updateItem(item.id, { owner: event.target.value })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2 font-bold">
                                                {state.resources.map(resource => <option key={resource.owner}>{resource.owner}</option>)}
                                            </select>
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <input value={item.supporter} onChange={event => updateItem(item.id, { supporter: event.target.value })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2" />
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <input type="number" value={item.plannedMd} onChange={event => updateItem(item.id, { plannedMd: Number(event.target.value) })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2 font-bold" />
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <input type="number" value={item.timesheetMd} onChange={event => updateItem(item.id, { timesheetMd: Number(event.target.value) })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2 font-bold" />
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3 font-black">{formatNumber(remaining)}</td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <input type="date" value={item.dueDate} onChange={event => updateItem(item.id, { dueDate: event.target.value })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2" />
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <select value={item.weekKey} onChange={event => updateItem(item.id, { weekKey: event.target.value })} className="w-full border border-[#d8d0c5] bg-white px-2 py-2">
                                                {WEEKS.map(week => <option key={week.key} value={week.key}>{week.label} {week.range}</option>)}
                                            </select>
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <select value={item.status} onChange={event => updateItem(item.id, { status: event.target.value as ForecastStatus })} className={`w-full border px-2 py-2 font-black ${statusClass[item.status]}`}>
                                                {statusOptions.map(option => <option key={option}>{option}</option>)}
                                            </select>
                                        </td>
                                        <td className="border-r border-[#d8d0c5] px-4 py-3">
                                            <span className={`inline-flex border px-2 py-1 text-xs font-black tracking-[0.12em] uppercase ${alertClass[level]}`}>{level}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <textarea value={item.action} onChange={event => updateItem(item.id, { action: event.target.value })} className="min-h-16 w-full resize-none border border-[#d8d0c5] bg-white px-2 py-2" />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="border border-[#d8d0c5] bg-[#fffdf8] p-5">
                    <h2 className="mb-3 flex items-center gap-2 text-lg font-black">
                        <CalendarDays className="size-5" />
                        Selected Week Action List
                    </h2>
                    <div className="grid gap-3">
                        {selectedWeekItems.map(item => (
                            <div key={item.id} className="border border-[#d8d0c5] bg-white p-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="font-black">{item.project}</div>
                                    <div className="text-xs font-black text-[#d31321]">{item.gateway} due {item.dueDate}</div>
                                </div>
                                <div className="mt-2 text-sm text-[#4f463d]">{item.action}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-[#d8d0c5] bg-[#fffdf8] p-5">
                    <h2 className="mb-3 text-lg font-black">Alert SOP</h2>
                    <div className="grid gap-3 text-sm">
                        <div className="border-l-4 border-[#b16a00] bg-white px-4 py-3">
                            <b>Capacity warning:</b> weekly owner load reaches 80%. Action: rebalance owner/supporter before weekly huddle.
                        </div>
                        <div className="border-l-4 border-[#d31321] bg-white px-4 py-3">
                            <b>Capacity breach:</b> weekly owner load reaches 100% or task is due within 3 days. Action: escalate decision / priority / scope.
                        </div>
                        <div className="border-l-4 border-[#0f7a5a] bg-white px-4 py-3">
                            <b>Timesheet control:</b> compare timesheet actuals with planned mandays weekly. If actual exceeds 90%, refresh remaining effort forecast.
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export { ResourceCapacityForecastPage };
