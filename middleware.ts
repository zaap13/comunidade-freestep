import { auth } from './auth';
import { NextResponse } from 'next/server';

export async function middleware(request: Request) {
  const session = await auth();
  const { pathname } = new URL(request.url);

  const userIsAuthenticated = !!session?.user;
  const userNeedsOnboarding = userIsAuthenticated && !session.user.nick;
  const isOnboardingPage = pathname.startsWith('/onboarding');

  if (userNeedsOnboarding && !isOnboardingPage) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  
  if (userIsAuthenticated && session.user.nick && isOnboardingPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/onboarding', '/profile/:path*'], // Rotas onde o middleware vai rodar
};