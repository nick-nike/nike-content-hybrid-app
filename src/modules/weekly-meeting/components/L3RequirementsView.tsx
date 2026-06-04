import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import {
    Upload, Download, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp, DollarSign, Briefcase, FileSpreadsheet, Activity, LayoutDashboard
} from 'lucide-react';

// ==========================================
// 1. TYPES & CONSTANTS
// ==========================================

interface L3ProjectItem {
    'APP'?: string;
    '系统'?: string;
    '项目名称'?: string;
    '工作内容'?: string;
    'ELC负责人'?: string;
    '投入资源'?: string;
    '#PO'?: string;
    '状态'?: string;
    'PO状态'?: string;
    '需求状态'?: string;
    '开始时间'?: string;
    '交付时间'?: string;
    '备注'?: string;
    'numericBudget'?: number;
    '项目名'?: string;
    [key: string]: any;
}

interface ProcessedL3Project extends L3ProjectItem {
    id: string;
    projectName: string;
    workContent: string;
    elcLead: string;
    resources: string;
    poNumber: string;
    currentStatus: string;
    businessArea: string;
    domain: 'Corp' | 'Data' | 'Commercial' | 'Digital' | 'Other';
    healthStatus: {
        label: string;
        color: string;
        bg: string;
        key: 'risk' | 'ontrack' | 'completed' | 'planned';
    };
    originalIndex: number;
}

const STORAGE_KEYS = {
    DATA: 'l3_portfolio_data',
    HEADERS: 'l3_portfolio_headers'
};

const STATUS_COLORS: Record<string, string> = {
    all: '#0a1e40',
    risk: '#be123c',
    ontrack: '#d97706',
    completed: '#059669',
    planned: '#64748b'
};

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

const getDomain = (systemName: string, projectName: string): 'Corp' | 'Data' | 'Commercial' | 'Digital' | 'Other' => {
    const text = (String(systemName || '') + ' ' + String(projectName || '')).toLowerCase();

    if (text.includes('hr') || text.includes('human') || text.includes('intern') || text.includes('people')) return 'Corp';
    if (text.includes('fin') || text.includes('财务') || text.includes('ap') || text.includes('macro') || text.includes('sap')) return 'Corp';
    if (text.includes('sc') || text.includes('ra') || text.includes('供应链') || text.includes('scm') || text.includes('物流')) return 'Corp';

    if (text.includes('nco') || text.includes('csp') || text.includes('retail') || text.includes('零售') || text.includes('brand') || text.includes('品牌')) return 'Commercial';

    if (text.includes('dwp') || text.includes('power app') || text.includes('泛微') || text.includes('e9') || text.includes('automation')) return 'Digital';

    if (text.includes('data') || text.includes('bi') || text.includes('报表') || text.includes('analytics') || text.includes('portal') || text.includes('云')) return 'Data';

    return 'Digital';
};

const getBusinessArea = (systemName: string): string => {
    if (!systemName) return 'Other';
    const name = systemName.toUpperCase();
    if (name.includes('HR')) return 'HR & People';
    if (name.includes('FIN') || name.includes('AP')) return 'Finance';
    if (name.includes('SC') || name.includes('RA')) return 'Supply Chain';
    if (name.includes('NCO') || name.includes('CSP')) return 'Commercial';
    if (name.includes('DWP') || name.includes('E9')) return 'Digital';
    if (name.includes('DATA') || name.includes('BI')) return 'Data & BI';
    return 'Core Tech';
};

const getHealthStatus = (status?: string, poStatus?: string, reqStatus?: string) => {
    const text = ((status || '') + (poStatus || '') + (reqStatus || '')).toLowerCase();
    if (text.includes('go live') || text.includes('完成') || text.includes('delivered')) {
        return { label: 'Go Live', color: '#059669', bg: '#ecfdf5', key: 'completed' as const };
    }
    if (text.includes('wip') || text.includes('进行中') || text.includes('in progress')) {
        return { label: 'WIP', color: '#d97706', bg: '#fffbeb', key: 'ontrack' as const };
    }
    if (text.includes('pending') || text.includes('风险') || text.includes('risk')) {
        return { label: 'Pending', color: '#be123c', bg: '#fff1f2', key: 'risk' as const };
    }
    return { label: 'TBD', color: '#64748b', bg: '#f1f5f9', key: 'planned' as const };
};

