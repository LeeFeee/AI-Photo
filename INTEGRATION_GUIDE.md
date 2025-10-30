# 图片上传功能集成指南

本指南帮助开发者快速将图片上传功能集成到现有页面或新功能中。

## 🚀 快速开始（5 分钟）

### 1. 基本集成

在任何页面中导入并使用上传组件：

```tsx
'use client'

import { ImageUpload, UploadResult } from '@/components/ui/image-upload'

export default function MyPage() {
  const handleUploadComplete = (result: UploadResult) => {
    if (result.success) {
      console.log('上传成功！', result.url)
      // 在这里处理上传成功的逻辑
    } else {
      console.error('上传失败：', result.error)
      // 在这里处理上传失败的逻辑
    }
  }

  return (
    <div>
      <h1>图片上传</h1>
      <ImageUpload
        folder="temp"
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
```

### 2. 保存到状态

```tsx
'use client'

import { useState } from 'react'
import { ImageUpload, UploadResult } from '@/components/ui/image-upload'

export default function MyPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageKey, setImageKey] = useState<string | null>(null)

  const handleUploadComplete = (result: UploadResult) => {
    if (result.success) {
      setImageUrl(result.url!)
      setImageKey(result.key!)
    }
  }

  return (
    <div>
      <ImageUpload
        folder="temp"
        onUploadComplete={handleUploadComplete}
      />
      
      {imageUrl && (
        <div>
          <p>已上传的图片：</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  )
}
```

---

## 📝 常见使用场景

### 场景 1：提示词管理（管理员上传预览图）

```tsx
'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/ui/image-upload'
import { Button } from '@/components/ui/button'

export default function PromptEditor() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    previewImage: '',
  })

  const handleUploadComplete = (result) => {
    if (result.success) {
      setFormData(prev => ({
        ...prev,
        previewImage: result.url
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 保存到数据库
    await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>标题</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>

      <div>
        <label>描述</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div>
        <label>预览图</label>
        <ImageUpload
          folder="prompts"
          currentImageUrl={formData.previewImage}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      <Button type="submit">保存提示词</Button>
    </form>
  )
}
```

### 场景 2：用户参考图上传

```tsx
'use client'

import { useState } from 'react'
import { ImageUpload } from '@/components/ui/image-upload'

export default function ReferenceImageUploader() {
  const [referenceImages, setReferenceImages] = useState<string[]>([])

  const handleUploadComplete = (result) => {
    if (result.success) {
      setReferenceImages(prev => [...prev, result.url!])
    }
  }

  return (
    <div>
      <h2>上传参考图</h2>
      <p>上传参考图片以帮助 AI 更好地理解您的需求</p>
      
      <ImageUpload
        folder="references"
        onUploadComplete={handleUploadComplete}
      />

      {referenceImages.length > 0 && (
        <div className="mt-4">
          <h3>已上传的参考图：</h3>
          <div className="grid grid-cols-3 gap-4">
            {referenceImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Reference ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 场景 3：表单中的图片字段

```tsx
'use client'

import { useForm } from 'react-hook-form' // 假设使用 react-hook-form
import { ImageUpload } from '@/components/ui/image-upload'

interface FormData {
  name: string
  email: string
  avatar: string
}

