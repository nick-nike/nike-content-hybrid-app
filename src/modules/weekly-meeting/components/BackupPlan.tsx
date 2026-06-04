import React from 'react';
import { ShieldCheck, User, Layers } from 'lucide-react';

const BACKUP_DATA = [
    {
        domain: "Corp",
        members: [
            { name: "Ken Zhu", module: "SC SAP", backup: "SC" },
            { name: "Rolo", module: "HR", backup: "HR" },
            { name: "ShanShan Huang", module: "SC & PA", backup: "SC SAP" },
            { name: "Ruizi Hu", module: "Finance SAP", backup: "Finance Non-SAP" },
            { name: "Yan Zhang", module: "Finance Non-SAP", backup: "Finance SAP" },
            { name: "Jun Lei", module: "CSP", backup: "PA" }
        ]
    },
    {
        domain: "Digital",
        members: [
            { name: "Lena Zhou", module: "DWP", backup: "DWP & HR" },
            { name: "Qiao Shan", module: "DWP", backup: "DWP" }
        ]
    },
    {
        domain: "Data",
        members: [
            { name: "Haixiao", module: "CSR/Data Platform", backup: "mSafety/Data Portal" },
            { name: "Kangsheng Shu", module: "mSafety/Data Portal", backup: "CSR/Data Platform" },
            { name: "Haixiao", module: "GCC/Control tower", backup: "GCC/mSafety/Control tower" }
        ]
    },
    {
        domain: "Retail",
        members: [
            { name: "Jennie", module: "NCO", backup: "CSP" }
        ]
    }
];

export const BackupPlan: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-1000">
            <div className="p-8 bg-[#0a1e40] text-white flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: 'Optima, serif' }}>Operational Backup Plan</h3>
                    <p className="text-[10px] text-[#d4af37] uppercase tracking-widest mt-2">Resource redundancy & coverage mapping</p>
                </div>
                <ShieldCheck className="text-[#d4af37]" size={32} />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-200">
                        <tr>
                            <th className="px-10 py-6 w-1/5 text-center">Domain</th>
                            <th className="px-10 py-6 w-1/5">人员 (Personnel)</th>
                            <th className="px-10 py-6 w-1/4">负责模块 (Primary)</th>
                            <th className="px-10 py-6 w-1/4">Backup模块 (Secondary)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {BACKUP_DATA.map((group, gIdx) => (
                            <React.Fragment key={gIdx}>
                                {group.members.map((m, mIdx) => (
                                    <tr key={`${gIdx}-${mIdx}`} className="group hover:bg-slate-50/50 transition-colors">
                                        {mIdx === 0 && (
                                            <td
                                                className="px-10 py-8 font-black text-[#0a1e40] bg-slate-50/30 border-r border-slate-100 align-middle text-center uppercase tracking-tighter"
                                                rowSpan={group.members.length}
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Layers className="text-[#d4af37] opacity-40" size={16} />
                                                    {group.domain}
                                                </div>
                                            </td>
                                        )}
                                        <td className="px-10 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-[#0a1e40] font-bold">
                                                    <User size={14} className="opacity-40" />
                                                </div>
                                                <span className="font-bold text-[#0a1e40] text-sm">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-5 text-sm text-slate-600 font-medium">
                                            {m.module}
                                        </td>
                                        <td className="px-10 py-5">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
                                                <ShieldCheck size={12} />
                                                {m.backup}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