const parseCurrency = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = String(val).replace(/[¥,$\s]/g, '');
    return parseFloat(clean) || 0;
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        maximumFractionDigits: 0
    }).format(val);
};

const renderDash = (val: any) => (val && val !== '-' ? val : '-');

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export const L3RequirementsView: React.FC = () => {
    const [data, setData] = useState<ProcessedL3Project[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [filter, setFilter] = useState<'all' | 'risk' | 'ontrack' | 'completed' | 'planned'>('all');
    const [domainFilter, setDomainFilter] = useState<string | null>(null);
    const [showOnlyWithPO, setShowOnlyWithPO] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEYS.DATA);
        const savedHeaders = localStorage.getItem(STORAGE_KEYS.HEADERS);
        if (savedData && savedHeaders) {
            try {
                const parsedData = JSON.parse(savedData);
                const migratedData = parsedData.map((item: any) => {
                    const budgetKey = Object.keys(item).find(k =>
                        k.includes('预算') || k.includes('Value') || k.includes('Budget') || k.includes('金额') || k.includes('Price')
                    );
                    const numericBudget = budgetKey ? parseCurrency(item[budgetKey]) : (item.numericBudget || 0);

                    return {
                        ...item,
                        domain: getDomain(item['系统'] || '', item.projectName || item['项目名'] || ''),
                        healthStatus: getHealthStatus(item['状态'], item['PO状态'], item['需求状态']),
                        numericBudget,
                        poNumber: String(item['#PO'] || item['PO'] || item.poNumber || '-')
                    };
                });
                setData(migratedData);
                setHeaders(JSON.parse(savedHeaders));
            } catch (e) {
                console.error('Failed to load L3 cache', e);
            }
        }
    }, []);

    const processRawData = (raw: any[]): ProcessedL3Project[] => {
        return raw
            .filter(row => {
                const values = Object.values(row).filter(v => v !== null && v !== undefined && v !== '');
                return values.length > 3;
            })
            .map((item, index) => {
                const normalizedItem: any = {};
                Object.keys(item).forEach(key => {
                    const cleanKey = key.trim();
                    normalizedItem[cleanKey] = item[key];
                });

                const budgetKey = Object.keys(normalizedItem).find(k =>
                    k.includes('预算') || k.includes('Value') || k.includes('Budget') || k.includes('金额') || k.includes('Price')
                );
                const numericBudget = budgetKey ? parseCurrency(normalizedItem[budgetKey]) : 0;

                const projectName = normalizedItem['项目名'] || normalizedItem['项目名称'] || normalizedItem['项目'] || normalizedItem['Name'] || '-';
                const workContent = normalizedItem['工作内容'] || normalizedItem['Description'] || '-';
                const elcLead = normalizedItem['ELC负责人'] || normalizedItem['Owner'] || '-';
                const resources = normalizedItem['投入资源'] || normalizedItem['Resources'] || '-';
                const rawPO = normalizedItem['#PO'] || normalizedItem['PO'] || '-';
                const poNumber = String(rawPO);
                const currentStatus = normalizedItem['状态'] || normalizedItem['Status'] || '-';

                return {
                    ...normalizedItem,
                    numericBudget,
                    projectName,
                    workContent,
                    elcLead,
                    resources,
                    poNumber,
                    currentStatus,
                    businessArea: getBusinessArea(normalizedItem['系统'] || normalizedItem['项目名'] || normalizedItem['项目名称'] || projectName),
                    domain: getDomain(normalizedItem['系统'] || '', projectName),
                    healthStatus: getHealthStatus(normalizedItem['状态'], normalizedItem['PO状态'], normalizedItem['需求状态']),
                    originalIndex: index
                } as ProcessedL3Project;
            });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const raw = XLSX.utils.sheet_to_json(ws);

                if (raw.length === 0) throw new Error("No data found in file");

                const processed = processRawData(raw);
                setData(processed);
                setHeaders(Object.keys(raw[0] as any));
                localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(processed));
                localStorage.setItem(STORAGE_KEYS.HEADERS, JSON.stringify(Object.keys(raw[0] as any)));
                setError(null);
            } catch (err) {
                setError("Failed to parse Excel file. Please ensure it's a valid .xlsx or .xls file.");
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "L3 Requirements");
        XLSX.writeFile(wb, `L3_Portfolio_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const clearCache = () => {
        localStorage.removeItem(STORAGE_KEYS.DATA);
        localStorage.removeItem(STORAGE_KEYS.HEADERS);
        setData([]);
        setHeaders([]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newData = [...data];
        const item = { ...newData[index] };
        item[field] = value;

        if (field === '项目名') item.projectName = value;
        if (field === '工作内容') item.workContent = value;
        if (field === 'ELC负责人') item.elcLead = value;
        if (field === '投入资源') item.resources = value;
        if (field === '#PO') item.poNumber = value;

        newData[index] = item as ProcessedL3Project;
        setData(newData);
    };

    const stats = useMemo(() => {
        const withPO = data.filter(i => i.poNumber && i.poNumber !== '-' && typeof i.poNumber === 'string' && i.poNumber.trim().length > 0).length;
        return {
            total: data.length,
            completed: data.filter(i => i.healthStatus.key === 'completed').length,
            ontrack: data.filter(i => i.healthStatus.key === 'ontrack').length,
            planned: data.filter(i => i.healthStatus.key === 'planned').length,
            risk: data.filter(i => i.healthStatus.key === 'risk').length,
            totalBudget: data.reduce((acc, i) => acc + (i.numericBudget || 0), 0),
            poCount: withPO,
            poPercentage: data.length > 0 ? Math.round((withPO / data.length) * 100) : 0
        };
    }, [data]);

    const filteredData = useMemo(() => {
        let result = filter === 'all' ? data : data.filter(item => item.healthStatus.key === filter);
        if (domainFilter) {
            result = result.filter(item => item.domain === domainFilter);
        }
        if (showOnlyWithPO) {
            result = result.filter(item => item.poNumber && item.poNumber !== '-' && typeof item.poNumber === 'string' && item.poNumber.trim().length > 0);
        }
        return result;
    }, [data, filter, domainFilter, showOnlyWithPO]);

    const domainStatsData = useMemo(() => {
        const counts: Record<string, number> = { 'Corp': 0, 'Data': 0, 'Commercial': 0, 'Digital': 0 };
        data.forEach(item => {
            const d = item.domain === 'Other' ? 'Digital' : item.domain;
            if (counts[d] !== undefined) counts[d]++;
        });
        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            color: name === 'Corp' ? '#0a1e40' :
                name === 'Data' ? '#d4af37' :
                    name === 'Commercial' ? '#059669' : '#dc2626'
        }));
    }, [data]);

    return (
        <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="flex items-center gap-6 z-10">
                    <div
                        onClick={() => setShowOnlyWithPO(!showOnlyWithPO)}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-all cursor-pointer ${showOnlyWithPO ? 'bg-[#d4af37] ring-4 ring-[#d4af37]/30' : 'bg-[#0a1e40] hover:bg-[#1a2e50]'
                            }`}
                    >
                        <LayoutDashboard className={showOnlyWithPO ? 'text-white' : 'text-[#d4af37]'} size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-light text-[#0a1e40] tracking-[0.1em] uppercase" style={{ fontFamily: 'Optima, serif' }}>
                            L3 Development Matrix
                        </h1>
                        <p className="text-[10px] text-[#8b7355] font-black uppercase tracking-[0.3em] mt-1">
                            雅诗兰黛 (ELC) IT Portfolio Insights
                            {showOnlyWithPO && <span className="ml-3 text-[#d4af37]">• PO Filter Active</span>}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6 md:mt-0 z-10">
                    <label className="cursor-pointer group">
                        <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                        <div className="px-6 py-2.5 bg-[#0a1e40] text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#1a2e50] transition-all shadow-lg">
                            <Upload size={14} /> Import Table
                        </div>
                    </label>
                    <button onClick={handleExport} disabled={data.length === 0} className="px-6 py-2.5 bg-[#d4af37] text-white rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#c49f27] transition-all shadow-lg disabled:opacity-50">
                        <Download size={14} /> Export
                    </button>
                    <button onClick={clearCache} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl text-sm flex items-center gap-3 animate-bounce">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* KPI Aesthetic Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                    { label: 'Total Projects', value: stats.total, key: 'all' },
                    { label: 'Pending', value: stats.risk, key: 'risk' },
                    { label: 'WIP', value: stats.ontrack, key: 'ontrack' },
                    { label: 'Go Live', value: stats.completed, key: 'completed' },
                    { label: 'TBD', value: stats.planned, key: 'planned' }
                ].map((kpi) => (
                    <div
                        key={kpi.key}
                        onClick={() => setFilter(kpi.key as any)}
                        className={`cursor-pointer bg-white rounded-2xl p-6 border shadow-sm transition-all duration-500 hover:shadow-xl group relative overflow-hidden ${filter === kpi.key ? 'ring-2 ring-[#0a1e40] ring-offset-2' : 'border-[#d4af3711]'
                            }`}
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-2.5" style={{ backgroundColor: STATUS_COLORS[kpi.key] }}></div>
                        <div className="text-[10px] font-black text-[#8b7355] uppercase tracking-[0.2em] mb-3 group-hover:text-[#0a1e40] transition-colors">{kpi.label}</div>
                        <div className="flex items-baseline gap-2">
                            <div className="text-4xl font-light text-[#0a1e40] tracking-tighter" style={{ fontFamily: 'Optima, serif' }}>{kpi.value}</div>
                            {stats.total > 0 && kpi.key !== 'all' && (
                                <span className="text-[10px] text-slate-400 font-medium">({Math.round((kpi.value / stats.total) * 100)}%)</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hero Budget Card */}
            <div className="bg-[#0a1e40] rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <p className="text-[12px] font-bold text-[#d4af37] uppercase tracking-[0.4em] mb-3">Portfolio Total Valuation</p>
                        <h2 className="text-6xl font-light tracking-tighter" style={{ fontFamily: 'Optima, serif' }}>{formatCurrency(stats.totalBudget)}</h2>
                    </div>
                    <div className="mt-8 md:mt-0 flex gap-8">
                        <div className="text-center border-l border-white/10 pl-8">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Projects with PO</p>
                            <p className="text-2xl font-bold">{stats.poCount}</p>
                        </div>
                        <div className="text-center border-l border-white/10 pl-8">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">PO Issuance Rate</p>
                            <p className="text-2xl font-bold">{stats.poPercentage}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Left List Section */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="flex justify-between items-end px-4">
                        <div>
                            <h2 className="text-2xl text-[#0a1e40]" style={{ fontFamily: 'Optima, serif' }}>Project Directory</h2>
                            <div className="h-0.5 w-12 bg-[#d4af37] mt-2"></div>
                        </div>
                        <span className="text-[10px] font-black text-[#8b7355] tracking-widest uppercase">{filteredData.length} records active</span>
                    </div>

                    <div className="space-y-4 max-h-[900px] overflow-y-auto pr-2">
                        {filteredData.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-dashed border-[#d4af3733] p-32 flex flex-col items-center justify-center text-slate-300">
                                <FileSpreadsheet size={64} className="mb-4 opacity-10" />
                                <p className="text-sm font-medium italic">Waiting for portfolio data import...</p>
                            </div>
                        ) : (
                            filteredData.map((item) => (
                                <div key={item.originalIndex} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 overflow-hidden group">
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1 w-full">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded border border-rose-100">L3 PROJECT</span>
                                                    <span className="text-[10px] font-bold text-[#d4af37] tracking-[0.2em] uppercase">{item.businessArea}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-[9px] font-black text-[#8b7355] uppercase tracking-widest mb-1">Project Name</p>
                                                    <input
                                                        value={item.projectName}
                                                        onChange={(e) => updateItem(item.originalIndex, '项目名', e.target.value)}
                                                        className="text-2xl font-light text-[#0a1e40] bg-transparent border-none p-0 focus:ring-0 w-full hover:text-[#d4af37] transition-colors"
                                                        style={{ fontFamily: 'Optima, serif' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className={`shrink-0 px-4 py-1.5 rounded-full border text-[9px] font-black tracking-[0.2em] uppercase shadow-sm ${item.healthStatus.key === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                item.healthStatus.key === 'risk' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                    item.healthStatus.key === 'ontrack' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-slate-50 text-slate-700 border-slate-100'
                                                }`}>
                                                {item.currentStatus || item.healthStatus.label}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-[#8b7355] uppercase tracking-widest">PO Number</p>
                                                <input
                                                    value={item.poNumber}
                                                    onChange={(e) => updateItem(item.originalIndex, '#PO', e.target.value)}
                                                    className="text-xs font-bold text-[#0a1e40] bg-transparent border-none p-0 focus:ring-0 w-full"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-[#8b7355] uppercase tracking-widest">ELC Lead</p>
                                                <input
                                                    value={item.elcLead}
                                                    onChange={(e) => updateItem(item.originalIndex, 'ELC负责人', e.target.value)}
                                                    className="text-xs font-bold text-[#0a1e40] bg-transparent border-none p-0 focus:ring-0 w-full"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-[#8b7355] uppercase tracking-widest">Resources</p>
                                                <input
                                                    value={item.resources}
                                                    onChange={(e) => updateItem(item.originalIndex, '投入资源', e.target.value)}
                                                    className="text-xs font-bold text-[#0a1e40] bg-transparent border-none p-0 focus:ring-0 w-full"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-[#8b7355] uppercase tracking-widest">Valuation (CNY)</p>
                                                <p className="text-[14px] font-light text-[#0a1e40]" style={{ fontFamily: 'Optima, serif' }}>{formatCurrency(item.numericBudget || 0)}</p>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] font-black text-[#8b7355] uppercase tracking-widest">System</p>
                                                <p className="text-xs font-bold text-[#0a1e40] uppercase tracking-tighter">{renderDash(item['系统'])}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-[9px] font-black text-[#8b7355] uppercase tracking-widest mb-2">Workload & Objectives</p>
                                            <textarea
                                                value={item.workContent}
                                                onChange={(e) => updateItem(item.originalIndex, '工作内容', e.target.value)}
                                                className="text-sm text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100 focus:border-[#d4af37] focus:ring-0 w-full resize-none leading-relaxed italic"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Stats Sidebar */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center">
                        <div className="flex justify-between items-center w-full mb-8">
                            <h3 className="text-[10px] font-black text-[#8b7355] uppercase tracking-[0.3em]">Domain Distribution</h3>
                            {domainFilter && (
                                <button onClick={() => setDomainFilter(null)} className="text-[9px] font-bold text-[#d4af37] uppercase tracking-widest hover:underline">Clear</button>
                            )}
                        </div>
                        <div className="h-[220px] w-full relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={domainStatsData}
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={8}
                                        dataKey="value"
                                        onClick={(data) => setDomainFilter(data.name)}
                                        className="cursor-pointer"
                                    >
                                        {domainStatsData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                opacity={domainFilter && domainFilter !== entry.name ? 0.3 : 1}
                                                strokeWidth={domainFilter === entry.name ? 4 : 0}
                                                stroke={entry.color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute text-center pointer-events-none">
                                <p className="text-4xl font-light text-[#0a1e40]" style={{ fontFamily: 'Optima, serif' }}>{domainFilter ? domainStatsData.find(d => d.name === domainFilter)?.value : stats.total}</p>
                                <p className="text-[8px] font-black text-[#8b7355] tracking-widest uppercase mt--1">{domainFilter || 'Inventory'}</p>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                            {domainStatsData.map((entry) => (
                                <div
                                    key={entry.name}
                                    onClick={() => setDomainFilter(entry.name === domainFilter ? null : entry.name)}
                                    className={`flex items-center gap-3 cursor-pointer transition-all p-2 rounded-lg ${domainFilter === entry.name ? 'bg-slate-50 ring-1 ring-slate-100' : 'hover:bg-slate-50/50'
                                        }`}
                                >
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${domainFilter && domainFilter !== entry.name ? 'text-slate-300' : 'text-slate-600'
                                            }`}>{entry.name}</span>
                                        <span className="text-[9px] text-slate-400">{entry.value} Items</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
