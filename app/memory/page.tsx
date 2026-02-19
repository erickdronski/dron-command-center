'use client';
import { useEffect, useState } from 'react';
import { Brain, Search, FileText, ChevronRight } from 'lucide-react';

interface MemoryFile {
  name: string;
  path: string;
  size: number;
  modified: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    fetch('/api/memory')
      .then(r => r.json())
      .then(d => {
        setFiles(d.files || []);
        setLoading(false);
        // Load MEMORY.md by default
        const def = (d.files || []).find((f: MemoryFile) => f.name === 'MEMORY.md');
        if (def) loadFile(def.path);
      });
  }, []);

  const loadFile = (filePath: string) => {
    setSelected(filePath);
    setContentLoading(true);
    fetch(`/api/memory?file=${encodeURIComponent(filePath)}`)
      .then(r => r.json())
      .then(d => {
        setContent(d.content || d.error || '');
        setContentLoading(false);
      });
  };

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      <div className="w-[260px] flex-shrink-0 border-r border-[#222] flex flex-col">
        {/* Header */}
        <div className="px-4 py-4 border-b border-[#222] flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-purple-400" />
            <span className="text-sm font-semibold">Memory</span>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-2.5 text-[#444]" />
            <input
              type="text"
              placeholder="Filter files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111] border border-[#222] rounded text-xs text-[#888] pl-8 pr-3 py-2 focus:outline-none focus:border-purple-500/50 placeholder-[#444]"
            />
          </div>
        </div>
        {/* File list */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="px-4 py-6 text-xs text-[#444]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-6 text-xs text-[#444]">No files found</div>
          ) : (
            filtered.map((file) => (
              <button
                key={file.path}
                onClick={() => loadFile(file.path)}
                className={`w-full text-left px-4 py-3 flex items-start gap-2 hover:bg-[#1a1a1a] transition-colors border-b border-[#111] ${
                  selected === file.path ? 'bg-[#1a1a1a] border-l-2 border-l-purple-500' : ''
                }`}
              >
                <FileText size={12} className="text-[#555] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{file.name}</div>
                  <div className="text-xs text-[#444] mt-0.5">{formatSize(file.size)} · {formatDate(file.modified)}</div>
                </div>
                {selected === file.path && <ChevronRight size={12} className="text-purple-400 flex-shrink-0 mt-0.5" />}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Content header */}
        <div className="px-6 py-3 border-b border-[#222] flex-shrink-0 flex items-center gap-2">
          <span className="text-xs text-[#555]">
            {selected ? selected : 'Select a file'}
          </span>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {contentLoading ? (
            <div className="text-xs text-[#444]">Loading...</div>
          ) : !selected ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#444]">
              <Brain size={32} className="mb-3 opacity-30" />
              <div className="text-sm">Select a file to read</div>
            </div>
          ) : (
            <pre className="text-xs text-[#aaa] font-mono whitespace-pre-wrap leading-relaxed break-words">
              {content}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
