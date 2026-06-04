import { Network } from 'lucide-react';
import React from 'react';

const FlowBox = ({
    children,
    tone = 'normal',
}: {
    children: React.ReactNode;
    tone?: 'normal' | 'red' | 'dark';
}) => {
    const toneClass = {
        normal: 'border-[#b8aea4] bg-white text-[#111111]',
        red: 'border-[#d31321] bg-white text-[#111111]',
        dark: 'border-[#111111] bg-[#111111] text-white',
    }[tone];

    return <div className={`flex min-h-[62px] items-center justify-center border px-4 text-center text-sm font-bold leading-5 ${toneClass}`}>{children}</div>;
};

const FlowArrow = ({ label }: { label?: string }) => (
    <div className="flex min-w-10 flex-col items-center justify-center">
        <div className="h-px w-full bg-[#343434]" />
        {label && <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#746b62]">{label}</div>}
    </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="border border-[#d8d0c5] bg-[#fffdf8]">
        <div className="border-b border-[#d8d0c5] bg-[#111111] px-5 py-3 text-white">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em]">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
    </section>
);

const SwimlaneSvg = () => (
    <svg viewBox="0 0 1220 640" className="block min-w-[1220px] bg-[#fffdf8]" role="img" aria-label="OPS case handling swimlane">
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="#343434" />
            </marker>
        </defs>

        <rect x="0" y="0" width="1220" height="640" fill="#fffdf8" stroke="#d8d0c5" />
        <rect x="0" y="0" width="1220" height="56" fill="#111111" />
        <text x="610" y="36" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700" letterSpacing="8">OPS Case Handling Flow</text>

        <rect x="0" y="56" width="1220" height="62" fill="#f1eee8" stroke="#d8d0c5" />
        <line x1="406" y1="56" x2="406" y2="640" stroke="#d8d0c5" />
        <line x1="813" y1="56" x2="813" y2="640" stroke="#d8d0c5" />
        <text x="203" y="95" textAnchor="middle" fill="#111111" fontSize="18" fontWeight="700" letterSpacing="4">Business Team</text>
        <text x="610" y="95" textAnchor="middle" fill="#111111" fontSize="18" fontWeight="700" letterSpacing="4">OPS</text>
        <text x="1016" y="95" textAnchor="middle" fill="#111111" fontSize="18" fontWeight="700" letterSpacing="4">Delivery Domain</text>

        <rect x="144" y="162" width="140" height="58" fill="#ffffff" stroke="#d31321" />
        <text x="214" y="187" textAnchor="middle" fontSize="14" fontWeight="700">Business</text>
        <text x="214" y="206" textAnchor="middle" fontSize="14" fontWeight="700">request</text>

        <rect x="144" y="270" width="140" height="58" fill="#ffffff" stroke="#b8aea4" />
        <text x="214" y="295" textAnchor="middle" fontSize="14" fontWeight="700">Submit</text>
        <text x="214" y="314" textAnchor="middle" fontSize="14" fontWeight="700">to OPS</text>

        <rect x="540" y="270" width="140" height="58" fill="#ffffff" stroke="#b8aea4" />
        <text x="610" y="304" textAnchor="middle" fontSize="14" fontWeight="700">OPS</text>

        <polygon points="610,382 680,452 610,522 540,452" fill="#111111" />
        <text x="610" y="448" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">ST or LT?</text>

        <rect x="430" y="552" width="150" height="58" fill="#ffffff" stroke="#d31321" />
        <text x="505" y="576" textAnchor="middle" fontSize="14" fontWeight="700">ST emergency</text>
        <text x="505" y="595" textAnchor="middle" fontSize="13" fontWeight="700">Lucy / Ruby</text>

        <rect x="640" y="552" width="150" height="58" fill="#ffffff" stroke="#d31321" />
        <text x="715" y="576" textAnchor="middle" fontSize="14" fontWeight="700">LT CR</text>
        <text x="715" y="595" textAnchor="middle" fontSize="13" fontWeight="700">OPS Domain</text>

        <rect x="946" y="384" width="150" height="58" fill="#ffffff" stroke="#b8aea4" />
        <text x="1021" y="418" textAnchor="middle" fontSize="14" fontWeight="700">Delivery Team</text>

        <rect x="946" y="552" width="150" height="58" fill="#ffffff" stroke="#b8aea4" />
        <text x="1021" y="576" textAnchor="middle" fontSize="14" fontWeight="700">Domain support</text>
        <text x="1021" y="595" textAnchor="middle" fontSize="13" fontWeight="700">teams deliver</text>

        <rect x="144" y="384" width="140" height="58" fill="#ffffff" stroke="#b8aea4" />
        <text x="214" y="409" textAnchor="middle" fontSize="14" fontWeight="700">Confirm</text>
        <text x="214" y="428" textAnchor="middle" fontSize="14" fontWeight="700">result</text>

        <rect x="154" y="552" width="120" height="58" rx="29" fill="#f1eee8" stroke="#111111" />
        <text x="214" y="586" textAnchor="middle" fontSize="14" fontWeight="700">Close</text>

        <path d="M214 220 L214 270" stroke="#343434" strokeWidth="1.4" markerEnd="url(#arrow)" />
        <path d="M284 299 L540 299" stroke="#343434" strokeWidth="1.4" markerEnd="url(#arrow)" />
        <path d="M610 328 L610 382" stroke="#343434" strokeWidth="1.4" markerEnd="url(#arrow)" />

        <path d="M610 522 L610 535 L505 535 L505 552" stroke="#343434" strokeWidth="1.4" fill="none" markerEnd="url(#arrow)" />
        <text x="548" y="530" textAnchor="middle" fontSize="11" fontWeight="700" fill="#746b62">ST</text>
        <path d="M610 522 L610 535 L715 535 L715 552" stroke="#343434" strokeWidth="1.4" fill="none" markerEnd="url(#arrow)" />
        <text x="672" y="530" textAnchor="middle" fontSize="11" fontWeight="700" fill="#746b62">LT</text>

        <path d="M790 581 L946 581" stroke="#343434" strokeWidth="1.4" markerEnd="url(#arrow)" />
        <path d="M1021 442 L1021 552" stroke="#343434" strokeWidth="1.4" markerEnd="url(#arrow)" />
        <path d="M946 413 L284 413" stroke="#343434" strokeWidth="1.4" markerEnd="url(#arrow)" />
        <path d="M430 581 L284 581 L284 413" stroke="#343434" strokeWidth="1.4" fill="none" markerEnd="url(#arrow)" />
        <path d="M214 442 L214 552" stroke="#343434" strokeWidth="1.4" markerEnd="url(#arrow)" />
    </svg>
);

