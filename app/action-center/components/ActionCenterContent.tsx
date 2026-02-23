'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  Play, CheckCircle, XCircle, Clock, RotateCcw, 
  Code, Rocket, Terminal, User, Plus, RefreshCw,
  AlertCircle, CheckSquare, Loader2, Zap
} from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { CreateActionModal } from './CreateActionModal';
import { ActionDetailModal } from './ActionDetailModal';
import { ActionCard } from './ActionCard';
// StatusBadge removed — unused

// Types
export interface Action {
  id: string;
  type: 'code_change' | 'deploy' | 'rollback' | 'execute_task' | 'request_agent';
  title: string;
  description: string;
  status: 'pending' | 'pending_approval' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  requester: string;
  agent: string | null;
  result: string | null;
  logs: Array<{ time: string; level: 'info' | 'success' | 'warning' | 'error'; message: string }>;
}

export const actionTypes = [
  { value: 'request_agent', label: 'Request Agent', icon: User, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', description: 'Get AI assistance on any task' },
  { value: 'code_change', label: 'Code Change', icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', description: 'Implement features or fixes' },
  { value: 'deploy', label: 'Deploy', icon: Rocket, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', description: 'Push to production (requires approval)' },
  { value: 'rollback', label: 'Rollback', icon: RotateCcw, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', description: 'Revert to previous version' },
  { value: 'execute_task', label: 'Execute Task', icon: Terminal, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', description: 'Run scripts or commands' },
] as const;

// Data fetching with error handling
async function fetchActions(): Promise<Action[]> {
  const res = await fetch('/api/actions', { 
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  return data.actions || [];
}

async function updateActionStatus(actionId: string, status: string): Promise<void> {
  const res = await fetch(`/api/actions/${actionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update: ${res.status} ${res.statusText}`);
  }
}

export function ActionCenterContent() {
  const [actions, setActions] = useState<Action[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // Optimistic UI updates
  const [optimisticActions, setOptimisticActions] = useState<Action[]>([]);

  const loadActions = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchActions();
      setActions(data);
      setOptimisticActions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load actions');
      console.error('Failed to fetch actions:', err);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    loadActions();
    const interval = setInterval(loadActions, 5000);
    return () => clearInterval(interval);
  }, [loadActions]);

  // Optimistic update handlers
  const handleApprove = async (actionId: string) => {
    // Optimistic update
    setOptimisticActions(prev => 
      prev.map(a => a.id === actionId ? { ...a, status: 'in_progress' } : a)
    );
    
    startTransition(async () => {
      try {
        await updateActionStatus(actionId, 'in_progress');
        await loadActions();
      } catch (err) {
        // Rollback on error
        setOptimisticActions(actions);
        console.error('Failed to approve:', err);
      }
    });
  };

  const handleCancel = async (actionId: string) => {
    setOptimisticActions(prev => 
      prev.map(a => a.id === actionId ? { ...a, status: 'cancelled' } : a)
    );
    
    startTransition(async () => {
      try {
        await updateActionStatus(actionId, 'cancelled');
        await loadActions();
      } catch (err) {
        setOptimisticActions(actions);
        console.error('Failed to cancel:', err);
      }
    });
  };

  const handleActionCreated = () => {
    loadActions();
    setShowModal(false);
  };

  // Group actions by status
  const pendingActions = optimisticActions.filter(a => a.status === 'pending' || a.status === 'pending_approval');
  const inProgressActions = optimisticActions.filter(a => a.status === 'in_progress');
  const completedActions = optimisticActions.filter(a => ['completed', 'failed', 'cancelled'].includes(a.status));

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={20} />
            <span className="font-medium">Failed to load actions</span>
          </div>
          <p className="text-sm text-red-300 mt-2">{error}</p>
        </div>
        <button
          onClick={loadActions}
          className="flex items-center gap-2 px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Play className="text-purple-400" size={24} />
              Action Center
            </h1>
            <p className="text-sm text-[#555] mt-1">
              Request agent actions, deploy code, execute tasks — all in one place
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={loadActions}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#888] hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isPending ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-purple-500/20"
            >
              <Plus size={16} />
              Request Agent
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Pending', value: pendingActions.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
            { label: 'In Progress', value: inProgressActions.length, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Loader2 },
            { label: 'Completed', value: completedActions.filter(a => a.status === 'completed').length, color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle },
            { label: 'Failed', value: completedActions.filter(a => a.status === 'failed').length, color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors`}>
              <div className="flex items-center gap-2">
                <stat.icon size={16} className={stat.color} />
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
              <div className="text-xs text-[#555] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-3 gap-6">
          {/* Pending Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} />
                Pending
              </h2>
              <span className="text-xs text-[#555] bg-[#1a1a1a] px-2 py-1 rounded">{pendingActions.length}</span>
            </div>
            
            <div className="space-y-3 min-h-[100px]">
              {pendingActions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onClick={() => setSelectedAction(action)}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  isPending={isPending}
                />
              ))}
              {pendingActions.length === 0 && (
                <div className="text-center py-8 text-[#444] text-sm border border-dashed border-[#222] rounded-lg">
                  No pending actions
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                In Progress
              </h2>
              <span className="text-xs text-[#555] bg-[#1a1a1a] px-2 py-1 rounded">{inProgressActions.length}</span>
            </div>
            
            <div className="space-y-3 min-h-[100px]">
              {inProgressActions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onClick={() => setSelectedAction(action)}
                  isPending={isPending}
                  highlighted
                />
              ))}
              {inProgressActions.length === 0 && (
                <div className="text-center py-8 text-[#444] text-sm border border-dashed border-[#222] rounded-lg">
                  No active tasks
                </div>
              )}
            </div>
          </div>

          {/* History Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider flex items-center gap-2">
                <CheckSquare size={14} />
                History
              </h2>
              <span className="text-xs text-[#555] bg-[#1a1a1a] px-2 py-1 rounded">{completedActions.length}</span>
            </div>
            
            <div className="space-y-3 min-h-[100px]">
              {completedActions.slice(0, 10).map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onClick={() => setSelectedAction(action)}
                  compact
                />
              ))}
              {completedActions.length === 0 && (
                <div className="text-center py-8 text-[#444] text-sm border border-dashed border-[#222] rounded-lg">
                  No completed actions
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showModal && (
          <CreateActionModal
            onClose={() => setShowModal(false)}
            onCreated={handleActionCreated}
          />
        )}

        {selectedAction && (
          <ActionDetailModal
            action={selectedAction}
            onClose={() => setSelectedAction(null)}
            onApprove={handleApprove}
            onCancel={handleCancel}
          />
        )}
      </>
    </ErrorBoundary>
  );
}
