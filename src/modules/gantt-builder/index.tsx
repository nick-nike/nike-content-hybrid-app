import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
    Download,
    Eye,
    EyeOff,
    Plus,
    RotateCcw,
    Save,
    Trash2,
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';

type GanttItemType = 'phase' | 'milestone';

type GanttItem = {
    id: string;
    name: string;
    start: string;
    end: string;
    type: GanttItemType;
    tone: 'blue' | 'green' | 'purple' | 'amber' | 'red';
};

type GanttPlan = {
    title: string;
    subtitle: string;
    owner: string;
    keyMessage: string;
    items: GanttItem[];
};

const STORAGE_KEY = 'generic-gantt-builder-v1';

const defaultPlan: GanttPlan = {
    title: 'MFP Data Source Change Master Schedule',
    subtitle: 'Project Window: Jul 3 - Sep 4, 2026',
    owner: 'SCM & Corp Tech Ops',
    keyMessage: 'Critical path: Feasibility -> Development -> SIT -> Deploy -> Business Go-Live',
    items: [
        {
            id: 'intake',
            name: 'Intake',
            start: '2026-07-03',
            end: '2026-07-03',
            type: 'milestone',
            tone: 'red',
        },
        {
            id: 'feasibility',
            name: 'Feasibility',
            start: '2026-07-06',
            end: '2026-07-17',
            type: 'phase',
            tone: 'green',
        },
        {
            id: 'coding',
            name: 'Coding',
            start: '2026-07-20',
            end: '2026-07-31',
            type: 'phase',
            tone: 'purple',
        },
        {
            id: 'sit',
            name: 'SIT',
            start: '2026-08-03',
            end: '2026-08-04',
            type: 'phase',
            tone: 'purple',
        },
        {
            id: 'qa-review',
            name: 'QA Review',
            start: '2026-08-05',
            end: '2026-08-06',
            type: 'phase',
            tone: 'purple',
        },
        {
            id: 'deploy',
            name: 'Deploy / Migration',
            start: '2026-08-07',
            end: '2026-08-14',
            type: 'phase',
            tone: 'amber',
        },
        {
            id: 'business-go-live',
            name: 'Business Go-Live',
            start: '2026-08-25',
            end: '2026-08-25',
            type: 'milestone',
            tone: 'red',
        },
        {
            id: 'archive',
            name: 'Deliverable Archive',
            start: '2026-08-26',
            end: '2026-09-04',
            type: 'phase',
            tone: 'blue',
        },
    ],
};

const toneClass: Record<GanttItem['tone'], string> = {
    blue: 'border-[#344154] bg-[#edf1f6] text-[#344154]',
    green: 'border-[#0f7a5a] bg-[#e5f3ed] text-[#0f7a5a]',
    purple: 'border-[#5b32c8] bg-[#eee8ff] text-[#5b32c8]',
    amber: 'border-[#b16a00] bg-[#fff0cc] text-[#8a5200]',
    red: 'border-[#d31321] bg-[#fde7e9] text-[#d31321]',
};

const summaryToneClass: Record<GanttItem['tone'], string> = {
    blue: 'text-[#344154]',
    green: 'text-[#0f7a5a]',
    purple: 'text-[#5b32c8]',
    amber: 'text-[#8a5200]',
    red: 'text-[#d31321]',
};

const parseDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? new Date() : date;
};

const formatDate = (value: string) => {
    const date = parseDate(value);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
};

const formatFullDate = (value: string) => {
    const date = parseDate(value);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const diffDays = (start: Date, end: Date) => {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((end.getTime() - start.getTime()) / msPerDay);
};

const toInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const loadPlan = () => {
    if (typeof window === 'undefined') {
        return defaultPlan;
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) as GanttPlan : defaultPlan;
    } catch {
        return defaultPlan;
    }
};

const savePlan = (plan: GanttPlan) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
};

const sortedItems = (items: GanttItem[]) => [...items].sort((first, second) => (
    first.start.localeCompare(second.start)
    || first.end.localeCompare(second.end)
    || first.name.localeCompare(second.name)
));

