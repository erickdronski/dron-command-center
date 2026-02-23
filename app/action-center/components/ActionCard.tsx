'use client';

import { Clock, Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Action, actionTypes } from './ActionCenterContent';

interface Props {
  action: Action;
  onClick: () => void;
  onApprove?: (id: string) => void;
  onCancel?: (id: string) => void;
  isPending?: boolean;
  highlighted?: boolean;
  compact?: boolean;
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ActionCard({ 
  action, 
  onClick, 
  onApprove, 
  onCancel, 
  isPending = false,
  highlighted = false,
  compact = false 
}: Props) {
  const typeConfig = actionTypes.find(t => t.value === action.type);
  const status = statusConfig[action.status];
  const StatusIcon = status.icon;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="bg-[#111] border border-[#222] rounded-lg p-3 hover:border-[#333] cursor-pointer transition-all opacity-70 hover:opacity-100"
      >
        <div className="flex items-center gap-2">
          {typeConfig && <typeConfig.icon size={14} className={typeConfig.color} />}
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
  }

  return (
    <div
      onClick={onClick}
      className={`bg-[#111] border rounded-lg p-4 cursor-pointer transition-all group ${
        highlighted 
          ? 'border-blue-500/30 hover:border-blue-500/50' 
          : 'border-[#222] hover:border-[#333]'
      }`}
    >
      <div className="flex items-start gap-3">
        {typeConfig && (
          <div className={`p-2 rounded-lg ${typeConfig.bg} ${typeConfig.border} border flex-shrink-0`}>
            <typeConfig.icon size={16} className={typeConfig.color} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">{action.title}</div>
          <div className="text-xs text-[#555] mt-1">
            {formatDate(action.createdAt)} {formatTime(action.createdAt)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className={`flex items-center gap-1.5 text-xs ${status.color} ${status.bg} px-2 py-1 rounded`}>
          <StatusIcon size={12} className={status.animate ? 'animate-spin' : ''} />
          {status.label}
        </div>

        {action.status === 'pending_approval' && onApprove && onCancel && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(action.id); }}
              disabled={isPending}
              className="p-1.5 text-[#555] hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <XCircle size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onApprove(action.id); }}
              disabled={isPending}
              className="p-1.5 text-[#555] hover:text-green-400 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={14} />
            </button>
          </div>
        )}
      </div>

      {action.logs.length > 0 && highlighted && (
        <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
          <div className="text-xs text-[#666] truncate">
            {action.logs[action.logs.length - 1].message}
          </div>
        </div>
      )}
    </div>
  );
}
