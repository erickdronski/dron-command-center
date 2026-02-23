'use client';

import { useEffect, useState } from 'react';
import { FileText, ExternalLink, RefreshCw, Twitter } from 'lucide-react';

interface XPost {
  id: string;
  content: string;
  url: string;
  timestamp: string;
  category?: string;
  engagement?: {
    likes?: number;
    retweets?: number;
    replies?: number;
  };
}

export default function PostsPage() {
  const [posts, setPosts] = useState<XPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchPosts, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (cat?: string) => {
    switch (cat?.toLowerCase()) {
      case 'sports': return 'bg-orange-500/20 text-orange-400';
      case 'builder': return 'bg-green-500/20 text-green-400';
      case 'knowledge': return 'bg-blue-500/20 text-blue-400';
      case 'stoic': return 'bg-purple-500/20 text-purple-400';
      case 'humor': return 'bg-pink-500/20 text-pink-400';
      default: return 'bg-[#222] text-[#888]';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Twitter size={20} className="text-sky-400" />
          <div>
            <h1 className="text-xl font-semibold text-white">X Posts Archive</h1>
            <p className="text-xs text-[#555]">@DronskiErick content history</p>
          </div>
        </div>
        <button
          onClick={fetchPosts}
          className="flex items-center gap-2 text-xs text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#222] hover:border-[#444]"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Posts', value: posts.length },
          { label: 'This Week', value: posts.filter(p => {
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return new Date(p.timestamp) > weekAgo;
          }).length },
          { label: 'Today', value: posts.filter(p => {
            const today = new Date().toDateString();
            return new Date(p.timestamp).toDateString() === today;
          }).length },
          { label: 'Categories', value: new Set(posts.map(p => p.category).filter(Boolean)).size },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111] border border-[#222] rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-[#555] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Posts List */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
          Error loading posts: {error}
        </div>
      ) : loading && posts.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-[#555]">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-[#555]">No posts found</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-2">
                    {post.category && (
                      <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    )}
                    <span className="text-xs text-[#555]">{formatDate(post.timestamp)}</span>
                  </div>
                  
                  {/* Content */}
                  <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>

                  {/* Engagement */}
                  {post.engagement && (
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#555]">
                      {post.engagement.likes !== undefined && (
                        <span>♥ {post.engagement.likes}</span>
                      )}
                      {post.engagement.retweets !== undefined && (
                        <span>↻ {post.engagement.retweets}</span>
                      )}
                      {post.engagement.replies !== undefined && (
                        <span>💬 {post.engagement.replies}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Link */}
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 shrink-0"
                >
                  <ExternalLink size={12} />
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
