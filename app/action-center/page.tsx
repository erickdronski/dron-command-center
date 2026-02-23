'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Play, CheckCircle, XCircle, Clock, RotateCcw, 
  Code, Rocket, Terminal, User, Plus, RefreshCw,
  AlertCircle, CheckSquare, Loader2
} from 'lucide-react';

interface Action {
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

const actionTypes = [
  { value: 'request_agent', label: 'Request Agent', icon: User, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { value: 'code_change', label: 'Code Change', icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { value: 'deploy', label: 'Deploy', icon: Rocket, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { value: 'rollback', label: 'Rollback', icon: RotateCcw, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { value: 'execute_task', label: 'Execute Task', icon: Terminal, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', animate: false },
  pending_approval: { label: 'Needs Approval', icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', animate: false },
  in_progress: { label: 'In Progress', icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10', animate: true },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', animate: false },
  failed: { label: 'Failed', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', animate: false },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', animate: false },
};

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActionCenterPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState('request_agent');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActions = useCallback(async () => {
    try {
      const res = await fetch('/api/actions');
      const data = await res.json();
      setActions(data.actions || []);
    } catch (err) {
      console.error('Failed to fetch actions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 5000);
    return () => clearInterval(interval);
  }, [fetchActions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActions();
    setRefreshing(false);
  };

  const handleCreateAction = async () => {
    if (!title.trim()) return;
    
    setCreating(true);
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          title: title.trim(),
          description: description.trim(),
          requester: 'Dron',
        }),
      });
      
      if (res.ok) {
        setTitle('');
        setDescription('');
        setShowModal(false);
        await fetchActions();
      }
    } catch (err) {
      console.error('Failed to create action:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleApprove = async (actionId: string) => {
    try {
      await fetch(`/api/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      await fetchActions();
    } catch (err) {
      console.error('Failed to approve action:', err);
    }
  };

  const handleCancel = async (actionId: string) => {
    try {
      await fetch(`/api/actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      await fetchActions();
    } catch (err) {
      console.error('Failed to cancel action:', err);
    }
  };

  const pendingActions = actions.filter(a => a.status === 'pending' || a.status === 'pending_approval');
  const inProgressActions = actions.filter(a => a.status === 'in_progress');
  const completedActions = actions.filter(a => ['completed', 'failed', 'cancelled'].includes(a.status));

  const selectedTypeConfig = actionTypes.find(t => t.value === selectedType) || actionTypes[0];

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Play className="text-purple-400" size={24} />
            Action Center
          </h1>
          <p className="text-sm text-[#555] mt-1">
            Request agent actions, deploy code, execute tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#888] hover:text-white transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Request Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: pendingActions.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'In Progress', value: inProgressActions.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Completed', value: completedActions.filter(a => a.status === 'completed').length, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Failed', value: completedActions.filter(a => a.status === 'failed').length, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} border border-[#222] rounded-lg p-4`}>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-[#555] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} />
            Pending ({pendingActions.length})
          </h2>
          <div className="space-y-3">
            {pendingActions.map(action => {
              const typeConfig = actionTypes.find(t => t.value === action.type) || actionTypes[0];
              const status = statusConfig[action.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <div
                  key={action.id}
                  onClick={() => setSelectedAction(action)}
                  className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] cursor-pointer transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${typeConfig.bg} ${typeConfig.border} border`}>
                      <typeConfig.icon size={16} className={typeConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{action.title}</div>
                      <div className="text-xs text-[#555] mt-1">{formatDate(action.createdAt)} {formatTime(action.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className={`flex items-center gap-1.5 text-xs ${status.color} ${status.bg} px-2 py-1 rounded`}>
                      <StatusIcon size={12} className={status.animate ? 'animate-spin' : ''} />
                      {status.label}
                    </div>
                    
                    {action.status === 'pending_approval' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCancel(action.id); }}
                          className="p-1.5 text-[#555] hover:text-red-400 transition-colors"
                        >
                          <XCircle size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApprove(action.id); }}
                          className="p-1.5 text-[#555] hover:text-green-400 transition-colors"
                        >
                          <CheckCircle size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {pendingActions.length === 0 && (
              <div className="text-center py-8 text-[#444] text-sm">No pending actions</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            In Progress ({inProgressActions.length})
          </h2>
          <div className="space-y-3">
            {inProgressActions.map(action => {
              const typeConfig = actionTypes.find(t => t.value === action.type) || actionTypes[0];
              
              return (
                <div
                  key={action.id}
                  onClick={() => setSelectedAction(action)}
                  className="bg-[#111] border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/50 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${typeConfig.bg} ${typeConfig.border} border`}>
                      <typeConfig.icon size={16} className={typeConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{action.title}</div>
                      <div className="text-xs text-[#555] mt-1">Agent: {action.agent || 'Waiting...'}</div>
                    </div>
                  </div>
                  
                  {action.logs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                      <div className="text-xs text-[#666] truncate">
                        {action.logs[action.logs.length - 1].message}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {inProgressActions.length === 0 && (
              <div className="text-center py-8 text-[#444] text-sm">No active tasks</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider flex items-center gap-2">
            <CheckSquare size={14} />
            History ({completedActions.length})
          </h2>
          <div className="space-y-3">
            {completedActions.slice(0, 10).map(action => {
              const typeConfig = actionTypes.find(t => t.value === action.type) || actionTypes[0];
              const status = statusConfig[action.status as keyof typeof statusConfig];
              
              return (
                <div
                  key={action.id}
                  onClick={() => setSelectedAction(action)}
                  className="bg-[#111] border border-[#222] rounded-lg p-3 hover:border-[#333] cursor-pointer transition-all opacity-70 hover:opacity-100"
                >
                  <div className="flex items-center gap-2">
                    <typeConfig.icon size={14} className={typeConfig.color} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{action.title}</div>
                    </div>
                    <div className={`text-xs ${status.color}`}>{status.label}</div>
                  </div>
                  {action.result && (
                    <div className="text-xs text-[#555] mt-1 truncate">{action.result}</div>
                  )}
                </div>
              );
            })}
            {completedActions.length === 0 && (
              <div className="text-center py-8 text-[#444] text-sm">No completed actions</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#222]">
              <h2 className="text-lg font-semibold text-white">Request Agent Action</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {actionTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                      selectedType === type.value
                        ? `${type.bg} ${type.border} ${type.color} border`
                        : 'border-[#222] text-[#888] hover:border-[#333]'
                    }`}
                  >
                    <type.icon size={16} />
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-xs text-[#555] uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Add user authentication"
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-xs text-[#555] uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you want the agent to do..."
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-[#222] flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-[#888] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAction}
                disabled={!title.trim() || creating}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {creating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Action
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const typeConfig = actionTypes.find(t => t.value === selectedAction.type) || actionTypes[0];
                  const status = statusConfig[selectedAction.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  
                  return (
                    <>
                      <div className={`p-2 rounded-lg ${typeConfig.bg} ${typeConfig.border} border`}>
                        <typeConfig.icon size={18} className={typeConfig.color} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">{selectedAction.title}</h2>
                        <div className={`flex items-center gap-1.5 text-xs ${status.color}`}>
                          <StatusIcon size={12} className={status.animate ? 'animate-spin' : ''} />
                          {status.label}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <button
                onClick={() => setSelectedAction(null)}
                className="p-2 text-[#555] hover:text-white transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider">Type</div>
                  <div className="text-sm text-white mt-1">{actionTypes.find(t => t.value === selectedAction.type)?.label}</div>
                </div>
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider">Requester</div>
                  <div className="text-sm text-white mt-1">{selectedAction.requester}</div>
                </div>
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider">Created</div>
                  <div className="text-sm text-white mt-1">{formatDate(selectedAction.createdAt)} {formatTime(selectedAction.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider">Agent</div>
                  <div className="text-sm text-white mt-1">{selectedAction.agent || 'Unassigned'}</div>
                </div>
              </div>
              
              {selectedAction.description && (
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider mb-2">Description</div>
                  <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-sm text-[#aaa]">
                    {selectedAction.description}
                  </div>
                </div>
              )}
              
              {selectedAction.result && (
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider mb-2">Result</div>
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-sm text-green-400">
                    {selectedAction.result}
                  </div>
                </div>
              )}
              
              {selectedAction.logs.length > 0 && (
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider mb-2">Activity Log</div>
                  <div className="bg-[#0a0a0a] border border-[#222] rounded-lg overflow-hidden">
                    {selectedAction.logs.map((log, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 px-3 py-2 text-xs ${i > 0 ? 'border-t border-[#1a1a1a]' : ''}`}
                      >
                        <div className="text-[#555] whitespace-nowrap">
                          {formatTime(log.time)}
                        </div>
                        <div className={`flex-1 ${
                          log.level === 'error' ? 'text-red-400' :
                          log.level === 'success' ? 'text-green-400' :
                          log.level === 'warning' ? 'text-yellow-400' :
                          'text-[#888]'
                        }`}>
                          {log.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {selectedAction.status === 'pending_approval' && (
              <div className="px-6 py-4 border-t border-[#222] flex items-center justify-end gap-3">
                <button
                  onClick={() => { handleCancel(selectedAction.id); setSelectedAction(null); }}
                  className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleApprove(selectedAction.id); setSelectedAction(null); }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
