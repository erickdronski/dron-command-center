'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  status: 'backlog' | 'inProgress' | 'testing' | 'live';
  channel: string;
  channelIcon: string;
  lastActivity: string;
  description?: string;
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'FastLoop ML v9',
    status: 'testing',
    channel: '#polymarket-trades',
    channelIcon: '💸',
    lastActivity: '2 min ago',
    description: 'Smart exit strategy with 30% profit target',
  },
  {
    id: '2',
    name: 'X Posting Bot',
    status: 'live',
    channel: '#x-posts',
    channelIcon: '🐦',
    lastActivity: '1 hour ago',
    description: 'Every 3h posting schedule',
  },
  {
    id: '3',
    name: 'X Engagement Bot',
    status: 'live',
    channel: '#x-engagement',
    channelIcon: '💬',
    lastActivity: '30 min ago',
    description: '5x daily at peak hours',
  },
  {
    id: '4',
    name: 'Weather Trader',
    status: 'inProgress',
    channel: '#weather-trader',
    channelIcon: '🌦️',
    lastActivity: '2 hours ago',
    description: 'NOAA forecast vs Kalshi odds',
  },
  {
    id: '5',
    name: 'Arb Scanner',
    status: 'backlog',
    channel: '#trading',
    channelIcon: '⚡',
    lastActivity: 'Not started',
    description: 'Cross-platform arbitrage detection',
  },
  {
    id: '6',
    name: 'Daily Digest Cron',
    status: 'inProgress',
    channel: '#daily-digest',
    channelIcon: '📊',
    lastActivity: 'In development',
    description: '9 AM automated summary',
  },
  {
    id: '7',
    name: 'Sentiment Scanner',
    status: 'backlog',
    channel: '#opportunities',
    channelIcon: '🧠',
    lastActivity: 'Not started',
    description: 'Twitter/Reddit early signal detection',
  },
  {
    id: '8',
    name: 'Threads Automation',
    status: 'backlog',
    channel: '#social',
    channelIcon: '🧵',
    lastActivity: 'Blocked',
    description: 'Waiting for API compatibility',
  },
];

const columns = [
  { id: 'backlog', title: 'Backlog', color: 'border-gray-600' },
  { id: 'inProgress', title: 'In Progress', color: 'border-yellow-600' },
  { id: 'testing', title: 'Testing', color: 'border-blue-600' },
  { id: 'live', title: 'Live', color: 'border-green-600' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const getProjectsByStatus = (status: string) => {
    return projects.filter(p => p.status === status);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
              📋 Project Board
            </h1>
            <p className="text-muted-foreground">Track all active projects and automations</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className={`mb-4 pb-3 border-b-2 ${column.color}`}>
              <h2 className="text-lg font-semibold">{column.title}</h2>
              <p className="text-sm text-muted-foreground">
                {getProjectsByStatus(column.id).length} project{getProjectsByStatus(column.id).length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Project Cards */}
            <div className="space-y-3 flex-1">
              {getProjectsByStatus(column.id).map(project => (
                <div
                  key={project.id}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-2xl">{project.channelIcon}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{project.lastActivity}</span>
                  </div>

                  {/* Project Name */}
                  <h3 className="font-semibold mb-1">{project.name}</h3>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  )}

                  {/* Channel Tag */}
                  <div className="inline-block text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {project.channel}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {getProjectsByStatus(column.id).length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8 border-2 border-dashed border-border rounded-lg">
                  No projects
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold">{projects.length}</div>
          <div className="text-sm text-muted-foreground">Total Projects</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-500">{getProjectsByStatus('live').length}</div>
          <div className="text-sm text-muted-foreground">Live & Running</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-500">{getProjectsByStatus('inProgress').length}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-500">{getProjectsByStatus('backlog').length}</div>
          <div className="text-sm text-muted-foreground">Backlog</div>
        </div>
      </div>
    </div>
  );
}
