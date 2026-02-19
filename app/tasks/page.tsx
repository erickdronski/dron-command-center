'use client';
import { useEffect, useState } from 'react';
import { CheckSquare, Clock, RotateCcw } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: string;
  project: string;
  createdAt: string;
}

const COLUMNS = ['Recurring', 'Backlog', 'In Progress', 'Review', 'Done'] as const;

const COLUMN_STYLES: Record<string, { border: string; header: string; dot: string }> = {
  Recurring:    { border: 'border-violet-500/30', header: 'text-violet-400', dot: 'bg-violet-500' },
  Backlog:      { border: 'border-[#333]',        header: 'text-[#888]',     dot: 'bg-[#555]' },
  'In Progress':{ border: 'border-yellow-500/30', header: 'text-yellow-400', dot: 'bg-yellow-500' },
  Review:       { border: 'border-blue-500/30',   header: 'text-blue-400',   dot: 'bg-blue-500' },
  Done:         { border: 'border-green-500/30',  header: 'text-green-400',  dot: 'bg-green-500' },
};

const PROJECT_COLORS: Record<string, string> = {
  'Mission Control': 'bg-purple-500/20 text-purple-300',
  'Trading':         'bg-green-500/20 text-green-300',
  'Social':          'bg-pink-500/20 text-pink-300',
  'Content':         'bg-yellow-500/20 text-yellow-300',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks').then(r => r.json()).then(d => {
      setTasks(d.tasks || []);
      setLoading(false);
    });
  }, []);

  const byStatus = (status: string) => tasks.filter(t => t.status === status);
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#222] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare size={20} className="text-purple-400" />
            <h1 className="text-lg font-semibold">Tasks</h1>
          </div>
          {/* Stats bar */}
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{total}</div>
              <div className="text-xs text-[#555]">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">{inProgress}</div>
              <div className="text-xs text-[#555]">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{done}</div>
              <div className="text-xs text-[#555]">Done</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{pct}%</div>
              <div className="text-xs text-[#555]">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-[#555]">Loading tasks...</div>
        ) : (
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map((col) => {
              const style = COLUMN_STYLES[col];
              const colTasks = col === 'Recurring' ? [] : byStatus(col);
              return (
                <div key={col} className={`w-64 flex flex-col bg-[#0d0d0d] rounded-lg border ${style.border}`}>
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-3 py-3 border-b border-[#1a1a1a]">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${style.header}`}>{col}</span>
                    <span className="ml-auto text-xs text-[#555] bg-[#1a1a1a] px-1.5 py-0.5 rounded">
                      {col === 'Recurring' ? '3' : colTasks.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {col === 'Recurring' ? (
                      <>
                        {[
                          { title: 'Mission Control check', freq: 'Every 30 min', icon: '🔄' },
                          { title: 'AI trading scan', freq: 'Every hour', icon: '📊' },
                          { title: 'Morning brief', freq: 'Daily 8:00 AM', icon: '☀️' },
                        ].map((r, i) => (
                          <div key={i} className="bg-[#111] border border-[#1e1e1e] rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-base">{r.icon}</span>
                              <span className="text-xs font-medium text-white">{r.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-violet-400">
                              <RotateCcw size={10} />
                              {r.freq}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : colTasks.length === 0 ? (
                      <div className="flex items-center justify-center h-20 text-xs text-[#444]">Empty</div>
                    ) : (
                      colTasks.map((task) => (
                        <div key={task.id} className="bg-[#111] border border-[#1e1e1e] hover:border-[#333] rounded-lg p-3 transition-colors cursor-pointer">
                          <div className="text-sm font-medium text-white mb-1 leading-tight">{task.title}</div>
                          <div className="text-xs text-[#555] mb-3 leading-relaxed">{task.description}</div>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${PROJECT_COLORS[task.project] || 'bg-[#222] text-[#888]'}`}>
                              {task.project}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              task.assignee === 'AI' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {task.assignee}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-[#444]">
                            <Clock size={10} />
                            {formatDate(task.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
