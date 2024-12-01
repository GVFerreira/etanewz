import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from './lib/get-url'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(process.env.AUTH_COOKIES_JS as string)
  const pathname = request.nextUrl.pathname

  // CORS Handling for API Routes
  if (pathname.startsWith('/api')) {
    const allowedOrigins = [
      'http://localhost:3000', // Ambiente local
      'https://etanz.com.br',  // Produção
    ]
    const origin = request.headers.get('origin')

    if (origin && allowedOrigins.includes(origin)) {
      const response = NextResponse.next()
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return response
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    // Bloqueia se a origem não for permitida
    return new Response('CORS not allowed', { status: 403 })
  }

  // Admin Route Protection
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL(getUrl('/admin')))
  }

  if (pathname.includes('/admin') && !token) {
    return NextResponse.redirect(new URL(getUrl('/login')))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
