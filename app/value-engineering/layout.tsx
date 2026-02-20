'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FolderOpen, Wrench } from 'lucide-react';

const tabs = [
  { href: '/value-engineering', label: 'Overview', icon: Wrench },
  { href: '/value-engineering/prompt-toolkit', label: 'Prompt Toolkit', icon: BookOpen },
  { href: '/value-engineering/projects', label: 'Projects', icon: FolderOpen },
];

export default function VELayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="border-b border-[#222] bg-[#0a0a0a] px-6 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">Value Engineering</h1>
            <p className="text-xs text-[#555] mt-0.5">Frameworks, tools, and active projects</p>
          </div>
        </div>
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-t-lg transition-colors ${
                  active
                    ? 'bg-[#111] text-white border border-[#222] border-b-[#111] -mb-px'
                    : 'text-[#666] hover:text-[#999] hover:bg-[#111]/50'
                }`}>
                <tab.icon size={14} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
