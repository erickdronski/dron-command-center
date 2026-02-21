'use client';

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function HealthIndicator({ status }: { status: 'up' | 'down' | 'slow' }) {
  const colors = {
    up: 'bg-green-500',
    down: 'bg-red-500',
    slow: 'bg-yellow-500',
  };

  return <div className={`w-2 h-2 ${colors[status]} rounded-full animate-pulse`} />;
}

export function StatusBadge({ status }: { status: 'success' | 'error' | 'pending' }) {
  const config = {
    success: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle2 },
    error: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle },
    pending: { color: 'text-[#555]', bg: 'bg-[#1a1a1a]', border: 'border-[#333]', icon: AlertCircle },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${c.color} ${c.bg} ${c.border} border`}>
      <Icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
