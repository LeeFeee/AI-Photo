import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// 中间件：保护管理员路由 - Middleware: Protect admin routes
// 检查管理员会话和角色，未授权用户重定向到登录页 - Check admin session and role, redirect unauthorized users to login
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = req.nextUrl.pathname === '/admin/login'

    // 如果访问管理员路由（非登录页），检查是否已认证且是管理员 - If accessing admin route (not login page), check if authenticated and is admin
    if (isAdminRoute && !isLoginPage) {
      if (!token || token.role !== 'admin') {
        // 未授权，重定向到登录页 - Unauthorized, redirect to login page
        const loginUrl = new URL('/admin/login', req.url)
        loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // 如果已登录访问登录页，重定向到后台首页 - If already logged in accessing login page, redirect to admin dashboard
    if (isLoginPage && token?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // 授权回调：决定是否需要认证 - Authorization callback: decide if authentication is needed
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
        const isLoginPage = req.nextUrl.pathname === '/admin/login'
        
        // 登录页始终允许访问 - Always allow access to login page
        if (isLoginPage) {
          return true
        }
        
        // 管理员路由需要 token - Admin routes require token
        if (isAdminRoute) {
          return !!token
        }
        
        // 其他路由不受保护 - Other routes are not protected
        return true
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
)

// 配置需要中间件的路径 - Configure paths that need middleware
export const config = {
  matcher: ['/admin/:path*']
}
