import {
    CalendarRange,
    Download,
    Filter,
    Pencil,
    Save,
    Search,
    Table2,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';

import budgetProjectCalendar from '@/data/budgetProjectCalendar.json';

type GatewayMarker = {
    type: 'BRD' | 'SRE' | 'GW1/2' | 'TUAT' | 'GW3/4/5';
    milestone: string;
    deliverable: string;
    start: string;
    end: string;
};

type GatewayProject = {
    businessDomain: string;
    projectName: string;
    cscopNo: string;
    status: string;
    contractOps: string;
    handoverDone: string;
    taskCount: number;
    taskStart: string;
    taskEnd: string;
    gatewayCount: number;
    hasGateway: boolean;
    gatewayMonths: Record<string, GatewayMarker[]>;
};

type GatewayData = {
    summary: {
        projectCount: number;
        taskCount: number;
        projectsWithGateway: number;
        projectsWithoutGateway: number;
        domainCounts: Record<string, number>;
        monthCounts: Record<string, { BRD: number; SRE: number; 'GW1/2': number; TUAT: number; 'GW3/4/5': number; projects: number }>;
        domainMonthCounts: Record<string, Record<string, { BRD: number; SRE: number; 'GW1/2': number; TUAT: number; 'GW3/4/5': number; projects: number }>>;
    };
    projects: GatewayProject[];
};

type ProjectMeetingInput = {
    size: string;
    priority: string;
    goLive: string;
    note?: string;
};

type GatewayDateOverride = {
    start: string;
    end: string;
};

type GatewayStatus = 'To Do' | 'WIP' | 'Done' | 'On Hold';
type HandoverStatusFilter = 'Active' | GatewayStatus | 'All';

type DefaultGatewayPatch = {
    projectName: string;
    cscopNo: string;
    type: GatewayMarker['type'];
    start?: string;
    end: string;
    status?: GatewayStatus;
};

const data = budgetProjectCalendar as GatewayData;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NODE_TYPES = ['BRD', 'SRE', 'GW1/2', 'TUAT', 'GW3/4/5'] as const;
const DOMAINS = ['All', ...Object.keys(data.summary.domainCounts)];
const MEETING_INPUTS_STORAGE_KEY = 'budget-project-calendar-meeting-inputs-v1';
const GATEWAY_DATE_OVERRIDES_STORAGE_KEY = 'budget-project-calendar-date-overrides-v1';
const GATEWAY_STATUS_STORAGE_KEY = 'budget-project-calendar-status-v1';
const GATEWAY_PATCH_VERSION_STORAGE_KEY = 'budget-project-calendar-confirmed-patch-version';
const GATEWAY_STATUS_PATCH_VERSION_STORAGE_KEY = 'budget-project-calendar-confirmed-status-patch-version';
const CURRENT_GATEWAY_PATCH_VERSION = '2026-06-12-v3';
const DEFAULT_GATEWAY_PATCHES: DefaultGatewayPatch[] = [
    { projectName: 'SFS Store Rollout – 9 Store', cscopNo: 'CSCOP-954', type: 'GW3/4/5', end: '2026-06-12', status: 'Done' },
    { projectName: 'CR : APS Report', cscopNo: 'CSCOP-881', type: 'GW1/2', end: '2026-06-05', status: 'Done' },
    { projectName: 'CR : APS Report', cscopNo: 'CSCOP-881', type: 'GW3/4/5', end: '2026-06-05', status: 'Done' },
    { projectName: 'Weather alert', cscopNo: 'CSCOP-891', type: 'GW1/2', end: '2026-05-30', status: 'WIP' },
    { projectName: 'Store Clustering SU27 Women / CN Adoption', cscopNo: 'CSCOP-785', type: 'GW3/4/5', end: '2026-06-02', status: 'Done' },
    { projectName: 'Price Portal enhancement: MD pricing Phase 1 Retail MD', cscopNo: 'CSCOP-939', type: 'GW3/4/5', end: '2026-06-05', status: 'WIP' },
    { projectName: 'China Service Center', cscopNo: 'CSCOP-935', type: 'GW1/2', end: '2026-06-12', status: 'WIP' },
    { projectName: 'OTB Report Automation', cscopNo: 'CSCOP-924', type: 'GW3/4/5', end: '2026-06-02', status: 'On Hold' },
    { projectName: 'CR : Chart Attribute Change', cscopNo: 'CSCOP-938', type: 'TUAT', end: '2026-06-24' },
    { projectName: 'CR : Chart Attribute Change', cscopNo: 'CSCOP-938', type: 'GW3/4/5', start: '2026-06-25', end: '2026-07-01', status: 'WIP' },
    { projectName: 'CR : E2P Enhancement', cscopNo: 'CSCOP-810', type: 'TUAT', end: '2026-06-24' },
    { projectName: 'CR : E2P Enhancement', cscopNo: 'CSCOP-810', type: 'GW3/4/5', start: '2026-06-25', end: '2026-07-01', status: 'WIP' },
    { projectName: 'Price Portal enhancement: MD pricing Phase2 EC MD', cscopNo: 'CSCOP-971', type: 'TUAT', end: '2026-07-29' },
    { projectName: 'Price Portal enhancement: MD pricing Phase2 EC MD', cscopNo: 'CSCOP-971', type: 'GW3/4/5', start: '2026-07-30', end: '2026-08-12', status: 'WIP' },
    { projectName: 'DC to Province Mapping data EDE Publish', cscopNo: 'CSCOP-984', type: 'TUAT', start: '2026-07-01', end: '2026-07-15' },
    { projectName: 'DC to Province Mapping data EDE Publish', cscopNo: 'CSCOP-984', type: 'GW3/4/5', start: '2026-07-16', end: '2026-07-29', status: 'WIP' },
    { projectName: 'SSOT : Product Dataset', cscopNo: 'CSCOP-851', type: 'TUAT', end: '2026-07-03' },
    { projectName: 'SSOT : Product Dataset', cscopNo: 'CSCOP-851', type: 'GW3/4/5', start: '2026-07-06', end: '2026-07-17', status: 'WIP' },
    { projectName: 'SFS | JD channel', cscopNo: 'CSCOP-956', type: 'GW3/4/5', start: '2026-06-17', end: '2026-06-30', status: 'WIP' },
    { projectName: 'SFS Enhancement :​ Low ROI Item', cscopNo: 'N/A', type: 'GW3/4/5', start: '2026-06-15', end: '2026-06-26', status: 'WIP' },
    { projectName: 'FY25 CCTV监控视频云备份', cscopNo: 'N/A-CCTV', type: 'GW3/4/5', start: '2026-06-15', end: '2026-06-26', status: 'WIP' },
    { projectName: '[MDM] Timestamp & Dummy Indicator', cscopNo: 'CSCOP-1010', type: 'GW3/4/5', start: '2026-06-15', end: '2026-06-26', status: 'WIP' },
    { projectName: '[MDM] Product Sibling', cscopNo: 'CSCOP-1011', type: 'GW3/4/5', start: '2026-06-15', end: '2026-06-26', status: 'WIP' },
    { projectName: 'Reporting Adoption for 3rd DC R2', cscopNo: 'CSCOP-967', type: 'TUAT', start: '2026-05-01', end: '2026-06-09' },
    { projectName: 'Reporting Adoption for 3rd DC R2', cscopNo: 'CSCOP-967', type: 'GW3/4/5', start: '2026-06-10', end: '2026-06-23', status: 'WIP' },
    { projectName: 'MS Notification for After-sale Orders - Share Service Portal Integration', cscopNo: 'N/A-SCU-001', type: 'GW3/4/5', start: '2026-06-18', end: '2026-07-01', status: 'To Do' },
    { projectName: 'Helios Location Channel_Code Integration', cscopNo: 'N/A-SCU-002', type: 'GW3/4/5', start: '2026-06-18', end: '2026-07-01', status: 'To Do' },
    { projectName: 'FOH BOH Engine - Re Open Date Integration', cscopNo: 'N/A-SCU-003', type: 'GW3/4/5', start: '2026-06-18', end: '2026-07-01', status: 'To Do' },
];
const DEFAULT_PROJECT_INPUTS: Record<string, ProjectMeetingInput> = {
    'CSCOP-956::SFS | JD channel': {
        size: '',
        priority: 'Charley asks close by Jun 30',
        goLive: '2026-06-08',
    },
    'N/A::SFS Enhancement :​ Low ROI Item': {
        size: '',
        priority: 'Confirm deliverables by Jun 19; complete GW3/4/5 by Jun 26',
        goLive: '2026-06-30',
    },
    'N/A-CCTV::FY25 CCTV监控视频云备份': {
        size: '',
        priority: 'Handover confirmed on Jun 10; sign-off by Jun 26',
        goLive: '2025-12-12',
    },
    'CSCOP-1010::[MDM] Timestamp & Dummy Indicator': {
        size: '',
        priority: 'Prepare handover materials this week; GW3/4/5 by Jun 26',
        goLive: '2026-05-26',
        note: '06/10 Touchbase with Aki',
    },
    'CSCOP-1011::[MDM] Product Sibling': {
        size: '',
        priority: 'Prepare handover materials this week; GW3/4/5 by Jun 26',
        goLive: '2026-05-26',
        note: '06/10 Touchbase with Aki',
    },
    'N/A-SCU-001::MS Notification for After-sale Orders - Share Service Portal Integration': {
        size: '',
        priority: 'Aki to provide handover materials during Jun 18-22',
        goLive: 'Live',
    },
    'N/A-SCU-002::Helios Location Channel_Code Integration': {
        size: '',
        priority: 'Aki to provide handover materials during Jun 18-22',
        goLive: 'Live',
    },
    'N/A-SCU-003::FOH BOH Engine - Re Open Date Integration': {
        size: '',
        priority: 'Aki to provide handover materials during Jun 18-22',
        goLive: 'Live',
    },
};
const REMOVED_GATEWAY_MARKERS = [
    { projectName: 'DC to Province Mapping data EDE Publish', cscopNo: 'CSCOP-984', type: 'GW1/2' },
    { projectName: 'Reporting Adoption for 3rd DC R2', cscopNo: 'CSCOP-967', type: 'GW1/2' },
];
const EXTRA_PROJECTS: GatewayProject[] = [
    {
        businessDomain: 'Corporate',
        projectName: 'FY25 CCTV监控视频云备份',
        cscopNo: 'N/A-CCTV',
        status: '进行中',
        contractOps: '',
        handoverDone: '',
        taskCount: 0,
        taskStart: '2025-12-12',
        taskEnd: '2026-06-26',
        gatewayCount: 0,
        hasGateway: false,
        gatewayMonths: MONTHS.reduce<Record<string, GatewayMarker[]>>((acc, month) => {
            acc[month] = [];
            return acc;
        }, {}),
    },
    {
        businessDomain: 'Supply chain & upstream',
        projectName: 'MS Notification for After-sale Orders - Share Service Portal Integration',
        cscopNo: 'N/A-SCU-001',
        status: '进行中',
        contractOps: '',
        handoverDone: '',
        taskCount: 0,
        taskStart: '2026-06-18',
        taskEnd: '2026-07-01',
        gatewayCount: 0,
        hasGateway: false,
        gatewayMonths: MONTHS.reduce<Record<string, GatewayMarker[]>>((acc, month) => {
            acc[month] = [];
            return acc;
        }, {}),
    },
    {
        businessDomain: 'Supply chain & upstream',
        projectName: 'Helios Location Channel_Code Integration',
        cscopNo: 'N/A-SCU-002',
        status: '进行中',
        contractOps: '',
        handoverDone: '',
        taskCount: 0,
        taskStart: '2026-06-18',
        taskEnd: '2026-07-01',
        gatewayCount: 0,
        hasGateway: false,
        gatewayMonths: MONTHS.reduce<Record<string, GatewayMarker[]>>((acc, month) => {
            acc[month] = [];
            return acc;
        }, {}),
    },
    {
        businessDomain: 'Supply chain & upstream',
        projectName: 'FOH BOH Engine - Re Open Date Integration',
        cscopNo: 'N/A-SCU-003',
        status: '进行中',
        contractOps: '',
        handoverDone: '',
        taskCount: 0,
        taskStart: '2026-06-18',
        taskEnd: '2026-07-01',
        gatewayCount: 0,
        hasGateway: false,
        gatewayMonths: MONTHS.reduce<Record<string, GatewayMarker[]>>((acc, month) => {
            acc[month] = [];
            return acc;
        }, {}),
    },
];
const CANCELED_PROJECT_NAMES = [
    'CR : Inventory Efficiency Tool Enhancement',
    'Demand Factors PBI enhancement',
    'On order OTP',
];
const isGatewayMarker = (marker: GatewayMarker) => marker.type === 'GW1/2' || marker.type === 'GW3/4/5';

const compactDate = (value: string) => value ? value.slice(5).replace('-', '/') : '';
const isoFromDate = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const todayIso = () => isoFromDate(new Date());
const addDaysIso = (value: string, days: number) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day + days);
    return isoFromDate(date);
};
const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const addBusinessDaysInclusive = (value: string, businessDays: number) => {
    if (!isIsoDate(value) || businessDays <= 1) {
        return value;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    let counted = 0;

    while (counted < businessDays) {
        const weekDay = date.getDay();
        if (weekDay !== 0 && weekDay !== 6) {
            counted += 1;
        }

        if (counted < businessDays) {
            date.setDate(date.getDate() + 1);
        }
    }

    return isoFromDate(date);
};
const daysBetween = (start: string, end: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) {
        return null;
    }

    const [startYear, startMonth, startDay] = start.split('-').map(Number);
    const [endYear, endMonth, endDay] = end.split('-').map(Number);
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    return Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
};
const markerDateLabel = (marker: GatewayMarker) => {
    if (!marker.start && !marker.end) {
        return '';
    }
    if (!marker.start || marker.start === marker.end) {
        return compactDate(marker.end || marker.start);
    }
    if (!marker.end) {
        return compactDate(marker.start);
    }
    return `${compactDate(marker.start)}-${compactDate(marker.end)}`;
};
const hasValidCscop = (project: GatewayProject) => {
    const value = project.cscopNo.trim().toUpperCase();
    return Boolean(value) && !['N/A', 'NA', 'NONE', 'NULL', '-'].includes(value);
};
const shouldShowProject = (project: GatewayProject) => hasValidCscop(project) || project.projectName === 'SFS Enhancement :​ Low ROI Item';
const isCanceledProject = (project: GatewayProject) => CANCELED_PROJECT_NAMES.some(name => project.projectName === name);
const defaultProjectInputKey = (project: GatewayProject) => `${project.cscopNo}::${project.projectName}`;
const projectInput = (project: GatewayProject, meetingInputs: Record<string, ProjectMeetingInput>) => (
    meetingInputs[projectKey(project)] ?? DEFAULT_PROJECT_INPUTS[defaultProjectInputKey(project)]
);
const projectKey = (project: GatewayProject) => `${project.businessDomain}::${project.cscopNo}::${project.projectName}`;
const gatewayOverrideKey = (project: GatewayProject, markerType: GatewayMarker['type']) => `${projectKey(project)}::${markerType}`;
const isSameProjectRef = (project: Pick<GatewayProject, 'cscopNo' | 'projectName'>, ref: Pick<DefaultGatewayPatch, 'cscopNo' | 'projectName'>) => (
    project.cscopNo === ref.cscopNo && project.projectName === ref.projectName
);
const confirmedPatchOverrideKeys = () => new Set(
    DEFAULT_GATEWAY_PATCHES
        .map((patch) => {
            const project = [...data.projects, ...EXTRA_PROJECTS].find(item => isSameProjectRef(item, patch));
            return project ? gatewayOverrideKey(project, patch.type) : '';
        })
        .filter(Boolean),
);
const emptyMeetingInput = { size: '', priority: '', goLive: '' };
const emptyGatewayDateOverride = { start: '', end: '' };
const loadMeetingInputs = (): Record<string, ProjectMeetingInput> => {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(MEETING_INPUTS_STORAGE_KEY);
        return raw ? JSON.parse(raw) as Record<string, ProjectMeetingInput> : {};
    }
    catch {
        return {};
    }
};
const loadGatewayDateOverrides = (): Record<string, GatewayDateOverride> => {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(GATEWAY_DATE_OVERRIDES_STORAGE_KEY);
        const overrides = raw ? JSON.parse(raw) as Record<string, GatewayDateOverride> : {};
        const appliedPatchVersion = window.localStorage.getItem(GATEWAY_PATCH_VERSION_STORAGE_KEY);

        if (appliedPatchVersion !== CURRENT_GATEWAY_PATCH_VERSION) {
            const patchedKeys = confirmedPatchOverrideKeys();
            const cleanedOverrides = Object.fromEntries(
                Object.entries(overrides).filter(([key]) => !patchedKeys.has(key)),
            ) as Record<string, GatewayDateOverride>;

            window.localStorage.setItem(GATEWAY_DATE_OVERRIDES_STORAGE_KEY, JSON.stringify(cleanedOverrides));
            window.localStorage.setItem(GATEWAY_PATCH_VERSION_STORAGE_KEY, CURRENT_GATEWAY_PATCH_VERSION);
            return cleanedOverrides;
        }

        return overrides;
    }
    catch {
        return {};
    }
};
const loadGatewayStatuses = (): Record<string, GatewayStatus> => {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(GATEWAY_STATUS_STORAGE_KEY);
        const statuses = raw ? JSON.parse(raw) as Record<string, GatewayStatus> : {};
        const appliedPatchVersion = window.localStorage.getItem(GATEWAY_STATUS_PATCH_VERSION_STORAGE_KEY);

        if (appliedPatchVersion !== CURRENT_GATEWAY_PATCH_VERSION) {
            const patchedKeys = confirmedPatchOverrideKeys();
            const cleanedStatuses = Object.fromEntries(
                Object.entries(statuses).filter(([key]) => !patchedKeys.has(key)),
            ) as Record<string, GatewayStatus>;

            window.localStorage.setItem(GATEWAY_STATUS_STORAGE_KEY, JSON.stringify(cleanedStatuses));
            window.localStorage.setItem(GATEWAY_STATUS_PATCH_VERSION_STORAGE_KEY, CURRENT_GATEWAY_PATCH_VERSION);
            return cleanedStatuses;
        }

        return statuses;
    }
    catch {
        return {};
    }
};

