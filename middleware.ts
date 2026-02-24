import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Shared access token for team members
// Share this URL with your team: https://your-domain.com/value-engineering/projects/benefit-stories?token=TOKEN
// Once they visit with ?token=, a cookie is set and they won't need the token again for 30 days.
const SHARE_TOKEN = process.env.VE_SHARE_TOKEN || 'team-ve-2026';

// Public paths that shared users can access (benefit stories project only)
const PUBLIC_PATHS = [
  '/value-engineering/projects/benefit-stories',
];

// Paths that are always public (API routes for data, static assets, etc.)
const ALWAYS_PUBLIC = [
  '/_next',
  '/favicon.ico',
  '/api/public',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'));
}

function isAlwaysPublic(pathname: string): boolean {
  return ALWAYS_PUBLIC.some(p => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Always allow static assets
  if (isAlwaysPublic(pathname)) {
    return NextResponse.next();
  }

  // Check if user has owner cookie (you, Erick — full access)
  const ownerCookie = request.cookies.get('dc_owner');
  if (ownerCookie?.value === 'true') {
    return NextResponse.next();
  }

  // Check if user has team cookie (shared access to benefit stories only)
  const teamCookie = request.cookies.get('dc_team');
  const hasTeamAccess = teamCookie?.value === 'true';

  // Check for token in URL (first visit — sets cookie)
  const tokenParam = searchParams.get('token');

  // If they have a valid token, set the team cookie and redirect without token in URL
  if (tokenParam === SHARE_TOKEN) {
    const cleanUrl = new URL(pathname, request.url);
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set('dc_team', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // If they have team access and are on a public path, allow
  if (hasTeamAccess && isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // If they have team access but are on a restricted path, redirect to benefit stories
  if (hasTeamAccess && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL('/value-engineering/projects/benefit-stories', request.url));
  }

  // Check for owner token (for you to get full access)
  const ownerToken = searchParams.get('owner');
  if (ownerToken === (process.env.DC_OWNER_TOKEN || 'erick-owner-2026')) {
    const cleanUrl = new URL(pathname, request.url);
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set('dc_owner', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90, // 90 days
    });
    return response;
  }

  // No access — show 401
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
    <head><title>Access Required</title></head>
    <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0a0a0a; color: #fff;">
      <div style="text-align: center;">
        <h1 style="font-size: 48px; margin: 0;">🔒</h1>
        <p style="color: #888; margin-top: 16px;">You need an access link to view this.</p>
      </div>
    </body>
    </html>`,
    {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
