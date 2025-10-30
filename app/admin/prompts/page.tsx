'use client'

import * as React from 'react'
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Modal, ConfirmModal } from '@/components/ui/modal'
import { Pagination } from '@/components/ui/pagination'
import { PromptForm, type PromptFormData } from '@/components/admin/prompt-form'
import { EmptyState } from '@/components/ui/empty-state'
import {
  getPromptsAction,
  searchPromptsAction,
  createPromptAction,
  updatePromptAction,
  deletePromptAction,
  togglePromptActiveAction,
} from '@/app/actions/prompts'
import type { Prompt } from '@/lib/prompts'

const ITEMS_PER_PAGE = 10

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = React.useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = React.useState<Prompt[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [editingPrompt, setEditingPrompt] = React.useState<Prompt | null>(null)
  const [deletingPromptId, setDeletingPromptId] = React.useState<string | null>(null)

  // Load prompts
  const loadPrompts = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPromptsAction()
      setPrompts(data)
      setFilteredPrompts(data)
    } catch (error) {
      toast.error('加载提示词失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadPrompts()
  }, [loadPrompts])

  // Search
  const handleSearch = React.useCallback(async (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)

    if (!query.trim()) {
      setFilteredPrompts(prompts)
      return
    }

    try {
      const results = await searchPromptsAction(query)
      setFilteredPrompts(results)
    } catch (error) {
      toast.error('搜索失败')
      console.error(error)
    }
  }, [prompts])

  // Pagination
  const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE)
  const paginatedPrompts = filteredPrompts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Create prompt
  const handleCreate = async (data: PromptFormData) => {
    try {
      await createPromptAction(data)
      toast.success('提示词创建成功')
      setIsCreateModalOpen(false)
      await loadPrompts()
    } catch (error: any) {
      toast.error(error.message || '创建失败')
      throw error
    }
  }

  // Update prompt
  const handleUpdate = async (data: PromptFormData) => {
    if (!editingPrompt) return

    try {
      await updatePromptAction(editingPrompt.id, data)
      toast.success('提示词更新成功')
      setEditingPrompt(null)
      
      // Optimistic update
      setPrompts(prev => prev.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, ...data, updatedAt: new Date() }
          : p
      ))
      setFilteredPrompts(prev => prev.map(p => 
        p.id === editingPrompt.id 
          ? { ...p, ...data, updatedAt: new Date() }
          : p
      ))
      
      await loadPrompts()
    } catch (error: any) {
      toast.error(error.message || '更新失败')
      throw error
    }
  }

  // Delete prompt
  const handleDelete = async () => {
    if (!deletingPromptId) return

    try {
      await deletePromptAction(deletingPromptId)
      toast.success('提示词删除成功')
      setDeletingPromptId(null)
      
      // Optimistic update
      setPrompts(prev => prev.filter(p => p.id !== deletingPromptId))
      setFilteredPrompts(prev => prev.filter(p => p.id !== deletingPromptId))
      
      await loadPrompts()
    } catch (error: any) {
      toast.error(error.message || '删除失败')
    }
  }

  // Toggle active
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await togglePromptActiveAction(id, isActive)
      toast.success(isActive ? '提示词已启用' : '提示词已禁用')
      
      // Optimistic update
      setPrompts(prev => prev.map(p => 
        p.id === id ? { ...p, isActive, updatedAt: new Date() } : p
      ))
      setFilteredPrompts(prev => prev.map(p => 
        p.id === id ? { ...p, isActive, updatedAt: new Date() } : p
      ))
      
      await loadPrompts()
    } catch (error: any) {
      toast.error(error.message || '操作失败')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">提示词管理</h1>
          <p className="text-gray-600 mt-1">
            管理 AI 图片生成提示词库
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          创建提示词
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="搜索提示词名称、内容或分类..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">{prompts.length}</div>
            <div className="text-sm text-gray-600">总提示词数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {prompts.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-gray-600">已启用</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-600">
              {prompts.filter(p => !p.isActive).length}
            </div>
            <div className="text-sm text-gray-600">已禁用</div>
          </CardContent>
        </Card>
      </div>

      {/* Prompts List */}
      {paginatedPrompts.length === 0 ? (
        <EmptyState
          icon={Search}
          title={searchQuery ? '未找到匹配的提示词' : '还没有提示词'}
          description={searchQuery ? '尝试使用其他关键词搜索' : '点击上方按钮创建第一个提示词'}
        />
      ) : (
        <div className="space-y-4">
          {paginatedPrompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Preview Image */}
                  {prompt.previewImage && (
                    <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={prompt.previewImage}
                        alt={prompt.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {prompt.name}
                        </h3>
                        {prompt.category && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-brand-100 text-brand-700 rounded">
                            {prompt.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={prompt.isActive}
                          onCheckedChange={(checked) => handleToggleActive(prompt.id, checked)}
                        />
                        {prompt.isActive ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {prompt.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="space-y-1">
                        <div>创建于：{new Date(prompt.createdAt).toLocaleString('zh-CN')}</div>
                        <div>更新于：{new Date(prompt.updatedAt).toLocaleString('zh-CN')}</div>
                        {prompt.updatedBy && <div>更新者：{prompt.updatedBy}</div>}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPrompt(prompt)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          编辑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingPromptId(prompt.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Create Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="创建提示词"
        description="填写提示词信息并上传预览图片"
      >
        <PromptForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      {editingPrompt && (
        <Modal
          open={!!editingPrompt}
          onOpenChange={(open) => !open && setEditingPrompt(null)}
          title="编辑提示词"
          description="修改提示词信息"
        >
          <PromptForm
            prompt={editingPrompt}
            onSubmit={handleUpdate}
            onCancel={() => setEditingPrompt(null)}
          />
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deletingPromptId}
        onOpenChange={(open) => !open && setDeletingPromptId(null)}
        title="确认删除"
        description="确定要删除这个提示词吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={handleDelete}
      />
    </div>
  )
}
