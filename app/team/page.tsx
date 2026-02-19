import { Users, ArrowRight } from 'lucide-react';

const BOSS = {
  emoji: '👤',
  name: 'Dron',
  role: 'Chief of Operations',
  desc: 'Steers direction, approves work, owns outcomes',
  tags: ['Strategy', 'Vision', 'Ownership'],
  color: 'border-purple-500/50 bg-purple-500/5',
  tagColor: 'bg-purple-500/20 text-purple-300',
};

const AGENTS = [
  {
    emoji: '🏗️',
    name: 'Dron Builder',
    role: 'Lead Engineer',
    desc: 'Builds, deploys, maintains the full stack',
    tags: ['Code', 'Systems', 'Deploy'],
    color: 'border-green-500/30 bg-green-500/5',
    tagColor: 'bg-green-500/20 text-green-300',
    status: 'Working',
    statusColor: 'text-green-400',
    dotColor: 'bg-green-500',
  },
  {
    emoji: '📊',
    name: 'Dron Analyst',
    role: 'Value Engineer',
    desc: 'Researches opportunities, analyzes performance',
    tags: ['Research', 'Data', 'Strategy'],
    color: 'border-blue-500/30 bg-blue-500/5',
    tagColor: 'bg-blue-500/20 text-blue-300',
    status: 'Idle',
    statusColor: 'text-[#555]',
    dotColor: 'bg-[#444]',
  },
  {
    emoji: '🤖',
    name: 'Trading Bot',
    role: 'Market Agent',
    desc: 'Executes Polymarket trades, monitors positions',
    tags: ['Trading', 'Speed', 'Alpha'],
    color: 'border-yellow-500/30 bg-yellow-500/5',
    tagColor: 'bg-yellow-500/20 text-yellow-300',
    status: 'Working',
    statusColor: 'text-green-400',
    dotColor: 'bg-green-500',
  },
  {
    emoji: '✍️',
    name: 'Content Agent',
    role: 'Content Writer',
    desc: 'Scripts videos, writes threads, manages pipeline',
    tags: ['Voice', 'Quality', 'Design'],
    color: 'border-pink-500/30 bg-pink-500/5',
    tagColor: 'bg-pink-500/20 text-pink-300',
    status: 'Idle',
    statusColor: 'text-[#555]',
    dotColor: 'bg-[#444]',
  },
];

export default function TeamPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Users size={20} className="text-purple-400" />
        <div>
          <h1 className="text-lg font-semibold">Meet the Team</h1>
          <p className="text-sm text-[#555]">AI agents, each with a real role</p>
        </div>
      </div>

      {/* Boss card - centered */}
      <div className="flex justify-center">
        <div className={`w-80 border ${BOSS.color} rounded-xl p-6 text-center relative`}>
          <div className="w-16 h-16 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            {BOSS.emoji}
          </div>
          <div className="text-base font-bold text-white mb-0.5">{BOSS.name}</div>
          <div className="text-sm text-purple-400 mb-2">{BOSS.role}</div>
          <div className="text-xs text-[#888] mb-4 leading-relaxed">{BOSS.desc}</div>
          <div className="flex gap-2 justify-center mb-4">
            {BOSS.tags.map(t => (
              <span key={t} className={`text-xs px-2 py-0.5 rounded ${BOSS.tagColor}`}>{t}</span>
            ))}
          </div>
          <button className="flex items-center gap-1 text-xs text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded hover:bg-purple-500/10 transition-colors mx-auto">
            ROLE CARD <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Connecting line */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-px h-6 bg-[#333]" />
          <div className="w-[calc(100%-200px)] h-px bg-[#333] max-w-2xl" />
        </div>
      </div>

      {/* Sub line down from center */}
      <div className="flex justify-center -mt-6">
        <div className="w-full max-w-4xl relative h-6">
          <div className="absolute left-1/2 top-0 w-px h-full bg-[#333]" style={{transform:'translateX(-50%)'}} />
          {/* Horizontal line */}
          <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-[#333]" />
          {/* Vertical stubs */}
          {[12.5, 37.5, 62.5, 87.5].map(pct => (
            <div key={pct} className="absolute top-0 w-px h-6 bg-[#333]" style={{left:`${pct}%`,transform:'translateX(-50%)'}} />
          ))}
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
        {AGENTS.map((agent) => (
          <div key={agent.name} className={`border ${agent.color} rounded-xl p-5 text-center`}>
            <div className="w-14 h-14 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
              {agent.emoji}
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className={`w-1.5 h-1.5 rounded-full ${agent.dotColor} ${agent.status === 'Working' ? 'animate-pulse' : ''}`} />
              <span className={`text-xs ${agent.statusColor}`}>{agent.status}</span>
            </div>
            <div className="text-sm font-bold text-white mb-0.5">{agent.name}</div>
            <div className={`text-xs mb-2 ${agent.tagColor.replace('bg-', 'text-').split(' ')[1]}`}>{agent.role}</div>
            <div className="text-xs text-[#666] mb-3 leading-relaxed">{agent.desc}</div>
            <div className="flex gap-1 justify-center flex-wrap mb-3">
              {agent.tags.map(t => (
                <span key={t} className={`text-xs px-1.5 py-0.5 rounded ${agent.tagColor}`}>{t}</span>
              ))}
            </div>
            <button className={`flex items-center gap-1 text-xs border px-2 py-1 rounded hover:opacity-80 transition-opacity mx-auto ${agent.tagColor}`}
              style={{borderColor:'currentColor', opacity:0.8}}>
              ROLE CARD <ArrowRight size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
