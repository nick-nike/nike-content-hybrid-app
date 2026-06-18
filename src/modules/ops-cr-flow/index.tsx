import { Network } from 'lucide-react';
import React from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="border border-[#d8d0c5] bg-[#fffdf8]">
        <div className="border-b border-[#d8d0c5] bg-[#111111] px-5 py-3 text-white">
            <h2 className="text-sm font-bold uppercase tracking-[0.16em]">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
    </section>
);

const Box = ({
    x,
    y,
    width,
    height,
    title,
    sub,
    tone = 'normal',
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    sub?: string;
    tone?: 'normal' | 'red' | 'dark' | 'soft';
}) => {
    const fill = tone === 'dark' ? '#111111' : tone === 'soft' ? '#f7f0e8' : '#ffffff';
    const stroke = tone === 'red' ? '#d31321' : tone === 'dark' ? '#111111' : '#b8aea4';
    const text = tone === 'dark' ? '#ffffff' : '#111111';
    const titleY = sub ? y + height / 2 - 5 : y + height / 2 + 5;

    return (
        <>
            <rect x={x} y={y} width={width} height={height} fill={fill} stroke={stroke} />
            <text x={x + width / 2} y={titleY} textAnchor="middle" fontSize="14" fontWeight="700" fill={text}>{title}</text>
            {sub && <text x={x + width / 2} y={titleY + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill={text === '#ffffff' ? '#ffffff' : '#5f574f'}>{sub}</text>}
        </>
    );
};

const Decision = ({ x, y, label }: { x: number; y: number; label: string }) => (
    <>
        <polygon points={`${x},${y} ${x + 72},${y + 58} ${x},${y + 116} ${x - 72},${y + 58}`} fill="#111111" />
        <text x={x} y={y + 52} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">{label}</text>
        <text x={x} y={y + 72} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">ST or LT?</text>
    </>
);

const Arrow = ({
    d,
    marker = 'arrow',
}: {
    d: string;
    marker?: 'arrow' | 'thinArrow';
}) => <path d={d} stroke="#343434" strokeWidth={marker === 'thinArrow' ? 1.2 : 1.5} fill="none" markerEnd={`url(#${marker})`} />;

const SwimlaneSvg = () => (
    <svg viewBox="0 0 1260 690" className="block min-w-[1260px] bg-[#fffdf8]" role="img" aria-label="SCM and Corp Tech Ops incident to solution swimlane">
        <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="#343434" />
            </marker>
            <marker id="thinArrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="#343434" />
            </marker>
        </defs>

        <rect x="0" y="0" width="1260" height="690" fill="#fffdf8" stroke="#d8d0c5" />
        <rect x="0" y="0" width="1260" height="56" fill="#111111" />
        <text x="630" y="36" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="700" letterSpacing="6">SCM &amp; Corp Tech Ops Incident Solution Flow</text>

        <rect x="0" y="56" width="1260" height="62" fill="#f1eee8" stroke="#d8d0c5" />
        <line x1="420" y1="56" x2="420" y2="690" stroke="#d8d0c5" />
        <line x1="840" y1="56" x2="840" y2="690" stroke="#d8d0c5" />
        <text x="210" y="95" textAnchor="middle" fontSize="18" fontWeight="700" letterSpacing="4">Business / Users</text>
        <text x="630" y="95" textAnchor="middle" fontSize="16" fontWeight="700" letterSpacing="3">SCM &amp; Corp Tech Ops</text>
        <text x="1050" y="95" textAnchor="middle" fontSize="18" fontWeight="700" letterSpacing="4">Delivery Domain</text>

        <Box x={120} y={152} width={180} height={58} title="Incident raised" sub="operation case" tone="red" />
        <Box x={120} y={266} width={180} height={58} title="Confirm impact" sub="scope / urgency" />
        <Box x={120} y={400} width={180} height={58} title="Business validates" sub="result confirmed" />
        <Box x={130} y={556} width={160} height={58} title="Close" tone="soft" />

        <Box x={508} y={152} width={180} height={58} title="Tech Ops triage" sub="record / clarify" />
        <Box x={508} y={266} width={180} height={58} title="Dependency check" sub="related incidents" />
        <Decision x={598} y={384} label="Solution" />
        <Box x={452} y={560} width={172} height={58} title="ST solution" sub="SCM & Corp Tech Ops" tone="red" />
        <Box x={660} y={560} width={172} height={58} title="LT Enhancement" sub="business funded" tone="red" />

        <Box x={942} y={384} width={190} height={58} title="Business intake" sub="budget owner" />
        <Box x={942} y={560} width={190} height={58} title="Domain delivery" sub="deliver / handover" />

        <Arrow d="M300 181 L508 181" />
        <Arrow d="M598 210 L598 266" />
        <Arrow d="M300 295 L508 295" />
        <Arrow d="M598 324 L598 384" />
        <Arrow d="M598 500 L598 530 L538 530 L538 560" />
        <Arrow d="M598 500 L598 530 L746 530 L746 560" />
        <text x="556" y="523" textAnchor="middle" fontSize="11" fontWeight="700" fill="#746b62">ST</text>
        <text x="700" y="523" textAnchor="middle" fontSize="11" fontWeight="700" fill="#746b62">LT</text>
        <Arrow d="M832 589 L942 589" />
        <Arrow d="M1037 442 L1037 560" />
        <Arrow d="M942 413 L300 413" />
        <Arrow d="M452 589 L300 589 L300 429" />
        <Arrow d="M210 458 L210 556" />

        <path d="M688 295 C748 260 810 260 868 295 C810 330 748 330 688 295" fill="none" stroke="#b8aea4" strokeDasharray="5 5" />
        <text x="778" y="289" textAnchor="middle" fontSize="12" fontWeight="700" fill="#746b62">incidents may depend on each other</text>
        <Arrow d="M868 295 L942 398" marker="thinArrow" />

        <text x="630" y="662" textAnchor="middle" fontSize="13" fontWeight="700" fill="#655f57">
            Full Intake / Business Request is a separate project intake path. This flow starts from incidents and then defines ST or LT solution.
        </text>
    </svg>
);

const CleanFlowSvg = () => (
    <svg viewBox="0 0 1480 620" className="block min-w-[1480px] bg-[#fffdf8]" role="img" aria-label="Clean incident solution flowchart">
        <defs>
            <marker id="flowArrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="#343434" />
            </marker>
        </defs>

        <rect x="0" y="0" width="1480" height="620" fill="#fffdf8" stroke="#d8d0c5" />

        <Box x={38} y={52} width={190} height={58} title="Incident" sub="operation case" tone="red" />
        <Box x={282} y={52} width={190} height={58} title="Impact" sub="business / system" />
        <Box x={526} y={52} width={190} height={58} title="Dependency" sub="related incidents" />
        <Decision x={842} y={24} label="Solution" />
        <Box x={1080} y={52} width={190} height={58} title="Path confirmed" />

        <Arrow d="M228 81 L282 81" marker="thinArrow" />
        <Arrow d="M472 81 L526 81" marker="thinArrow" />
        <Arrow d="M716 81 L770 81" marker="thinArrow" />
        <Arrow d="M914 82 L1080 82" marker="thinArrow" />

        <path d="M842 140 L842 178" stroke="#343434" strokeWidth="1.5" />
        <path d="M356 178 L1094 178" stroke="#343434" strokeWidth="1.5" />
        <path d="M356 178 L356 218" stroke="#343434" strokeWidth="1.5" markerEnd="url(#flowArrow)" />
        <path d="M1094 178 L1094 218" stroke="#343434" strokeWidth="1.5" markerEnd="url(#flowArrow)" />
        <text x="338" y="169" textAnchor="middle" fontSize="12" fontWeight="700" fill="#746b62">ST</text>
        <text x="1112" y="169" textAnchor="middle" fontSize="12" fontWeight="700" fill="#746b62">LT</text>

        <rect x="38" y="220" width="560" height="250" fill="#ffffff" stroke="#d8d0c5" />
        <text x="66" y="254" fontSize="18" fontWeight="700">Short-term: Emergency Solution</text>
        <rect x="66" y="272" width="420" height="28" fill="#fffdf8" stroke="#e5ded5" />
        <text x="82" y="290" fontSize="12" fontWeight="700" fill="#d31321">Driver</text>
        <text x="140" y="290" fontSize="12" fontWeight="700">SCM & Corp Tech Ops</text>
        <rect x="66" y="306" width="420" height="34" fill="#fffdf8" stroke="#e5ded5" />
        <text x="82" y="327" fontSize="12" fontWeight="700" fill="#d31321">Delivery</text>
        <text x="148" y="327" fontSize="12" fontWeight="700">SCM & Corp Tech Ops</text>
        <line x1="66" y1="344" x2="570" y2="344" stroke="#d8d0c5" />
        <Box x={66} y={376} width={140} height={48} title="Urgent handling" />
        <Box x={246} y={376} width={140} height={48} title="Owner + ETA" sub="confirmed" />
        <Box x={426} y={376} width={140} height={48} title="Emergency close" />
        <Arrow d="M206 400 L246 400" marker="thinArrow" />
        <Arrow d="M386 400 L426 400" marker="thinArrow" />

        <rect x="648" y="220" width="760" height="340" fill="#ffffff" stroke="#d8d0c5" />
        <text x="710" y="254" fontSize="18" fontWeight="700">Long-term: Enhancement Solution</text>
        <rect x="710" y="272" width="420" height="28" fill="#fffdf8" stroke="#e5ded5" />
        <text x="726" y="290" fontSize="12" fontWeight="700" fill="#d31321">Driver</text>
        <text x="784" y="290" fontSize="12" fontWeight="700">SCM & Corp Tech Ops</text>
        <rect x="710" y="306" width="420" height="34" fill="#fffdf8" stroke="#e5ded5" />
        <text x="726" y="327" fontSize="12" fontWeight="700" fill="#d31321">Delivery</text>
        <text x="792" y="327" fontSize="11" fontWeight="700">Product / Fulfillment / Corporate / Supply Chain & Upstreams</text>
        <line x1="690" y1="360" x2="1370" y2="360" stroke="#d8d0c5" />
        <Box x={690} y={382} width={140} height={46} title="Jira Task" sub="Enhancement details" tone="red" />
        <Box x={858} y={382} width={140} height={46} title="Gateway" sub="Charley approve" />
        <Box x={1026} y={382} width={140} height={46} title="Create CSCOP" sub="Jenny" />
        <Box x={1194} y={382} width={140} height={46} title="Wishlist" sub="delivery backlog" />
        <Box x={690} y={470} width={140} height={46} title="Business Confirm" sub="go / no-go" />
        <Box x={878} y={470} width={140} height={46} title="Create Intake" sub="business owner" />
        <Box x={1066} y={470} width={156} height={46} title="Delivery Gateway" sub="business sign-off" />
        <Arrow d="M830 405 L858 405" marker="thinArrow" />
        <Arrow d="M998 405 L1026 405" marker="thinArrow" />
        <Arrow d="M1166 405 L1194 405" marker="thinArrow" />
        <Arrow d="M1264 428 L1264 448 L760 448 L760 470" marker="thinArrow" />
        <Arrow d="M830 493 L878 493" marker="thinArrow" />
        <Arrow d="M1018 493 L1066 493" marker="thinArrow" />
    </svg>
);

const TpmoIntakeOwnerSvg = () => (
    <svg viewBox="0 0 1480 690" className="block min-w-[1480px] bg-[#fffdf8]" role="img" aria-label="SCM and Corp Tech Ops incident to Enhancement solution process">
        <defs>
            <marker id="tpmoArrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="#343434" />
            </marker>
        </defs>

        <rect x="0" y="0" width="1480" height="690" fill="#fffdf8" stroke="#d8d0c5" />
        <rect x="0" y="0" width="1480" height="54" fill="#111111" />
        <text x="740" y="35" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="700" letterSpacing="5">SCM &amp; Corp Tech Ops Incident to Enhancement Solution Process</text>

        <rect x="18" y="74" width="1444" height="588" fill="#fffdf8" stroke="#d8d0c5" />
        <rect x="38" y="86" width="1200" height="20" fill="#f7f0e8" stroke="#d8d0c5" />
        <text x="638" y="101" textAnchor="middle" fontSize="11" fontWeight="700" fill="#655f57" letterSpacing="3">SCM &amp; CORP TECH OPS</text>

        <Box x={54} y={132} width={176} height={58} title="Incident" sub="operation case" tone="red" />
        <Box x={282} y={132} width={176} height={58} title="Impact" sub="business / system" />
        <Box x={510} y={132} width={176} height={58} title="Dependency" sub="related incidents" />
        <polygon points="826,110 898,178 826,246 754,178" fill="#111111" />
        <text x="826" y="169" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="700">Solution</text>
        <text x="826" y="192" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="700">ST or LT?</text>
        

        <path d="M230 161 L282 161" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M458 161 L510 161" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M686 161 L754 161" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        

        <path d="M826 246 L826 270" stroke="#343434" strokeWidth="1.5" />
        <path d="M324 270 L1080 270" stroke="#343434" strokeWidth="1.5" />
        <path d="M324 270 L324 292" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M1080 270 L1080 292" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <text x="306" y="261" textAnchor="middle" fontSize="12" fontWeight="700" fill="#746b62">ST</text>
        <text x="1098" y="261" textAnchor="middle" fontSize="12" fontWeight="700" fill="#746b62">LT</text>

        <rect x="54" y="294" width="524" height="230" fill="#ffffff" stroke="#d8d0c5" />
        <text x="84" y="326" fontSize="18" fontWeight="700">Short-term: Emergency Solution</text>
        <rect x="84" y="344" width="420" height="28" fill="#fffdf8" stroke="#e5ded5" />
        <text x="100" y="362" fontSize="12" fontWeight="700" fill="#d31321">Driver</text>
        <text x="158" y="362" fontSize="12" fontWeight="700">SCM & Corp Tech Ops</text>
        <rect x="84" y="378" width="420" height="34" fill="#fffdf8" stroke="#e5ded5" />
        <text x="100" y="399" fontSize="12" fontWeight="700" fill="#d31321">Delivery</text>
        <text x="166" y="399" fontSize="12" fontWeight="700">SCM & Corp Tech Ops</text>
        <line x1="84" y1="428" x2="548" y2="428" stroke="#d8d0c5" />
        <Box x={84} y={458} width={126} height={38} title="Urgent handling" />
        <Box x={254} y={458} width={126} height={38} title="Owner + ETA" />
        <Box x={424} y={458} width={126} height={38} title="Close" />
        <path d="M210 477 L254 477" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M380 477 L424 477" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />

        <rect x="646" y="294" width="760" height="316" fill="#ffffff" stroke="#d8d0c5" />
        <text x="694" y="326" fontSize="18" fontWeight="700">Long-term: Enhancement Solution</text>
        <rect x="694" y="344" width="430" height="28" fill="#fffdf8" stroke="#e5ded5" />
        <text x="710" y="362" fontSize="12" fontWeight="700" fill="#d31321">Driver</text>
        <text x="768" y="362" fontSize="12" fontWeight="700">SCM & Corp Tech Ops</text>
        <rect x="694" y="378" width="430" height="34" fill="#fffdf8" stroke="#e5ded5" />
        <text x="710" y="399" fontSize="12" fontWeight="700" fill="#d31321">Delivery</text>
        <text x="776" y="399" fontSize="11" fontWeight="700">Product / Fulfillment / Corporate / Supply Chain & Upstreams</text>
        <line x1="680" y1="428" x2="1370" y2="428" stroke="#d8d0c5" />
        <Box x={680} y={448} width={142} height={44} title="Jira Task" sub="Enhancement details" tone="red" />
        <Box x={856} y={448} width={142} height={44} title="Gateway" sub="Charley approve" />
        <Box x={1032} y={448} width={142} height={44} title="Create CSCOP" sub="Jenny" />
        <Box x={1208} y={448} width={142} height={44} title="Wishlist" sub="delivery backlog" />
        <Box x={680} y={528} width={142} height={44} title="Business Confirm" sub="go / no-go" />
        <Box x={866} y={528} width={142} height={44} title="Create Intake" sub="business owner" />
        <Box x={1052} y={528} width={156} height={44} title="Delivery Gateway" sub="business sign-off" />
        <path d="M822 470 L856 470" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M998 470 L1032 470" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M1174 470 L1208 470" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M1279 492 L1279 510 L751 510 L751 528" stroke="#343434" strokeWidth="1.5" fill="none" markerEnd="url(#tpmoArrow)" />
        <path d="M822 550 L866 550" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
        <path d="M1008 550 L1052 550" stroke="#343434" strokeWidth="1.5" markerEnd="url(#tpmoArrow)" />
    </svg>
);

export const OpsCrFlowPage: React.FC = () => (
    <div className="min-h-screen bg-[#f6f3ee] text-[#111111]">
        <header className="border-b border-[#d8d0c5] bg-[#111111] text-white">
            <div className="mx-auto max-w-[1600px] px-6 py-7 lg:px-10">
                <div className="inline-flex items-center gap-2 border border-white/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]">
                    <Network size={14} />
                    SCM &amp; Corp Tech Ops Incident to Enhancement Solution Process
                </div>
                <h1 className="mt-4 text-4xl font-semibold tracking-normal md:text-5xl">Incident to Solution Flow</h1>
                <p className="mt-4 max-w-5xl text-sm leading-6 text-white/72">
                    All cases start as incidents. SCM & Corp Tech Ops checks impact and dependency across related incidents. If the solution becomes LT, the Enhancement is documented in Jira first, approved through Gateway, then handed over to Delivery Domain teams.
                </p>
            </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-6 px-6 py-6 lg:px-10">
            <Section title="Domain Swimlane">
                <div className="overflow-auto">
                    <SwimlaneSvg />
                </div>
            </Section>

            <Section title="SCM & Corp Tech Ops Incident to Enhancement Solution Process">
                <div className="overflow-auto">
                    <CleanFlowSvg />
                </div>
            </Section>

            <Section title="SCM & Corp Tech Ops Incident to Enhancement Solution Process">
                <div className="overflow-auto">
                    <TpmoIntakeOwnerSvg />
                </div>
            </Section>
        </main>
    </div>
);
