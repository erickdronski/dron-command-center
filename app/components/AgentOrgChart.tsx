'use client';

import { useState } from 'react';
import { Zap, TrendingUp, Users, Code, Bell, CheckCircle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'building' | 'error';
  category: 'orchestrator' | 'trading' | 'social' | 'infrastructure';
  icon: any;
  color: string;
  lastAction?: string;
}

const agents: Agent[] = [
  // Main Orchestrator
  {
    id: 'dron',
    name: 'Dron',
    role: 'Main Orchestrator',
    status: 'active',
    category: 'orchestrator',
    icon: Zap,
    color: 'purple',
    lastAction: 'Monitoring all systems',
  },
  
  // Trading Agents
  {
    id: 'weather-bot',
    name: 'Weather Trader',
    role: 'NOAA → Kalshi Bot',
    status: 'idle',
    category: 'trading',
    icon: TrendingUp,
    color: 'blue',
    lastAction: 'Waiting for markets',
  },
  {
    id: 'fastloop',
    name: 'FastLoop ML',
    role: 'Polymarket Momentum',
    status: 'active',
    category: 'trading',
    icon: TrendingUp,
    color: 'green',
    lastAction: 'Training on Simmer',
  },
  
  // Social Agents
  {
    id: 'x-posts',
    name: 'X Content Bot',
    role: 'Tweet Automation',
    status: 'active',
    category: 'social',
    icon: Users,
    color: 'cyan',
    lastAction: 'Posted 2h ago',
  },
  {
    id: 'x-engage',
    name: 'X Engagement',
    role: 'Community Growth',
    status: 'active',
    category: 'social',
    icon: Users,
    color: 'pink',
    lastAction: '98 replies today',
  },
  
  // Infrastructure Agents
  {
    id: 'dashboard',
    name: 'Dashboard Builder',
    role: 'Command Center',
    status: 'building',
    category: 'infrastructure',
    icon: Code,
    color: 'orange',
    lastAction: 'Building org chart',
  },
  {
    id: 'cron-monitor',
    name: 'Cron Monitor',
    role: 'Job Scheduler',
    status: 'active',
    category: 'infrastructure',
    icon: Bell,
    color: 'yellow',
    lastAction: 'All jobs healthy',
  },
];

export default function AgentOrgChart() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const orchestrator = agents.find(a => a.category === 'orchestrator');
  const tradingAgents = agents.filter(a => a.category === 'trading');
  const socialAgents = agents.filter(a => a.category === 'social');
  const infraAgents = agents.filter(a => a.category === 'infrastructure');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'building': return 'bg-yellow-500 animate-pulse';
      case 'idle': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBorderColor = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'border-purple-500',
      blue: 'border-blue-500',
      green: 'border-green-500',
      cyan: 'border-cyan-500',
      pink: 'border-pink-500',
      orange: 'border-orange-500',
      yellow: 'border-yellow-500',
    };
    return colors[color] || 'border-gray-500';
  };

  const AgentCard = ({ agent }: { agent: Agent }) => {
    const Icon = agent.icon;
    const isSelected = selectedAgent === agent.id;
    
    return (
      <div
        onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
        className={`
          bg-card border-2 ${getBorderColor(agent.color)} rounded-lg p-4 
          cursor-pointer transition-all hover:scale-105
          ${isSelected ? 'ring-2 ring-white' : ''}
        `}
      >
        <div className="flex items-start justify-between mb-2">
          <Icon className={`w-5 h-5 text-${agent.color}-400`} />
          <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
        </div>
        
        <div className="font-semibold mb-1">{agent.name}</div>
        <div className="text-xs text-muted-foreground mb-2">{agent.role}</div>
        
        {agent.lastAction && (
          <div className="text-xs text-muted-foreground italic">
            {agent.lastAction}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-border rounded-lg p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Agent Empire Org Chart
        </h2>
        <p className="text-sm text-muted-foreground">
          Autonomous agents working 24/7
        </p>
      </div>

      {/* Orchestrator */}
      {orchestrator && (
        <div className="flex justify-center mb-12">
          <div className="w-64">
            <AgentCard agent={orchestrator} />
          </div>
        </div>
      )}

      {/* Connector Line */}
      <div className="flex justify-center mb-8">
        <div className="w-px h-12 bg-gradient-to-b from-purple-500 to-transparent" />
      </div>

      {/* Sub-Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Trading */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <h3 className="text-sm font-semibold text-green-500 uppercase">Trading</h3>
          </div>
          <div className="space-y-3">
            {tradingAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Social */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-cyan-500" />
            <h3 className="text-sm font-semibold text-cyan-500 uppercase">Social</h3>
          </div>
          <div className="space-y-3">
            {socialAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold text-orange-500 uppercase">Infrastructure</h3>
          </div>
          <div className="space-y-3">
            {infraAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 pt-6 border-t border-border grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-500">
            {agents.filter(a => a.status === 'active').length}
          </div>
          <div className="text-xs text-muted-foreground">Active</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-500">
            {agents.filter(a => a.status === 'building').length}
          </div>
          <div className="text-xs text-muted-foreground">Building</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-500">
            {agents.filter(a => a.status === 'idle').length}
          </div>
          <div className="text-xs text-muted-foreground">Idle</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-500">
            {agents.length}
          </div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>
    </div>
  );
}
