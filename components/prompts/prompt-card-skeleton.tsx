import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PromptCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* 图片骨架 */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      
      <CardContent className="p-4 space-y-3">
        {/* 标题和分类骨架 */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-6 w-16" />
        </div>
        
        {/* 描述骨架 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* 提示词内容骨架 */}
        <Skeleton className="h-12 w-full" />
        
        {/* 按钮骨架 */}
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  )
}

export function PromptGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PromptCardSkeleton key={i} />
      ))}
    </div>
  )
}
