"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Bell, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  showGitHub?: boolean;
  githubUrl?: string;
  showDeploy?: boolean;
  deployUrl?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  children,
  actions,
  showGitHub = true,
  githubUrl = "https://github.com/erickdronski/dron-command-center",
  showDeploy = true,
  deployUrl = "https://dron-command-center.vercel.app"
}: PageHeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has a preference stored
    const stored = localStorage.getItem("theme");
    if (stored) {
      setIsDark(stored === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    // In a real implementation, you'd apply the theme to the document
    // document.documentElement.classList.toggle("dark", newTheme);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-[#555] mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {children}
        </div>
        {subtitle && (
          <p className="text-sm text-[#555] mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {showGitHub && (
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#222] hover:border-[#444]"
          >
            <Github size={14} />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        )}
        
        {showDeploy && (
          <Link
            href={deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#222] hover:border-[#444]"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Live</span>
          </Link>
        )}
        
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded border border-[#222] hover:border-[#444] text-[#666] hover:text-white transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        {actions}
      </div>
    </div>
  );
}

export function BrandedHeader() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-[#222] bg-[#0a0a0a]">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <div>
        <h1 className="text-lg font-bold text-white leading-tight">Mission Control</h1>
        <p className="text-[10px] text-[#555] uppercase tracking-wider">Dron Command Center</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="flex items-center justify-center w-8 h-8 rounded border border-[#222] hover:border-[#444] text-[#666] hover:text-white transition-colors">
          <Bell size={14} />
        </button>
      </div>
    </div>
  );
}