const CleanFlowSvg = () => (
    <svg viewBox="0 0 1240 450" className="block min-w-[1240px] bg-[#fffdf8]" role="img" aria-label="Clean OPS CR flowchart">
        <defs>
            <marker id="flowArrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="#343434" />
            </marker>
        </defs>

        <rect x="0" y="0" width="1240" height="450" fill="#fffdf8" stroke="#d8d0c5" />

        <rect x="22" y="50" width="260" height="56" fill="#ffffff" stroke="#d31321" />
        <text x="152" y="83" textAnchor="middle" fontSize="14" fontWeight="700">Business request</text>

        <rect x="342" y="50" width="260" height="56" fill="#ffffff" stroke="#b8aea4" />
        <text x="472" y="83" textAnchor="middle" fontSize="14" fontWeight="700">Submit to OPS</text>

        <polygon points="750,18 810,78 750,138 690,78" fill="#111111" />
        <text x="750" y="68" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">ST</text>
        <text x="750" y="87" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">or</text>
        <text x="750" y="106" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">LT?</text>

        <rect x="938" y="50" width="260" height="56" fill="#ffffff" stroke="#b8aea4" />
        <text x="1068" y="83" textAnchor="middle" fontSize="14" fontWeight="700">OPS confirms path</text>

        <path d="M282 78 L342 78" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
        <path d="M602 78 L690 78" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
        <path d="M810 78 L938 78" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />

        <path d="M750 138 L750 170" stroke="#343434" strokeWidth="1.4" />
        <path d="M260 170 L980 170" stroke="#343434" strokeWidth="1.4" />
        <path d="M260 170 L260 208" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
        <path d="M980 170 L980 208" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
        <text x="242" y="161" textAnchor="middle" fontSize="12" fontWeight="700" fill="#746b62">ST</text>
        <text x="998" y="161" textAnchor="middle" fontSize="12" fontWeight="700" fill="#746b62">LT</text>

        <rect x="22" y="210" width="570" height="210" fill="#ffffff" stroke="#d8d0c5" />
        <text x="44" y="242" fontSize="16" fontWeight="700">Short-term: Emergency Change</text>
        <text x="44" y="267" fontSize="13" fontWeight="700" fill="#d31321">Driver</text>
        <text x="94" y="267" fontSize="13" fontWeight="700">OPS Lucy / Ruby</text>
        <text x="44" y="290" fontSize="13" fontWeight="700" fill="#d31321">Visibility</text>
        <text x="112" y="290" fontSize="13" fontWeight="700">Charley / Ryan</text>
        <line x1="44" y1="316" x2="570" y2="316" stroke="#d8d0c5" />

        <rect x="44" y="340" width="145" height="44" fill="#ffffff" stroke="#b8aea4" />
        <text x="116.5" y="367" textAnchor="middle" fontSize="12" fontWeight="700">Urgent OPS handling</text>
        <rect x="224" y="340" width="145" height="44" fill="#ffffff" stroke="#b8aea4" />
        <text x="296.5" y="358" textAnchor="middle" fontSize="12" fontWeight="700">Owner + ETA</text>
        <text x="296.5" y="374" textAnchor="middle" fontSize="12" fontWeight="700">confirmed</text>
        <rect x="404" y="340" width="145" height="44" fill="#ffffff" stroke="#b8aea4" />
        <text x="476.5" y="367" textAnchor="middle" fontSize="12" fontWeight="700">Emergency closure</text>
        <path d="M189 362 L224 362" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
        <path d="M369 362 L404 362" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />

        <rect x="648" y="210" width="570" height="210" fill="#ffffff" stroke="#d8d0c5" />
        <text x="670" y="242" fontSize="16" fontWeight="700">Long-term: CR</text>
        <text x="670" y="267" fontSize="13" fontWeight="700" fill="#d31321">Driver</text>
        <text x="720" y="267" fontSize="13" fontWeight="700">Nick / Jacky</text>
        <text x="670" y="290" fontSize="13" fontWeight="700" fill="#d31321">Support</text>
        <text x="730" y="290" fontSize="12" fontWeight="700">4 delivery domains: Product / Fulfillment / Corporate</text>
        <text x="730" y="310" fontSize="12" fontWeight="700">Supply Chain & Upstreams</text>
        <text x="670" y="333" fontSize="13" fontWeight="700" fill="#d31321">Visibility</text>
        <text x="738" y="333" fontSize="13" fontWeight="700">Charley / Domain Lead</text>
        <line x1="670" y1="344" x2="1196" y2="344" stroke="#d8d0c5" />

        <rect x="668" y="360" width="100" height="44" fill="#ffffff" stroke="#b8aea4" />
        <text x="718" y="387" textAnchor="middle" fontSize="11" fontWeight="700">Create intake</text>
        <rect x="796" y="360" width="106" height="44" fill="#ffffff" stroke="#b8aea4" />
        <text x="849" y="378" textAnchor="middle" fontSize="11" fontWeight="700">Forward to</text>
        <text x="849" y="394" textAnchor="middle" fontSize="11" fontWeight="700">Delivery</text>
        <rect x="930" y="360" width="116" height="44" fill="#ffffff" stroke="#d31321" />
        <text x="988" y="387" textAnchor="middle" fontSize="11" fontWeight="700">Delivery Team</text>
        <rect x="1074" y="360" width="98" height="44" fill="#ffffff" stroke="#b8aea4" />
        <text x="1123" y="378" textAnchor="middle" fontSize="11" fontWeight="700">Business</text>
        <text x="1123" y="394" textAnchor="middle" fontSize="11" fontWeight="700">closure</text>
        <path d="M768 382 L796 382" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
        <path d="M902 382 L930 382" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
        <path d="M1046 382 L1074 382" stroke="#343434" strokeWidth="1.4" markerEnd="url(#flowArrow)" />
    </svg>
);

export const OpsCrFlowPage: React.FC = () => (
    <div className="min-h-screen bg-[#f6f3ee] text-[#111111]">
        <header className="border-b border-[#d8d0c5] bg-[#111111] text-white">
            <div className="mx-auto max-w-[1600px] px-6 py-7 lg:px-10">
                <div className="inline-flex items-center gap-2 border border-white/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
                    <Network size={14} />
                    OPS CR / Emergency Change Process
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Operation Case Swimlane</h1>
                <p className="mt-4 max-w-5xl text-sm leading-6 text-white/72">
                    Business request is submitted to OPS. OPS confirms ST or LT. LT CR is driven by OPS Domain and delivered by Delivery Domain support teams.
                </p>
            </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-6 px-6 py-6 lg:px-10">
            <Section title="Option 1 - Domain Swimlane">
                <div className="overflow-auto">
                    <SwimlaneSvg />
                </div>
            </Section>

            <Section title="OPS CR Initiative Process">
                <div className="overflow-auto">
                    <CleanFlowSvg />
                </div>
            </Section>
        </main>
    </div>
);
