import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>
  )
}
