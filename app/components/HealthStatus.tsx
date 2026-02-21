"use client";

import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  services: {
    name: string;
    status: "up" | "down" | "slow";
    latency?: number;
    lastCheck: string;
  }[];
  lastUpdated: string;
}

export function HealthIndicator({ 
  status, 
  size = "md",
  pulse = true 
}: { 
  status: "up" | "down" | "slow" | "healthy" | "degraded";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}) {
  const colors = {
    up: "bg-green-500",
    healthy: "bg-green-500",
    down: "bg-red-500",
    slow: "bg-yellow-500",
    degraded: "bg-yellow-500",
  };

  const sizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div className={`relative flex items-center justify-center`}>
      <div className={`${sizes[size]} ${colors[status as keyof typeof colors]} rounded-full ${pulse ? "animate-pulse" : ""}`} />
      {pulse && (status === "up" || status === "healthy") && (
        <div className={`absolute ${sizes[size]} ${colors[status as keyof typeof colors]} rounded-full animate-ping opacity-30`} />
      )}
    </div>
  );
}

export function HealthStatusCard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        // Simulated health check - in production this would hit an actual endpoint
        const res = await fetch("/api/status");
        const data = await res.json();
        
        // Transform to health format
        const services = [
          { name: "Dashboard", status: "up" as const, latency: 45, lastCheck: new Date().toISOString() },
          { name: "Weather API", status: data.system?.errors ? "slow" : "up" as const, latency: 120, lastCheck: new Date().toISOString() },
          { name: "Build System", status: "up" as const, latency: 80, lastCheck: new Date().toISOString() },
          { name: "Kalshi Bot", status: data.trading?.weather?.active ? "up" : "slow" as const, latency: 200, lastCheck: new Date().toISOString() },
        ];
        
        const downCount = services.filter(s => s.status === "down").length;
        const slowCount = services.filter(s => s.status === "slow").length;
        
        setHealth({
          status: downCount > 0 ? "down" : slowCount > 0 ? "degraded" : "healthy",
          services,
          lastUpdated: new Date().toISOString(),
        });
      } catch {
        setHealth({
          status: "degraded",
          services: [
            { name: "Dashboard", status: "up", latency: 45, lastCheck: new Date().toISOString() },
            { name: "Weather API", status: "slow", latency: 500, lastCheck: new Date().toISOString() },
          ],
          lastUpdated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-[#222] rounded w-24 mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-[#222] rounded w-full" />
          <div className="h-3 bg-[#222] rounded w-3/4" />
        </div>
      </div>
    );
  }

  const statusConfig = {
    healthy: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", label: "All Systems Operational" },
    degraded: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", label: "Some Services Slow" },
    down: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", label: "Service Disruption" },
  };

  const config = statusConfig[health?.status || "healthy"];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={config.color} />
        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
      </div>
      
      <div className="space-y-2">
        {health?.services.map((service) => (
          <div key={service.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <HealthIndicator status={service.status} size="sm" pulse={false} />
              <span className="text-[#888]">{service.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {service.latency && (
                <span className={`${service.latency > 200 ? "text-yellow-400" : "text-[#555]"}`}>
                  {service.latency}ms
                </span>
              )}
              <span className={`${service.status === "up" ? "text-green-400" : service.status === "slow" ? "text-yellow-400" : "text-red-400"}`}>
                {service.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-[#222] text-[10px] text-[#444]">
        Updated {new Date(health?.lastUpdated || Date.now()).toLocaleTimeString()}
      </div>
    </div>
  );
}

export function StatusBadge({ 
  status, 
  text,
  showIcon = true 
}: { 
  status: "success" | "warning" | "error" | "pending" | "building";
  text?: string;
  showIcon?: boolean;
}) {
  const config = {
    success: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", icon: CheckCircle2 },
    warning: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: AlertCircle },
    error: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: XCircle },
    pending: { color: "text-[#555]", bg: "bg-[#1a1a1a]", border: "border-[#333]", icon: Clock },
    building: { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: Activity },
  };

  const c = config[status];
  const Icon = c.icon;
  const label = text || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${c.color} ${c.bg} ${c.border} border`}>
      {showIcon && <Icon size={12} />}
      {label}
    </span>
  );
}
