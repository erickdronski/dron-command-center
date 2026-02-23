import { NextResponse } from 'next/server';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const X_POSTS_CHANNEL_ID = '1473394891290841223';

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

function extractCategory(content: string): string | undefined {
  // Look for category indicators in Discord bot format
  const match = content.match(/\|\s*(\w+)\s*\|/);
  if (match) return match[1].toLowerCase();
  
  // Infer from content
  if (content.includes('sports') || content.includes('betting') || content.includes('odds')) return 'sports';
  if (content.includes('build') || content.includes('ship') || content.includes('product')) return 'builder';
  if (content.includes('learn') || content.includes('MBA') || content.includes('framework')) return 'knowledge';
  if (content.includes('stoic') || content.includes('discipline') || content.includes('mindset')) return 'stoic';
  if (content.includes('humor') || content.includes('joke') || content.includes('funny')) return 'humor';
  
  return undefined;
}

function parseDiscordMessage(message: any): XPost | null {
  const content = message.content || '';
  
  // Check if this is a content post (has the 📝 CONTENT marker or X embed)
  const isContentPost = content.includes('📝 CONTENT') || 
                        message.embeds?.some((e: any) => e.footer?.text === 'X');
  
  if (!isContentPost) return null;
  
  // Extract tweet URL from embed or content
  let url = '';
  let tweetContent = '';
  
  const xEmbed = message.embeds?.find((e: any) => e.footer?.text === 'X');
  if (xEmbed) {
    url = xEmbed.url || '';
    tweetContent = xEmbed.description || content;
  } else {
    // Extract URL from content
    const urlMatch = content.match(/https?:\/\/twitter\.com\/[^\s]+/);
    url = urlMatch?.[0] || '';
    // Remove the URL and metadata lines from content
    tweetContent = content
      .replace(/\*\*📝 CONTENT\*\*[^\n]*\n/, '')
      .replace(/\[View Tweet\]\([^)]+\)/, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .trim();
  }
  
  if (!url) return null;
  
  return {
    id: message.id,
    content: tweetContent,
    url,
    timestamp: message.timestamp,
    category: extractCategory(content),
  };
}

export async function GET() {
  try {
    // Fetch messages from Discord X Posts channel
    const response = await fetch(
      `https://discord.com/api/v10/channels/${X_POSTS_CHANNEL_ID}/messages?limit=50`,
      {
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    const messages = await response.json();
    
    // Parse messages into X posts
    const posts: XPost[] = messages
      .map(parseDiscordMessage)
      .filter((p: XPost | null): p is XPost => p !== null)
      .sort((a: XPost, b: XPost) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return empty array on error (don't break the UI)
    return NextResponse.json({ posts: [], error: String(error) });
  }
}