const markerSubLabel = (marker: GatewayMarker) => {
    const rawLabel = (marker.deliverable || marker.milestone || '').trim();
    const normalized = rawLabel.toLowerCase().replace(/\s+/g, '');
    const normalizedType = marker.type.toLowerCase().replace(/\s+/g, '');

    if (!rawLabel || normalized === normalizedType) {
        return '';
    }

    if (marker.type === 'GW1/2' || marker.type === 'GW3/4/5') {
        return rawLabel.toLowerCase().includes('handover') ? 'Handover' : rawLabel;
    }

    return rawLabel;
};

const markerClass = (type: GatewayMarker['type']) => (
    {
        BRD: 'border-[#7c8aa0] bg-[#eef2f7] text-[#344154]',
        SRE: 'border-[#00a86b] bg-[#e8f8ef] text-[#087f55]',
        'GW1/2': 'border-[#e5a900] bg-[#fff4c7] text-[#9f6600]',
        TUAT: 'border-[#7c3aed] bg-[#f1e9ff] text-[#5b21b6]',
        'GW3/4/5': 'border-[#d31321] bg-[#ffe5e8] text-[#a30d19]',
    }[type]
);

const escapeHtml = (value: string | number) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const markerInlineStyle = (type: GatewayMarker['type']) => (
    {
        BRD: 'border:1px solid #7c8aa0;background-color:#eef2f7;color:#344154;',
        SRE: 'border:1px solid #00a86b;background-color:#e8f8ef;color:#087f55;',
        'GW1/2': 'border:1px solid #e5a900;background-color:#fff4c7;color:#9f6600;',
        TUAT: 'border:1px solid #7c3aed;background-color:#f1e9ff;color:#5b21b6;',
        'GW3/4/5': 'border:1px solid #d31321;background-color:#ffe5e8;color:#a30d19;',
    }[type]
);

const statusClass = (status: GatewayStatus) => (
    {
        'To Do': 'border-[#a59b91] bg-white text-[#655f57]',
        WIP: 'border-[#2f80ed] bg-[#e8f1ff] text-[#1c5fb8]',
        Done: 'border-[#00a86b] bg-[#e8f8ef] text-[#087f55]',
        'On Hold': 'border-[#7b7166] bg-[#eee7dd] text-[#655f57]',
    }[status]
);

const statusInlineStyle = (status: GatewayStatus) => (
    {
        'To Do': 'border:1px solid #a59b91;background-color:#ffffff;color:#655f57;',
        WIP: 'border:1px solid #2f80ed;background-color:#e8f1ff;color:#1c5fb8;',
        Done: 'border:1px solid #00a86b;background-color:#e8f8ef;color:#087f55;',
        'On Hold': 'border:1px solid #7b7166;background-color:#eee7dd;color:#655f57;',
    }[status]
);

const markerMonth = (marker: GatewayMarker) => {
    const targetDate = marker.end || marker.start;
    if (!targetDate || !targetDate.startsWith('2026-')) {
        return '';
    }

    return MONTHS[Number(targetDate.slice(5, 7)) - 1] ?? '';
};

