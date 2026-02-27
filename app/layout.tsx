import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import {
  LayoutDashboard, Calendar, Brain, Users, CloudSun, BarChart2, Wrench, Twitter, Linkedin, Coffee, VideoOff, PenLine, Flame, UserRound
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mission Control',
  description: 'Dron Command Center — AI-first collaboration platform',
};

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/posts', icon: Twitter, label: 'X Posts' },
  { href: '/linkedin', icon: Linkedin, label: 'LinkedIn', highlight: true },
  { href: '/calendar', icon: Calendar, label: 'Schedule' },
  { href: '/memory', icon: Brain, label: 'Memory' },
  { href: '/team', icon: Users, label: 'Team' },
  { href: '/weather', icon: CloudSun, label: 'Weather' },
  { href: '/value-engineering', icon: Wrench, label: 'Value Eng', highlight: true },
  { href: '/goggins',            icon: Flame,    label: 'Goggins 🔥' },
  { href: '/parent-translator',  icon: UserRound, label: 'Parent Translator 👨‍👩‍👧' },
  { href: '/caffeine',           icon: Coffee,   label: 'Caffeine ☕' },
  { href: '/meeting-analyzer',   icon: VideoOff, label: 'Mtg → Email?' },
  { href: '/buzzword-generator', icon: PenLine,  label: 'Buzzwords ✍️' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white flex h-screen overflow-hidden">
        <aside className="w-[200px] flex-shrink-0 border-r border-[#222] flex flex-col">
          <div className="px-4 py-4 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-xs font-bold">M</div>
              <span className="text-sm font-semibold text-white">Mission Control</span>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-[#1a1a1a] hover:text-white ${
                  item.highlight ? 'text-purple-400 hover:text-purple-300' : 'text-[#888] hover:text-white'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-3 border-t border-[#222]">
            <div className="flex items-center gap-2 text-xs text-[#555]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              AI Online
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
