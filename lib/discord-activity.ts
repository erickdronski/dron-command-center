// Real Discord Activity Feed - Pull actual messages from channels
import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE_PATH = path.join(process.cwd(), '..');

export interface DiscordActivity {
  timestamp: string;
  channel: string;
  channelId: string;
  message: string;
  type: 'trade' | 'post' | 'alert' | 'system' | 'engagement';
  icon: string;
}

// Channel mappings
const CHANNELS = {
  POLYMARKET: { id: '1473394875826180096', name: '#polymarket-trades', icon: '💸', type: 'trade' as const },
  WEATHER: { id: '1473535322271907840', name: '#weather-trader', icon: '🌦️', type: 'trade' as const },
  X_POSTS: { id: '1473823764848541836', name: '#x-posts', icon: '🐦', type: 'post' as const },
  X_ENGAGE: { id: '1473823783848030238', name: '#x-engagement', icon: '💬', type: 'engagement' as const },
  ALERTS: { id: '1473823701740720148', name: '#alerts', icon: '🚨', type: 'alert' as const },
};

// This will be called by OpenClaw message tool to fetch real messages
export async function getDiscordActivity(limit: number = 20): Promise<DiscordActivity[]> {
  // TODO: Use OpenClaw message tool to read from Discord channels
  // For now, return structure showing what we'll display
  
  const activities: DiscordActivity[] = [];
  
  // We'll populate this with real messages using the message tool
  // Example: const messages = await fetchDiscordMessages([CHANNELS.POLYMARKET.id, ...])
  
  return activities;
}

// Parse message content to extract key info
export function parseActivityMessage(content: string, channelId: string): {
  summary: string;
  type: DiscordActivity['type'];
  icon: string;
} {
  const channel = Object.values(CHANNELS).find(c => c.id === channelId);
  
  if (!channel) {
    return { summary: content.slice(0, 100), type: 'system', icon: '📋' };
  }
  
  // Extract key info based on channel type
  if (channel.type === 'trade') {
    // Parse trading messages: "BTC-UP: OPEN $2.00 @ 52.3%"
    const match = content.match(/(BTC|ETH|SOL)[-\s]?(UP|DOWN)?.*?(\$[\d.]+|OPEN|CLOSE)/i);
    if (match) {
      return {
        summary: content.split('\n')[0].slice(0, 80),
        type: 'trade',
        icon: channel.icon,
      };
    }
  }
  
  if (channel.type === 'post') {
    // Parse X posts: "Posted [time]: [tweet content]"
    const match = content.match(/Posted.*?:\s*(.+)/);
    if (match) {
      return {
        summary: match[1].slice(0, 80),
        type: 'post',
        icon: channel.icon,
      };
    }
  }
  
  return {
    summary: content.slice(0, 100),
    type: channel.type,
    icon: channel.icon,
  };
}
