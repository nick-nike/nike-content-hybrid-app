import { CalendarDays, ClipboardCopy, Eye, EyeOff, Plus, RotateCcw, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type SnapshotProject = {
    id: number;
    project: string;
    status: string;
    progress: string;
    decision: string;
    due: string;
};

type FocusItem = {
    id: number;
    title: string;
    body: string;
};

const defaultProjects: SnapshotProject[] = [
    {
        id: 1,
        project: 'Reprice',
        status: 'In Progress',
        progress: 'waiting to confirm who will lead this request.',
        decision: 'Roberto to confirm who will lead this request.',
        due: 'TBD',
    },
    {
        id: 2,
        project: 'IP Protection Phase 1 & 2',
        status: 'In Progress',
        progress: 'payment forecast is being prepared for both phases.',
        decision: 'align payment forecast with Quinny.',
        due: 'This week',
    },
    {
        id: 3,
        project: 'Omni SSO Authorization',
        status: 'Need Decision',
        progress: 'quotation has been sent to Vivian Tong.',
        decision: 'Vivian to confirm project budget.',
        due: 'This week',
    },
];

const defaultFocus: FocusItem[] = [
    { id: 1, title: 'Next 24H Focus 1', body: 'Confirm project decision owners.' },
    { id: 2, title: 'Next 24H Focus 2', body: 'Update next milestone dates.' },
    { id: 3, title: 'Next 24H Focus 3', body: 'Close completed project items.' },
];

const formatToday = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}/${month}/${day}`;
};

const statusOptions = ['Need Decision', 'In Progress', 'At Risk', 'On Track', 'On Hold', 'Done'];

const fieldClass = 'w-full border border-[#cfc7bc] bg-white px-3 py-2 text-sm font-semibold text-[#111111] outline-none focus:border-[#315c52] focus:ring-2 focus:ring-[#dce8e1]';

const statusTone = (status: string) => {
    if (status === 'Need Decision') {
        return 'border-[#b26b00] bg-[#fff3d6] text-[#8a5200]';
    }
    if (status === 'At Risk' || status === 'On Hold') {
        return 'border-[#c7a563] bg-[#fff8e8] text-[#7d5600]';
    }
    if (status === 'Done') {
        return 'border-[#7aa28a] bg-[#e8f6ef] text-[#315c52]';
    }
    return 'border-[#d8d0c6] bg-[#fbf8f2] text-[#315c52]';
};

const ProjectEditor = ({
    project,
    onChange,
    onDelete,
    canDelete,
}: {
    project: SnapshotProject;
    onChange: (next: SnapshotProject) => void;
    onDelete: () => void;
    canDelete: boolean;
}) => (
    <div className="border border-[#d8d0c6] bg-[#fffdf8] p-4">
        <div className="mb-3 flex items-center justify-between">
            <span className="flex h-7 w-7 items-center justify-center bg-[#315c52] text-sm font-black text-white">{project.id}</span>
            <div className="flex items-center gap-2">
                <select
                    value={project.status}
                    onChange={event => onChange({ ...project, status: event.target.value })}
                    className="border border-[#cfc7bc] bg-white px-2 py-1 text-xs font-bold text-[#315c52] outline-none"
                >
                    {statusOptions.map(status => <option key={status}>{status}</option>)}
                </select>
                {canDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        className="border border-[#cfc7bc] bg-white p-1.5 text-[#6d655c] hover:border-[#a26300] hover:text-[#a26300]"
                        aria-label={`Remove ${project.project}`}
                    >
                        <Trash2 className="size-4" />
                    </button>
                )}
            </div>
        </div>
        <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6d655c]">Project</label>
        <input
            value={project.project}
            onChange={event => onChange({ ...project, project: event.target.value })}
            className={`${fieldClass} mb-3`}
        />
        <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6d655c]">Progress</label>
        <textarea
            value={project.progress}
            onChange={event => onChange({ ...project, progress: event.target.value })}
            rows={2}
            className={`${fieldClass} mb-3 resize-none`}
        />
        <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6d655c]">Decision Point</label>
        <textarea
            value={project.decision}
            onChange={event => onChange({ ...project, decision: event.target.value })}
            rows={2}
            className={`${fieldClass} mb-3 resize-none`}
        />
        <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6d655c]">Due</label>
        <input
            value={project.due}
            onChange={event => onChange({ ...project, due: event.target.value })}
            className={fieldClass}
        />
    </div>
);

const SnapshotPreview = ({
    reportDate,
    keyMessage,
    projects,
    focusItems,
}: {
    reportDate: string;
    keyMessage: string;
    projects: SnapshotProject[];
    focusItems: FocusItem[];
}) => {
    const compact = projects.length > 5;
    const roomy = projects.length <= 3;

    return (
    <section id="daily-snapshot-capture" className="bg-[#fffdf8] text-[#111111]">
        <div className="bg-[#111111] px-8 py-7 text-center text-[30px] font-black tracking-[0.22em] text-white">
            SCM & Corp Tech Ops Daily Report - Executive Snapshot
        </div>
        <div className={`${roomy ? 'm-9 p-6' : 'm-5 p-5'} border border-[#111111] bg-white`}>
            <div className="mb-8 inline-block bg-[#111111] px-4 py-2 text-sm font-black tracking-[0.16em] text-white">DAILY SNAPSHOT</div>

            <div className={`${roomy ? 'mb-8 grid-cols-[290px_1fr] gap-4' : 'mb-5 grid-cols-[230px_1fr] gap-4'} grid ${compact ? 'mb-4' : ''}`}>
                <div className={`flex flex-col items-center justify-center border border-[#315c52] bg-[#e7f0ea] text-center text-[#315c52] ${compact ? 'min-h-[98px]' : roomy ? 'min-h-[156px]' : 'min-h-[118px]'}`}>
                    <div className="mb-2 text-sm font-black uppercase tracking-[0.16em]">Report Date</div>
                    <div className={`${compact ? 'text-[32px]' : roomy ? 'text-[46px]' : 'text-[38px]'} font-black leading-none`}>{reportDate}</div>
                </div>
                <div className={`flex flex-col justify-center border border-[#d8d0c6] bg-[#fbf8f2] px-6 ${compact ? 'min-h-[98px]' : roomy ? 'min-h-[156px]' : 'min-h-[118px]'}`}>
                    <div className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-[#315c52]">Key Message</div>
                    <div className={`${compact ? 'text-[23px]' : roomy ? 'text-[31px]' : 'text-[28px]'} font-black leading-tight`}>{keyMessage}</div>
                </div>
            </div>

            <div className="divide-y divide-[#d8d0c6] border-y border-[#d8d0c6]">
                {projects.map(project => (
                    <div
                        key={project.id}
                        className={`grid items-center gap-4 ${roomy ? 'grid-cols-[70px_380px_1fr_360px_120px] py-7' : 'grid-cols-[58px_360px_1fr_330px_118px]'} ${compact ? 'py-3' : roomy ? '' : 'py-4'}`}
                    >
                        <div className={`${compact ? 'text-[22px]' : roomy ? 'text-[30px]' : 'text-[26px]'} text-center font-black text-[#315c52]`}>{project.id}</div>
                        <div>
                            <div className={`${compact ? 'text-[21px]' : roomy ? 'text-[25px]' : 'text-[24px]'} font-black leading-tight`}>{project.project}</div>
                            <span className={`mt-2 inline-block border px-3 py-1 text-sm font-black ${statusTone(project.status)}`}>{project.status}</span>
                        </div>
                        <div className={`${compact ? 'text-[18px]' : roomy ? 'text-[24px]' : 'text-[21px]'} font-black leading-snug`}>Progress: {project.progress}</div>
                        <div className={`${compact ? 'text-[18px]' : roomy ? 'text-[24px]' : 'text-[21px]'} font-black leading-snug text-[#a26300]`}>Decision: {project.decision}</div>
                        <div className="flex justify-center">
                            <span className={`${roomy ? 'min-w-[104px] px-4 py-4 text-xl' : 'min-w-[92px] px-3 py-3 text-lg'} border border-[#315c52] bg-[#e7f0ea] text-center font-black text-[#315c52]`}>{project.due}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`${roomy ? 'mt-7' : 'mt-5'} grid grid-cols-3 gap-4`}>
                {focusItems.map(item => (
                    <div key={item.id} className={`${roomy ? 'min-h-[136px] p-5' : 'min-h-[96px] p-4'} border border-[#d8d0c6] bg-[#fbf8f2]`}>
                        <div className={`${roomy ? 'text-xl' : 'text-lg'} mb-2 font-black text-[#315c52]`}>{item.title}</div>
                        <div className={`${roomy ? 'text-lg' : 'text-base'} font-black`}>{item.body}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
    );
};

const DailySnapshotPage = () => {
    const [presentationMode, setPresentationMode] = useState(false);
    const [reportDate, setReportDate] = useState(formatToday());
    const [keyMessage, setKeyMessage] = useState('Today focus: Reprice owner, IP Protection payment forecast, and Omni SSO budget confirmation.');
    const [projects, setProjects] = useState<SnapshotProject[]>(defaultProjects);
    const [focusItems, setFocusItems] = useState<FocusItem[]>(defaultFocus);

    const copiedText = useMemo(() => {
        const projectText = projects
            .map(project => `${project.id}. ${project.project} | ${project.status} | Progress: ${project.progress} | Decision: ${project.decision} | Due: ${project.due}`)
            .join('\n');
        const focusText = focusItems.map(item => `${item.title}: ${item.body}`).join('\n');
        return `SCM & Corp Tech Ops Daily Report - ${reportDate}\n${keyMessage}\n\n${projectText}\n\n${focusText}`;
    }, [focusItems, keyMessage, projects, reportDate]);

    const updateProject = (id: number, next: SnapshotProject) => {
        setProjects(current => current.map(project => (project.id === id ? next : project)));
    };

    const renumberProjects = (items: SnapshotProject[]) => items.map((project, index) => ({ ...project, id: index + 1 }));

    const addProject = () => {
        setProjects(current => [
            ...current,
            {
                id: current.length + 1,
                project: 'Project name',
                status: 'In Progress',
                progress: 'current progress / next milestone.',
                decision: 'decision point if any.',
                due: 'MM/DD',
            },
        ]);
    };

    const deleteProject = (id: number) => {
        setProjects(current => renumberProjects(current.filter(project => project.id !== id)));
    };

    const updateFocus = (id: number, body: string) => {
        setFocusItems(current => current.map(item => (item.id === id ? { ...item, body } : item)));
    };

    const reset = () => {
        setReportDate(formatToday());
        setKeyMessage('Today focus: Reprice owner, IP Protection payment forecast, and Omni SSO budget confirmation.');
        setProjects(defaultProjects);
        setFocusItems(defaultFocus);
    };

    const copyText = async () => {
        await navigator.clipboard.writeText(copiedText);
    };

    return (
        <main className="min-h-screen bg-[#f7f4ef] p-6">
            <div className="mx-auto max-w-[1760px]">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-[#111111] bg-[#111111] px-5 py-4 text-white">
                    <div>
                        <h1 className="text-xl font-black tracking-[0.18em]">SCM & Corp Tech Ops Daily Snapshot</h1>
                        <p className="mt-1 text-sm font-semibold text-[#d8d0c6]">Fill the projects that need visibility, then screenshot the preview area for mobile-friendly sharing.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setPresentationMode(current => !current)} className="inline-flex items-center gap-2 border border-white/30 px-3 py-2 text-sm font-bold hover:bg-white hover:text-[#111111]">
                            {presentationMode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            {presentationMode ? 'Edit Mode' : 'Presentation Mode'}
                        </button>
                        <button onClick={copyText} className="inline-flex items-center gap-2 border border-white/30 px-3 py-2 text-sm font-bold hover:bg-white hover:text-[#111111]">
                            <ClipboardCopy className="size-4" />
                            Copy Text
                        </button>
                        <button onClick={reset} className="inline-flex items-center gap-2 border border-white/30 px-3 py-2 text-sm font-bold hover:bg-white hover:text-[#111111]">
                            <RotateCcw className="size-4" />
                            Reset
                        </button>
                    </div>
                </div>

                <div className={presentationMode ? 'block' : 'grid grid-cols-[440px_minmax(980px,1fr)] gap-6'}>
                    {!presentationMode && (
                        <aside className="space-y-4">
                            <section className="border border-[#d8d0c6] bg-[#fffdf8] p-4">
                                <div className="mb-4 flex items-center gap-2 text-[#315c52]">
                                    <CalendarDays className="size-5" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.16em]">Snapshot Inputs</h2>
                                </div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6d655c]">Report Date</label>
                                <input value={reportDate} onChange={event => setReportDate(event.target.value)} className={`${fieldClass} mb-4`} />
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6d655c]">Key Message</label>
                                <textarea value={keyMessage} onChange={event => setKeyMessage(event.target.value)} rows={3} className={`${fieldClass} resize-none`} />
                            </section>

                            <section className="border border-[#d8d0c6] bg-[#fffdf8] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[#315c52]">Project Updates</h2>
                                        <p className="mt-1 text-xs font-semibold text-[#6d655c]">Best for mobile: 3-5 projects per screenshot. More projects can be split into another screenshot.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addProject}
                                        className="inline-flex items-center gap-2 border border-[#315c52] bg-[#315c52] px-3 py-2 text-xs font-black text-white hover:bg-[#24463f]"
                                    >
                                        <Plus className="size-4" />
                                        Add Project
                                    </button>
                                </div>
                            </section>

                            {projects.map(project => (
                                <ProjectEditor
                                    key={project.id}
                                    project={project}
                                    onChange={next => updateProject(project.id, next)}
                                    onDelete={() => deleteProject(project.id)}
                                    canDelete={projects.length > 1}
                                />
                            ))}

                            <section className="border border-[#d8d0c6] bg-[#fffdf8] p-4">
                                <h2 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#315c52]">Next 24H Focus</h2>
                                <div className="space-y-3">
                                    {focusItems.map(item => (
                                        <div key={item.id}>
                                            <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-[#6d655c]">{item.title}</label>
                                            <input value={item.body} onChange={event => updateFocus(item.id, event.target.value)} className={fieldClass} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </aside>
                    )}

                    <div className={presentationMode ? 'mx-auto max-w-[1520px]' : 'overflow-x-auto'}>
                        <SnapshotPreview reportDate={reportDate} keyMessage={keyMessage} projects={projects} focusItems={focusItems} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export { DailySnapshotPage };
