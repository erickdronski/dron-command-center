import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'public', 'data', 'x_posts.json');

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

// Default posts if file doesn't exist
const DEFAULT_POSTS: XPost[] = [
  {
    id: '1',
    content: "The hardest part of sports betting isn't picking winners.\n\nIt's:\n→ Managing bankroll\n→ Controlling emotion\n→ Staying disciplined\n\nMost people get the picks right. Then bet too much and blow up.\n\nMath is easy. Psychology is hard.",
    url: 'https://twitter.com/DronskiErick/status/2025979009046073765',
    timestamp: '2026-02-23T17:00:11Z',
    category: 'sports',
  },
  {
    id: '2',
    content: "The best part of building your own thing:\n\nNo meetings about meetings.\nNo politics.\nNo BS.\n\nJust build. Ship. Learn. Repeat.\n\nThat's worth the risk.",
    url: 'https://twitter.com/DronskiErick/status/2025968638948266072',
    timestamp: '2026-02-23T16:18:58Z',
    category: 'builder',
  },
];

async function readPosts(): Promise<XPost[]> {
  try {
    const content = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    // Return defaults if file doesn't exist
    return DEFAULT_POSTS;
  }
}

export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json({ posts: DEFAULT_POSTS });
  }
}

export async function POST(request: Request) {
  try {
    const post: XPost = await request.json();
    const posts = await readPosts();
    
    // Add new post at beginning
    posts.unshift(post);
    
    // Keep only last 100 posts
    const trimmed = posts.slice(0, 100);
    
    await fs.writeFile(POSTS_FILE, JSON.stringify(trimmed, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