const isPatchForProject = (patch: DefaultGatewayPatch, project: GatewayProject) => isSameProjectRef(project, patch);
const shouldRemoveMarker = (project: GatewayProject, marker: GatewayMarker) => REMOVED_GATEWAY_MARKERS.some(
    item => item.cscopNo === project.cscopNo && item.projectName === project.projectName && item.type === marker.type,
);

const defaultGatewayStatus = (project: GatewayProject, marker: GatewayMarker): GatewayStatus => {
    const patch = DEFAULT_GATEWAY_PATCHES.find(item => isPatchForProject(item, project) && item.type === marker.type);
    return patch?.status ?? (markerDateLabel(marker) ? 'WIP' : 'To Do');
};

const patchToMarker = (patch: DefaultGatewayPatch): GatewayMarker => ({
    type: patch.type,
    milestone: patch.type === 'GW1/2'
        ? 'Gateway Handover 1/2'
        : patch.type === 'GW3/4/5'
            ? 'Gateway Handover 3/4/5'
            : patch.type,
    deliverable: patch.type === 'GW1/2' || patch.type === 'GW3/4/5' ? `${patch.type} Handover` : patch.type,
    start: patch.start ?? patch.end,
    end: patch.type === 'GW3/4/5'
        ? addBusinessDaysInclusive(patch.start ?? patch.end, 10)
        : patch.end,
});

const applyDatePatch = (marker: GatewayMarker, patch?: DefaultGatewayPatch, override?: GatewayDateOverride) => {
    const normalizedMarker = marker.type === 'GW3/4/5' && marker.start
        ? {
                ...marker,
                end: addBusinessDaysInclusive(marker.start, 10),
            }
        : marker;

    const patchedMarker = patch
        ? {
                ...normalizedMarker,
                start: patch.start ?? patch.end,
                end: patch.type === 'GW3/4/5'
                    ? addBusinessDaysInclusive(patch.start ?? patch.end, 10)
                    : patch.end,
            }
        : normalizedMarker;

    return override
        ? {
                ...patchedMarker,
                start: override.start || patchedMarker.start,
                end: override.end || patchedMarker.end,
            }
        : patchedMarker;
};

const applyGatewayDateOverrides = (
    projects: GatewayProject[],
    overrides: Record<string, GatewayDateOverride>,
) => projects.map((project) => {
    const nextProject: GatewayProject = {
        ...project,
        gatewayMonths: MONTHS.reduce<Record<string, GatewayMarker[]>>((acc, month) => {
            acc[month] = [];
            return acc;
        }, {}),
    };

    MONTHS.forEach((month) => {
        (project.gatewayMonths[month] ?? []).forEach((marker) => {
            if (shouldRemoveMarker(project, marker)) {
                return;
            }

            const defaultPatch = DEFAULT_GATEWAY_PATCHES.find(patch => isPatchForProject(patch, project) && patch.type === marker.type);
            const override = isGatewayMarker(marker) ? overrides[gatewayOverrideKey(project, marker.type)] : undefined;
            const nextMarker = applyDatePatch(marker, defaultPatch, override);
            const nextMonth = markerMonth(nextMarker) || month;
            nextProject.gatewayMonths[nextMonth].push(nextMarker);
        });
    });

    DEFAULT_GATEWAY_PATCHES
        .filter(patch => isPatchForProject(patch, project))
        .forEach((patch) => {
            const alreadyExists = MONTHS.some(month => nextProject.gatewayMonths[month].some(marker => marker.type === patch.type));
            if (alreadyExists) {
                return;
            }

            const override = overrides[gatewayOverrideKey(project, patch.type)];
            const nextMarker = applyDatePatch(patchToMarker(patch), undefined, override);
            const nextMonth = markerMonth(nextMarker);
            if (nextMonth) {
                nextProject.gatewayMonths[nextMonth].push(nextMarker);
            }
        });

    nextProject.gatewayCount = sumGatewayCount(nextProject);
    nextProject.nodeCount = MONTHS.reduce((sum, month) => sum + nextProject.gatewayMonths[month].length, 0);
    nextProject.hasGateway = nextProject.nodeCount > 0;

    return nextProject;
});

const resolveGatewayStatus = (
    project: GatewayProject,
    marker: GatewayMarker,
    statuses: Record<string, GatewayStatus>,
) => statuses[gatewayOverrideKey(project, marker.type)] ?? defaultGatewayStatus(project, marker);

const matchesHandoverStatusFilter = (
    project: GatewayProject,
    marker: GatewayMarker,
    statuses: Record<string, GatewayStatus>,
    filter: HandoverStatusFilter,
) => {
    if (!isGatewayMarker(marker) || isCanceledProject(project)) {
        return false;
    }

    const status = resolveGatewayStatus(project, marker, statuses);
    if (filter === 'All') {
        return true;
    }
    if (filter === 'Active') {
        return status !== 'Done' && status !== 'On Hold';
    }
    return status === filter;
};

const projectHasMatchingHandoverInMonth = (
    project: GatewayProject,
    month: string,
    statuses: Record<string, GatewayStatus>,
    filter: HandoverStatusFilter,
) => (project.gatewayMonths[month] ?? []).some(marker => matchesHandoverStatusFilter(project, marker, statuses, filter));

const matchesWeeklyHandoverMarker = (project: GatewayProject, marker: GatewayMarker) => (
    isGatewayMarker(marker) && !isCanceledProject(project)
);

const projectHasWeeklyHandoverInMonth = (
    project: GatewayProject,
    month: string,
) => (project.gatewayMonths[month] ?? []).some(marker => matchesWeeklyHandoverMarker(project, marker));

const monthDetailMarkers = (
    project: GatewayProject,
    month: string,
    statuses: Record<string, GatewayStatus>,
    filter: HandoverStatusFilter,
) => {
    const nonGatewayMarkers = allNodeMarkers(project).filter(marker => !isGatewayMarker(marker));
    const monthGatewayMarkers = (project.gatewayMonths[month] ?? [])
        .filter(marker => matchesHandoverStatusFilter(project, marker, statuses, filter));

    return [...nonGatewayMarkers, ...monthGatewayMarkers];
};

const monthNumber = (month: string) => MONTHS.indexOf(month) + 1;
const monthWeekRanges = (month: string) => {
    const monthNo = monthNumber(month);
    const lastDay = new Date(2026, monthNo, 0).getDate();
    return [
        { label: 'W1', startDay: 1, endDay: Math.min(7, lastDay) },
        { label: 'W2', startDay: 8, endDay: Math.min(14, lastDay) },
        { label: 'W3', startDay: 15, endDay: Math.min(21, lastDay) },
        { label: 'W4', startDay: 22, endDay: Math.min(28, lastDay) },
        { label: 'W5', startDay: 29, endDay: lastDay },
    ].filter(week => week.startDay <= week.endDay);
};

const markerDayInMonth = (marker: GatewayMarker, month: string) => {
    const targetDate = marker.end || marker.start;
    const monthNo = monthNumber(month);
    if (!targetDate || !targetDate.startsWith(`2026-${String(monthNo).padStart(2, '0')}-`)) {
        return null;
    }

    return Number(targetDate.slice(8, 10));
};

const resourceLoad = (count: number, capacity: number) => {
    if (capacity <= 0) {
        return { label: 'Set capacity', tone: 'neutral' as const, percent: 0 };
    }

    const percent = Math.round((count / capacity) * 100);
    if (count > capacity) {
        return { label: 'Over capacity', tone: 'critical' as const, percent };
    }
    if (count === capacity) {
        return { label: 'Full', tone: 'full' as const, percent };
    }
    if (percent >= 80) {
        return { label: 'Tight', tone: 'tight' as const, percent };
    }
    return { label: 'Available', tone: 'available' as const, percent };
};

const exportMarkerHtml = (marker: GatewayMarker, status?: GatewayStatus) => {
    const subLabel = markerSubLabel(marker);
    const dateLabel = markerDateLabel(marker);
    const exportStatus = status === 'WIP' ? undefined : status;

    return `
        <div style="${markerInlineStyle(marker.type)}display:block;width:78px;margin:0 auto 4px auto;padding:5px 3px;text-align:center;font-size:11px;font-weight:700;line-height:16px;mso-number-format:'\\@';">
            <div style="font-weight:700;">${escapeHtml(marker.type)}</div>
            ${subLabel ? `<div style="font-weight:600;">${escapeHtml(subLabel)}</div>` : ''}
            ${dateLabel ? `<div style="font-size:10px;font-weight:500;mso-number-format:'\\@';">${escapeHtml(dateLabel)}</div>` : ''}
            ${exportStatus ? `<div style="${statusInlineStyle(exportStatus)}display:inline-block;margin-top:3px;padding:1px 5px;font-size:9px;font-weight:700;">${escapeHtml(exportStatus)}</div>` : ''}
        </div>
    `;
};

const hasMeetingInput = (input?: ProjectMeetingInput) => Boolean(input?.size || input?.priority || input?.goLive || input?.note);
const sumGatewayCount = (project: GatewayProject) => MONTHS.reduce(
    (sum, month) => sum + (project.gatewayMonths[month] ?? []).filter(isGatewayMarker).length,
    0,
);
const allGatewayMarkers = (project: GatewayProject) => MONTHS.flatMap(month => project.gatewayMonths[month] ?? []).filter(isGatewayMarker);
const allNodeMarkers = (project: GatewayProject) => MONTHS.flatMap(month => project.gatewayMonths[month] ?? []);
const firstGatewayDue = (project: GatewayProject) => allGatewayMarkers(project)
    .map(marker => marker.end || marker.start)
    .filter(Boolean)
    .sort()[0] ?? '';
