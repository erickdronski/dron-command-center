import { Building2 } from 'lucide-react';

const WORKSTATIONS = [
  {
    emoji: '🏗️',
    name: 'Dron Builder',
    status: 'Working',
    task: 'Building Mission Control',
    monitorLines: [
      '> npm run build',
      '✓ Compiled successfully',
      '> git commit -m "feat: ..."',
      '> vercel --prod',
      '⠸ Deploying...',
    ],
    monitorColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    statusColor: 'text-green-400',
    dotColor: 'bg-green-500',
  },
  {
    emoji: '📊',
    name: 'Dron Analyst',
    status: 'Idle',
    task: null,
    monitorLines: [
      '> standby mode',
      '$ waiting for task...',
      '',
      '_',
    ],
    monitorColor: 'text-[#444]',
    borderColor: 'border-[#222]',
    statusColor: 'text-[#555]',
    dotColor: 'bg-[#444]',
  },
  {
    emoji: '🤖',
    name: 'Trading Bot',
    status: 'Working',
    task: 'Scanning Polymarket',
    monitorLines: [
      '> scanning markets...',
      '📈 TEMP-JFK: 34°F ±2',
      '💰 Edge: +3.2% detected',
      '> placing position...',
      '✓ Order filled: $47.20',
    ],
    monitorColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    statusColor: 'text-green-400',
    dotColor: 'bg-green-500',
  },
  {
    emoji: '✍️',
    name: 'Content Agent',
    status: 'Idle',
    task: null,
    monitorLines: [
      '> standby mode',
      '$ awaiting brief...',
      '',
      '_',
    ],
    monitorColor: 'text-[#444]',
    borderColor: 'border-[#222]',
    statusColor: 'text-[#555]',
    dotColor: 'bg-[#444]',
  },
];

export default function OfficePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Building2 size={20} className="text-purple-400" />
        <div>
          <h1 className="text-lg font-semibold">Digital Office</h1>
          <p className="text-sm text-[#555]">Agent workstations — real-time status</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6">
        {WORKSTATIONS.map((ws) => (
          <div key={ws.name} className={`bg-[#111] border ${ws.borderColor} rounded-xl p-6 relative overflow-hidden`}>
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 text-8xl leading-none pointer-events-none select-none" aria-hidden>
              {ws.emoji}
            </div>

            {/* Agent info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center text-2xl">
                {ws.emoji}
              </div>
              <div>
                <div className="text-base font-bold text-white">{ws.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${ws.dotColor} ${ws.status === 'Working' ? 'animate-pulse' : ''}`} />
                  <span className={`text-xs font-medium ${ws.statusColor}`}>{ws.status}</span>
                  {ws.task && <span className="text-xs text-[#555]">· {ws.task}</span>}
                </div>
              </div>
            </div>

            {/* Monitor */}
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg overflow-hidden">
              {/* Monitor top bar */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#111] border-b border-[#1a1a1a]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-[#444] font-mono">terminal</span>
              </div>
              {/* Monitor content */}
              <div className="p-4 font-mono text-xs space-y-1 min-h-[120px]">
                {ws.monitorLines.map((line, i) => (
                  <div key={i} className={`${ws.monitorColor} ${line === '_' ? 'animate-pulse' : ''}`}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>

            {/* Desk surface */}
            <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
              <div className="flex gap-2">
                {/* Desk items */}
                <div className="w-8 h-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-center text-xs leading-6 text-[#333]">📋</div>
                <div className="w-8 h-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-center text-xs leading-6 text-[#333]">☕</div>
                <div className="w-8 h-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-center text-xs leading-6 text-[#333]">🖱️</div>
              </div>
              {ws.status === 'Working' ? (
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  Active Session
                </div>
              ) : (
                <div className="text-xs text-[#444]">Standby</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
