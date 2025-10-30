import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

// 管理员布局 - Admin layout
// 包含侧边栏导航和头部，用于所有管理员页面 - Contains sidebar navigation and header for all admin pages
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 服务器端会话检查 - Server-side session check
  const session = await getServerSession(authOptions)

  // 如果未登录且不在登录页，重定向到登录页 - If not logged in and not on login page, redirect to login
  // (middleware 也会处理，这里是额外保护层) - (middleware also handles this, this is an extra protection layer)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 管理员布局容器 - Admin layout container */}
      <div className="flex h-screen overflow-hidden">
        {/* 侧边栏 - Sidebar */}
        <AdminSidebar />

        {/* 主内容区 - Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部头部 - Top header */}
          <AdminHeader session={session} />

          {/* 主内容 - Main content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
