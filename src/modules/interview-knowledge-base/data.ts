export type Bilingual = {
  zh: string;
  en: string;
};

export type Company = {
  id: string;
  name: Bilingual;
  description: Bilingual;
};

export type Story = {
  id: string;
  title: Bilingual;
  summary: Bilingual;
  tags: string[];
  bullets: Bilingual[];
};

export type FitSignal = {
  id: string;
  companyId: string;
  title: Bilingual;
  jdNeed: Bilingual;
  yourFit: Bilingual;
  prepFocus: Bilingual;
  status: 'Strong Match' | 'Need Framing';
};

export type Question = {
  id: string;
  companyId: string;
  round: 'General' | 'Hongmin' | 'Charley' | 'HR';
  theme: string;
  question: Bilingual;
  intent: Bilingual;
  framework: Bilingual[];
  sampleAnswer: Bilingual;
  followUps: Bilingual[];
  keywords: string[];
};

export type Persona = {
  id: 'coach' | 'hongmin' | 'charley' | 'hr';
  round: Question['round'];
  name: Bilingual;
  style: Bilingual;
};

export const companies: Company[] = [
  {
    id: 'general',
    name: {
      zh: '\u901a\u7528\u9762\u8bd5',
      en: 'General',
    },
    description: {
      zh: '\u4f5c\u4e3a\u4f60\u957f\u671f\u7684\u4e2a\u4eba\u9762\u8bd5\u9898\u5e93\u57fa\u5ea7\uff0c\u9002\u5408\u6240\u6709\u516c\u53f8\u548c\u5c97\u4f4d\u7684\u884c\u4e3a\u9898\u3001\u5b9a\u4f4d\u9898\u548c\u9879\u76ee\u9898\u3002',
      en: 'The long-term foundation of your personal interview library for behavior, positioning, and project questions across companies.',
    },
  },
  {
    id: 'lululemon',
    name: {
      zh: 'lululemon \u4e13\u9898',
      en: 'lululemon',
    },
    description: {
      zh: '\u57fa\u4e8e JD \u548c Tips \u7684\u5b9a\u5236\u5316\u9898\u5e93\uff0c\u53ef\u4ee5\u4f5c\u4e3a\u672a\u6765\u5176\u4ed6\u516c\u53f8\u4e13\u9898\u9875\u7684\u6a21\u677f\u3002',
      en: 'A role-specific question set built from the JD and tips, which also serves as a template for future company-specific tracks.',
    },
  },
];

export const quickStats = [
  {
    label: {
      zh: '\u4e3b\u6848\u4f8b',
      en: 'Anchor Stories',
    },
    value: '4',
  },
  {
    label: {
      zh: '\u516c\u53f8\u4e13\u9898',
      en: 'Company Tracks',
    },
    value: '2',
  },
  {
    label: {
      zh: '\u53ef\u7ec3\u4e60\u9898\u76ee',
      en: 'Practice Questions',
    },
    value: '6',
  },
  {
    label: {
      zh: '\u53cc\u8bed\u6a21\u5f0f',
      en: 'Bilingual Mode',
    },
    value: 'ZH / EN',
  },
];

