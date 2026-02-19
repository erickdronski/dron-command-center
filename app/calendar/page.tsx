import { Calendar, Clock, RotateCcw, Zap } from 'lucide-react';

const RECURRING = [
  { name: 'Mission Control Check', freq: 'Every 30 min', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🔄' },
  { name: 'AI Trading Scan', freq: 'Every hour', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '📊' },
  { name: 'Morning Brief', freq: 'Daily 8:00 AM', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '☀️' },
  { name: 'Memory Maintenance', freq: 'Daily 11:00 PM', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30', icon: '🧠' },
  { name: 'Discord Heartbeat', freq: 'Every 30 min', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', icon: '💓' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WEEKLY_EVENTS: Record<number, Array<{ name: string; time: string; color: string }>> = {
  0: [{ name: 'Deploy review', time: '10:00', color: 'bg-purple-500/20 text-purple-300' }],
  1: [
    { name: 'Content sprint', time: '09:00', color: 'bg-yellow-500/20 text-yellow-300' },
    { name: 'Trading scan deep', time: '14:00', color: 'bg-green-500/20 text-green-300' },
  ],
  2: [{ name: 'X growth batch', time: '11:00', color: 'bg-pink-500/20 text-pink-300' }],
  3: [
    { name: 'P&L review', time: '09:00', color: 'bg-green-500/20 text-green-300' },
    { name: 'Video scripting', time: '15:00', color: 'bg-yellow-500/20 text-yellow-300' },
  ],
  4: [
    { name: 'System health check', time: '08:00', color: 'bg-blue-500/20 text-blue-300' },
    { name: 'Feature deploy', time: '16:00', color: 'bg-purple-500/20 text-purple-300' },
  ],
  5: [{ name: 'Weekly memory digest', time: '18:00', color: 'bg-violet-500/20 text-violet-300' }],
  6: [{ name: 'Strategy review', time: '11:00', color: 'bg-cyan-500/20 text-cyan-300' }],
};

const UPCOMING = [
  { name: 'AI Trading Scan', time: 'In 23 min', color: 'text-green-400', dot: 'bg-green-500' },
  { name: 'Mission Control Check', time: 'In 8 min', color: 'text-purple-400', dot: 'bg-purple-500' },
  { name: 'Morning Brief', time: 'Tomorrow 8:00 AM', color: 'text-blue-400', dot: 'bg-blue-500' },
  { name: 'P&L Review', time: 'Wed 9:00 AM', color: 'text-green-400', dot: 'bg-green-500' },
];

export default function CalendarPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calendar size={20} className="text-purple-400" />
        <h1 className="text-lg font-semibold">Calendar</h1>
        <span className="text-sm text-[#555]">Cron jobs & scheduled tasks</span>
      </div>

      {/* Always Running */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw size={14} className="text-[#555]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555]">Always Running</h2>
        </div>
        <div className="flex gap-3 flex-wrap">
          {RECURRING.map((r) => (
            <div key={r.name} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${r.color}`}>
              <span className="text-base">{r.icon}</span>
              <div>
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {r.freq}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-[#555]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555]">This Week</h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, i) => (
            <div key={day} className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
              <div className={`px-3 py-2 border-b border-[#1a1a1a] text-xs font-semibold ${
                i === 4 ? 'text-purple-400 bg-purple-500/10' : 'text-[#555]'
              }`}>
                {day}
                {i === 4 && <span className="ml-1 text-purple-300">(Today)</span>}
              </div>
              <div className="p-2 space-y-1.5 min-h-[100px]">
                {(WEEKLY_EVENTS[i] || []).map((evt, j) => (
                  <div key={j} className={`text-xs px-2 py-1.5 rounded ${evt.color}`}>
                    <div className="font-medium">{evt.name}</div>
                    <div className="opacity-70">{evt.time}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Up */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-[#555]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555]">Next Up</h2>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
          {UPCOMING.map((u, i) => (
            <div key={i} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-[#1a1a1a]' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${u.dot} animate-pulse`} />
              <div className="flex-1 text-sm text-white">{u.name}</div>
              <div className={`text-xs font-mono ${u.color}`}>{u.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
