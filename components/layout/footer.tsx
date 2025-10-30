export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50 mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} AI Photo. 保留所有权利。
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-sm text-gray-600 hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded px-2 py-1"
            >
              隐私政策
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-600 hover:text-brand-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded px-2 py-1"
            >
              使用条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