export const stories: Story[] = [
  {
    id: 'nike',
    title: {
      zh: 'Nike MarTech \u9879\u76ee\u96c6',
      en: 'Nike MarTech Program',
    },
    summary: {
      zh: '\u540c\u65f6\u7edf\u7b79 NCP\u3001Grafana \u8fc1\u79fb\u548c Content Hub\uff0c\u6700\u9002\u5408\u56de\u7b54\u591a\u9879\u76ee\u5e76\u884c\u3001global \u6c9f\u901a\u548c\u590d\u6742\u4ea4\u4ed8\u6cbb\u7406\u3002',
      en: 'Managed NCP, Grafana migration, and Content Hub in parallel. This is your strongest story for multi-project delivery, global communication, and governance.',
    },
    tags: ['Multi-project', 'Global', 'Governance'],
    bullets: [
      {
        zh: '\u4ece 0 \u5230 1 \u642d\u5efa Jira Dashboard\uff0c\u6210\u4e3a\u591a\u4e2a leader \u6bcf\u65e5\u4f7f\u7528\u7684\u7ba1\u7406\u5de5\u5177\u3002',
        en: 'Built a Jira dashboard from scratch that became a daily management tool for multiple leaders.',
      },
      {
        zh: '\u4e3b\u5bfc weekly huddle \u548c weekly report\uff0c\u83b7\u5f97 global leader \u7684\u516c\u5f00\u8ba4\u53ef\u3002',
        en: 'Led weekly huddles and reports that were publicly recognized by the global leader.',
      },
      {
        zh: '\u9002\u5408\u8bb2\u4f18\u5148\u7ea7\u3001\u8d44\u6e90\u51b2\u7a81\u3001\u98ce\u9669\u5347\u7ea7\u548c\u82f1\u6587\u8868\u8fbe\u3002',
        en: 'Strong for priority setting, resource conflicts, risk escalation, and English communication.',
      },
    ],
  },
  {
    id: 'nestle',
    title: {
      zh: '\u96c0\u5de2 30+ \u9879\u76ee\u7fa4',
      en: 'Nestle 30+ Project Cluster',
    },
    summary: {
      zh: '\u957f\u671f\u5e26\u9886 20 \u4eba\u591a\u804c\u80fd\u56e2\u961f\u5e76\u884c\u7ba1\u7406 30+ \u9879\u76ee\uff0c\u6700\u9002\u5408\u56de\u7b54 vendor\u3001\u8d44\u6e90\u5206\u914d\u548c\u5ba2\u6237\u7ba1\u7406\u3002',
      en: 'Led a 20-person cross-functional team and managed 30+ parallel projects. This is your strongest story for vendor management, resource allocation, and client ownership.',
    },
    tags: ['Vendor', 'Portfolio', 'Stakeholder'],
    bullets: [
      {
        zh: '\u8986\u76d6\u5fae\u4fe1\u751f\u6001\u3001CDP\u3001\u6570\u636e\u63a5\u53e3\u548c\u8fd0\u8425\u5206\u6790\u3002',
        en: 'Covered the WeChat ecosystem, CDP, data integrations, and operational analysis.',
      },
      {
        zh: '\u53ef\u4ee5\u5305\u88c5\u6210\u7532\u65b9\u89c6\u89d2\u7684 vendor governance \u548c cross-team delivery\u3002',
        en: 'Can be framed as owner-side vendor governance and cross-team delivery.',
      },
      {
        zh: '\u9002\u5408\u8bb2\u591a\u9879\u76ee\u6392\u5e8f\u3001\u4ea4\u4ed8\u8d28\u91cf\u548c\u5546\u4e1a\u7ed3\u679c\u3002',
        en: 'Strong for prioritization across programs, delivery quality, and business outcomes.',
      },
    ],
  },
  {
    id: 'longfor',
    title: {
      zh: '\u9f99\u6e56 0-1 \u5e73\u53f0\u5efa\u8bbe',
      en: 'Longfor 0-to-1 Platform Build',
    },
    summary: {
      zh: '\u6700\u9002\u5408\u56de\u7b54 discovery\u3001\u5e73\u53f0\u642d\u5efa\u3001\u8de8\u56e2\u961f\u534f\u540c\u548c\u6a21\u7cca\u9700\u6c42\u6f84\u6e05\u3002',
      en: 'Best used for discovery, platform building, cross-team alignment, and clarifying ambiguous requests.',
    },
    tags: ['0-1', 'Discovery', 'Platform'],
    bullets: [
      {
        zh: '\u5e2e\u52a9 50 \u4eba\u89c4\u6a21\u56e2\u961f\u5728\u9ad8\u538b\u73af\u5883\u4e0b\u5efa\u7acb\u7a33\u5b9a\u4ea4\u4ed8\u8282\u594f\u3002',
        en: 'Helped a 50-person organization establish a stable delivery rhythm under pressure.',
      },
      {
        zh: '\u9002\u5408\u8bb2 scope \u5b9a\u4e49\u3001backlog \u6cbb\u7406\u548c stakeholder \u5bf9\u9f50\u3002',
        en: 'Great for discussing scope definition, backlog governance, and stakeholder alignment.',
      },
      {
        zh: '\u80fd\u8bc1\u660e\u4f60\u4e0d\u53ea\u662f Scrum ceremony \u578b PM\u3002',
        en: 'Helps prove you are not just a Scrum-ceremony PM.',
      },
    ],
  },
  {
    id: 'ibm',
    title: {
      zh: 'IBM / \u6d77\u5916\u8de8\u6587\u5316\u4ea4\u4ed8',
      en: 'IBM / Cross-cultural Delivery Foundation',
    },
    summary: {
      zh: '\u4f5c\u4e3a\u4f60\u82f1\u6587\u6c9f\u901a\u3001SLA \u610f\u8bc6\u548c\u6280\u672f\u7406\u89e3\u529b\u7684\u5e95\u5c42\u652f\u6491\u3002',
      en: 'The foundation behind your English communication, SLA awareness, and technical credibility.',
    },
    tags: ['English', 'SLA', 'Technical'],
    bullets: [
      {
        zh: '\u4ece\u5f00\u53d1\u8f6c\u5230\u9879\u76ee\u7ba1\u7406\uff0c\u8ba9\u4f60\u66f4\u5bb9\u6613\u548c\u5de5\u7a0b\u56e2\u961f\u5efa\u7acb\u4fe1\u4efb\u3002',
        en: 'Your path from engineering to PM helps you build trust with technical teams.',
      },
      {
        zh: '\u4e2d\u97e9\u7f8e\u591a\u6587\u5316\u80cc\u666f\uff0c\u9002\u5408\u652f\u6491 global communication \u8bf4\u6cd5\u3002',
        en: 'Your China-Korea-US background supports your global communication story.',
      },
      {
        zh: '\u80fd\u5728\u9ad8 SLA \u73af\u5883\u4e0b\u8bb2\u8d28\u91cf\u3001\u98ce\u9669\u548c\u7a33\u5b9a\u6027\u3002',
        en: 'Lets you talk credibly about quality, risk, and stability in high-SLA environments.',
      },
    ],
  },
];

