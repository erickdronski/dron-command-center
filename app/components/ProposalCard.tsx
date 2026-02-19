'use client';

import { Check, X, Play, Clock } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'inProgress' | 'completed';
  category: 'trading' | 'social' | 'infrastructure' | 'analytics';
  createdAt: string;
  reasoning: string;
}

interface ProposalCardProps {
  proposal: Proposal;
  onAction: (id: string, action: 'approve' | 'reject' | 'start') => void;
}

const priorityColors = {
  low: 'border-gray-600 bg-gray-900/20',
  medium: 'border-yellow-600 bg-yellow-900/20',
  high: 'border-orange-600 bg-orange-900/20',
  critical: 'border-red-600 bg-red-900/20',
};

const categoryIcons = {
  trading: '💰',
  social: '🐦',
  infrastructure: '⚙️',
  analytics: '📊',
};

export default function ProposalCard({ proposal, onAction }: ProposalCardProps) {
  const isPending = proposal.status === 'pending';
  const isApproved = proposal.status === 'approved';
  const isInProgress = proposal.status === 'inProgress';

  return (
    <div className={`border-2 rounded-lg p-4 ${priorityColors[proposal.priority]}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[proposal.category]}</span>
          <div>
            <h3 className="font-semibold">{proposal.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className={`px-2 py-0.5 rounded ${
                proposal.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                proposal.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                proposal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {proposal.priority.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {proposal.estimatedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span className={`text-xs px-2 py-1 rounded ${
          proposal.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
          proposal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
          proposal.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
          proposal.status === 'inProgress' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {proposal.status === 'inProgress' ? 'IN PROGRESS' : proposal.status.toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3">
        {proposal.description}
      </p>

      {/* Reasoning */}
      <div className="text-xs bg-secondary/50 rounded p-2 mb-3">
        <span className="font-semibold">Why: </span>
        {proposal.reasoning}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isPending && (
          <>
            <button
              onClick={() => onAction(proposal.id, 'approve')}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              Approve & Build
            </button>
            <button
              onClick={() => onAction(proposal.id, 'reject')}
              className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </>
        )}

        {isApproved && (
          <button
            onClick={() => onAction(proposal.id, 'start')}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Building Now
          </button>
        )}

        {isInProgress && (
          <div className="flex-1 text-center text-sm text-yellow-400 font-medium">
            ⚡ Dron is building this now...
          </div>
        )}
      </div>
    </div>
  );
}
