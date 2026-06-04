import React from 'react';
import { Users, MapPin, Globe, ChevronDown } from 'lucide-react';

// ==========================================
// 1. DATA DEFINITION (Mapped from Org Chart Image)
// ==========================================

const DOMAINS = [
    {
        name: "SC & RA",
        po: "Phoebe & Irene",
        members: [
            { name: "Shan", chi: "黄姗姗", role: "L2 Support Engineer - SC & PA", type: "Onsite" },
            { name: "Ken", chi: "朱争光", role: "L2 Support Engineer", type: "Remote" }
        ]
    },
    {
        name: "Finance",
        po: "Sherry",
        members: [
            { name: "Ruizi Hu", chi: "胡端姿", role: "L2 Support Engineer", type: "Onsite" },
            { name: "Yan Zhang", chi: "张燕", role: "L2 Support Engineer", type: "Remote" }
        ]
    },
    {
        name: "HR",
        po: "Emma",
        members: [
            { name: "Rolo", chi: "刘泉", role: "Support Engineer", type: "Onsite" }
        ]
    },
    {
        name: "Digital",
        po: "Torin",
        members: [
            { name: "Lena", chi: "周远", role: "L2 Support Engineer", type: "Onsite" },
            { name: "Qiao Shan", chi: "乔善", role: "L2 Support Engineer", type: "Remote" }
        ]
    },
    {
        name: "Data",
        po: "Thomas/Nickel",
        members: [
            { name: "Haixiao", chi: "徐海啸", role: "L2 Support Engineer", type: "Onsite" },
            { name: "Kangsheng Shu", chi: "舒胜康", role: "L2 Support Engineer", type: "Remote" }
        ]
    },
    {
        name: "Commercial",
        po: "William",
        members: [
            { name: "Jennie", chi: "吴亚平", role: "L2 Support Engineer - NCO", type: "Onsite" },
            { name: "Jun Lei", chi: "俊磊", role: "L2 Support Engineer - CSP & PA", type: "Onsite" }
        ]
    }
];

const RESOURCE_POOL = [
    { name: "Nick", chi: "韩学哲", role: "L2 & L3 Manager", type: "Onsite" },
    { name: "Haixiao", chi: "徐海啸", role: "L2 Support Engineer", type: "Remote" },
    { name: "Leo", chi: "申演峰", role: "Full Stack Developer", type: "Onsite" },
    { name: "Jackson", chi: "晏杰", role: "Full Stack Developer", type: "Remote" },
    { name: "Mingming", chi: "冯明明", role: "Full Stack Developer", type: "Onsite" },
    { name: "Rolo", chi: "刘泉", role: "Full Stack Developer", type: "Remote" },
    { name: "Eva", chi: "张博文", role: "L3 - BA/PM", type: "Remote" }
];

// ==========================================
// 2. COMPONENT (DYNAMIC DATA)
// ==========================================

interface Member {
    name: string;
    chi: string;
    role: string;
    type: string;
}

interface DomainType {
    name: string;
    po: string;
    members: Member[];
}

interface OrganizationStructureProps {
    domains?: DomainType[];
    resourcePool?: Member[];
}

export const OrganizationStructure: React.FC<OrganizationStructureProps> = ({ domains = DOMAINS, resourcePool = RESOURCE_POOL }) => {
    // Show internal data if DB data is empty
    const displayDomains = domains.length > 0 ? domains : DOMAINS;
    const displayResources = resourcePool.length > 0 ? resourcePool : RESOURCE_POOL;

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">

            {/* Legend */}
            <div className="flex justify-end gap-6 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#0099cc]"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Onsite</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8cc63f]"></div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Remote</span>
                </div>
            </div>


            {/* 1. Domain Grid Layer */}
            <div className="relative">
                <div className="bg-[#0a1e40] text-white text-center py-2 text-xs font-bold tracking-[0.5em] uppercase border border-white/10 shadow-lg mb-8">
                    System/Domain Distribution
                </div>

                <div className="grid grid-cols-6 gap-4">
                    {displayDomains.map((domain, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="bg-[#1e3a5f] text-white p-3 text-center border-b-2 border-white/20">
                                <h4 className="text-sm font-black tracking-widest">{domain.name}</h4>
                                <p className="text-[9px] text-slate-400 uppercase mt-1">Domain</p>
                            </div>

                            <div className="bg-[#99ccff]/20 border border-[#99ccff]/30 p-2 text-center rounded-sm">
                                <p className="text-[10px] font-bold text-[#0a1e40] truncate">{domain.po}</p>
                                <p className="text-[8px] text-slate-500 uppercase tracking-tighter">PO</p>
                            </div>

                            <div className="space-y-3 pt-2">
                                {domain.members.map((m, midx) => (
                                    <div
                                        key={midx}
                                        className={`p-3 rounded-sm border-l-4 shadow-sm transition-all hover:translate-x-1 ${m.type === 'Onsite'
                                            ? 'bg-white border-[#0099cc] hover:bg-slate-50'
                                            : 'bg-white border-[#8cc63f] hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-black text-[#0a1e40]">{m.name}</span>
                                            {m.type === 'Onsite' ? <MapPin size={10} className="text-[#0099cc]" /> : <Globe size={10} className="text-[#8cc63f]" />}
                                        </div>
                                        <p className="text-[9px] text-slate-600 font-bold mb-1">{m.chi}</p>
                                        <p className="text-[8px] text-slate-400 leading-tight uppercase font-medium">{m.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vertical Connector */}
            <div className="flex justify-center -my-4">
                <div className="w-[1px] h-12 bg-slate-200"></div>
            </div>

            {/* 3. Resource Pool Layer (Moved to bottom) */}
            <div className="premium-card rounded-2xl p-8 bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-[#0a1e40] rounded-full flex items-center justify-center text-white">
                        <Users size={18} />
                    </div>
                    <div>
                        <h4 className="text-base font-black text-[#0a1e40] tracking-widest uppercase">ISS L2 & L3 Resource Pool</h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Cross-Functional Agile Support</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-7 gap-4">
                    {displayResources.map((p, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border-t-4 transition-all hover:-translate-y-1 ${p.type === 'Onsite'
                                ? 'bg-slate-50 border-[#0099cc] shadow-sm'
                                : 'bg-slate-50 border-[#8cc63f] shadow-sm'
                                }`}
                        >
                            <h5 className="text-[11px] font-black text-[#0a1e40]">{p.name}</h5>
                            <p className="text-[10px] text-slate-600 font-bold mb-2">{p.chi}</p>
                            <div className="h-[1px] bg-slate-200 my-2"></div>
                            <p className="text-[9px] text-slate-400 uppercase font-black leading-tight">{p.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
