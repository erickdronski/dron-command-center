'use client';

import { useEffect, useState, useCallback } from 'react';
import { Brain, Search, Trash2, FileText, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

interface MemoryFile {
  name: string;
  path: string;
  size: number;
  modified: string;
  category: 'long-term' | 'daily' | 'identity' | 'config';
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  'long-term': { label: 'Long-Term', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  'identity': { label: 'Identity', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  'config': { label: 'Config', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  'daily': { label: 'Daily Log', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
};

const PROTECTED = ['SOUL.md', 'AGENTS.md', 'IDENTITY.md', 'USER.md', 'TOOLS.md', 'HEARTBEAT.md'];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/memory');
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch {
      setError('Failed to load memory files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Auto-select MEMORY.md on load
  useEffect(() => {
    if (files.length > 0 && !selected) {
      const memoryMd = files.find(f => f.path === 'MEMORY.md');
      if (memoryMd) openFile(memoryMd.path);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const openFile = async (filePath: string) => {
    setSelected(filePath);
    setContent('');
    setContentLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/memory?file=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      setContent(data.content ?? data.error ?? 'No content');
    } catch {
      setContent('Failed to load file content');
    } finally {
      setContentLoading(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    if (deleteConfirm !== filePath) {
      setDeleteConfirm(filePath);
      return;
    }
    setDeleteConfirm(null);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/memory?file=${encodeURIComponent(filePath)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error ?? 'Delete failed');
        return;
      }
      if (selected === filePath) {
        setSelected(null);
        setContent('');
      }
      fetchFiles();
    } catch {
      setDeleteError('Delete request failed');
    }
  };

  const isProtected = (f: MemoryFile) => PROTECTED.includes(f.name);
  const isDeletable = (f: MemoryFile) => !isProtected(f);

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const groups = filtered.reduce<Record<string, MemoryFile[]>>((acc, f) => {
    const cat = f.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {});
  const ORDER = ['long-term', 'identity', 'daily', 'config'];
  const sortedGroups = ORDER.filter(k => groups[k]);

  const selectedFile = files.find(f => f.path === selected);
  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="flex h-full bg-[#0a0a0a]">
      {/* Left panel — file list */}
      <div className="w-[260px] flex-shrink-0 border-r border-[#222] flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-4 border-b border-[#222]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-purple-400" />
              <span className="text-sm font-medium text-white">Memory</span>
            </div>
            <button
              onClick={fetchFiles}
              className="text-[#555] hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#444]" />
            <input
              type="text"
              placeholder="Filter files..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#151515] border border-[#222] rounded px-2 py-1.5 pl-7 text-xs text-white placeholder-[#444] outline-none focus:border-[#333]"
            />
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto py-2">
          {error && (
            <div className="px-4 py-2 text-xs text-red-400 flex items-center gap-1.5">
              <AlertCircle size={12} />
              {error}
            </div>
          )}
          {deleteError && (
            <div className="px-4 py-2 text-xs text-red-400 flex items-center gap-1.5">
              <AlertCircle size={12} />
              {deleteError}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-[#444]">No files found</div>
          )}

          {sortedGroups.map(cat => (
            <div key={cat} className="mb-4">
              <div className="px-4 py-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${CATEGORY_LABELS[cat]?.color}`}>
                  {CATEGORY_LABELS[cat]?.label}
                </span>
              </div>
              {groups[cat].map(file => (
                <div
                  key={file.path}
                  className={`group relative flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                    selected === file.path
                      ? 'bg-[#1a1a1a] text-white'
                      : 'text-[#888] hover:bg-[#151515] hover:text-white'
                  }`}
                  onClick={() => openFile(file.path)}
                >
                  <FileText size={13} className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate font-medium">{file.name}</p>
                    <p className="text-[10px] text-[#555] mt-0.5">
                      {formatSize(file.size)} · {formatDate(file.modified)}
                    </p>
                  </div>
                  {/* Delete button */}
                  {isDeletable(file) && (
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(file.path); }}
                      className={`opacity-0 group-hover:opacity-100 transition-all p-1 rounded shrink-0 ${
                        deleteConfirm === file.path
                          ? 'opacity-100 text-red-400 bg-red-400/20'
                          : 'text-[#555] hover:text-red-400 hover:bg-red-400/10'
                      }`}
                      title={deleteConfirm === file.path ? 'Click again to confirm delete' : 'Delete file'}
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                  {selected === file.path && (
                    <ChevronRight size={12} className="text-[#444] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#222] text-[10px] text-[#444]">
          {files.length} files
        </div>
      </div>

      {/* Right panel — content viewer */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {!selected && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Brain size={40} className="text-[#222] mx-auto mb-3" />
              <p className="text-[#444] text-sm">Select a file to read</p>
            </div>
          </div>
        )}

        {selected && (
          <>
            {/* Content header */}
            <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-white">{selectedFile?.name ?? selected}</h2>
                <p className="text-xs text-[#555] mt-0.5">
                  {selectedFile && `${formatSize(selectedFile.size)} · ${wordCount} words · Updated ${formatDate(selectedFile.modified)}`}
                </p>
              </div>
              {selectedFile && isDeletable(selectedFile) && (
                <button
                  onClick={() => handleDelete(selected)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-colors ${
                    deleteConfirm === selected
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-[#333] text-[#555] hover:border-red-500/50 hover:text-red-400'
                  }`}
                >
                  <Trash2 size={12} />
                  {deleteConfirm === selected ? 'Confirm delete' : 'Delete'}
                </button>
              )}
              {selectedFile && !isDeletable(selectedFile) && (
                <span className="text-[10px] text-[#444] border border-[#222] px-2 py-1 rounded">protected</span>
              )}
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto">
              {contentLoading ? (
                <div className="flex items-center gap-2 text-[#555] text-sm p-6">
                  <RefreshCw size={14} className="animate-spin" />
                  Loading...
                </div>
              ) : (
                <pre className="p-6 text-sm text-[#ccc] font-mono whitespace-pre-wrap leading-relaxed break-words">
                  {content}
                </pre>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
