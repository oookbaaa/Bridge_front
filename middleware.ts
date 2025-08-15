import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get user data from localStorage (in a real app, this would be from cookies/JWT)
  // Since we can't access localStorage in middleware, we'll handle this in the layout components
  // This middleware serves as a backup and handles basic route protection

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    // In a real app, you would check JWT token or session here
    // For now, we rely on the layout component protection
    return NextResponse.next()
  }

  // Dashboard routes protection
  if (pathname.startsWith("/dashboard")) {
    // In a real app, you would check authentication status here
    // For now, we rely on the layout component protection
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
