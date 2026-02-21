import Link from 'next/link';
import { CheckSquare, Zap, FileText, Brain, Users, Building2, ThumbsUp, Calendar, TrendingUp, Activity, Rocket, BarChart2 } from 'lucide-react';
import { PageHeader } from './components/PageHeader';
import { ActivityFeedCompact } from './components/ActivityFeed';

// Static stats for now (avoid fs imports)
const stats = {
  tasks: { total: 8, inProgress: 3, done: 2 },
  content: 3,
  feed: 17,
  deployments: 2
};

const completion = Math.round((stats.tasks.done / stats.tasks.total) * 100);

const cards = [
  { label: 'Total Tasks', value: stats.tasks.total, icon: CheckSquare, color: 'text-blue-400', href: '/tasks' },
  { label: 'In Progress', value: stats.tasks.inProgress, icon: Activity, color: 'text-yellow-400', href: '/tasks' },
  { label: 'Completed', value: stats.tasks.done, icon: TrendingUp, color: 'text-green-400', href: '/tasks' },
  { label: 'Completion', value: `${completion}%`, icon: BarChart2, color: 'text-purple-400', href: '/tasks' },
  { label: 'Deployments', value: stats.deployments, icon: Rocket, color: 'text-cyan-400', href: '/deployments' },
  { label: 'Feed Entries', value: stats.feed, icon: Zap, color: 'text-pink-400', href: '/live-feed' },
];

const quickLinks = [
  { href: '/tasks', icon: CheckSquare, label: 'Tasks', desc: 'Kanban board' },
  { href: '/deployments', icon: Rocket, label: 'Deploys', desc: 'Build history' },
  { href: '/content', icon: FileText, label: 'Content', desc: 'Pipeline' },
  { href: '/approvals', icon: ThumbsUp, label: 'Approvals', desc: 'AI proposals' },
  { href: '/calendar', icon: Calendar, label: 'Calendar', desc: 'Cron jobs' },
  { href: '/memory', icon: Brain, label: 'Memory', desc: 'AI brain' },
  { href: '/team', icon: Users, label: 'Team', desc: 'Meet agents' },
  { href: '/live-feed', icon: Zap, label: 'Live Feed', desc: 'Terminal' },
];

// Static tasks data
const tasks = [
  { id: '1', title: 'Build Mission Control UI', status: 'In Progress', assignee: 'AI', project: 'Mission Control' },
  { id: '2', title: 'Add live feed auto-deploy', status: 'Todo', assignee: 'AI', project: 'Mission Control' },
  { id: '3', title: 'Polymarket weather bot V2', status: 'In Progress', assignee: 'AI', project: 'Trading' },
  { id: '4', title: 'Review trading P&L report', status: 'Todo', assignee: 'Dron', project: 'Trading' },
  { id: '5', title: 'X follower growth sprint', status: 'Review', assignee: 'AI', project: 'Social' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Dashboard"
        subtitle="Dron Command Center — AI-first operations"
      />

      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors">
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <div className="text-xs text-[#555] mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-purple-500/50 hover:bg-[#141414] transition-all group"
            >
              <link.icon size={20} className="text-[#555] group-hover:text-purple-400 transition-colors mb-2" />
              <div className="text-sm font-medium text-white">{link.label}</div>
              <div className="text-xs text-[#555]">{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Recent Tasks</h2>
          <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            {tasks.slice(0, 5).map((task, i) => (
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

        <ActivityFeedCompact />
      </div>
    </div>
  );
}