export default function UserProfileForm() {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>()
  const avatarUrl = watch('avatar')

  const onSubmit = async (data: FormData) => {
    // 提交表单数据（包括头像 URL）
    console.log('提交数据：', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="姓名" />
      <input {...register('email')} placeholder="邮箱" />

      <div>
        <label>头像</label>
        <ImageUpload
          folder="temp"
          currentImageUrl={avatarUrl}
          onUploadComplete={(result) => {
            if (result.success) {
              setValue('avatar', result.url!)
            }
          }}
        />
      </div>

      <button type="submit">保存</button>
    </form>
  )
}
```

### 场景 4：编辑模式（显示现有图片）

```tsx
'use client'

import { useEffect, useState } from 'react'
import { ImageUpload } from '@/components/ui/image-upload'

export default function EditPrompt({ promptId }: { promptId: string }) {
  const [prompt, setPrompt] = useState(null)
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null)

  useEffect(() => {
    // 加载现有数据
    fetch(`/api/prompts/${promptId}`)
      .then(res => res.json())
      .then(data => setPrompt(data))
  }, [promptId])

  if (!prompt) return <div>加载中...</div>

  return (
    <div>
      <h2>编辑提示词</h2>
      
      <ImageUpload
        folder="prompts"
        currentImageUrl={newImageUrl || prompt.previewImage}
        onUploadComplete={(result) => {
          if (result.success) {
            setNewImageUrl(result.url!)
          }
        }}
      />

      <button onClick={async () => {
        // 更新数据库
        await fetch(`/api/prompts/${promptId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            previewImage: newImageUrl || prompt.previewImage
          })
        })
      }}>
        保存更改
      </button>
    </div>
  )
}
```

---

## 🎨 自定义样式

### 自定义容器样式

```tsx
<ImageUpload
  className="max-w-md mx-auto"
  folder="temp"
  onUploadComplete={handleUploadComplete}
/>
```

### 禁用状态

```tsx
<ImageUpload
  disabled={isProcessing}
  folder="temp"
  onUploadComplete={handleUploadComplete}
/>
```

---

## 🔧 高级用法

### 1. 上传前确认

```tsx
const handleUploadComplete = (result) => {
  if (result.success) {
    const confirmed = window.confirm('确定使用这张图片吗？')
    if (confirmed) {
      saveImageUrl(result.url)
    }
  }
}
```

### 2. 上传后处理

```tsx
const handleUploadComplete = async (result) => {
  if (result.success) {
    // 保存到数据库
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: result.url,
        key: result.key,
        userId: currentUser.id,
      })
    })
    
    const savedImage = await response.json()
    console.log('已保存到数据库：', savedImage)
  }
}
```

### 3. 结合 Toast 通知

```tsx
import toast from 'react-hot-toast'

const handleUploadComplete = (result) => {
  if (result.success) {
    toast.success('图片上传成功！')
  } else {
    toast.error(`上传失败：${result.error}`)
  }
}
```

### 4. 多个上传组件

```tsx
function MultipleUploads() {
  const [images, setImages] = useState({
    cover: null,
    thumbnail: null,
    background: null,
  })

  return (
    <div>
      <div>
        <h3>封面图</h3>
        <ImageUpload
          folder="prompts"
          onUploadComplete={(result) => {
            if (result.success) {
              setImages(prev => ({ ...prev, cover: result.url }))
            }
          }}
        />
      </div>

      <div>
        <h3>缩略图</h3>
        <ImageUpload
          folder="prompts"
          onUploadComplete={(result) => {
            if (result.success) {
              setImages(prev => ({ ...prev, thumbnail: result.url }))
            }
          }}
        />
      </div>

      <div>
        <h3>背景图</h3>
        <ImageUpload
          folder="prompts"
          onUploadComplete={(result) => {
            if (result.success) {
              setImages(prev => ({ ...prev, background: result.url }))
            }
          }}
        />
      </div>
    </div>
  )
}
```

---

## 📊 与数据库集成

### 示例：保存上传记录

创建 API 路由 `app/api/images/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { url, key, userId } = body

  // 保存到数据库（伪代码）
  const image = await db.images.create({
    data: {
      url,
      key,
      userId,
      uploadedAt: new Date(),
    }
  })

  return NextResponse.json(image)
}
```

在组件中调用：

```tsx
const handleUploadComplete = async (result) => {
  if (result.success) {
    // 保存到数据库
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: result.url,
        key: result.key,
        userId: 'current-user-id',
      })
    })

    const savedImage = await response.json()
    console.log('已保存：', savedImage)
  }
}
```

---

## 🔒 权限控制

### 示例：管理员专属上传

```tsx
'use client'

import { useAuth } from '@/hooks/useAuth' // 假设的认证 hook
import { ImageUpload } from '@/components/ui/image-upload'

export default function AdminPromptUpload() {
  const { user, isAdmin } = useAuth()

  if (!isAdmin) {
    return <div>您没有权限上传图片</div>
  }

  return (
    <ImageUpload
      folder="prompts"
      onUploadComplete={(result) => {
        if (result.success) {
          // 保存到数据库
        }
      }}
    />
  )
}
```

---

## 🎯 文件夹选择指南

选择合适的文件夹以便于管理和设置生命周期策略：

### `references` - 用户参考图
- **用途**：用户上传的参考图片
- **生命周期**：长期保存
- **权限**：用户可读写自己的文件
- **示例**：`references/user123/1234567890-abc.jpg`

### `prompts` - 提示词预览图
- **用途**：管理员上传的提示词预览图
- **生命周期**：长期保存
- **权限**：管理员可写，所有用户可读
- **示例**：`prompts/admin/1234567890-xyz.jpg`

### `temp` - 临时文件
- **用途**：临时上传、测试
- **生命周期**：短期（可设置自动删除策略，如 7 天）
- **权限**：用户可读写自己的文件
- **示例**：`temp/user456/1234567890-tmp.jpg`

---

## 🐛 常见问题

### Q: 上传失败，提示"存储服务未配置"
**A**: 请检查 `.env.local` 文件是否存在并包含所有必需的环境变量。参考 [STORAGE_SETUP.md](./STORAGE_SETUP.md)。

### Q: 上传失败，CORS 错误
**A**: 需要在 R2/S3 存储桶中配置 CORS 策略。详见 [STORAGE_SETUP.md](./STORAGE_SETUP.md#cors-配置)。

### Q: 如何限制用户上传频率？
**A**: 在 API 路由中添加速率限制逻辑：

```typescript
// app/api/uploads/presign/route.ts
import rateLimit from '@/lib/rate-limit' // 假设的速率限制工具

export async function POST(request: NextRequest) {
  const userId = getCurrentUserId(request)
  
  // 检查速率限制（例如：每小时 10 次）
  const allowed = await rateLimit.check(userId, 10, 3600)
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: '上传次数过多，请稍后再试' },
      { status: 429 }
    )
  }

  // 继续处理...
}
```

### Q: 如何清理临时文件？
**A**: 在 R2/S3 中设置生命周期规则自动删除 `temp/` 文件夹中超过 7 天的文件。

### Q: 如何显示上传历史？
**A**: 创建数据库表记录上传，然后查询显示：

```tsx
function UploadHistory() {
  const [uploads, setUploads] = useState([])

  useEffect(() => {
    fetch('/api/images?userId=current-user')
      .then(res => res.json())
      .then(data => setUploads(data))
  }, [])

  return (
    <div>
      {uploads.map(upload => (
        <div key={upload.id}>
          <img src={upload.url} alt="" />
          <p>{new Date(upload.uploadedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 📚 相关文档

- [STORAGE_SETUP.md](./STORAGE_SETUP.md) - 云存储配置指南
- [UPLOAD_TESTING.md](./UPLOAD_TESTING.md) - 测试指南
- [CLOUD_STORAGE_IMPLEMENTATION.md](./CLOUD_STORAGE_IMPLEMENTATION.md) - 实现详情
- [README.md](./README.md) - 项目文档

---

## 💡 最佳实践

### 1. 错误处理
始终处理上传失败的情况：

```tsx
const handleUploadComplete = (result) => {
  if (result.success) {
    // 成功处理
    toast.success('上传成功')
    saveToDatabase(result.url)
  } else {
    // 失败处理
    toast.error(`上传失败：${result.error}`)
    logError(result.error)
  }
}
```

### 2. 加载状态
在保存到数据库时显示加载状态：

```tsx
const [isSaving, setIsSaving] = useState(false)

const handleUploadComplete = async (result) => {
  if (result.success) {
    setIsSaving(true)
    try {
      await saveToDatabase(result.url)
      toast.success('保存成功')
    } catch (error) {
      toast.error('保存失败')
    } finally {
      setIsSaving(false)
    }
  }
}
```

### 3. 验证
在保存前验证数据：

```tsx
const handleUploadComplete = (result) => {
  if (result.success) {
    if (!isValidImageUrl(result.url)) {
      toast.error('无效的图片 URL')
      return
    }
    saveToDatabase(result.url)
  }
}
```

### 4. 清理
组件卸载时清理资源：

```tsx
useEffect(() => {
  return () => {
    // 清理 blob URLs
    // ImageUpload 组件内部已处理
  }
}, [])
```

---

## 🎉 完成集成！

现在您已经了解如何在项目中集成图片上传功能。如有问题，请参考相关文档或查看演示页面 `/upload-demo`。
