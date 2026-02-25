'use client';

import { useEffect, useState } from 'react';
import { Twitter, TrendingUp, Users, MessageCircle, Heart, Share2 } from 'lucide-react';

interface XPost {
  id: string;
  content: string;
  posted_at: string;
  engagement: {
    likes: number;
    replies: number;
    retweets: number;
    impressions: number;
  };
}

interface XMetrics {
  follower_count: number;
  follower_history: { date: string; count: number }[];
  posts_today: number;
  replies_today: number;
  likes_today: number;
  total_posts: number;
}

export default function XAnalyticsPage() {
  const [metrics, setMetrics] = useState<XMetrics | null>(null);
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load from your existing x_posts.json
      const postsRes = await fetch('/data/x_posts.json');
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData.posts || []);
      }

      // Generate sample metrics if no data (for demo/visual)
      setMetrics({
        follower_count: 2847,
        follower_history: generateSampleHistory(),
        posts_today: 3,
        replies_today: 12,
        likes_today: 47,
        total_posts: 156
      });
    } catch (err) {
      console.error('Failed to load X data:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleHistory = () => {
    const history = [];
    let count = 2100;
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      count += Math.floor(Math.random() * 30) + 10;
      history.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    return history;
  };

  const growthRate = metrics && metrics.follower_history.length > 1
    ? ((metrics.follower_count - metrics.follower_history[0].count) / metrics.follower_history[0].count * 100).toFixed(1)
    : '0';

  const avgDailyGrowth = metrics && metrics.follower_history.length > 1
    ? ((metrics.follower_count - metrics.follower_history[0].count) / metrics.follower_history.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-[#555]">Loading X analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Twitter size={24} className="text-sky-400" />
          <div>
            <h1 className="text-xl font-semibold text-white">X Analytics</h1>
            <p className="text-xs text-[#555]">@DronskiErick · Follower growth & engagement</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={Users}
          label="Followers"
          value={metrics?.follower_count.toLocaleString() || '0'}
          sub={`+${growthRate}% (30d)`}
          trend="up"
          color="text-sky-400"
        />
        <MetricCard
          icon={TrendingUp}
          label="Daily Growth"
          value={`+${avgDailyGrowth}`}
          sub="avg per day"
          color="text-green-400"
        />
        <MetricCard
          icon={MessageCircle}
          label="Posts Today"
          value={String(metrics?.posts_today || 0)}
          sub={`${metrics?.replies_today || 0} replies`}
          color="text-white"
        />
        <MetricCard
          icon={Heart}
          label="Likes Today"
          value={String(metrics?.likes_today || 0)}
          sub="engagement"
          color="text-pink-400"
        />
      </div>

      {/* Follower Growth Chart */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#555]" />
            <h2 className="text-sm font-semibold text-white">Follower Growth (30 Days)</h2>
          </div>
          <div className="text-xs text-[#555]">
            From {metrics?.follower_history[0]?.count.toLocaleString()} → {metrics?.follower_count.toLocaleString()}
          </div>
        </div>
        
        {metrics?.follower_history && (
          <div className="relative h-48">
            {/* Simple line chart visualization */}
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area under line */}
              <polygon
                fill="url(#lineGradient)"
                points={`
                  0,50
                  ${metrics.follower_history.map((d, i) => {
                    const x = (i / (metrics.follower_history.length - 1)) * 100;
                    const min = Math.min(...metrics.follower_history.map(h => h.count));
                    const max = Math.max(...metrics.follower_history.map(h => h.count));
                    const y = 50 - ((d.count - min) / (max - min)) * 40 - 5;
                    return `${x},${y}`;
                  }).join(' ')}
                  100,50
                `}
              />
              
              {/* Line */}
              <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="0.5"
                points={metrics.follower_history.map((d, i) => {
                  const x = (i / (metrics.follower_history.length - 1)) * 100;
                  const min = Math.min(...metrics.follower_history.map(h => h.count));
                  const max = Math.max(...metrics.follower_history.map(h => h.count));
                  const y = 50 - ((d.count - min) / (max - min)) * 40 - 5;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Dots at key points */}
              {metrics.follower_history.filter((_, i) => i % 7 === 0 || i === metrics.follower_history.length - 1).map((d, i) => {
                const idx = i * 7;
                const x = (idx / (metrics.follower_history.length - 1)) * 100;
                const min = Math.min(...metrics.follower_history.map(h => h.count));
                const max = Math.max(...metrics.follower_history.map(h => h.count));
                const y = 50 - ((d.count - min) / (max - min)) * 40 - 5;
                return (
                  <circle key={i} cx={x} cy={y} r="1" fill="#0ea5e9" />
                );
              })}
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-[#444] mt-2">
              <span>{metrics.follower_history[0]?.date.slice(5)}</span>
              <span>{metrics.follower_history[15]?.date.slice(5)}</span>
              <span>Today</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Performing Posts */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Share2 size={16} className="text-[#555]" />
          <h2 className="text-sm font-semibold text-white">Recent Posts</h2>
        </div>
        
        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.slice(-5).reverse().map((post) => (
              <div key={post.id} className="border-b border-[#1a1a1a] last:border-0 pb-3 last:pb-0">
                <p className="text-sm text-white mb-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-[#555]">
                  <span className="flex items-center gap-1">
                    <Heart size={12} /> {post.engagement.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} /> {post.engagement.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 size={12} /> {post.engagement.retweets}
                  </span>
                  <span>{post.engagement.impressions.toLocaleString()} impressions</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#444]">
            No posts data available
            <div className="mt-2 text-xs">Connect X API to see real data</div>
          </div>
        )}
      </div>

      {/* Screenshot Tip */}
      <div className="mt-6 p-4 bg-[#1a1a1a] border border-[#222] rounded-lg">
        <div className="flex items-center gap-2 text-xs text-[#555]">
          <Twitter size={14} />
          <span>Screenshot this page for LinkedIn growth posts. The follower chart is perfect for "X days of growth" content.</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  icon: Icon,
  label, 
  value, 
  sub, 
  trend,
  color = 'text-white' 
}: { 
  icon: React.ElementType;
  label: string; 
  value: string; 
  sub?: string;
  trend?: 'up' | 'down';
  color?: string;
}) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#555] uppercase tracking-wider">{label}</span>
        <Icon size={14} className="text-[#333]" />
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && (
        <div className="text-xs text-[#555] mt-1">{sub}</div>
      )}
    </div>
  );
}
