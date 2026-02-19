'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import ProposalCard from '../components/ProposalCard';

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

export default function CollaboratePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await fetch('/api/proposals');
      const data = await res.json();
      setProposals(data);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'start') => {
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        fetchProposals(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to update proposal:', error);
    }
  };

  const pending = proposals.filter(p => p.status === 'pending');
  const approved = proposals.filter(p => p.status === 'approved');
  const inProgress = proposals.filter(p => p.status === 'inProgress');
  const completed = proposals.filter(p => p.status === 'completed');
  const rejected = proposals.filter(p => p.status === 'rejected');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-mono animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-purple-400" />
              AI Workbench
            </h1>
            <p className="text-muted-foreground">
              Review proposed work, approve projects, and track AI development in real-time
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{pending.length}</div>
            <div className="text-xs text-muted-foreground">Awaiting Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{inProgress.length}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{completed.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>
      </div>

      {/* Pending Proposals - Top Priority */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            Proposed Work - Awaiting Your Approval
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Review these proposals from Dron. Approve to start building, reject to dismiss.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pending.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            ⚡ Currently Building
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inProgress.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {/* Approved (not started yet) */}
      {approved.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Approved - Ready to Start
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {approved.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Completed
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completed.map(proposal => (
              <div key={proposal.id} className="border border-green-500/30 bg-green-900/10 rounded-lg p-4 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">{proposal.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{proposal.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <details className="mb-8">
          <summary className="text-xl font-semibold mb-4 flex items-center gap-2 cursor-pointer">
            <XCircle className="w-5 h-5 text-red-500" />
            Rejected ({rejected.length})
          </summary>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {rejected.map(proposal => (
              <div key={proposal.id} className="border border-red-500/30 bg-red-900/10 rounded-lg p-4 opacity-40">
                <h3 className="font-semibold mb-1">{proposal.title}</h3>
                <p className="text-sm text-muted-foreground">{proposal.description}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Empty State */}
      {proposals.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No proposals yet</p>
          <p className="text-sm">Dron will propose new work as opportunities arise</p>
        </div>
      )}
    </div>
  );
}
