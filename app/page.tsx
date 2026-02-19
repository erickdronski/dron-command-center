import Link from 'next/link';
import { CheckSquare, Zap, FileText, Brain, Users, Building2, ThumbsUp, Calendar, TrendingUp, Activity } from 'lucide-react';
import fs from 'fs';
import path from 'path';

function getStats() {
  try {
    const tasks = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/tasks.json'), 'utf-8'));
    const feed = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/feed.json'), 'utf-8'));
    const content = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/content.json'), 'utf-8'));
    const inProgress = tasks.filter((t: { status: string }) => t.status === 'In Progress').length;
    const done = tasks.filter((t: { status: string }) => t.status === 'Done').length;
    return { tasks, feed, content, inProgress, done };
  } catch {
    return { tasks: [], feed: [], content: [], inProgress: 0, done: 0 };
  }
}

export default function DashboardPage() {
  const { tasks, feed, content, inProgress, done } = getStats();
  const total = tasks.length;
  const completion = total > 0 ? Math.round((done / total) * 100) : 0;
  const recentFeed = [...feed].reverse().slice(0, 5);

  const cards = [
    { label: 'Total Tasks', value: total, icon: CheckSquare, color: 'text-blue-400', href: '/tasks' },
    { label: 'In Progress', value: inProgress, icon: Activity, color: 'text-yellow-400', href: '/tasks' },
    { label: 'Completed', value: done, icon: TrendingUp, color: 'text-green-400', href: '/tasks' },
    { label: 'Completion', value: `${completion}%`, icon: TrendingUp, color: 'text-purple-400', href: '/tasks' },
    { label: 'Content Items', value: content.length, icon: FileText, color: 'text-pink-400', href: '/content' },
    { label: 'Feed Entries', value: feed.length, icon: Zap, color: 'text-cyan-400', href: '/live-feed' },
  ];

  const quickLinks = [
    { href: '/tasks', icon: CheckSquare, label: 'Tasks', desc: 'Kanban board' },
    { href: '/content', icon: FileText, label: 'Content', desc: 'Pipeline' },
    { href: '/approvals', icon: ThumbsUp, label: 'Approvals', desc: 'AI proposals' },
    { href: '/calendar', icon: Calendar, label: 'Calendar', desc: 'Cron jobs' },
    { href: '/memory', icon: Brain, label: 'Memory', desc: 'AI brain' },
    { href: '/team', icon: Users, label: 'Team', desc: 'Meet agents' },
    { href: '/office', icon: Building2, label: 'Office', desc: 'Workstations' },
    { href: '/live-feed', icon: Zap, label: 'Live Feed', desc: 'Terminal' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#555] mt-1">Dron Command Center — AI-first operations</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#111] border border-[#222] px-3 py-2 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[#888]">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-xs text-[#555] mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Nav */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-purple-500/50 hover:bg-[#141414] transition-all group">
              <link.icon size={20} className="text-[#555] group-hover:text-purple-400 transition-colors mb-2" />
              <div className="text-sm font-medium text-white">{link.label}</div>
              <div className="text-xs text-[#555]">{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div>
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Recent Tasks</h2>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            {tasks.slice(0, 5).map((task: { id: string; title: string; status: string; assignee: string; project: string }, i: number) => (
              <div key={task.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[#1a1a1a]' : ''}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  task.status === 'Done' ? 'bg-green-500' :
                  task.status === 'In Progress' ? 'bg-yellow-500' :
                  task.status === 'Review' ? 'bg-blue-500' : 'bg-[#333]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{task.title}</div>
                  <div className="text-xs text-[#555]">{task.project}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  task.assignee === 'AI' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                }`}>{task.assignee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feed */}
        <div>
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Recent Activity</h2>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden font-mono">
            {recentFeed.map((entry: { id: string; type: string; message: string; agent: string; timestamp: string }, i: number) => (
              <div key={entry.id} className={`px-4 py-3 ${i > 0 ? 'border-t border-[#1a1a1a]' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    entry.type === 'FILE_EDIT' ? 'text-green-400 bg-green-400/10' :
                    entry.type === 'COMMAND' ? 'text-blue-400 bg-blue-400/10' :
                    entry.type === 'THINKING' ? 'text-purple-400 bg-purple-400/10' :
                    entry.type === 'GIT' ? 'text-cyan-400 bg-cyan-400/10' :
                    'text-[#888] bg-[#222]'
                  }`}>{entry.type}</span>
                  <span className="text-xs text-[#555]">{entry.agent}</span>
                </div>
                <div className="text-xs text-[#888] truncate">{entry.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
