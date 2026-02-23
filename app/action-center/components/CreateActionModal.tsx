'use client';

import { useState } from 'react';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import { actionTypes } from './ActionCenterContent';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateActionModal({ onClose, onCreated }: Props) {
  const [selectedType, setSelectedType] = useState('request_agent');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          title: title.trim(),
          description: description.trim(),
          requester: 'Dron',
        }),
      });

      if (res.ok) {
        onCreated();
      }
    } catch (err) {
      console.error('Failed to create action:', err);
    } finally {
      setCreating(false);
    }
  };

  const selectedTypeConfig = actionTypes.find(t => t.value === selectedType);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={20} />
            <h2 className="text-lg font-semibold text-white">Request Agent Action</h2>
          </div>
          <p className="text-sm text-[#555] mt-1">
            Describe what you need. The AI agent will handle it.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-2">
            {actionTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                  selectedType === type.value
                    ? `${type.bg} ${type.border} ${type.color} border`
                    : 'border-[#222] text-[#888] hover:border-[#333]'
                }`}
              >
                <type.icon size={16} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Selected type description */}
          {selectedTypeConfig && (
            <p className={`text-xs ${selectedTypeConfig.color}`}>
              {selectedTypeConfig.description}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs text-[#555] uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Add dark mode toggle"
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-[#555] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you want the agent to do in detail..."
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#222] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#888] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || creating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {creating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Create Action
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