export const fitSignals: FitSignal[] = [
  {
    id: 'multi-project',
    companyId: 'lululemon',
    title: {
      zh: '\u591a\u9879\u76ee\u5e76\u884c\u7ba1\u7406',
      en: 'Parallel Program Management',
    },
    jdNeed: {
      zh: 'JD \u660e\u786e\u8981\u6c42\u540c\u65f6\u63a8\u8fdb\u591a\u4e2a\u9879\u76ee\u5e76\u786e\u4fdd\u6309\u671f\u4ea4\u4ed8\u3002',
      en: 'The JD explicitly requires leading multiple projects in parallel with reliable on-time delivery.',
    },
    yourFit: {
      zh: 'Nike \u548c\u96c0\u5de2\u7684\u7ecf\u5386\u90fd\u80fd\u8bc1\u660e\u4f60\u6709 program \u7ea7\u89c6\u89d2\u3002',
      en: 'Your Nike and Nestle experience both demonstrate a program-level operating model.',
    },
    prepFocus: {
      zh: '\u91cd\u70b9\u8981\u8bb2\u4f18\u5148\u7ea7\u673a\u5236\u3001\u8d44\u6e90\u51b2\u7a81\u3001\u4f9d\u8d56\u7ba1\u7406\u548c\u98ce\u9669\u5347\u7ea7\u3002',
      en: 'Emphasize prioritization logic, resource conflicts, dependency management, and escalation.',
    },
    status: 'Strong Match',
  },
  {
    id: 'vendor',
    companyId: 'lululemon',
    title: {
      zh: 'Vendor \u7ba1\u7406',
      en: 'Vendor Management',
    },
    jdNeed: {
      zh: 'Tips \u7279\u522b\u5f3a\u8c03\u4f9b\u5e94\u5546\u7ba1\u7406\uff0c\u800c\u4e14\u8981\u7ad9\u5728\u7532\u65b9\u89c6\u89d2\u3002',
      en: 'The interview tips strongly emphasize vendor management from the owner-side perspective.',
    },
    yourFit: {
      zh: '\u9700\u8981\u628a\u96c0\u5de2\u91cc\u7684\u7b2c\u4e09\u65b9\u5e73\u53f0\u534f\u540c\u3001\u63a5\u53e3\u7ba1\u7406\u548c\u5ba2\u6237\u63a8\u8fdb\u91cd\u65b0\u5305\u88c5\u6210 vendor governance\u3002',
      en: 'Your Nestle work with third-party platforms, interfaces, and client-side delivery should be framed as vendor governance.',
    },
    prepFocus: {
      zh: '\u5fc5\u987b\u51c6\u5907\u4e00\u4e2a\u5ef6\u671f vendor \u6848\u4f8b\u548c\u4e00\u4e2a\u591a\u65b9\u76f8\u4e92\u7529\u9505\u7684\u6848\u4f8b\u3002',
      en: 'Prepare one delayed-vendor case and one multi-party blame-shifting case.',
    },
    status: 'Need Framing',
  },
  {
    id: 'solution',
    companyId: 'lululemon',
    title: {
      zh: '\u9700\u6c42\u5230 solution \u8f6c\u5316',
      en: 'Requirement-to-Solution Translation',
    },
    jdNeed: {
      zh: '\u5c97\u4f4d\u9700\u8981 discovery\u3001solution design \u548c 0-1 \u80fd\u529b\u3002',
      en: 'The role needs discovery, solution design, and 0-to-1 capability.',
    },
    yourFit: {
      zh: '\u9f99\u6e56\u548c Content Hub \u90fd\u5f88\u9002\u5408\u62ff\u6765\u8bb2\u9700\u6c42\u6f84\u6e05\u548c\u65b9\u6848\u8bbe\u8ba1\u3002',
      en: 'Longfor and Content Hub are both strong cases for discovery and solution design.',
    },
    prepFocus: {
      zh: '\u5c11\u8bb2\u6d41\u7a0b\u540d\u8bcd\uff0c\u591a\u8bb2\u4f60\u5982\u4f55\u5b9a\u4e49\u8fb9\u754c\u3001\u5bf9\u9f50\u5173\u952e\u4eba\u548c\u63a7\u5236\u53d8\u66f4\u3002',
      en: 'Use fewer process terms and more detail on scope boundaries, stakeholder alignment, and change control.',
    },
    status: 'Strong Match',
  },
];