const shouldShowExportUrgency = (project: GatewayProject) => (
    project.cscopNo === 'CSCOP-939'
    && project.projectName.includes('Price Portal enhancement: MD pricing Phase 1 Retail MD')
);
const normalizedProjectSize = (project: GatewayProject, input?: ProjectMeetingInput) => {
    const rawSize = (input?.size ?? '').trim().toLowerCase();
    if (/小\s*cr|small|几天|s\b|^s$/.test(rawSize)) {
        return 'S';
    }
    if (/^m\b|medium/.test(rawSize)) {
        return 'M';
    }
    if (/^l\b|large|xl/.test(rawSize)) {
        return 'L';
    }

    const goLive = input?.goLive;
    const duration = goLive ? daysBetween(project.taskStart, goLive) : null;
    if (duration !== null && duration <= 21) {
        return 'S';
    }
    if (duration !== null && duration <= 75) {
        return 'M';
    }
    if (duration !== null) {
        return 'L';
    }
    return '';
};
const projectUrgency = (project: GatewayProject, input?: ProjectMeetingInput) => {
    const today = todayIso();
    const near = addDaysIso(today, 45);
    const priority = (input?.priority ?? '').trim().toLowerCase();
    const size = normalizedProjectSize(project, input);
    const goLive = input?.goLive ?? '';
    const due = firstGatewayDue(project);
    const isHighest = project.cscopNo === 'CSCOP-939' || project.projectName.includes('Price Portal enhancement: MD pricing Phase 1 Retail MD');
    const isCanceled = priority.includes('cancel') || priority.includes('取消') || project.projectName.includes('Canceled') || isCanceledProject(project);
    const isHold = priority.includes('hold');
    const isPending = priority.includes('pending');
    const isDone = priority.includes('done');
    const isSmallCr = priority.includes('小cr') || (input?.size ?? '').toLowerCase().includes('小cr');
    const goLivePassed = Boolean(goLive && goLive < today);
    const goLiveSoon = Boolean(goLive && goLive <= near);
    const duePassed = Boolean(due && due < today);
    const dueSoon = Boolean(due && due <= near);

    if (isCanceled) {
        return { score: 900, tone: 'normal' as const, label: '', reason: 'Canceled' };
    }
    if (isHold) {
        return { score: 820, tone: 'normal' as const, label: '', reason: 'Hold' };
    }
    if (isPending) {
        return { score: 720, tone: 'normal' as const, label: '', reason: 'Pending' };
    }
    if (isHighest) {
        return { score: 0, tone: 'critical' as const, label: 'Top Urgent', reason: 'Priority highest handover' };
    }
    if (goLivePassed) {
        return { score: 15, tone: 'critical' as const, label: 'Urgent', reason: 'Go-live passed' };
    }
    if (duePassed) {
        return { score: 25, tone: 'critical' as const, label: 'Urgent', reason: 'GW due passed' };
    }
    if (isDone && project.projectName.toLowerCase().includes('support')) {
        return { score: 35, tone: 'critical' as const, label: 'Urgent', reason: 'Done support item' };
    }
    if (isDone) {
        return { score: 45, tone: 'normal' as const, label: '', reason: 'Project done, close handover' };
    }
    if (goLiveSoon && (size === 'S' || isSmallCr)) {
        return { score: 55, tone: 'normal' as const, label: '', reason: 'Small June/near go-live' };
    }
    if (dueSoon) {
        return { score: 70, tone: 'normal' as const, label: '', reason: 'GW due soon' };
    }
    if (size === 'S' || isSmallCr) {
        return { score: 95, tone: 'normal' as const, label: '', reason: 'Small size' };
    }
    return { score: 200, tone: 'normal' as const, label: '', reason: '' };
};
const urgencyRowClass = (tone: ReturnType<typeof projectUrgency>['tone']) => (
    {
        critical: 'hover:bg-[#faf4e8]',
        high: 'hover:bg-[#faf4e8]',
        medium: 'hover:bg-[#faf4e8]',
        normal: 'hover:bg-[#faf4e8]',
        paused: 'hover:bg-[#faf4e8]',
        canceled: 'hover:bg-[#faf4e8]',
    }[tone]
);
const urgencyBadgeClass = (tone: ReturnType<typeof projectUrgency>['tone']) => (
    {
        critical: 'border-[#d31321] bg-[#d31321] text-white',
        high: 'border-[#d31321] bg-[#ffe5e8] text-[#a30d19]',
        medium: 'border-[#e5a900] bg-[#fff4c7] text-[#9f6600]',
        normal: 'border-[#d8d0c5] bg-white text-[#655f57]',
        paused: 'border-[#7b7166] bg-[#eee7dd] text-[#655f57]',
        canceled: 'border-[#8b8b8b] bg-[#eeeeee] text-[#666666]',
    }[tone]
);

