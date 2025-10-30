export { default } from 'next-auth/middleware'

// 配置需要保护的路由 - Configure protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/generate/:path*', '/account/:path*'],
}
