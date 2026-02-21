import Link from 'next/link';
import { Github } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[#555] mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Link
          href="https://github.com/erickdronski/dron-command-center"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#222] hover:border-[#444]"
        >
          <Github size={14} />
          GitHub
        </Link>
      </div>
    </div>
  );
}
