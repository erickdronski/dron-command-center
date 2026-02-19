'use client';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  agent: string;
  priority: string;
  createdAt: string;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Add auto-deploy to Vercel on build success',
    description: 'After npm run build succeeds, automatically trigger vercel --prod to deploy to production. This would close the loop from coding → live in one step.',
    agent: 'Dron Builder',
    priority: 'High',
    createdAt: '2026-02-19T10:00:00Z',
  },
  {
    id: '2',
    title: 'Integrate real-time NOAA weather data for trading',
    description: 'Connect to NOAA API to pull forecast data every 15 minutes. Feed into the Polymarket temperature prediction model for higher accuracy.',
    agent: 'Trading Bot',
    priority: 'Medium',
    createdAt: '2026-02-19T09:30:00Z',
  },
  {
    id: '3',
    title: 'Publish YouTube short: "How AI runs my business"',
    description: 'Script is ready. Thumbnail generated. Requesting approval to finalize and schedule upload for Thursday 3PM for maximum reach.',
    agent: 'Content Agent',
    priority: 'Low',
    createdAt: '2026-02-18T15:00:00Z',
  },
];

const PRIORITY_STYLES: Record<string, string> = {
  High:   'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low:    'bg-green-500/20 text-green-400 border-green-500/30',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ApprovalsPage() {
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'rejected'>>({});

  const decide = (id: string, decision: 'approved' | 'rejected') => {
    setDecisions(prev => ({ ...prev, [id]: decision }));
  };

  const pending = MOCK_PROPOSALS.filter(p => !decisions[p.id]);
  const approved = MOCK_PROPOSALS.filter(p => decisions[p.id] === 'approved');
  const rejected = MOCK_PROPOSALS.filter(p => decisions[p.id] === 'rejected');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThumbsUp size={20} className="text-purple-400" />
          <h1 className="text-lg font-semibold">Approvals</h1>
          <span className="text-sm text-[#555]">AI proposals awaiting your decision</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{pending.length}</div>
            <div className="text-xs text-[#555]">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{approved.length}</div>
            <div className="text-xs text-[#555]">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{rejected.length}</div>
            <div className="text-xs text-[#555]">Rejected</div>
          </div>
        </div>
      </div>

      {/* Pending */}
      {pending.length === 0 ? (
        <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
          <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
          <div className="text-white font-medium mb-1">All caught up!</div>
          <div className="text-sm text-[#555]">No proposals pending your review</div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555]">Pending Review</h2>
          {pending.map((proposal) => (
            <div key={proposal.id} className="bg-[#111] border border-[#222] hover:border-[#333] rounded-lg p-5 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${PRIORITY_STYLES[proposal.priority]}`}>
                      {proposal.priority}
                    </span>
                    <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      {proposal.agent}
                    </span>
                    <span className="text-xs text-[#444]">{formatDate(proposal.createdAt)}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{proposal.title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{proposal.description}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => decide(proposal.id, 'approved')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm transition-colors"
                  >
                    <ThumbsUp size={14} />
                    Approve
                  </button>
                  <button
                    onClick={() => decide(proposal.id, 'rejected')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm transition-colors"
                  >
                    <ThumbsDown size={14} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decided */}
      {(approved.length > 0 || rejected.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555]">Decided</h2>
          {[...approved.map(p => ({ ...p, dec: 'approved' as const })), ...rejected.map(p => ({ ...p, dec: 'rejected' as const }))].map((p) => (
            <div key={p.id} className={`bg-[#111] border rounded-lg p-4 flex items-center gap-4 ${
              p.dec === 'approved' ? 'border-green-500/20' : 'border-red-500/20'
            }`}>
              {p.dec === 'approved'
                ? <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                : <XCircle size={18} className="text-red-400 flex-shrink-0" />
              }
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{p.title}</div>
                <div className="text-xs text-[#555]">{p.agent} · {formatDate(p.createdAt)}</div>
              </div>
              <span className={`text-xs font-semibold uppercase ${p.dec === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                {p.dec}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
