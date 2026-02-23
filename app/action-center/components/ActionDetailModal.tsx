'use client';

import { XCircle, CheckCircle, Clock, AlertCircle, Loader2, CheckSquare } from 'lucide-react';
import { Action, actionTypes } from './ActionCenterContent';

interface Props {
  action: Action;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onCancel?: (id: string) => void;
}

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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFullDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function ActionDetailModal({ action, onClose, onApprove, onCancel }: Props) {
  const typeConfig = actionTypes.find(t => t.value === action.type);
  const status = statusConfig[action.status];
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {typeConfig && (
              <div className={`p-2 rounded-lg ${typeConfig.bg} ${typeConfig.border} border`}>
                <typeConfig.icon size={18} className={typeConfig.color} />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-white truncate max-w-md">{action.title}</h2>
              <div className={`flex items-center gap-1.5 text-xs ${status.color}`}>
                <StatusIcon size={12} className={status.animate ? 'animate-spin' : ''} />
                {status.label}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#555] hover:text-white transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[#555] uppercase tracking-wider">Type</div>
              <div className="text-sm text-white mt-1">{typeConfig?.label || action.type}</div>
            </div>
            
            <div>
              <div className="text-xs text-[#555] uppercase tracking-wider">Requester</div>
              <div className="text-sm text-white mt-1">{action.requester}</div>
            </div>
            
            <div>
              <div className="text-xs text-[#555] uppercase tracking-wider">Created</div>
              <div className="text-sm text-white mt-1">{formatFullDate(action.createdAt)}</div>
            </div>
            
            <div>
              <div className="text-xs text-[#555] uppercase tracking-wider">Agent</div>
              <div className="text-sm text-white mt-1">{action.agent || 'Unassigned'}</div>
            </div>
          </div>

          {/* Description */}
          {action.description && (
            <div>
              <div className="text-xs text-[#555] uppercase tracking-wider mb-2">Description</div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3 text-sm text-[#aaa] whitespace-pre-wrap">
                {action.description}
              </div>
            </div>
          )}

          {/* Result */}
          {action.result && (
            <div>
              <div className="text-xs text-[#555] uppercase tracking-wider mb-2">Result</div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-sm text-green-400 whitespace-pre-wrap">
                {action.result}
              </div>
            </div>
          )}

          {/* Activity Log */}
          {action.logs.length > 0 && (
            <div>
              <div className="text-xs text-[#555] uppercase tracking-wider mb-2">Activity Log</div>
              <div className="bg-[#0a0a0a] border border-[#222] rounded-lg overflow-hidden">
                {action.logs.map((log, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-3 py-2.5 text-xs ${i > 0 ? 'border-t border-[#1a1a1a]' : ''}`}
                  >
                    <div className="text-[#555] whitespace-nowrap text-[10px]">
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

        {/* Actions */}
        {action.status === 'pending_approval' && onApprove && onCancel && (
          <div className="px-6 py-4 border-t border-[#222] flex items-center justify-end gap-3">
            <button
              onClick={() => { onCancel(action.id); onClose(); }}
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { onApprove(action.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