export const questions: Question[] = [
  {
    id: 'general-positioning',
    companyId: 'general',
    round: 'General',
    theme: 'Positioning',
    question: {
      zh: '\u4f60\u6700\u5927\u7684\u9879\u76ee\u7ba1\u7406\u5f3a\u9879\u662f\u4ec0\u4e48\uff1f',
      en: 'What is your strongest project-management capability?',
    },
    intent: {
      zh: '\u7528\u6765\u5efa\u7acb\u4f60\u7684\u57fa\u672c\u5b9a\u4f4d\uff0c\u540e\u7eed\u5927\u90e8\u5206\u8ffd\u95ee\u90fd\u4f1a\u56de\u5230\u8fd9\u4e2a\u5b9a\u4f4d\u3002',
      en: 'This sets your positioning, and many follow-ups will come back to it.',
    },
    framework: [
      {
        zh: '\u5148\u7ed9\u4e00\u53e5\u5b9a\u4f4d\u7ed3\u8bba\u3002',
        en: 'Start with a one-line positioning statement.',
      },
      {
        zh: '\u518d\u7528 1 \u4e2a\u6848\u4f8b\u8bc1\u660e\uff0c\u4e0d\u8981\u8bb2\u7a7a\u8bdd\u3002',
        en: 'Use one concrete story to prove it.',
      },
      {
        zh: '\u6700\u540e\u8bf4\u8fd9\u4e2a\u80fd\u529b\u5982\u4f55\u5e2e\u52a9\u4e1a\u52a1\u7ed3\u679c\u3002',
        en: 'Close by linking the capability to business outcomes.',
      },
    ],
    sampleAnswer: {
      zh: '\u6211\u6700\u5f3a\u7684\u4e0d\u662f\u5355\u4e00\u65b9\u6cd5\u8bba\uff0c\u800c\u662f\u5728\u590d\u6742\u73af\u5883\u4e0b\u628a\u591a\u9879\u76ee\u3001\u591a\u56e2\u961f\u548c\u591a\u65b9\u4f9d\u8d56\u62c9\u56de\u5230\u53ef\u63a7\u8282\u594f\u7684\u80fd\u529b\u3002',
      en: 'My strongest capability is bringing complex multi-project, multi-team, dependency-heavy work back into a controllable rhythm.',
    },
    followUps: [
      {
        zh: '\u4f60\u662f\u600e\u4e48\u77e5\u9053\u81ea\u5df1\u771f\u7684\u628a\u9879\u76ee\u62c9\u56de\u53ef\u63a7\u7684\uff1f',
        en: 'How do you know you really brought the project back under control?',
      },
      {
        zh: '\u4f60\u5f53\u65f6\u7528\u4e86\u4ec0\u4e48\u673a\u5236\u800c\u4e0d\u662f\u53ea\u9760\u4e2a\u4eba\u63a8\u52a8\uff1f',
        en: 'What mechanism did you use instead of relying only on personal effort?',
      },
    ],
    keywords: ['positioning', 'control', 'governance', 'business outcome'],
  },
  {
    id: 'lulu-multi-project',
    companyId: 'lululemon',
    round: 'Hongmin',
    theme: 'Multi-project',
    question: {
      zh: '\u4f60\u6700\u8fd1\u4e00\u6b21\u540c\u65f6\u7ba1\u7406\u591a\u4e2a\u9879\u76ee\u662f\u4ec0\u4e48\u573a\u666f\uff1f\u4f60\u600e\u4e48\u6392\u4f18\u5148\u7ea7\uff1f',
      en: 'Tell me about the most recent time you managed multiple projects in parallel. How did you prioritize them?',
    },
    intent: {
      zh: '\u9a8c\u8bc1\u4f60\u662f\u5426\u771f\u7684\u6709 program manager \u7684\u89c6\u89d2\uff0c\u800c\u4e0d\u662f\u53ea\u4f1a\u8ddf\u4efb\u52a1\u3002',
      en: 'Tests whether you truly think like a program manager instead of just tracking tasks.',
    },
    framework: [
      {
        zh: '\u5148\u8bf4\u9879\u76ee\u7ec4\u5408\u548c\u51b2\u7a81\u6765\u6e90\u3002',
        en: 'Start with the project portfolio and the source of conflict.',
      },
      {
        zh: '\u518d\u8bf4\u4f60\u7684\u6392\u5e8f\u539f\u5219\u548c\u8d44\u6e90\u53d6\u820d\u3002',
        en: 'Then explain your prioritization criteria and resource trade-offs.',
      },
      {
        zh: '\u6700\u540e\u8bf4\u7ed3\u679c\u548c\u4f60\u600e\u4e48\u907f\u514d\u5931\u63a7\u3002',
        en: 'Close with outcomes and how you prevented loss of control.',
      },
    ],
    sampleAnswer: {
      zh: '\u6211\u4f1a\u7528 Nike MarTech \u9879\u76ee\u96c6\u6765\u56de\u7b54\u3002\u6211\u540c\u65f6\u8d1f\u8d23 NCP\u3001Grafana \u8fc1\u79fb\u548c Content Hub\uff0c\u4e0d\u662f\u5e73\u5747\u5206\u914d\u7cbe\u529b\uff0c\u800c\u662f\u6309\u4e1a\u52a1\u5f71\u54cd\u3001\u65f6\u95f4\u7a97\u53e3\u3001\u4f9d\u8d56\u590d\u6742\u5ea6\u548c\u98ce\u9669\u66dd\u9732\u5ea6\u6765\u6392\u5e8f\u3002',
      en: 'I would use the Nike MarTech program. I was managing NCP, Grafana migration, and Content Hub at the same time, and I did not spread my effort evenly. I prioritized based on business impact, timing window, dependency complexity, and risk exposure.',
    },
    followUps: [
      {
        zh: '\u5982\u679c\u4e24\u4e2a\u9879\u76ee\u90fd\u8bf4\u81ea\u5df1\u662f P1\uff0c\u4f60\u6700\u540e\u600e\u4e48\u62cd\u677f\uff1f',
        en: 'If two projects both say they are P1, how do you make the final call?',
      },
      {
        zh: '\u4f60\u7528\u4ec0\u4e48\u53ef\u89c6\u5316\u65b9\u5f0f\u8ba9 leader \u548c\u56e2\u961f\u770b\u5230\u53d6\u820d\uff1f',
        en: 'What visual mechanism did you use to make the trade-offs visible to leaders and the team?',
      },
    ],
    keywords: ['priority', 'resource', 'dependency', 'risk'],
  },
  {
    id: 'lulu-vendor',
    companyId: 'lululemon',
    round: 'Hongmin',
    theme: 'Vendor',
    question: {
      zh: '\u5982\u679c vendor \u4ea4\u4ed8\u5ef6\u671f\uff0c\u4f46 business deadline \u4e0d\u53d8\uff0c\u4f60\u600e\u4e48\u5904\u7406\uff1f',
      en: 'If a vendor slips but the business deadline does not move, how do you respond?',
    },
    intent: {
      zh: '\u8003\u4f60\u662f\u5426\u80fd\u7ad9\u5728\u7532\u65b9\u89c6\u89d2\u538b\u5b9e\u4ea4\u4ed8\u3002',
      en: 'Tests whether you can drive delivery from the owner side.',
    },
    framework: [
      {
        zh: '\u5148\u5224\u65ad\u6839\u56e0\uff0c\u4e0d\u8981\u53ea\u8bf4\u201c\u50ac\u201d\u3002',
        en: 'Diagnose the root cause instead of saying you would just chase harder.',
      },
      {
        zh: '\u91cd\u5efa\u8282\u594f\u3001\u91cc\u7a0b\u7891\u548c\u8d23\u4efb\u4eba\u3002',
        en: 'Rebuild cadence, milestones, and ownership.',
      },
      {
        zh: '\u540c\u65f6\u4fdd\u62a4\u65f6\u95f4\u7ebf\u3001scope \u548c\u5173\u952e\u5173\u7cfb\u3002',
        en: 'Protect the timeline, scope, and key relationships at the same time.',
      },
    ],
    sampleAnswer: {
      zh: '\u6211\u4e0d\u4f1a\u76f4\u63a5\u8fdb\u5165\u60c5\u7eea\u7ba1\u7406\uff0c\u800c\u662f\u5148\u533a\u5206\u95ee\u9898\u662f\u9700\u6c42\u4e0d\u6e05\u3001\u80fd\u529b\u4e0d\u8db3\u8fd8\u662f\u4f9d\u8d56\u6ca1\u6709\u5173\u95ed\u3002\u4e4b\u540e\u6211\u4f1a\u628a\u4ea4\u4ed8\u62c6\u6210\u66f4\u77ed\u7684\u91cc\u7a0b\u7891\u5e76\u63d0\u9ad8 review \u9891\u7387\u3002',
      en: 'I would not move into emotional management. I would first determine whether the problem comes from unclear requirements, capability gaps, or unresolved dependencies. Then I would break delivery into shorter milestones and increase review frequency.',
    },
    followUps: [
      {
        zh: '\u4ec0\u4e48\u60c5\u51b5\u4e0b\u4f60\u4f1a\u9009\u62e9\u5347\u7ea7\u7ed9\u66f4\u9ad8\u5c42\uff1f',
        en: 'Under what condition would you escalate to a higher level?',
      },
      {
        zh: 'vendor \u89c9\u5f97\u95ee\u9898\u4e0d\u5728\u81ea\u5df1\u8eab\u4e0a\u65f6\uff0c\u4f60\u600e\u4e48\u6253\u7834\u50f5\u5c40\uff1f',
        en: 'If the vendor believes the problem is not theirs, how do you break the deadlock?',
      },
    ],
    keywords: ['vendor', 'root cause', 'milestone', 'escalation'],
  },
  {
    id: 'lulu-why-pm',
    companyId: 'lululemon',
    round: 'Charley',
    theme: 'Positioning',
    question: {
      zh: '\u4e3a\u4ec0\u4e48\u4f60\u9002\u5408 Program Manager \u800c\u4e0d\u53ea\u662f Scrum Master \uff1f',
      en: 'Why are you a fit for a Program Manager role instead of just being a Scrum Master?',
    },
    intent: {
      zh: '\u8fd9\u662f\u5b9a\u4f4d\u9898\uff0c\u8981\u628a\u4f60\u4ece\u6d41\u7a0b\u89d2\u8272\u62c9\u5230\u590d\u6742\u4ea4\u4ed8 owner\u3002',
      en: 'This is a positioning question that moves you from a process role into a complex-delivery owner.',
    },
    framework: [
      {
        zh: '\u627f\u8ba4\u4f60\u6709\u654f\u6377\u80cc\u666f\uff0c\u4f46\u8981\u5feb\u901f\u5347\u7ef4\u3002',
        en: 'Acknowledge your agile background, then quickly elevate the discussion.',
      },
      {
        zh: '\u5f3a\u8c03\u4f60\u505a\u8fc7\u4f18\u5148\u7ea7\u3001\u98ce\u9669\u3001stakeholder \u5bf9\u9f50\u548c solution \u8f6c\u5316\u3002',
        en: 'Emphasize prioritization, risk, stakeholder alignment, and solution translation.',
      },
      {
        zh: '\u7528 Nike\u3001\u96c0\u5de2\u3001\u9f99\u6e56\u4e09\u4e2a\u6848\u4f8b\u652f\u6491\u3002',
        en: 'Support it with Nike, Nestle, and Longfor.',
      },
    ],
    sampleAnswer: {
      zh: '\u867d\u7136\u6211\u6709\u5f88\u5f3a\u7684 Scrum \u548c\u654f\u6377\u80cc\u666f\uff0c\u4f46\u6211\u8fc7\u53bb\u51e0\u5e74\u505a\u7684\u6838\u5fc3\u5de5\u4f5c\u5e76\u4e0d\u662f\u4e3b\u6301 ceremony\uff0c\u800c\u662f\u7ba1\u7406\u590d\u6742\u9879\u76ee\u7ec4\u5408\u3001\u63a8\u52a8\u8de8\u56e2\u961f\u534f\u4f5c\u548c\u5e73\u8861\u4f18\u5148\u7ea7\u4e0e\u98ce\u9669\u3002',
      en: 'Although I have a strong Scrum and agile background, my core work in recent years has not been running ceremonies. It has been managing complex project portfolios, driving cross-functional delivery, and balancing priority with risk.',
    },
    followUps: [
      {
        zh: '\u90a3\u4f60\u548c\u4e00\u4e2a\u4f20\u7edf IT PM \u6700\u5927\u7684\u533a\u522b\u662f\u4ec0\u4e48\uff1f',
        en: 'Then what is the biggest difference between you and a traditional IT PM?',
      },
      {
        zh: '\u5982\u679c\u8fd9\u91cc\u4e0d\u5f3a\u8c03 Scrum\uff0c\u4f60\u8fd8\u80fd\u5e26\u6765\u4ec0\u4e48\uff1f',
        en: 'If Scrum is not the focus here, what else do you bring?',
      },
    ],
    keywords: ['program', 'ownership', 'risk', 'stakeholder'],
  },
  {
    id: 'lulu-why-company',
    companyId: 'lululemon',
    round: 'HR',
    theme: 'Motivation',
    question: {
      zh: '\u4e3a\u4ec0\u4e48\u60f3\u52a0\u5165 lululemon\uff1f',
      en: 'Why do you want to join lululemon?',
    },
    intent: {
      zh: '\u786e\u8ba4\u52a8\u673a\u3001\u7a33\u5b9a\u6027\u548c\u5bf9\u5c97\u4f4d\u7684\u7406\u89e3\u3002',
      en: 'Checks motivation, stability, and role understanding.',
    },
    framework: [
      {
        zh: '\u5148\u8bf4\u88ab\u4ec0\u4e48\u5438\u5f15\u3002',
        en: 'Start with what attracts you.',
      },
      {
        zh: '\u518d\u8bf4\u4f60\u7684\u7ecf\u5386\u4e3a\u4ec0\u4e48\u5339\u914d\u3002',
        en: 'Then explain why your background fits.',
      },
      {
        zh: '\u6700\u540e\u4f20\u8fbe\u957f\u671f\u6295\u5165\u7684\u4fe1\u53f7\u3002',
        en: 'Close with a signal of long-term commitment.',
      },
    ],
    sampleAnswer: {
      zh: '\u6211\u5bf9\u8fd9\u4e2a\u673a\u4f1a\u611f\u5174\u8da3\uff0c\u4e00\u65b9\u9762\u662f\u56e0\u4e3a lululemon \u662f\u5f88\u5f3a\u7684\u5168\u7403\u5316\u54c1\u724c\uff0c\u53e6\u4e00\u65b9\u9762\u662f\u56e0\u4e3a\u8fd9\u4e2a\u89d2\u8272\u5f3a\u8c03\u7684\u4e0d\u53ea\u662f\u534f\u8c03\uff0c\u800c\u662f\u771f\u6b63\u5bf9\u590d\u6742\u4ea4\u4ed8\u8d1f\u8d23\u3002',
      en: 'I am interested in this opportunity because lululemon is a strong global brand, and this role is about much more than coordination. It requires real ownership of complex delivery.',
    },
    followUps: [
      {
        zh: '\u5982\u679c global exposure \u6bd4\u4f60\u9884\u671f\u5c11\uff0c\u4f60\u8fd8\u611f\u5174\u8da3\u5417\uff1f',
        en: 'If the global exposure is lower than you expected, are you still interested?',
      },
      {
        zh: '\u4f60\u5e0c\u671b\u672a\u6765\u4e24\u4e09\u5e74\u6210\u957f\u6210\u4ec0\u4e48\u6837\u5b50\uff1f',
        en: 'How do you want to grow over the next two to three years?',
      },
    ],
    keywords: ['motivation', 'ownership', 'global', 'long-term'],
  },
];