export const BudgetProjectCalendarPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [domain, setDomain] = useState('All');
    const [show, setShow] = useState<'all' | 'with-gw' | 'missing-gw'>('all');
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [handoverStatusFilter, setHandoverStatusFilter] = useState<HandoverStatusFilter>('Active');
    const [weeklyCapacity, setWeeklyCapacity] = useState(5);
    const [selectedWeekLabel, setSelectedWeekLabel] = useState('');
    const [meetingInputs, setMeetingInputs] = useState<Record<string, ProjectMeetingInput>>(() => loadMeetingInputs());
    const [gatewayDateOverrides, setGatewayDateOverrides] = useState<Record<string, GatewayDateOverride>>(() => loadGatewayDateOverrides());
    const [gatewayStatuses, setGatewayStatuses] = useState<Record<string, GatewayStatus>>(() => loadGatewayStatuses());
    const [editingProject, setEditingProject] = useState<GatewayProject | null>(null);
    const [draftInput, setDraftInput] = useState<ProjectMeetingInput>(emptyMeetingInput);
    const [editingGateway, setEditingGateway] = useState<{ project: GatewayProject; marker: GatewayMarker } | null>(null);
    const [draftGatewayDate, setDraftGatewayDate] = useState<GatewayDateOverride>(emptyGatewayDateOverride);
    const [draftGatewayStatus, setDraftGatewayStatus] = useState<GatewayStatus>('To Do');

    const displayProjects = useMemo(
        () => applyGatewayDateOverrides([...data.projects.filter(shouldShowProject), ...EXTRA_PROJECTS], gatewayDateOverrides),
        [gatewayDateOverrides],
    );

    const openMeetingInput = (project: GatewayProject) => {
        setEditingProject(project);
        setDraftInput(projectInput(project, meetingInputs) ?? emptyMeetingInput);
    };

    const saveMeetingInput = () => {
        if (!editingProject) {
            return;
        }

        const key = projectKey(editingProject);
        const next = {
            ...meetingInputs,
            [key]: {
                size: draftInput.size.trim(),
                priority: draftInput.priority.trim(),
                goLive: draftInput.goLive,
                note: draftInput.note?.trim(),
            },
        };
        setMeetingInputs(next);
        window.localStorage.setItem(MEETING_INPUTS_STORAGE_KEY, JSON.stringify(next));
        setEditingProject(null);
    };

    const openGatewayDateEditor = (project: GatewayProject, marker: GatewayMarker) => {
        if (!isGatewayMarker(marker)) {
            return;
        }

        const originalProject = data.projects.find(item => projectKey(item) === projectKey(project)) ?? project;
        const key = gatewayOverrideKey(originalProject, marker.type);
        setEditingGateway({ project: originalProject, marker });
        setDraftGatewayDate(gatewayDateOverrides[key] ?? { start: marker.start, end: marker.end });
        setDraftGatewayStatus(gatewayStatuses[key] ?? defaultGatewayStatus(originalProject, marker));
    };

    const saveGatewayDate = () => {
        if (!editingGateway) {
            return;
        }

        const key = gatewayOverrideKey(editingGateway.project, editingGateway.marker.type);
        const next = {
            ...gatewayDateOverrides,
            [key]: {
                start: draftGatewayDate.start,
                end: draftGatewayDate.end,
            },
        };
        setGatewayDateOverrides(next);
        window.localStorage.setItem(GATEWAY_DATE_OVERRIDES_STORAGE_KEY, JSON.stringify(next));
        const nextStatuses = {
            ...gatewayStatuses,
            [key]: draftGatewayStatus,
        };
        setGatewayStatuses(nextStatuses);
        window.localStorage.setItem(GATEWAY_STATUS_STORAGE_KEY, JSON.stringify(nextStatuses));
        setEditingGateway(null);
    };

    const updateGatewayEndDate = (project: GatewayProject, marker: GatewayMarker, endDate: string) => {
        const key = gatewayOverrideKey(project, marker.type);
        const current = gatewayDateOverrides[key] ?? { start: marker.start, end: marker.end };
        const next = {
            ...gatewayDateOverrides,
            [key]: {
                start: current.start || marker.start,
                end: endDate,
            },
        };
        setGatewayDateOverrides(next);
        window.localStorage.setItem(GATEWAY_DATE_OVERRIDES_STORAGE_KEY, JSON.stringify(next));
    };

    const updateGatewayStatus = (project: GatewayProject, marker: GatewayMarker, status: GatewayStatus) => {
        const key = gatewayOverrideKey(project, marker.type);
        const next = {
            ...gatewayStatuses,
            [key]: status,
        };
        setGatewayStatuses(next);
        window.localStorage.setItem(GATEWAY_STATUS_STORAGE_KEY, JSON.stringify(next));
    };

    const baseFilteredProjects = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return displayProjects.filter((project) => {
            const matchesQuery = !needle || [
                project.businessDomain,
                project.projectName,
                project.cscopNo,
                project.status,
            ].some(value => value.toLowerCase().includes(needle));
            const matchesDomain = domain === 'All' || project.businessDomain === domain;
            const matchesMonth = selectedMonth === 'All' || projectHasMatchingHandoverInMonth(project, selectedMonth, gatewayStatuses, handoverStatusFilter);
            const matchesShow = show === 'all'
                || (show === 'with-gw' && project.hasGateway)
                || (show === 'missing-gw' && !project.hasGateway);

            return matchesQuery && matchesDomain && matchesShow;
        });
    }, [displayProjects, domain, query, show]);

    const filteredProjects = useMemo(() => baseFilteredProjects.filter((project) => {
        const matchesMonth = selectedMonth === 'All' || projectHasMatchingHandoverInMonth(project, selectedMonth, gatewayStatuses, handoverStatusFilter);

        return matchesMonth;
    }), [baseFilteredProjects, gatewayStatuses, handoverStatusFilter, selectedMonth]);

    const monthFilterCounts = useMemo(() => {
        return MONTHS.reduce<Record<string, { projects: number; BRD: number; SRE: number; 'GW1/2': number; TUAT: number; 'GW3/4/5': number }>>((acc, month) => {
            const monthProjects = baseFilteredProjects.filter(project => projectHasMatchingHandoverInMonth(project, month, gatewayStatuses, handoverStatusFilter));
            acc[month] = {
                projects: monthProjects.length,
                BRD: monthProjects.reduce((sum, project) => sum + project.gatewayMonths[month].filter(marker => marker.type === 'BRD').length, 0),
                SRE: monthProjects.reduce((sum, project) => sum + project.gatewayMonths[month].filter(marker => marker.type === 'SRE').length, 0),
                'GW1/2': monthProjects.reduce((sum, project) => sum + project.gatewayMonths[month].filter(marker => marker.type === 'GW1/2' && matchesHandoverStatusFilter(project, marker, gatewayStatuses, handoverStatusFilter)).length, 0),
                TUAT: monthProjects.reduce((sum, project) => sum + project.gatewayMonths[month].filter(marker => marker.type === 'TUAT').length, 0),
                'GW3/4/5': monthProjects.reduce((sum, project) => sum + project.gatewayMonths[month].filter(marker => marker.type === 'GW3/4/5' && matchesHandoverStatusFilter(project, marker, gatewayStatuses, handoverStatusFilter)).length, 0),
            };
            return acc;
        }, {});
    }, [baseFilteredProjects, gatewayStatuses, handoverStatusFilter]);

    const selectedMonthProjects = useMemo(() => {
        if (selectedMonth === 'All') {
            return [];
        }

        return filteredProjects
            .filter(project => projectHasMatchingHandoverInMonth(project, selectedMonth, gatewayStatuses, handoverStatusFilter))
            .map(project => ({
                project,
                markers: project.gatewayMonths[selectedMonth],
            }));
    }, [filteredProjects, gatewayStatuses, handoverStatusFilter, selectedMonth]);

    const selectedMonthWeeklyProjects = useMemo(() => {
        if (selectedMonth === 'All') {
            return [];
        }

        return baseFilteredProjects
            .filter(project => projectHasWeeklyHandoverInMonth(project, selectedMonth))
            .map(project => ({
                project,
                markers: project.gatewayMonths[selectedMonth],
            }));
    }, [baseFilteredProjects, selectedMonth]);

    const selectedMonthCounts = selectedMonth === 'All'
        ? { projects: 0, BRD: 0, SRE: 0, 'GW1/2': 0, TUAT: 0, 'GW3/4/5': 0 }
        : monthFilterCounts[selectedMonth];
    const selectedMonthGatewayTotal = selectedMonthCounts['GW1/2'] + selectedMonthCounts['GW3/4/5'];
    const chooseMonth = (month: string) => {
        setSelectedMonth(month);
        setSelectedWeekLabel('');
    };
    const selectedMonthWeekCounts = useMemo(() => {
        if (selectedMonth === 'All') {
            return [];
        }

        return monthWeekRanges(selectedMonth).map((week) => {
            const weekProjects = new Set<string>();
            const items: Array<{ project: GatewayProject; marker: GatewayMarker; dueDate: string; status: GatewayStatus }> = [];
            const counts = selectedMonthWeeklyProjects.reduce((acc, { project }) => {
                (project.gatewayMonths[selectedMonth] ?? []).forEach((marker) => {
                    const day = markerDayInMonth(marker, selectedMonth);
                    if (
                        day !== null
                        && day >= week.startDay
                        && day <= week.endDay
                        && matchesWeeklyHandoverMarker(project, marker)
                    ) {
                        acc[marker.type as 'GW1/2' | 'GW3/4/5'] += 1;
                        weekProjects.add(projectKey(project));
                        items.push({
                            project,
                            marker,
                            dueDate: marker.end || marker.start,
                            status: resolveGatewayStatus(project, marker, gatewayStatuses),
                        });
                    }
                });
                return acc;
            }, { 'GW1/2': 0, 'GW3/4/5': 0 });
            const total = counts['GW1/2'] + counts['GW3/4/5'];

            return {
                ...week,
                counts,
                total,
                projects: weekProjects.size,
                items: items.sort((first, second) => (
                    first.dueDate.localeCompare(second.dueDate)
                    || first.project.businessDomain.localeCompare(second.project.businessDomain)
                    || first.project.projectName.localeCompare(second.project.projectName)
                )),
                load: resourceLoad(total, weeklyCapacity),
            };
        });
    }, [gatewayStatuses, selectedMonth, selectedMonthWeeklyProjects, weeklyCapacity]);
    const selectedWeek = selectedMonthWeekCounts.find(week => week.label === selectedWeekLabel);

    const exportWorkbook = () => {
        const exportProjects = displayProjects;
        const exportGroups = groupProjects(exportProjects, meetingInputs);
        const exportMonthCounts = MONTHS.reduce<Record<string, { 'GW1/2': number; 'GW3/4/5': number }>>((acc, month) => {
            acc[month] = exportProjects.reduce((counts, project) => {
                const markers = project.gatewayMonths[month] ?? [];
                return {
                    'GW1/2': counts['GW1/2'] + markers.filter(marker => marker.type === 'GW1/2' && matchesHandoverStatusFilter(project, marker, gatewayStatuses, handoverStatusFilter)).length,
                    'GW3/4/5': counts['GW3/4/5'] + markers.filter(marker => marker.type === 'GW3/4/5' && matchesHandoverStatusFilter(project, marker, gatewayStatuses, handoverStatusFilter)).length,
                };
            }, { 'GW1/2': 0, 'GW3/4/5': 0 });
            return acc;
        }, {});
        const monthNote = 'All Projects';
        const rowsHtml = exportGroups.map(group => (`
            <tr>
                <td colspan="14" style="background:#f4aa00;color:#ffffff;font-weight:700;font-size:14px;padding:8px 10px;border:1px solid #cfc7bd;">
                    ${escapeHtml(group.domain)}
                </td>
            </tr>
            ${group.projects.map((project) => {
                const meetingInput = projectInput(project, meetingInputs);
                const exportUrgency = shouldShowExportUrgency(project) ? projectUrgency(project, meetingInput).label : '';
                return `
                    <tr>
                        <td style="width:150px;height:88px;vertical-align:top;color:#746b62;font-style:italic;padding:10px;border:1px solid #d8d0c5;background-color:#fffdf8;font-size:14px;">
                            ${escapeHtml(project.businessDomain)}
                            <div style="margin-top:4px;color:#a1988f;font-style:normal;font-size:11px;">${escapeHtml(project.cscopNo)}</div>
                        </td>
                        <td style="width:340px;height:88px;vertical-align:top;color:#17203a;font-weight:700;padding:10px;border:1px solid #d8d0c5;background-color:#fffdf8;font-size:14px;line-height:20px;">
                            ${escapeHtml(project.projectName)}
                            ${exportUrgency ? `<div style="margin-top:8px;color:#d31321;font-size:11px;font-weight:700;line-height:16px;">${escapeHtml(exportUrgency)}</div>` : ''}
                            ${hasMeetingInput(meetingInput)
                                ? `<div style="margin-top:4px;color:#6f665d;font-size:11px;font-weight:600;line-height:16px;">
                                    Size: ${escapeHtml(meetingInput?.size || '-')} / Priority: ${escapeHtml(meetingInput?.priority || '-')} / Go-live: ${escapeHtml(meetingInput?.goLive || '-')}
                                    ${meetingInput?.note ? `<div>Note: ${escapeHtml(meetingInput.note)}</div>` : ''}
                                </div>`
                                : ''}
                        </td>
                        ${MONTHS.map(month => {
                            const markers = project.gatewayMonths[month] ?? [];
                            return `
                                <td style="width:98px;height:88px;vertical-align:top;padding:6px;border:1px solid #d8d0c5;background-color:#fffdf8;text-align:center;">
                                    ${markers.map(marker => exportMarkerHtml(marker, isGatewayMarker(marker) ? (gatewayStatuses[gatewayOverrideKey(project, marker.type)] ?? defaultGatewayStatus(project, marker)) : undefined)).join('')}
                                </td>
                            `;
                        }).join('')}
                    </tr>
                `;
            }).join('')}
        `)).join('');

        const monthSummaryHtml = MONTHS.map(month => `
            <td style="width:98px;height:62px;border:1px solid #e5ded5;background-color:#ffffff;color:#111111;text-align:center;vertical-align:middle;padding:6px;">
                <div style="font-size:11px;font-weight:700;">${month}</div>
                <div style="font-size:18px;font-weight:700;">${exportMonthCounts[month]['GW1/2'] + exportMonthCounts[month]['GW3/4/5']}</div>
                <div style="font-size:10px;font-weight:600;">GW1/2 ${exportMonthCounts[month]['GW1/2']} / GW3/4/5 ${exportMonthCounts[month]['GW3/4/5']}</div>
            </td>
        `).join('');
        const weeklyExportHtml = selectedMonth === 'All' ? '' : `
            <tr>
                <td colspan="14" style="border:1px solid #d8d0c5;background-color:#fffdf8;padding:14px 18px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#5f574e;">Weekly Filter / Resource Load</div>
                    <div style="font-size:11px;color:#7b7166;margin-top:4px;">${escapeHtml(selectedMonth)} weekly handover count is based on GW1/2 and GW3/4/5 end date. Weekly capacity: ${weeklyCapacity}</div>
                    <table style="width:100%;border-collapse:collapse;margin-top:10px;">
                        <tr>
                            ${selectedMonthWeekCounts.map(week => `
                                <td style="width:20%;border:1px solid #d8d0c5;background-color:${
                                    week.load.tone === 'critical'
                                        ? '#ffe5e8'
                                        : week.load.tone === 'full'
                                            ? '#fff4c7'
                                            : week.load.tone === 'tight'
                                                ? '#fff8e2'
                                                : '#ffffff'
                                };padding:10px;vertical-align:top;">
                                    <div style="font-size:14px;font-weight:700;color:#17203a;">${week.label}</div>
                                    <div style="font-size:11px;font-weight:600;color:#7b7166;">${escapeHtml(selectedMonth)} ${week.startDay}-${week.endDay}</div>
                                    <div style="font-size:24px;font-weight:700;color:#111111;margin-top:6px;">${week.total}</div>
                                    <div style="font-size:11px;font-weight:700;color:#5f574e;">GW1/2 ${week.counts['GW1/2']} / GW3/4/5 ${week.counts['GW3/4/5']}</div>
                                    <div style="font-size:11px;font-weight:700;color:#5f574e;">${week.projects} projects / ${week.load.percent}%</div>
                                    <div style="display:inline-block;margin-top:6px;border:1px solid #111111;padding:2px 6px;font-size:10px;font-weight:700;">${escapeHtml(week.load.label)}</div>
                                </td>
                            `).join('')}
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="14" style="border:1px solid #d8d0c5;background-color:#ffffff;padding:14px 18px;">
                    <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#17203a;">Weekly Handover Project List</div>
                    <table style="width:100%;border-collapse:collapse;margin-top:10px;">
                        <tr>
                            <th style="background:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:8px;text-align:left;font-size:11px;">Week</th>
                            <th style="background:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:8px;text-align:left;font-size:11px;">Project Name</th>
                            <th style="background:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:8px;text-align:left;font-size:11px;">Domain / CSCOP</th>
                            <th style="background:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:8px;text-align:left;font-size:11px;">Handover</th>
                            <th style="background:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:8px;text-align:left;font-size:11px;">Complete Date</th>
                            <th style="background:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:8px;text-align:left;font-size:11px;">Status</th>
                        </tr>
                        ${selectedMonthWeekCounts.flatMap(week => week.items.map(item => `
                            <tr>
                                <td style="border:1px solid #d8d0c5;padding:8px;font-size:11px;font-weight:700;">${week.label}<div style="font-weight:600;color:#7b7166;">${escapeHtml(selectedMonth)} ${week.startDay}-${week.endDay}</div></td>
                                <td style="border:1px solid #d8d0c5;padding:8px;font-size:12px;font-weight:700;color:#17203a;">${escapeHtml(item.project.projectName)}</td>
                                <td style="border:1px solid #d8d0c5;padding:8px;font-size:11px;color:#5f574e;">${escapeHtml(item.project.businessDomain)} / ${escapeHtml(item.project.cscopNo)}</td>
                                <td style="border:1px solid #d8d0c5;padding:8px;font-size:11px;"><span style="${markerInlineStyle(item.marker.type)}display:inline-block;padding:4px 8px;font-weight:700;">${escapeHtml(item.marker.type)} Handover</span></td>
                                <td style="border:1px solid #d8d0c5;padding:8px;font-size:12px;font-weight:700;color:#5f574e;">${escapeHtml(compactDate(item.dueDate))}</td>
                                <td style="border:1px solid #d8d0c5;padding:8px;font-size:11px;"><span style="${statusInlineStyle(item.status)}display:inline-block;padding:3px 7px;font-weight:700;">${escapeHtml(item.status)}</span></td>
                            </tr>
                        `)).join('')}
                    </table>
                </td>
            </tr>
        `;

        const html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8" />
                <style>
                    body {
                        margin: 0;
                        background: #f6f3ee;
                        color: #111111;
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    table.calendar {
                        border-collapse: collapse;
                        table-layout: fixed;
                        width: 1600px;
                        background: #fffdf8;
                    }
                    th {
                        background: #344154;
                        color: #ffffff;
                        font-weight: 700;
                    }
                    .title-band {
                        background: #171727;
                        color: #ffffff;
                        padding: 22px 28px;
                        border: 1px solid #171727;
                    }
                    .eyebrow {
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        border: 1px solid rgba(255,255,255,.35);
                        display: inline-block;
                        padding: 4px 8px;
                    }
                    .title {
                        font-size: 34px;
                        font-weight: 700;
                        margin-top: 14px;
                    }
                    .subtitle {
                        font-size: 13px;
                        color: #d8d8df;
                        margin-top: 10px;
                    }
                </style>
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Budget Project Handover Calendar</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                    <x:FreezePanes/>
                                    <x:FrozenNoSplit/>
                                    <x:SplitHorizontal>4</x:SplitHorizontal>
                                    <x:TopRowBottomPane>4</x:TopRowBottomPane>
                                    <x:ActivePane>2</x:ActivePane>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
            </head>
            <body>
                <table class="calendar">
                    <colgroup>
                        <col style="width:150px;" />
                        <col style="width:340px;" />
                        ${MONTHS.map(() => '<col style="width:98px;" />').join('')}
                    </colgroup>
                    <tr style="height:116px;">
                        <td colspan="14" style="background-color:#171727;color:#ffffff;padding:18px 28px;border:1px solid #171727;vertical-align:middle;">
                            <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:1px solid #666678;display:inline-block;padding:4px 8px;">
                                Budget Project Handover Calendar
                            </div>
                            <div style="font-size:34px;font-weight:700;margin-top:12px;">2026 Project Implementation Calendar</div>
                            <div style="font-size:13px;color:#d8d8df;margin-top:8px;">${escapeHtml(monthNote)} / ${exportProjects.length} total projects / BRD, SRE, GW1/2, TUAT and GW3/4/5 by month, domain and project</div>
                        </td>
                    </tr>
                    <tr style="height:76px;">
                        <td colspan="2" style="background-color:#f6f3ee;color:#111111;border:1px solid #d8d0c5;padding:10px 12px;vertical-align:middle;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                            Month Filter
                            <div style="font-size:11px;font-weight:600;letter-spacing:0;text-transform:none;color:#6f665d;margin-top:4px;">Count = GW1/2 + GW3/4/5 completions</div>
                        </td>
                        ${monthSummaryHtml}
                    </tr>
                    ${weeklyExportHtml}
                    <tr style="height:48px;background-color:#344154;color:#ffffff;">
                        <th style="width:150px;background-color:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:10px;text-align:left;font-size:12px;font-weight:700;">Business<br/>Domain</th>
                        <th style="width:340px;background-color:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:10px;text-align:left;font-size:12px;font-weight:700;">Project Name</th>
                        ${MONTHS.map(month => `<th style="width:98px;background-color:#344154;color:#ffffff;border:1px solid #cfc7bd;padding:10px;text-align:center;font-size:12px;font-weight:700;">${month}</th>`).join('')}
                    </tr>
                    <tr style="height:30px;background-color:#ffffff;">
                        <td colspan="2" style="border:1px solid #d8d0c5;padding:6px;text-align:right;color:#7b7166;font-style:italic;font-size:12px;">Milestone Legend &rarr;</td>
                        <td colspan="10" style="border:1px solid #d8d0c5;padding:6px;text-align:center;color:#d31321;font-size:12px;font-weight:700;">BRD &rarr; SRE &rarr; GW1/2 &rarr; TUAT &rarr; GW3/4/5</td>
                        <td colspan="2" style="border:1px solid #d8d0c5;padding:6px;"></td>
                    </tr>
                    ${rowsHtml}
                </table>
            </body>
            </html>
        `;

        const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `budget-project-handover-calendar-${selectedMonth.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.xls`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[#f6f3ee] text-[#111111]">
            <header className="border-b border-[#d8d0c5] bg-[#171727] text-white">
                <div className="mx-auto max-w-[1600px] px-6 py-7 lg:px-10">
                    <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-end 2xl:justify-between">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 border border-white/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
                                <CalendarRange size={14} />
                                Budget project handover calendar
                            </div>
                            <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">
                                2026 Project Implementation Calendar
                            </h1>
                            <p className="mt-4 max-w-4xl text-sm leading-6 text-white/70">
                                BRD, SRE, GW1/2, TUAT, GW3/4/5 are mapped into month cells by project node order, grouped by Business Domain and Project Name.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 2xl:w-[640px] 2xl:grid-cols-4">
                            <Metric label="Projects" value={data.summary.projectCount} />
                            <Metric label="Task rows" value={data.summary.taskCount} />
                            <Metric label="With Nodes" value={data.summary.projectsWithGateway} tone="good" />
                            <Metric label="No Node" value={data.summary.projectsWithoutGateway} tone="warn" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-6 py-6 lg:px-10">
                <section className="mb-5 grid grid-cols-1 items-start gap-4 2xl:grid-cols-[minmax(0,1fr)_420px]">
                    <div className="border border-[#d8d0c5] bg-[#fffdf8] p-4">
                        <div className="space-y-4">
                            <div className="flex min-w-0 items-center gap-3 border border-[#d8d0c5] bg-white px-3 py-2">
                                <Search size={18} className="shrink-0 text-[#80776e]" />
                                <input
                                    value={query}
                                    onChange={event => setQuery(event.target.value)}
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#a79e94]"
                                    placeholder="Search domain, project, CSCOP, status"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <select
                                    value={domain}
                                    onChange={event => setDomain(event.target.value)}
                                    className="h-10 border border-[#d8d0c5] bg-white px-3 text-sm font-semibold outline-none"
                                >
                                    {DOMAINS.map(item => <option key={item}>{item}</option>)}
                                </select>
                                <Segmented value={show} onChange={setShow} />
                                <select
                                    value={handoverStatusFilter}
                                    onChange={event => setHandoverStatusFilter(event.target.value as HandoverStatusFilter)}
                                    className="h-10 border border-[#111111] bg-white px-3 text-xs font-bold uppercase tracking-[0.08em] outline-none"
                                    title="Filter GW1/2 and GW3/4/5 by status"
                                >
                                    <option value="Active">Active Handover</option>
                                    <option value="To Do">To Do</option>
                                    <option value="WIP">WIP</option>
                                    <option value="Done">Done</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="All">All Status</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => chooseMonth('All')}
                                    className={`h-10 border border-[#111111] px-3 text-xs font-bold uppercase tracking-[0.08em] ${selectedMonth === 'All' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}
                                >
                                    All Months
                                </button>
                                <button
                                    type="button"
                                    onClick={exportWorkbook}
                                    className="inline-flex h-10 items-center gap-2 bg-[#d31321] px-4 text-xs font-bold uppercase tracking-[0.1em] text-white"
                                >
                                    <Download size={15} />
                                    Export XLS
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border border-[#d8d0c5] bg-[#fffdf8] p-4">
                        <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#5f574e]">
                            <Filter size={15} />
                            Month filter
                        </div>
                        <div className="mb-3 text-[11px] font-semibold text-[#7b7166]">
                            Status: {handoverStatusFilter === 'Active' ? 'Active handover excludes Done / On Hold / Cancelled' : handoverStatusFilter}
                        </div>
                        <div className="grid grid-cols-6 gap-1">
                            {MONTHS.map(month => (
                                <button
                                    key={month}
                                    type="button"
                                    onClick={() => chooseMonth(month)}
                                    className={`border p-2 text-center transition-colors ${selectedMonth === month ? 'border-[#d31321] bg-[#d31321] text-white' : 'border-[#e5ded5] bg-white text-[#111111] hover:border-[#d31321]'}`}
                                >
                                    <div className="text-[11px] font-bold">{month}</div>
                                    <div className="mt-1 text-lg font-semibold">
                                        {(monthFilterCounts[month]?.['GW1/2'] ?? 0) + (monthFilterCounts[month]?.['GW3/4/5'] ?? 0)}
                                    </div>
                                    <div className="mt-1 text-[10px] font-semibold opacity-75">
                                        GW {monthFilterCounts[month]?.['GW1/2'] ?? 0}/{monthFilterCounts[month]?.['GW3/4/5'] ?? 0}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {selectedMonth !== 'All' && (
                    <section className="mb-5 border border-[#d8d0c5] bg-[#fffdf8]">
                        <div className="flex flex-col gap-3 border-b border-[#d8d0c5] px-5 py-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">{selectedMonth} Gateway Project List</h2>
                                <p className="text-sm text-[#6f665d]">
                                    {selectedMonthGatewayTotal} handover items / GW1/2 handover {selectedMonthCounts['GW1/2']} / GW3/4/5 handover {selectedMonthCounts['GW3/4/5']} / {selectedMonthCounts.projects} projects
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => chooseMonth('All')}
                                className="h-9 border border-[#111111] px-3 text-xs font-bold uppercase tracking-[0.08em]"
                            >
                                Clear Month
                            </button>
                        </div>
                        <div className="border-b border-[#d8d0c5] px-5 py-4">
                            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#5f574e]">
                                        Weekly filter / Resource load
                                    </div>
                                    <div className="mt-1 text-xs text-[#7b7166]">
                                        Week count is based on handover due date. W1=1-7, W2=8-14, W3=15-21, W4=22-28, W5=29-end.
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#5f574e]">
                                    Weekly capacity
                                    <input
                                        type="number"
                                        min={1}
                                        value={weeklyCapacity}
                                        onChange={event => setWeeklyCapacity(Math.max(1, Number(event.target.value) || 1))}
                                        className="h-9 w-20 border border-[#d8d0c5] bg-white px-2 text-center text-sm font-semibold text-[#111111] outline-none"
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
                                {selectedMonthWeekCounts.map((week) => (
                                    <button
                                        type="button"
                                        key={week.label}
                                        onClick={() => setSelectedWeekLabel(selectedWeekLabel === week.label ? '' : week.label)}
                                        className={`border p-3 text-left transition-shadow ${
                                            selectedWeekLabel === week.label ? 'ring-2 ring-[#111111] ring-offset-1' : ''
                                        } ${
                                            week.load.tone === 'critical'
                                                ? 'border-[#d31321] bg-[#ffe5e8]'
                                                : week.load.tone === 'full'
                                                    ? 'border-[#b7791f] bg-[#fff4c7]'
                                                    : week.load.tone === 'tight'
                                                        ? 'border-[#d8a03a] bg-[#fff8e2]'
                                                        : 'border-[#d8d0c5] bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="text-sm font-bold text-[#17203a]">{week.label}</div>
                                                <div className="text-[11px] font-semibold text-[#7b7166]">
                                                    {selectedMonth} {week.startDay}-{week.endDay}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-semibold text-[#111111]">{week.total}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f665d]">
                                                    {week.load.percent}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 text-[11px] font-semibold text-[#5f574e]">
                                            GW1/2 {week.counts['GW1/2']} / GW3/4/5 {week.counts['GW3/4/5']}
                                        </div>
                                        <div className="mt-1 text-[11px] font-semibold text-[#5f574e]">
                                            {week.projects} projects
                                        </div>
                                        <div className="mt-2 inline-block border border-[#111111] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#111111]">
                                            {week.load.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {selectedWeek && (
                                <div className="mt-4 border border-[#d8d0c5] bg-white">
                                    <div className="flex flex-col gap-2 border-b border-[#eee6dc] px-4 py-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#17203a]">
                                                {selectedWeek.label} Handover Project List
                                            </div>
                                            <div className="mt-1 text-xs font-semibold text-[#6f665d]">
                                                {selectedMonth} {selectedWeek.startDay}-{selectedWeek.endDay} / {selectedWeek.total} handover items / GW1/2 {selectedWeek.counts['GW1/2']} / GW3/4/5 {selectedWeek.counts['GW3/4/5']}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedWeekLabel('')}
                                            className="h-8 border border-[#111111] px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#111111]"
                                        >
                                            Hide list
                                        </button>
                                    </div>
                                    <div className="divide-y divide-[#eee6dc]">
                                        {selectedWeek.items.length > 0 ? selectedWeek.items.map(item => (
                                            <div
                                                key={`${projectKey(item.project)}-${item.marker.type}-${item.dueDate}`}
                                                className="grid gap-3 px-4 py-3 text-sm xl:grid-cols-[minmax(260px,1fr)_130px_260px] xl:items-center"
                                            >
                                                <div>
                                                    <div className="font-bold text-[#17203a]">{item.project.projectName}</div>
                                                    <div className="mt-1 text-xs font-semibold text-[#7b7166]">
                                                        {item.project.businessDomain} / {item.project.cscopNo}
                                                    </div>
                                                </div>
                                                <div className={`inline-flex w-fit border px-2 py-1 text-[11px] font-bold ${markerClass(item.marker.type)}`}>
                                                    {item.marker.type} Handover
                                                </div>
                                                <div className="flex flex-wrap items-end gap-2">
                                                    <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5f574e]">
                                                        Complete
                                                        <input
                                                            type="date"
                                                            value={item.dueDate}
                                                            onChange={event => updateGatewayEndDate(item.project, item.marker, event.target.value)}
                                                            className="h-8 w-[150px] border border-[#d8d0c5] bg-white px-2 text-xs font-semibold tracking-normal text-[#111111] outline-none"
                                                        />
                                                    </label>
                                                    <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5f574e]">
                                                        Status
                                                        <select
                                                            value={item.status}
                                                            onChange={event => updateGatewayStatus(item.project, item.marker, event.target.value as GatewayStatus)}
                                                            className={`h-8 w-[100px] border px-2 text-[10px] font-bold uppercase tracking-[0.08em] outline-none ${statusClass(item.status)}`}
                                                        >
                                                            <option value="To Do">To Do</option>
                                                            <option value="WIP">WIP</option>
                                                            <option value="Done">Done</option>
                                                            <option value="On Hold">On Hold</option>
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="px-4 py-4 text-sm font-semibold text-[#7b7166]">
                                                No handover items in this week.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="divide-y divide-[#eee6dc]">
                            {groupProjects(selectedMonthProjects.map(item => item.project), meetingInputs).map(group => (
                                <div key={group.domain}>
                                    <div className="bg-[#f4aa00] px-5 py-2 text-sm font-bold text-white">{group.domain}</div>
                                    <div className="grid grid-cols-1 divide-y divide-[#eee6dc] xl:grid-cols-2 xl:divide-x xl:divide-y-0">
                                        {group.projects.map((project) => {
                                            const markers = monthDetailMarkers(project, selectedMonth, gatewayStatuses, handoverStatusFilter);
                                            const meetingInput = projectInput(project, meetingInputs);
                                            const urgency = projectUrgency(project, meetingInput);
                                            return (
                                                <div key={`${project.businessDomain}-${project.projectName}-${project.cscopNo}`} className="p-4">
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <span className="bg-[#eee7dd] px-2 py-0.5 text-[11px] font-semibold text-[#655f57]">{project.cscopNo}</span>
                                                        {urgency.label && (
                                                            <span className={`border px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] ${urgencyBadgeClass(urgency.tone)}`}>{urgency.label}</span>
                                                        )}
                                                        {hasMeetingInput(meetingInput) && (
                                                            <>
                                                                <span className="border border-[#d8d0c5] px-2 py-0.5 text-[11px] font-semibold text-[#655f57]">Size {meetingInput.size || '-'}</span>
                                                                <span className="border border-[#d8d0c5] px-2 py-0.5 text-[11px] font-semibold text-[#655f57]">Priority {meetingInput.priority || '-'}</span>
                                                                <span className="border border-[#d8d0c5] px-2 py-0.5 text-[11px] font-semibold text-[#655f57]">Go-live {meetingInput.goLive || '-'}</span>
                                                                {meetingInput.note && (
                                                                    <span className="border border-[#d8d0c5] px-2 py-0.5 text-[11px] font-semibold text-[#655f57]">Note {meetingInput.note}</span>
                                                                )}
                                                            </>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => openMeetingInput(project)}
                                                            className="inline-flex size-6 items-center justify-center border border-[#111111] text-[#111111]"
                                                            title="Edit project inputs"
                                                        >
                                                            <Pencil size={13} />
                                                        </button>
                                                    </div>
                                                    <h3 className="text-sm font-bold leading-5 text-[#17203a]">{project.projectName}</h3>
                                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-5">
                                                        {NODE_TYPES.map(nodeType => {
                                                            const marker = markers.find(item => item.type === nodeType);
                                                            const subLabel = marker ? markerSubLabel(marker) : '';
                                                            return (
                                                                <div
                                                                    key={nodeType}
                                                                    onClick={() => marker && isGatewayMarker(marker) && openGatewayDateEditor(project, marker)}
                                                                    className={`min-h-[76px] border px-2 py-2 text-center text-[11px] font-semibold ${marker ? markerClass(marker.type) : 'border-[#e5ded5] bg-white text-[#b5aca2]'} ${marker && isGatewayMarker(marker) ? 'cursor-pointer hover:ring-2 hover:ring-[#d31321]/45' : ''}`}
                                                                >
                                                                    <div className="font-bold">{nodeType}</div>
                                                                    {marker
                                                                        ? (
                                                                                <>
                                                                                    {subLabel && <div className="mt-1">{subLabel}</div>}
                                                                                    {(marker.start || marker.end) && (
                                                                                        <div className="mt-1 text-[10px] opacity-80">
                                                                                    {markerDateLabel(marker)}
                                                                                        </div>
                                                                                    )}
                                                                                    {isGatewayMarker(marker) && (
                                                                                        <div className={`mt-1 inline-block border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${statusClass(gatewayStatuses[gatewayOverrideKey(project, marker.type)] ?? defaultGatewayStatus(project, marker))}`}>
                                                                                            {gatewayStatuses[gatewayOverrideKey(project, marker.type)] ?? defaultGatewayStatus(project, marker)}
                                                                                        </div>
                                                                                    )}
                                                                                </>
                                                                            )
                                                                        : <div className="mt-4 text-[10px]">-</div>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="overflow-hidden border border-[#cfc7bd] bg-[#fffdf8]">
                    <div className="flex items-center justify-between border-b border-[#d8d0c5] bg-[#344154] px-5 py-4 text-white">
                        <div className="flex items-center gap-3">
                            <Table2 size={18} />
                            <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Budget Project Handover Calendar by Domain / Project</h2>
                        </div>
                        <div className="text-xs font-semibold text-white/75">
                            {filteredProjects.length} visible projects{selectedMonth !== 'All' ? ` / ${selectedMonth}` : ''}
                        </div>
                    </div>

                    <div className="max-h-[760px] overflow-auto">
                        <table className="w-full min-w-[1420px] border-collapse text-left">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-[#344154] text-white">
                                    <th className="w-[150px] border-r border-white/15 px-4 py-3 text-xs font-bold">Business Domain</th>
                                    <th className="w-[340px] border-r border-white/15 px-4 py-3 text-xs font-bold">Project Name</th>
                                    {MONTHS.map(month => (
                                        <th key={month} className="w-[92px] border-r border-white/15 px-3 py-3 text-center text-xs font-bold">{month}</th>
                                    ))}
                                </tr>
                                <tr className="bg-white">
                                    <th colSpan={2} className="border-b border-[#d8d0c5] px-4 py-2 text-right text-[12px] italic text-[#7b7166]">
                                        Milestone Legend →
                                    </th>
                                    <th className="border-b border-[#d8d0c5] px-2 py-2 text-center text-[11px] font-bold text-[#d31321]" colSpan={10}>
                                        BRD → SRE → GW1/2 → TUAT → GW3/4/5
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupProjects(filteredProjects, meetingInputs).map(group => (
                                    <React.Fragment key={group.domain}>
                                        <tr>
                                            <td colSpan={14} className="bg-[#f4aa00] px-4 py-2 text-sm font-bold text-white">
                                                {group.domain}
                                            </td>
                                        </tr>
                                        {group.projects.map(project => (
                                            <GatewayRow
                                                key={`${project.businessDomain}-${project.projectName}-${project.cscopNo}`}
                                                project={project}
                                                meetingInput={projectInput(project, meetingInputs)}
                                                urgency={projectUrgency(project, projectInput(project, meetingInputs))}
                                                onEdit={() => openMeetingInput(project)}
                                                onEditGateway={openGatewayDateEditor}
                                                gatewayStatuses={gatewayStatuses}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {editingProject && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4">
                        <div className="w-full max-w-lg border border-[#d8d0c5] bg-[#fffdf8] shadow-2xl">
                            <div className="flex items-start justify-between border-b border-[#d8d0c5] px-5 py-4">
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d31321]">Project Inputs</div>
                                    <h3 className="mt-1 text-base font-bold leading-6 text-[#17203a]">{editingProject.projectName}</h3>
                                    <div className="mt-1 text-xs text-[#7b7166]">{editingProject.businessDomain} / {editingProject.cscopNo}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingProject(null)}
                                    className="inline-flex size-8 items-center justify-center border border-[#111111]"
                                    title="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="grid gap-4 px-5 py-5">
                                <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5f574e]">
                                    Size
                                    <input
                                        value={draftInput.size}
                                        onChange={event => setDraftInput({ ...draftInput, size: event.target.value })}
                                        className="h-10 border border-[#d8d0c5] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none"
                                        placeholder="S / M / L / XL"
                                    />
                                </label>
                                <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5f574e]">
                                    Priority
                                    <input
                                        value={draftInput.priority}
                                        onChange={event => setDraftInput({ ...draftInput, priority: event.target.value })}
                                        className="h-10 border border-[#d8d0c5] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none"
                                        placeholder="P0 / P1 / P2 / P3"
                                    />
                                </label>
                                <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5f574e]">
                                    Go-live
                                    <input
                                        type="date"
                                        value={draftInput.goLive}
                                        onChange={event => setDraftInput({ ...draftInput, goLive: event.target.value })}
                                        className="h-10 border border-[#d8d0c5] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none"
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 border-t border-[#d8d0c5] px-5 py-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingProject(null)}
                                    className="h-10 border border-[#111111] px-4 text-xs font-bold uppercase tracking-[0.1em]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveMeetingInput}
                                    className="inline-flex h-10 items-center gap-2 bg-[#d31321] px-4 text-xs font-bold uppercase tracking-[0.1em] text-white"
                                >
                                    <Save size={15} />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {editingGateway && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4">
                        <div className="w-full max-w-lg border border-[#d8d0c5] bg-[#fffdf8] shadow-2xl">
                            <div className="flex items-start justify-between border-b border-[#d8d0c5] px-5 py-4">
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d31321]">Edit Gateway Date</div>
                                    <h3 className="mt-1 text-base font-bold leading-6 text-[#17203a]">{editingGateway.project.projectName}</h3>
                                    <div className="mt-1 text-xs text-[#7b7166]">{editingGateway.marker.type} / {editingGateway.project.cscopNo}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditingGateway(null)}
                                    className="inline-flex size-8 items-center justify-center border border-[#111111]"
                                    title="Close"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="grid gap-4 px-5 py-5">
                                <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5f574e]">
                                    Start Date
                                    <input
                                        type="date"
                                        value={draftGatewayDate.start}
                                        onChange={event => setDraftGatewayDate({ ...draftGatewayDate, start: event.target.value })}
                                        className="h-10 border border-[#d8d0c5] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none"
                                    />
                                </label>
                                <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5f574e]">
                                    End Date
                                    <input
                                        type="date"
                                        value={draftGatewayDate.end}
                                        onChange={event => setDraftGatewayDate({ ...draftGatewayDate, end: event.target.value })}
                                        className="h-10 border border-[#d8d0c5] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none"
                                    />
                                </label>
                                <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#5f574e]">
                                    Status
                                    <select
                                        value={draftGatewayStatus}
                                        onChange={event => setDraftGatewayStatus(event.target.value as GatewayStatus)}
                                        className="h-10 border border-[#d8d0c5] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#111111] outline-none"
                                    >
                                        <option>To Do</option>
                                        <option>WIP</option>
                                        <option>Done</option>
                                        <option>On Hold</option>
                                    </select>
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 border-t border-[#d8d0c5] px-5 py-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingGateway(null)}
                                    className="h-10 border border-[#111111] px-4 text-xs font-bold uppercase tracking-[0.1em]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveGatewayDate}
                                    className="inline-flex h-10 items-center gap-2 bg-[#d31321] px-4 text-xs font-bold uppercase tracking-[0.1em] text-white"
                                >
                                    <Save size={15} />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const groupProjects = (projects: GatewayProject[], meetingInputs: Record<string, ProjectMeetingInput> = {}) => {
    const groups = new Map<string, GatewayProject[]>();
    projects.forEach((project) => {
        groups.set(project.businessDomain, [...(groups.get(project.businessDomain) ?? []), project]);
    });
    return Array.from(groups.entries()).map(([domain, items]) => ({
        domain,
        projects: [...items].sort((first, second) => {
            const firstUrgency = projectUrgency(first, projectInput(first, meetingInputs));
            const secondUrgency = projectUrgency(second, projectInput(second, meetingInputs));
            if (firstUrgency.score !== secondUrgency.score) {
                return firstUrgency.score - secondUrgency.score;
            }
            const firstDue = firstGatewayDue(first) || '9999-12-31';
            const secondDue = firstGatewayDue(second) || '9999-12-31';
            return firstDue.localeCompare(secondDue) || first.projectName.localeCompare(second.projectName);
        }),
    }));
};

const Metric = ({ label, value, tone = 'neutral' }: { label: string; value: number; tone?: 'neutral' | 'good' | 'warn' }) => (
    <div className="border border-white/20 bg-white/5 p-4">
        <div className={`text-3xl font-semibold ${tone === 'good' ? 'text-[#7ee39d]' : tone === 'warn' ? 'text-[#ffd166]' : 'text-white'}`}>
            {value.toLocaleString()}
        </div>
        <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">{label}</div>
    </div>
);

const Segmented = ({ value, onChange }: { value: 'all' | 'with-gw' | 'missing-gw'; onChange: (next: 'all' | 'with-gw' | 'missing-gw') => void }) => {
    const items = [
        { key: 'with-gw', label: 'With Nodes' },
        { key: 'all', label: 'All' },
        { key: 'missing-gw', label: 'No Node' },
    ] as const;
    return (
        <div className="flex border border-[#111111] bg-white">
            {items.map(item => (
                <button
                    key={item.key}
                    type="button"
                    onClick={() => onChange(item.key)}
                    className={`h-10 px-3 text-xs font-bold uppercase tracking-[0.08em] ${value === item.key ? 'bg-[#111111] text-white' : 'text-[#111111]'}`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

const GatewayRow = ({
    project,
    meetingInput,
    urgency,
    onEdit,
    onEditGateway,
    gatewayStatuses,
}: {
    project: GatewayProject;
    meetingInput?: ProjectMeetingInput;
    urgency: ReturnType<typeof projectUrgency>;
    onEdit: () => void;
    onEditGateway: (project: GatewayProject, marker: GatewayMarker) => void;
    gatewayStatuses: Record<string, GatewayStatus>;
}) => (
    <tr className={`border-b border-[#d8d0c5] ${urgencyRowClass(urgency.tone)}`}>
        <td className="border-r border-[#d8d0c5] px-4 py-3 align-top text-sm italic text-[#746b62]">
            {project.businessDomain}
            <div className="mt-1 text-[11px] not-italic text-[#a1988f]">{project.cscopNo}</div>
        </td>
        <td className="border-r border-[#d8d0c5] px-4 py-3 align-top text-sm font-semibold text-[#17203a]">
            <div className="flex items-start justify-between gap-2">
                <span>{project.projectName}</span>
                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex size-6 shrink-0 items-center justify-center border border-[#111111] text-[#111111]"
                    title="Edit project inputs"
                >
                    <Pencil size={13} />
                </button>
            </div>
            {urgency.label && (
                <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold uppercase tracking-[0.08em]">
                    <span className={`border px-1.5 py-0.5 ${urgencyBadgeClass(urgency.tone)}`}>{urgency.label}</span>
                </div>
            )}
            {hasMeetingInput(meetingInput) && (
                <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-semibold text-[#655f57]">
                    <span className="border border-[#d8d0c5] px-1.5 py-0.5">Size {meetingInput?.size || '-'}</span>
                    <span className="border border-[#d8d0c5] px-1.5 py-0.5">Priority {meetingInput?.priority || '-'}</span>
                    <span className="border border-[#d8d0c5] px-1.5 py-0.5">Go-live {meetingInput?.goLive || '-'}</span>
                    {meetingInput?.note && (
                        <span className="border border-[#d8d0c5] px-1.5 py-0.5">Note {meetingInput.note}</span>
                    )}
                </div>
            )}
        </td>
        {MONTHS.map(month => (
            <td key={month} className="h-[78px] border-r border-[#d8d0c5] px-2 py-2 align-top">
                <div className="space-y-1">
                    {project.gatewayMonths[month].map((marker, index) => (
                        <div
                            key={`${month}-${marker.type}-${index}`}
                            onClick={() => isGatewayMarker(marker) && onEditGateway(project, marker)}
                            className={`border px-2 py-1 text-center text-[11px] font-bold leading-4 ${markerClass(marker.type)} ${isGatewayMarker(marker) ? 'cursor-pointer hover:ring-2 hover:ring-[#d31321]/45' : ''}`}
                        >
                            <div>{marker.type}</div>
                            {markerSubLabel(marker) && (
                                <div className="mt-0.5 max-h-8 overflow-hidden font-semibold">{markerSubLabel(marker)}</div>
                            )}
                            {(marker.start || marker.end) && (
                                <div className="mt-1 text-[10px] font-medium opacity-80">
                                    {markerDateLabel(marker)}
                                </div>
                            )}
                            {isGatewayMarker(marker) && (
                                <div className={`mt-1 inline-block border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] ${statusClass(gatewayStatuses[gatewayOverrideKey(project, marker.type)] ?? defaultGatewayStatus(project, marker))}`}>
                                    {gatewayStatuses[gatewayOverrideKey(project, marker.type)] ?? defaultGatewayStatus(project, marker)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </td>
        ))}
    </tr>
);
