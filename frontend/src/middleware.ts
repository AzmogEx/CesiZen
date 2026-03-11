import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profil', '/journal'];
const adminRoutes = ['/admin'];
const authRoutes = ['/connexion', '/inscription'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si un token existe dans les cookies de Zustand persist (localStorage côté client)
  // En middleware Next.js (edge), on ne peut pas lire localStorage.
  // On utilise un cookie pour transmettre l'état d'auth.
  const authCookie = request.cookies.get('cesizen-auth');
  let isAuthenticated = false;
  let isAdmin = false;

  if (authCookie?.value) {
    try {
      const parsed = JSON.parse(authCookie.value);
      const state = parsed?.state;
      isAuthenticated = !!state?.token;
      isAdmin = state?.user?.role?.nom === 'administrateur';
    } catch {
      // Cookie invalide
    }
  }

  // Pages auth (connexion/inscription) : rediriger si déjà connecté
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Routes protégées : rediriger si pas connecté
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL('/connexion', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Routes admin : vérifier rôle admin
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = new URL('/connexion', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profil/:path*',
    '/journal/:path*',
    '/admin/:path*',
    '/connexion',
    '/inscription',
  ],
};