export const personas: Persona[] = [
  {
    id: 'coach',
    round: 'General',
    name: {
      zh: '\u901a\u7528 coach',
      en: 'General Coach',
    },
    style: {
      zh: '\u5e2e\u4f60\u6253\u78e8\u5b9a\u4f4d\u3001\u884c\u4e3a\u9898\u548c\u4e3b\u6848\u4f8b\u7684\u901a\u7528\u56de\u7b54\u3002',
      en: 'Helps you sharpen positioning, behavioral stories, and reusable project answers.',
    },
  },
  {
    id: 'hongmin',
    round: 'Hongmin',
    name: {
      zh: '\u6d2a\u654f\u89c6\u89d2',
      en: 'Hongmin View',
    },
    style: {
      zh: '\u95ee\u9898\u5f88\u5177\u4f53\uff0c\u53ef\u80fd\u6253\u65ad\u4f60\uff0c\u91cd\u70b9\u770b\u591a\u9879\u76ee\u3001vendor \u548c ownership\u3002',
      en: 'Specific and interrupt-driven. Focuses on multi-project management, vendor control, and ownership.',
    },
  },
  {
    id: 'charley',
    round: 'Charley',
    name: {
      zh: 'Charley \u89c6\u89d2',
      en: 'Charley View',
    },
    style: {
      zh: '\u66f4\u770b manager \u89c6\u89d2\u3001\u5224\u65ad\u529b\u548c governance \u80fd\u529b\u3002',
      en: 'More focused on management perspective, judgment, and governance.',
    },
  },
  {
    id: 'hr',
    round: 'HR',
    name: {
      zh: 'HR \u89c6\u89d2',
      en: 'HR View',
    },
    style: {
      zh: '\u5173\u6ce8\u52a8\u673a\u3001\u7a33\u5b9a\u6027\u3001\u82f1\u6587\u8868\u8fbe\u548c\u6574\u4f53\u5339\u914d\u5ea6\u3002',
      en: 'Focused on motivation, stability, English communication, and overall fit.',
    },
  },
];
