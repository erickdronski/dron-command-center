import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface NOAAGridResponse {
  properties: {
    forecast: string;
    forecastHourly: string;
    gridId: string;
    gridX: number;
    gridY: number;
    relativeLocation: {
      properties: {
        city: string;
        state: string;
      };
    };
  };
}

interface NOAAForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
  detailedForecast: string;
  isDaytime: boolean;
  startTime: string;
  endTime: string;
  windSpeed: string;
  windDirection: string;
  probabilityOfPrecipitation?: {
    value: number | null;
    unitCode: string;
  };
}

interface NOAAForecastResponse {
  properties: {
    periods: NOAAForecastPeriod[];
    updated: string;
    generatedAt: string;
  };
}

const LOCATIONS: Record<string, { lat: number; lon: number; label: string }> = {
  NYC: { lat: 40.7128, lon: -74.006, label: 'New York City' },
  Chicago: { lat: 41.8781, lon: -87.6298, label: 'Chicago' },
  Seattle: { lat: 47.6062, lon: -122.3321, label: 'Seattle' },
  Atlanta: { lat: 33.749, lon: -84.388, label: 'Atlanta' },
  Dallas: { lat: 32.7767, lon: -96.797, label: 'Dallas' },
  Miami: { lat: 25.7617, lon: -80.1918, label: 'Miami' },
};

async function fetchNOAAForecast(lat: number, lon: number) {
  const headers = {
    'User-Agent': 'dron-command-center/1.0 (admin@droncommand.com)',
    Accept: 'application/geo+json',
  };

  // Step 1: Get grid point for the location
  const pointsRes = await fetch(
    `https://api.weather.gov/points/${lat},${lon}`,
    { headers, next: { revalidate: 1800 } } // cache 30min
  );

  if (!pointsRes.ok) {
    throw new Error(`NOAA points API error: ${pointsRes.status}`);
  }

  const pointsData: NOAAGridResponse = await pointsRes.json();
  const forecastUrl = pointsData.properties.forecast;
  const city = pointsData.properties.relativeLocation?.properties?.city ?? 'Unknown';
  const state = pointsData.properties.relativeLocation?.properties?.state ?? '';

  // Step 2: Get the forecast
  const forecastRes = await fetch(forecastUrl, {
    headers,
    next: { revalidate: 1800 },
  });

  if (!forecastRes.ok) {
    throw new Error(`NOAA forecast API error: ${forecastRes.status}`);
  }

  const forecastData: NOAAForecastResponse = await forecastRes.json();
  const periods = forecastData.properties.periods.slice(0, 7); // next 7 periods

  return {
    location: `${city}, ${state}`,
    updated: forecastData.properties.updated,
    periods: periods.map((p) => ({
      name: p.name,
      temperature: p.temperature,
      temperatureUnit: p.temperatureUnit,
      shortForecast: p.shortForecast,
      isDaytime: p.isDaytime,
      startTime: p.startTime,
      windSpeed: p.windSpeed,
      windDirection: p.windDirection,
      precipitationChance: p.probabilityOfPrecipitation?.value ?? null,
    })),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationKey = searchParams.get('location') ?? 'NYC';
  const location = LOCATIONS[locationKey] ?? LOCATIONS.NYC;

  try {
    const forecast = await fetchNOAAForecast(location.lat, location.lon);
    return NextResponse.json({
      ok: true,
      locationKey,
      label: location.label,
      ...forecast,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