const timelineTicks = (start: Date, end: Date) => {
    const total = Math.max(diffDays(start, end), 1);
    const tickCount = 10;

    return Array.from({ length: tickCount }, (_, index) => {
        const tickStart = addDays(start, Math.round((total / tickCount) * index));
        const tickEnd = index === tickCount - 1
            ? end
            : addDays(start, Math.round((total / tickCount) * (index + 1)) - 1);

        return `${formatDate(toInputDate(tickStart))}-${formatDate(toInputDate(tickEnd))}`;
    });
};

const itemRangeStyle = (item: GanttItem, timelineStart: Date, timelineEnd: Date) => {
    const totalDays = Math.max(diffDays(timelineStart, timelineEnd) + 1, 1);
    const itemStart = Math.max(diffDays(timelineStart, parseDate(item.start)), 0);
    const itemEnd = Math.min(diffDays(timelineStart, parseDate(item.end)), totalDays - 1);
    const left = (itemStart / totalDays) * 100;
    const width = Math.max(((itemEnd - itemStart + 1) / totalDays) * 100, item.type === 'milestone' ? 2 : 3);

    return {
        left: `${left}%`,
        width: item.type === 'milestone' ? '24px' : `${width}%`,
    };
};

const GanttPreview = React.forwardRef<HTMLDivElement, { plan: GanttPlan }>(({ plan }, ref) => {
    const items = sortedItems(plan.items);
    const startDates = items.map(item => parseDate(item.start));
    const endDates = items.map(item => parseDate(item.end));
    const timelineStart = addDays(new Date(Math.min(...startDates.map(date => date.getTime()))), -2);
    const timelineEnd = addDays(new Date(Math.max(...endDates.map(date => date.getTime()))), 2);
    const ticks = timelineTicks(timelineStart, timelineEnd);

    return (
        <section ref={ref} className="w-[1440px] bg-[#f6f3ee] p-7 text-[#111111]">
            <div className="bg-[#111111] px-7 py-5 text-center text-[28px] font-extrabold tracking-[0.22em] text-white uppercase">
                {plan.title}
            </div>

            <div className="mt-5 border-2 border-[#111111] bg-[#fffdf8] p-6">
                <div className="grid grid-cols-3 gap-4">
                    <div className="border border-[#d8d0c5] bg-white p-4">
                        <div className="text-[12px] font-extrabold tracking-[0.15em] text-[#6a625a] uppercase">Schedule Window</div>
                        <div className="mt-2 text-[22px] font-extrabold">{plan.subtitle}</div>
                    </div>
                    <div className="border border-[#d8d0c5] bg-white p-4">
                        <div className="text-[12px] font-extrabold tracking-[0.15em] text-[#6a625a] uppercase">Owner</div>
                        <div className="mt-2 text-[22px] font-extrabold">{plan.owner}</div>
                    </div>
                    <div className="border border-[#d8d0c5] bg-white p-4">
                        <div className="text-[12px] font-extrabold tracking-[0.15em] text-[#6a625a] uppercase">Key Message</div>
                        <div className="mt-2 text-[18px] leading-7 font-extrabold">{plan.keyMessage}</div>
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-5 text-[12px] font-bold tracking-[0.12em] text-[#6a625a] uppercase">
                    {(['green', 'purple', 'amber', 'red', 'blue'] as GanttItem['tone'][]).map(tone => (
                        <div key={tone} className="flex items-center gap-2">
                            <span className={`h-3 w-6 border ${toneClass[tone]}`} />
                            {tone}
                        </div>
                    ))}
                </div>

                <div className="mt-5 overflow-hidden border border-[#d8d0c5] bg-white">
                    <div className="grid grid-cols-[260px_1fr] bg-[#344154] text-white">
                        <div className="border-r border-white/40 px-5 py-3 text-[13px] font-extrabold tracking-[0.08em] uppercase">
                            Phase / Activity
                        </div>
                        <div className="grid grid-cols-10">
                            {ticks.map(tick => (
                                <div key={tick} className="border-r border-white/40 px-2 py-3 text-center text-[12px] font-extrabold">
                                    {tick}
                                </div>
                            ))}
                        </div>
                    </div>

                    {items.map(item => (
                        <div key={item.id} className="grid min-h-[76px] grid-cols-[260px_1fr] border-t border-[#d8d0c5]">
                            <div className="border-r border-[#d8d0c5] bg-[#fffdf8] px-5 py-4">
                                <div className="text-[17px] leading-6 font-extrabold text-[#17203a]">{item.name}</div>
                                <div className="mt-1 text-[12px] font-bold tracking-[0.08em] text-[#6a625a] uppercase">
                                    {item.type === 'milestone'
                                        ? formatFullDate(item.start)
                                        : `${formatDate(item.start)} - ${formatDate(item.end)}`}
                                </div>
                            </div>
                            <div
                                className="relative bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(10%-1px),#d8d0c5_calc(10%-1px),#d8d0c5_10%)]"
                            >
                                {item.type === 'milestone'
                                    ? (
                                            <div
                                                className="absolute top-1/2 flex -translate-y-1/2 items-center gap-3"
                                                style={itemRangeStyle(item, timelineStart, timelineEnd)}
                                            >
                                                <div className={`h-6 w-6 rotate-45 border-2 ${toneClass[item.tone]}`} />
                                                <span className={`text-[12px] font-black tracking-[0.08em] whitespace-nowrap uppercase ${summaryToneClass[item.tone]}`}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        )
                                    : (
                                            <div
                                                className={`absolute top-1/2 flex h-8 -translate-y-1/2 items-center justify-center border px-3 text-[12px] font-extrabold tracking-[0.08em] whitespace-nowrap uppercase shadow-sm ${toneClass[item.tone]}`}
                                                style={itemRangeStyle(item, timelineStart, timelineEnd)}
                                            >
                                                {item.name}
                                            </div>
                                        )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 grid grid-cols-4 gap-4">
                    <div className="border border-[#d8d0c5] bg-white p-4">
                        <div className="text-[13px] font-black tracking-[0.12em] text-[#d31321] uppercase">Intake</div>
                        <div className="mt-2 text-[14px] leading-6 font-bold">Confirm scope, owner, dependency, and baseline.</div>
                    </div>
                    <div className="border border-[#d8d0c5] bg-white p-4">
                        <div className="text-[13px] font-black tracking-[0.12em] text-[#d31321] uppercase">Build & Test</div>
                        <div className="mt-2 text-[14px] leading-6 font-bold">Complete development, SIT, QA review, and readiness.</div>
                    </div>
                    <div className="border border-[#d8d0c5] bg-white p-4">
                        <div className="text-[13px] font-black tracking-[0.12em] text-[#d31321] uppercase">Deploy</div>
                        <div className="mt-2 text-[14px] leading-6 font-bold">Complete migration, cutover, and production validation.</div>
                    </div>
                    <div className="border border-[#d8d0c5] bg-white p-4">
                        <div className="text-[13px] font-black tracking-[0.12em] text-[#d31321] uppercase">Close</div>
                        <div className="mt-2 text-[14px] leading-6 font-bold">Archive deliverables and prepare final handover.</div>
                    </div>
                </div>
            </div>
        </section>
    );
});

GanttPreview.displayName = 'GanttPreview';

const newItem = (): GanttItem => ({
    id: `item-${Date.now()}`,
    name: 'New Activity',
    start: toInputDate(new Date()),
    end: toInputDate(addDays(new Date(), 5)),
    type: 'phase',
    tone: 'blue',
});

export const GanttBuilderPage: React.FC = () => {
    const [plan, setPlan] = useState<GanttPlan>(() => loadPlan());
    const [showEditor, setShowEditor] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const items = useMemo(() => sortedItems(plan.items), [plan.items]);

    const updatePlan = (nextPlan: GanttPlan) => {
        setPlan(nextPlan);
        savePlan(nextPlan);
    };

    const updateItem = (id: string, patch: Partial<GanttItem>) => {
        updatePlan({
            ...plan,
            items: plan.items.map(item => item.id === id ? { ...item, ...patch } : item),
        });
    };

    const addItem = () => {
        updatePlan({
            ...plan,
            items: [...plan.items, newItem()],
        });
    };

    const deleteItem = (id: string) => {
        updatePlan({
            ...plan,
            items: plan.items.filter(item => item.id !== id),
        });
    };

    const resetPlan = () => {
        updatePlan(defaultPlan);
    };

    const exportPdf = async () => {
        if (!previewRef.current) {
            return;
        }

        setIsExporting(true);
        try {
            const dataUrl = await toPng(previewRef.current, {
                backgroundColor: '#f6f3ee',
                pixelRatio: 2,
                cacheBust: true,
            });
            const image = new window.Image();
            image.src = dataUrl;
            await new Promise(resolve => {
                image.onload = resolve;
            });

            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const ratio = Math.min(pageWidth / image.width, pageHeight / image.height);
            const imageWidth = image.width * ratio;
            const imageHeight = image.height * ratio;
            const x = (pageWidth - imageWidth) / 2;
            const y = (pageHeight - imageHeight) / 2;

            pdf.addImage(dataUrl, 'PNG', x, y, imageWidth, imageHeight);
            pdf.save(`${plan.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-gantt.pdf`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f3ee] p-6 text-[#111111]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-[12px] font-extrabold tracking-[0.18em] text-[#6a625a] uppercase">Reusable Gantt Builder</div>
                    <h1 className="mt-1 text-3xl font-black tracking-[0.04em]">Executive Gantt Chart</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setShowEditor(!showEditor)}
                        className="inline-flex items-center gap-2 border border-[#111111] bg-white px-4 py-2 text-sm font-extrabold tracking-[0.08em] uppercase"
                    >
                        {showEditor ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        {showEditor ? 'Hide Editor' : 'Show Editor'}
                    </button>
                    <button
                        type="button"
                        onClick={resetPlan}
                        className="inline-flex items-center gap-2 border border-[#111111] bg-white px-4 py-2 text-sm font-extrabold tracking-[0.08em] uppercase"
                    >
                        <RotateCcw className="size-4" />
                        Reset
                    </button>
                    <button
                        type="button"
                        onClick={exportPdf}
                        disabled={isExporting}
                        className="inline-flex items-center gap-2 border border-[#d31321] bg-[#d31321] px-4 py-2 text-sm font-extrabold tracking-[0.08em] text-white uppercase disabled:opacity-60"
                    >
                        <Download className="size-4" />
                        {isExporting ? 'Exporting' : 'Export PDF'}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto border border-[#d8d0c5] bg-white p-4">
                <GanttPreview ref={previewRef} plan={plan} />
            </div>

            {showEditor && (
                <section className="mt-5 border border-[#d8d0c5] bg-[#fffdf8] p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black">Edit Gantt Data</h2>
                            <p className="mt-1 text-sm font-semibold text-[#6a625a]">Changes are saved automatically in this browser.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addItem}
                            className="inline-flex items-center gap-2 border border-[#111111] bg-white px-4 py-2 text-sm font-extrabold tracking-[0.08em] uppercase"
                        >
                            <Plus className="size-4" />
                            Add Activity
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-extrabold text-[#5f574e]">
                            Title
                            <input
                                value={plan.title}
                                onChange={event => updatePlan({ ...plan, title: event.target.value })}
                                className="mt-1 w-full border border-[#cfc7bc] bg-white px-3 py-2 text-sm font-bold text-[#111111] outline-none focus:border-[#d31321]"
                            />
                        </label>
                        <label className="text-sm font-extrabold text-[#5f574e]">
                            Schedule Window
                            <input
                                value={plan.subtitle}
                                onChange={event => updatePlan({ ...plan, subtitle: event.target.value })}
                                className="mt-1 w-full border border-[#cfc7bc] bg-white px-3 py-2 text-sm font-bold text-[#111111] outline-none focus:border-[#d31321]"
                            />
                        </label>
                        <label className="text-sm font-extrabold text-[#5f574e]">
                            Owner
                            <input
                                value={plan.owner}
                                onChange={event => updatePlan({ ...plan, owner: event.target.value })}
                                className="mt-1 w-full border border-[#cfc7bc] bg-white px-3 py-2 text-sm font-bold text-[#111111] outline-none focus:border-[#d31321]"
                            />
                        </label>
                        <label className="text-sm font-extrabold text-[#5f574e]">
                            Key Message
                            <input
                                value={plan.keyMessage}
                                onChange={event => updatePlan({ ...plan, keyMessage: event.target.value })}
                                className="mt-1 w-full border border-[#cfc7bc] bg-white px-3 py-2 text-sm font-bold text-[#111111] outline-none focus:border-[#d31321]"
                            />
                        </label>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[980px] border-collapse text-left">
                            <thead>
                                <tr className="bg-[#344154] text-white">
                                    <th className="border border-[#cfc7bc] px-3 py-3 text-xs font-extrabold uppercase">Activity</th>
                                    <th className="border border-[#cfc7bc] px-3 py-3 text-xs font-extrabold uppercase">Start</th>
                                    <th className="border border-[#cfc7bc] px-3 py-3 text-xs font-extrabold uppercase">End</th>
                                    <th className="border border-[#cfc7bc] px-3 py-3 text-xs font-extrabold uppercase">Type</th>
                                    <th className="border border-[#cfc7bc] px-3 py-3 text-xs font-extrabold uppercase">Tone</th>
                                    <th className="border border-[#cfc7bc] px-3 py-3 text-xs font-extrabold uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td className="border border-[#d8d0c5] p-2">
                                            <input
                                                value={item.name}
                                                onChange={event => updateItem(item.id, { name: event.target.value })}
                                                className="w-full border border-[#d8d0c5] bg-white px-2 py-2 text-sm font-bold"
                                            />
                                        </td>
                                        <td className="border border-[#d8d0c5] p-2">
                                            <input
                                                type="date"
                                                value={item.start}
                                                onChange={event => updateItem(item.id, { start: event.target.value })}
                                                className="w-full border border-[#d8d0c5] bg-white px-2 py-2 text-sm font-bold"
                                            />
                                        </td>
                                        <td className="border border-[#d8d0c5] p-2">
                                            <input
                                                type="date"
                                                value={item.end}
                                                onChange={event => updateItem(item.id, { end: event.target.value })}
                                                className="w-full border border-[#d8d0c5] bg-white px-2 py-2 text-sm font-bold"
                                            />
                                        </td>
                                        <td className="border border-[#d8d0c5] p-2">
                                            <select
                                                value={item.type}
                                                onChange={event => updateItem(item.id, { type: event.target.value as GanttItemType })}
                                                className="w-full border border-[#d8d0c5] bg-white px-2 py-2 text-sm font-bold"
                                            >
                                                <option value="phase">Phase</option>
                                                <option value="milestone">Milestone</option>
                                            </select>
                                        </td>
                                        <td className="border border-[#d8d0c5] p-2">
                                            <select
                                                value={item.tone}
                                                onChange={event => updateItem(item.id, { tone: event.target.value as GanttItem['tone'] })}
                                                className="w-full border border-[#d8d0c5] bg-white px-2 py-2 text-sm font-bold"
                                            >
                                                <option value="blue">Blue</option>
                                                <option value="green">Green</option>
                                                <option value="purple">Purple</option>
                                                <option value="amber">Amber</option>
                                                <option value="red">Red</option>
                                            </select>
                                        </td>
                                        <td className="border border-[#d8d0c5] p-2">
                                            <button
                                                type="button"
                                                onClick={() => deleteItem(item.id)}
                                                className="inline-flex items-center gap-2 border border-[#111111] bg-white px-3 py-2 text-xs font-extrabold uppercase"
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 border border-[#d8d0c5] bg-white px-3 py-2 text-xs font-bold text-[#5f574e]">
                        <Save className="size-4" />
                        Auto-saved locally
                    </div>
                </section>
            )}
        </div>
    );
};
