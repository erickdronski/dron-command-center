import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import {
  LayoutDashboard, CheckSquare, FileText, ThumbsUp,
  Calendar, FolderOpen, Brain, Users, Building2, Zap, CloudSun, 
  BarChart2, Wrench, Rocket, GitBranch
} from 'lucide-react';
import { HealthIndicator } from './components/HealthStatus';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Dron Command Center — AI-first collaboration platform',
};

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/deployments', icon: Rocket, label: 'Deployments' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/content', icon: FileText, label: 'Content' },
  { href: '/approvals', icon: ThumbsUp, label: 'Approvals' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/memory', icon: Brain, label: 'Memory' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/office', icon: Building2, label: 'Office' },
  { href: '/weather', icon: CloudSun, label: 'Weather' },
  { href: '/value-engineering', icon: Wrench, label: 'Value Eng', highlight: true },
  { href: '/live-feed', icon: Zap, label: 'Live Feed', highlight: true },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[200px] flex-shrink-0 border-r border-[#222] flex flex-col">
          {/* Logo */}
          <div className="px-4 py-4 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-white block leading-tight">Mission Control</span>
                <span className="text-[10px] text-[#555] uppercase tracking-wider">Dron Command</span>
              </div>
            </div>
          </div>
          
          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-[#1a1a1a] hover:text-white ${
                  item.highlight
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Health Status */}
          <div className="px-4 py-3 border-t border-[#222]">
            <div className="flex items-center gap-2 text-xs">
              <HealthIndicator status="up" size="sm" />
              <span className="text-[#555]">All systems operational</span>
            </div>
            <div className="text-[10px] text-[#444] mt-1 ml-4">
              Updated just now
            </div>
          </div>
        </aside>
        
        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
