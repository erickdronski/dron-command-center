#!/bin/bash
# Sync external data files into the project for Vercel deployment

# Sync Kalshi shared state
cp /Users/dron/.openclaw/workspace/dron-command-center/ml_data/kalshi_shared_state.json ./public/data/kalshi_shared_state.json 2>/dev/null || echo "Kalshi state not found"

# Sync X bot state
cp /Users/dron/.openclaw/workspace/dronskierick_bot_state.json ./public/data/dronskierick_bot_state.json 2>/dev/null || echo "X bot state not found"

# Sync cron jobs
cp /Users/dron/.openclaw/cron/jobs.json ./public/data/cron_jobs.json 2>/dev/null || echo "Cron jobs not found"

# Sync agent state
cp /Users/dron/.openclaw/workspace/agent_state.json ./public/data/agent_state.json 2>/dev/null || echo "Agent state not found"

echo "Data sync complete"
