import Link from 'next/link';
import { PageHeader } from '../components/PageHeader';
import { Rocket, CheckCircle2, XCircle, Clock, RotateCcw, ExternalLink } from 'lucide-react';

// Static deployment data (will be dynamic later)
const deployments = [
  { id: '1', commit: '52372ef', message: 'Restructure VE into tabbed layout', branch: 'main', status: 'success', time: '2h ago' },
  { id: '2', commit: 'd756127', message: 'Kalshi analytics reads real trade data', branch: 'main', status: 'success', time: '5h ago' },
];

export default function DeploymentsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Deployments"
        subtitle="Build history and rollback management"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{deployments.length}</div>
          <div className="text-xs text-[#555] mt-1">Total Deployments</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">100%</div>
          <div className="text-xs text-[#555] mt-1">Success Rate</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{deployments.filter(d => d.status === 'success').length}</div>
          <div className="text-xs text-[#555] mt-1">Successful</div>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">0</div>
          <div className="text-xs text-[#555] mt-1">Failed</div>
        </div>
      </div>

      {/* Deployments List */}
      <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
        <div className="divide-y divide-[#1a1a1a]">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="p-4 hover:bg-[#151515] transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {deployment.status === 'success' ? (
                    <CheckCircle2 size={18} className="text-green-400" />
                  ) : (
                    <XCircle size={18} className="text-red-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-[#666]">{deployment.commit}</span>
                    <span className="text-xs text-[#555]">on</span>
                    <span className="text-xs text-purple-400">{deployment.branch}</span>
                    <span className="text-xs text-[#444] ml-auto">{deployment.time}</span>
                  </div>
                  <p className="text-sm text-white">{deployment.message}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`https://github.com/erickdronski/dron-command-center/commit/${deployment.commit}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#666] hover:text-purple-400 transition-colors px-2 py-1 rounded border border-[#222]"
                  >
                    <ExternalLink size={12} />
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
