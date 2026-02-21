import Link from 'next/link';
import { 
  CheckSquare, Zap, FileText, Brain, Users, Building2, 
  ThumbsUp, Calendar, TrendingUp, Activity, Rocket, BarChart2 
} from 'lucide-react';
import fs from 'fs';
import path from 'path';
import { PageHeader } from './components/PageHeader';
import { HealthStatusCard, StatusBadge } from './components/HealthStatus';
import { ActivityFeedCompact } from './components/ActivityFeed';

function getStats() {
  try {
    const tasks = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/tasks.json'), 'utf-8'));
    const feed = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/feed.json'), 'utf-8'));
    const content = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/content.json'), 'utf-8'));
    const inProgress = tasks.filter((t: { status: string }) => t.status === 'In Progress').length;
    const done = tasks.filter((t: { status: string }) => t.status === 'Done').length;
    
    // Calculate deployment stats from feed
    const deployments = feed.filter((f: { type: string }) => f.type === 'GIT');
    const lastDeploy = deployments[deployments.length - 1];
    
    return { 
      tasks, 
      feed, 
      content, 
      inProgress, 
      done,
      deploymentCount: deployments.length,
      lastDeployTime: lastDeploy?.timestamp,
      successRate: 95 // Mock - would calculate from actual deployment data
    };
  } catch {
    return { 
      tasks: [], 
      feed: [], 
      content: [], 
      inProgress: 0, 
      done: 0,
      deploymentCount: 0,
      lastDeployTime: null,
      successRate: 0
    };
  }
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { tasks, feed, content, inProgress, done, deploymentCount, lastDeployTime, successRate } = getStats();
  const total = tasks.length;
  const completion = total > 0 ? Math.round((done / total) * 100) : 0;

  const statsCards = [
    { 
      label: 'Total Tasks', 
      value: total, 
      icon: CheckSquare, 
      color: 'text-blue-400',
      href: '/tasks',
      trend: total > 0 ? 'up' : 'neutral' as const
    },
    { 
      label: 'In Progress', 
      value: inProgress, 
      icon: Activity, 
      color: 'text-yellow-400',
      href: '/tasks',
      trend: inProgress > 0 ? 'up' : 'neutral' as const
    },
    { 
      label: 'Completed', 
      value: done, 
      icon: TrendingUp, 
      color: 'text-green-400',
      href: '/tasks',
      trend: done > 0 ? 'up' : 'neutral' as const
    },
    { 
      label: 'Completion', 
      value: `${completion}%`, 
      icon: BarChart2, 
      color: 'text-purple-400',
      href: '/tasks',
      trend: completion >= 50 ? 'up' : 'neutral' as const
    },
    { 
      label: 'Deployments', 
      value: deploymentCount, 
      icon: Rocket, 
      color: 'text-cyan-400',
      href: '/deployments',
      trend: 'up' as const
    },
    { 
      label: 'Success Rate', 
      value: `${successRate}%`, 
      icon: TrendingUp, 
      color: successRate >= 90 ? 'text-green-400' : 'text-yellow-400',
      href: '/deployments',
      trend: successRate >= 90 ? 'up' : 'down' as const
    },
  ];

  const quickLinks = [
    { href: '/tasks', icon: CheckSquare, label: 'Tasks', desc: 'Kanban board', status: inProgress > 0 ? `${inProgress} active` : undefined },
    { href: '/deployments', icon: Rocket, label: 'Deploys', desc: 'Build history', status: lastDeployTime ? formatTimeAgo(lastDeployTime) : undefined },
    { href: '/content', icon: FileText, label: 'Content', desc: 'Pipeline', status: `${content.length} items` },
    { href: '/approvals', icon: ThumbsUp, label: 'Approvals', desc: 'AI proposals', status: undefined },
    { href: '/analytics', icon: BarChart2, label: 'Analytics', desc: 'Metrics', status: 'Live' },
    { href: '/calendar', icon: Calendar, label: 'Calendar', desc: 'Cron jobs', status: undefined },
    { href: '/memory', icon: Brain, label: 'Memory', desc: 'AI brain', status: undefined },
    { href: '/team', icon: Users, label: 'Team', desc: 'Meet agents', status: undefined },
    { href: '/office', icon: Building2, label: 'Office', desc: 'Workstations', status: undefined },
    { href: '/live-feed', icon: Zap, label: 'Live Feed', desc: 'Terminal', status: `${feed.length} entries` },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Dashboard"
        subtitle="Dron Command Center — AI-first operations"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statsCards.map((card) => (
              <Link key={card.label} href={card.href}
                className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <card.icon size={16} className="text-[#333] group-hover:text-purple-400 transition-colors" />
                  {card.trend === 'up' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                </div>
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                <div className="text-xs text-[#555] mt-1">{card.label}</div>
              </Link>
            ))}
          </div>

          {/* Quick Nav */}
          <div>
            <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-purple-500/50 hover:bg-[#141414] transition-all group"
                >
                  <link.icon size={20} className="text-[#555] group-hover:text-purple-400 transition-colors mb-2" />
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-white">{link.label}</div>
                  </div>
                  <div className="text-xs text-[#555] mt-0.5">{link.desc}</div>
                  {link.status && (
                    <div className="text-[10px] text-purple-400 mt-1.5">{link.status}</div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider">Recent Tasks</h2>
                <Link href="/tasks" className="text-xs text-[#666] hover:text-purple-400 transition-colors">View all →</Link>
              </div>
              <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
                {tasks.slice(0, 5).map((task: { id: string; title: string; status: string; assignee: string; project: string }, i: number) => (
                  <div key={task.id} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-[#1a1a1a]' : ''} hover:bg-[#151515] transition-colors`}>
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
                {tasks.length === 0 && (
                  <div className="px-4 py-8 text-center text-[#555] text-sm">No tasks yet</div>
                )}
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeedCompact />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <HealthStatusCard />
          
          {/* Mini Deploy Status */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Latest Deploy</h3>
            
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status="success" text="Success" />
              <span className="text-xs text-[#666]">{lastDeployTime ? formatTimeAgo(lastDeployTime) : 'N/A'}</span>
            </div>
            
            <p className="text-sm text-white mb-3">
              feat: NOAA weather page with trading signals
            </p>
            
            <div className="flex gap-2">
              <Link
                href="/deployments"
                className="flex-1 text-center text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-2 rounded hover:bg-purple-500/30 transition-colors"
              >
                View History
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Content Pipeline</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Draft</span>
                <span className="text-white">{content.filter((c: {status: string}) => c.status === 'Draft').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">In Review</span>
                <span className="text-yellow-400">{content.filter((c: {status: string}) => c.status === 'Review').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Published</span>
                <span className="text-green-400">{content.filter((c: {status: string}) => c.status === 'Published').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
