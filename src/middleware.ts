import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from './lib/get-url'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(process.env.AUTH_COOKIES_JS as string)
  const pathname = request.nextUrl.pathname

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL(getUrl('/admin')))
  }

  if (pathname.includes('/admin') && !token) {
    return NextResponse.redirect(new URL(getUrl('/login')))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}