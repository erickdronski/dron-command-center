import { Suspense } from 'react';
import { Metadata } from 'next';
import { ActionCenterContent } from './components/ActionCenterContent';
import { ActionCenterSkeleton } from './components/ActionCenterSkeleton';

export const metadata: Metadata = {
  title: 'Action Center | Mission Control',
  description: 'Request agent actions, deploy code, execute tasks — all in one place',
};

// Force dynamic to ensure fresh data on each load
export const dynamic = 'force-dynamic';

export default function ActionCenterPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <Suspense fallback={<ActionCenterSkeleton />}>
        <ActionCenterContent />
      </Suspense>
    </div>
  );
}
