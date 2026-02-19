// Discord channel activity feed
// This will be populated by OpenClaw message tool in production

export interface DiscordMessage {
  channelId: string;
  channelName: string;
  timestamp: string;
  content: string;
  type: 'trade' | 'post' | 'alert' | 'system';
}

// Channel IDs (from Discord setup)
export const CHANNELS = {
  POLYMARKET_TRADES: '1473394875826180096',
  WEATHER_TRADER: '1473535322271907840',
  X_POSTS: '1473823764848541836',
  X_ENGAGEMENT: '1473823783848030238',
  CRON_JOBS: '1473399326322458838',
  ERRORS: '1473824129249763459',
  DAILY_DIGEST: '1473823899816050719',
  ALERTS: '1473823701740720148',
};

// Mock activity for now - will be replaced with real Discord messages
export async function getDiscordActivity(limit: number = 20): Promise<DiscordMessage[]> {
  // TODO: Use OpenClaw message tool to read from Discord channels
  // For now, return mock data showing the structure

  const now = new Date();
  const activities: DiscordMessage[] = [];

  // In production, this will be:
  // const messages = await fetchDiscordMessages([
  //   CHANNELS.POLYMARKET_TRADES,
  //   CHANNELS.WEATHER_TRADER,
  //   CHANNELS.X_POSTS,
  //   CHANNELS.ALERTS,
  // ], limit);

  return activities.slice(0, limit);
}

// Parse different message types
export function parseMessageType(channelId: string, content: string): 'trade' | 'post' | 'alert' | 'system' {
  if (channelId === CHANNELS.POLYMARKET_TRADES || channelId === CHANNELS.WEATHER_TRADER) {
    return 'trade';
  }
  if (channelId === CHANNELS.X_POSTS || channelId === CHANNELS.X_ENGAGEMENT) {
    return 'post';
  }
  if (channelId === CHANNELS.ALERTS || channelId === CHANNELS.ERRORS) {
    return 'alert';
  }
  return 'system';
}
