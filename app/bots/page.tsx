import Link from 'next/link';

const bots = [
  { href: '/goggins', title: 'Goggins Mode', emoji: '🔥', desc: 'Motivational David Goggins voice' },
  { href: '/parent-translator', title: 'Parent Translator', emoji: '👨‍👩‍👧', desc: 'Translate kid language to parent language' },
  { href: '/chair-finder', title: 'Chair Finder', emoji: '🪑', desc: 'Find the perfect office chair' },
  { href: '/caffeine', title: 'Caffeine Tracker', emoji: '☕', desc: 'Track your daily caffeine intake' },
  { href: '/meeting-analyzer', title: 'Mtg → Email?', emoji: '📧', desc: 'Should this meeting be an email?' },
  { href: '/buzzword-generator', title: 'Buzzword Generator', emoji: '✍️', desc: 'Corporate buzzword generator' },
  { href: '/wfh-judge', title: 'WFH Judge', emoji: '📹', desc: 'Judge your work from home setup' },
];

export default function BotsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Bots 🤖</h1>
        <p className="text-sm text-[#666] mt-1">Fun side projects and utility bots</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {bots.map((b) => (
          <Link key={b.href} href={b.href}
            className="bg-[#111] border border-[#222] rounded-xl p-5 hover:border-purple-500/30 hover:bg-[#141414] transition-all group">
            <div className="text-2xl mb-2">{b.emoji}</div>
            <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{b.title}</div>
            <div className="text-xs text-[#666] mt-1">{b.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
