import { NextRequest, NextResponse } from 'next/server'

export function middleware(request : NextRequest) {
  // Check if the pathname is /studio
  if (request.nextUrl.pathname === '/studio') {
    // Redirect to your desired URL
    return NextResponse.redirect(new URL('https://chtvanguard.sanity.studio', request.url))
  }
  
  // Continue with the request if it's not /studio
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/studio'
}