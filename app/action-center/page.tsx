'use client';

import { useState } from 'react';
import { Rocket, Code, Bot, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface Action {
  id: string;
  type: 'CODE_CHANGE' | 'DEPLOY' | 'REQUEST_AGENT';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
}

export default function ActionCenterPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [newAction, setNewAction] = useState('');

  const createAction = (type: Action['type']) => {
    if (!newAction.trim()) return;
    
    const action: Action = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description: newAction,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setActions([action, ...actions]);
    setNewAction('');
    
    // Simulate execution
    setTimeout(() => {
      setActions(prev => prev.map(a => 
        a.id === action.id ? { ...a, status: 'in_progress' } : a
      ));
      
      setTimeout(() => {
        setActions(prev => prev.map(a => 
          a.id === action.id ? { ...a, status: 'completed' } : a
        ));
      }, 2000);
    }, 500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Action Center"
        subtitle="Request agent actions — executes in real-time"
      />
      
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 mb-6">
        <textarea
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          placeholder="What should the agent do?"
          className="w-full bg-[#0a0a0a] border border-[#222] rounded p-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-purple-500 mb-3"
          rows={3}
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => createAction('REQUEST_AGENT')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded font-medium hover:bg-purple-600"
          >
            <Bot size={16} /> Request Agent
          </button>
          
          <button
            onClick={() => createAction('CODE_CHANGE')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white border border-[#333] rounded hover:border-purple-500"
          >
            <Code size={16} /> Code Change
          </button>
          
          <button
            onClick={() => createAction('DEPLOY')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white border border-[#333] rounded hover:border-purple-500"
          >
            <Rocket size={16} /> Deploy
          </button>
        </div>
      </div>
      
      {actions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#555] uppercase">Actions ({actions.length})</h3>
          
          {actions.map((action) => (
            <div key={action.id} className="bg-[#111] border border-[#222] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {action.type === 'REQUEST_AGENT' && <Bot size={18} className="text-purple-400" />}
                  {action.type === 'CODE_CHANGE' && <Code size={18} className="text-blue-400" />}
                  {action.type === 'DEPLOY' && <Rocket size={18} className="text-green-400" />}
                  
                  <div>
                    <p className="text-sm text-white">{action.description}</p>
                    <p className="text-xs text-[#555]">{action.type} • {new Date(action.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {action.status === 'pending' && <span className="text-xs text-[#555]">Pending...</span>}
                  {action.status === 'in_progress' && <Loader2 size={16} className="animate-spin text-yellow-400" />}
                  {action.status === 'completed' && <CheckCircle2 size={16} className="text-green-400" />}
                  {action.status === 'failed' && <XCircle size={16} className="text-red-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
