import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import {
  LayoutDashboard, CheckSquare, FileText, ThumbsUp,
  Calendar, FolderOpen, Brain, Users, Building2, Zap
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Dron Command Center — AI-first collaboration platform',
};

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/content', icon: FileText, label: 'Content' },
  { href: '/approvals', icon: ThumbsUp, label: 'Approvals' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/memory', icon: Brain, label: 'Memory' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/office', icon: Building2, label: 'Office' },
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
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-xs font-bold">M</div>
              <span className="text-sm font-semibold text-white">Mission Control</span>
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
          {/* Status */}
          <div className="px-4 py-3 border-t border-[#222]">
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              AI Online
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
