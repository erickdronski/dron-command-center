import { ExternalLink } from 'lucide-react';

const apps = [
  {
    title: 'Capability & Maturity Playbook',
    url: 'https://ve-capability-maturity.vercel.app/',
    desc: '7-phase workshop playbook with journey view, process maps, and customer engagements',
    color: 'border-blue-500/20',
  },
  {
    title: 'Benefit Stories',
    url: 'https://ve-benefit-stories.vercel.app/',
    desc: '168 industry-specific benefit stories across 8 verticals',
    color: 'border-green-500/20',
  },
  {
    title: 'Prompt Toolkit',
    url: 'https://ve-prompt-toolkit.vercel.app/',
    desc: '6-prompt sales knowledge chain with interactive flow map and Mermaid export',
    color: 'border-purple-500/20',
  },
];

export default function AppsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Apps</h1>
        <p className="text-sm text-[#666] mt-1">Deployed standalone Vercel apps for the team</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {apps.map((app) => (
          <div key={app.url} className={`bg-[#111] border ${app.color} rounded-xl p-5 flex flex-col justify-between`}>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">{app.title}</h3>
              <p className="text-xs text-[#888] leading-relaxed mb-3">{app.desc}</p>
              <div className="text-[10px] text-[#555] font-mono truncate">{app.url}</div>
            </div>
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-colors"
            >
              Open App <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
