'use client';

import { useEffect, useState } from 'react';
import { CloudSun, TrendingUp, AlertCircle, RefreshCw, Thermometer } from 'lucide-react';

const LOCATIONS = ['NYC', 'Chicago', 'Seattle', 'Atlanta', 'Dallas', 'Miami'];

interface ForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
  isDaytime: boolean;
  startTime: string;
  windSpeed: string;
  windDirection: string;
  precipitationChance: number | null;
}

interface WeatherData {
  ok: boolean;
  locationKey: string;
  label: string;
  location: string;
  updated: string;
  periods: ForecastPeriod[];
  error?: string;
}

// Simple trading signal logic (mirrors Polymarket weather trader)
function getTradingSignal(temp: number, period: string): {
  signal: 'BUY' | 'HOLD' | 'WATCH';
  color: string;
  reason: string;
} {
  // Temperature extremes are more tradeable on Polymarket
  if (temp <= 20) {
    return { signal: 'BUY', color: 'text-blue-400', reason: `Extreme cold (${temp}°F) — low bucket likely underpriced` };
  }
  if (temp >= 90) {
    return { signal: 'BUY', color: 'text-red-400', reason: `Extreme heat (${temp}°F) — high bucket likely underpriced` };
  }
  if (temp <= 32 || temp >= 80) {
    return { signal: 'WATCH', color: 'text-yellow-400', reason: `${temp}°F — monitor Polymarket for mispriced bucket` };
  }
  return { signal: 'HOLD', color: 'text-[#555]', reason: `${temp}°F — mild temp, lower edge` };
}

function TempBar({ temp, unit }: { temp: number; unit: string }) {
  // Scale: 0°F = left, 110°F = right
  const fahrenheit = unit === 'C' ? (temp * 9) / 5 + 32 : temp;
  const pct = Math.max(0, Math.min(100, (fahrenheit / 110) * 100));
  const color =
    fahrenheit <= 32 ? 'bg-blue-400' :
    fahrenheit <= 55 ? 'bg-cyan-400' :
    fahrenheit <= 75 ? 'bg-green-400' :
    fahrenheit <= 90 ? 'bg-yellow-400' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-[#888] w-12 text-right">{temp}°{unit}</span>
    </div>
  );
}

export default function WeatherPage() {
  const [location, setLocation] = useState('NYC');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?location=${loc}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData({ ok: false, locationKey: loc, label: loc, location: '', updated: '', periods: [], error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const daytimePeriods = data?.periods?.filter(p => p.isDaytime) ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <CloudSun size={22} className="text-yellow-400" />
            <h1 className="text-xl font-semibold">NOAA Weather</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-green-400/10 text-green-400 border border-green-400/20">
              Live Forecast
            </span>
          </div>
          <p className="text-sm text-[#555] mt-1">Real-time NOAA forecasts + Polymarket trading signals</p>
        </div>
        <button
          onClick={() => fetchWeather(location)}
          className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#222] hover:border-[#444]"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Location tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {LOCATIONS.map(loc => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors border ${
              location === loc
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'border-[#222] text-[#666] hover:text-white hover:border-[#333]'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-[#555] py-12 justify-center">
          <RefreshCw size={16} className="animate-spin" />
          Fetching NOAA forecast...
        </div>
      )}

      {!loading && data && !data.ok && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded px-4 py-3 text-sm">
          <AlertCircle size={16} />
          {data.error ?? 'Failed to load forecast'}
        </div>
      )}

      {!loading && data?.ok && (
        <>
          {/* Location header */}
          <div className="mb-5">
            <h2 className="text-lg font-medium text-white">{data.location || data.label}</h2>
            <p className="text-xs text-[#555] mt-0.5">
              Updated: {new Date(data.updated).toLocaleString()}
            </p>
          </div>

          {/* Forecast grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {daytimePeriods.map((period) => {
              const signal = getTradingSignal(period.temperature, period.name);
              return (
                <div key={period.name} className="bg-[#111] border border-[#1e1e1e] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-white">{period.name}</p>
                      <p className="text-xs text-[#555]">
                        {new Date(period.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${
                      signal.signal === 'BUY' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                      signal.signal === 'WATCH' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' :
                      'text-[#555] border-[#333] bg-transparent'
                    }`}>
                      {signal.signal}
                    </span>
                  </div>

                  {/* Temp */}
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer size={14} className="text-[#555]" />
                    <span className="text-2xl font-bold text-white">
                      {period.temperature}°{period.temperatureUnit}
                    </span>
                  </div>
                  <TempBar temp={period.temperature} unit={period.temperatureUnit} />

                  <p className="text-xs text-[#888] mt-3 mb-3 leading-relaxed">{period.shortForecast}</p>

                  {/* Wind & precip */}
                  <div className="flex gap-4 text-xs text-[#555] mb-3">
                    <span>💨 {period.windSpeed} {period.windDirection}</span>
                    {period.precipitationChance !== null && (
                      <span>🌧️ {period.precipitationChance}%</span>
                    )}
                  </div>

                  {/* Signal */}
                  {signal.signal !== 'HOLD' && (
                    <div className={`flex items-start gap-1.5 text-xs ${signal.color} border border-current/20 bg-current/5 rounded px-2 py-1.5`}>
                      <TrendingUp size={12} className="shrink-0 mt-0.5" />
                      <span>{signal.reason}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Full 7-period list */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#1e1e1e]">
              <h3 className="text-sm font-medium">Full Forecast</h3>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {data.periods.map((p) => (
                <div key={p.name} className="flex items-center justify-between px-4 py-3 hover:bg-[#151515] transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-sm text-[#888] w-28 shrink-0">{p.name}</span>
                    <span className="text-sm font-medium text-white w-16 shrink-0">
                      {p.temperature}°{p.temperatureUnit}
                    </span>
                    <span className="text-xs text-[#555] truncate">{p.shortForecast}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-[#555]">{p.windSpeed}</span>
                    {p.precipitationChance !== null && (
                      <span className="text-xs text-blue-400/60">{p.precipitationChance}% rain</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-[#444] mt-4 text-center">
            Data from NOAA National Weather Service (api.weather.gov) · Free, no API key required
          </p>
        </>
      )}
    </div>
  );
}
