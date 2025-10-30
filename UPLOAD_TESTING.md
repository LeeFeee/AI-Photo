# 图片上传功能测试指南

本文档提供完整的图片上传功能测试步骤和验证清单。

## 📋 前置条件

在开始测试前，确保：

1. ✅ 已安装所有依赖：`npm install`
2. ✅ 已配置环境变量（复制 `.env.example` 为 `.env.local` 并填写）
3. ✅ 已在 R2/S3 配置 CORS 策略
4. ✅ 已设置存储桶权限
5. ✅ 开发服务器正在运行：`npm run dev`

详细配置步骤见 [STORAGE_SETUP.md](./STORAGE_SETUP.md)

---

## 🧪 测试场景

### 1. API 端点测试

#### 1.1 检查配置状态

```bash
curl http://localhost:3000/api/uploads/presign
```

**预期响应**（配置正确）：
```json
{
  "success": true,
  "configured": true,
  "limits": {
    "maxSize": 5242880,
    "maxSizeMB": "5.00",
    "allowedTypes": ["image/jpeg", "image/png", "image/webp", "image/gif"],
    "allowedExtensions": ["jpeg", "png", "webp", "gif"]
  }
}
```

**预期响应**（配置缺失）：
```json
{
  "success": true,
  "configured": false,
  "limits": {...}
}
```

#### 1.2 测试预签名 URL 生成

```bash
curl -X POST http://localhost:3000/api/uploads/presign \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.jpg",
    "fileType": "image/jpeg",
    "fileSize": 1024000,
    "folder": "temp"
  }'
```

**预期响应**（成功）：
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://...",
    "key": "temp/dev-user/1234567890-abc123.jpg",
    "publicUrl": "https://...",
    "expiresIn": 3600
  },
  "limits": {...}
}
```

**预期响应**（文件太大）：
```json
{
  "success": false,
  "error": "文件太大",
  "message": "文件太大。最大允许 5MB。",
  "limits": {...}
}
```

**预期响应**（文件类型不支持）：
```json
{
  "success": false,
  "error": "文件类型不支持",
  "message": "不支持的文件类型。允许的类型：image/jpeg,image/png,image/webp,image/gif",
  "limits": {...}
}
```

---

### 2. 上传组件 UI 测试

访问演示页面：`http://localhost:3000/upload-demo`

#### 2.1 初始状态

- [ ] 显示上传区域（虚线边框）
- [ ] 显示图标（图片图标）
- [ ] 显示提示文本："点击或拖拽图片到此处"
- [ ] 显示格式限制："支持 JPG、PNG、WebP、GIF 格式，最大 5MB"
- [ ] 显示"选择图片"按钮
- [ ] 底部显示上传说明

#### 2.2 点击上传

1. 点击上传区域或"选择图片"按钮
2. 选择一个有效的图片文件（JPG/PNG/WebP/GIF，< 5MB）

**预期行为**：
- [ ] 立即显示图片预览
- [ ] 显示上传进度遮罩（黑色半透明）
- [ ] 显示旋转加载图标
- [ ] 显示"上传中..."文本
- [ ] 显示进度百分比（0% → 100%）
- [ ] 上传完成后移除遮罩
- [ ] 在预览图右上角显示"清除"按钮（X）
- [ ] 下方显示绿色成功消息："✓ 上传成功！"
- [ ] 显示上传结果详情（URL 和 Key）

#### 2.3 拖拽上传

1. 从文件管理器拖拽图片文件到上传区域
2. 悬停在上传区域上方

**预期行为**：
- [ ] 悬停时边框变为蓝色（brand-500）
- [ ] 背景变为浅蓝色（brand-50）
- [ ] 提示文本变为："松开以上传"
- [ ] 松开后立即开始上传（同点击上传）

#### 2.4 文件验证

##### 测试：文件类型错误
上传非图片文件（如 .pdf、.txt、.mp4）

**预期行为**：
- [ ] 显示红色错误消息
- [ ] 错误图标（AlertCircle）
- [ ] 错误标题："上传失败"
- [ ] 错误详情："不支持的文件类型。请上传 JPG、PNG、WebP 或 GIF 格式的图片。"
- [ ] 不显示图片预览

##### 测试：文件大小超限
上传 > 5MB 的图片文件

**预期行为**：
- [ ] 显示红色错误消息
- [ ] 错误标题："上传失败"
- [ ] 错误详情："文件太大。最大允许 5MB。"
- [ ] 不显示图片预览

#### 2.5 清除上传

1. 成功上传图片后
2. 点击预览图右上角的"X"按钮

**预期行为**：
- [ ] 预览图消失
- [ ] 恢复初始上传界面
- [ ] 清除成功/错误消息
- [ ] 可以重新上传

---

### 3. 多文件夹测试

在演示页面测试三种不同的文件夹：

#### 3.1 参考图（references）
- [ ] 上传成功
- [ ] Key 包含 `references/` 前缀
- [ ] 示例：`references/dev-user/1234567890-abc123.jpg`

#### 3.2 提示词预览（prompts）
- [ ] 上传成功
- [ ] Key 包含 `prompts/` 前缀
- [ ] 示例：`prompts/dev-user/1234567890-abc123.png`

#### 3.3 临时文件（temp）
- [ ] 上传成功
- [ ] Key 包含 `temp/` 前缀
- [ ] 示例：`temp/dev-user/1234567890-abc123.webp`

---

### 4. 集成测试

#### 4.1 在自定义页面中使用

创建测试页面 `app/test-upload/page.tsx`：

```tsx
'use client'

import { useState } from 'react'
import { ImageUpload, UploadResult } from '@/components/ui/image-upload'

export default function TestUploadPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleUploadComplete = (result: UploadResult) => {
    if (result.success) {
      setUploadedUrl(result.url!)
      console.log('上传成功！', result)
    } else {
      console.error('上传失败：', result.error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">上传测试</h1>
      
      <ImageUpload
        folder="temp"
        onUploadComplete={handleUploadComplete}
      />

      {uploadedUrl && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <p className="font-medium">已保存的 URL：</p>
          <p className="text-sm break-all mt-2">{uploadedUrl}</p>
        </div>
      )}
    </div>
  )
}
```

**测试步骤**：
1. 访问 `http://localhost:3000/test-upload`
2. 上传图片
3. 验证 `onUploadComplete` 回调被触发
4. 验证 URL 被保存到状态
5. 检查浏览器控制台日志

#### 4.2 编辑模式测试

测试显示现有图片：

```tsx
<ImageUpload
  folder="prompts"
  currentImageUrl="https://example.com/existing-image.jpg"
  onUploadComplete={handleUploadComplete}
/>
```

**预期行为**：
- [ ] 加载时显示现有图片
- [ ] 显示"清除"按钮
- [ ] 可以清除并重新上传
- [ ] 新上传替换旧图片

---

### 5. 错误处理测试

#### 5.1 网络错误

1. 断开网络连接
2. 尝试上传图片

**预期行为**：
- [ ] 显示错误消息
- [ ] 提示重试

#### 5.2 API 错误

1. 停止开发服务器
2. 尝试上传图片

**预期行为**：
- [ ] 显示"获取上传地址失败"或类似错误
- [ ] 不崩溃，优雅降级

#### 5.3 存储服务错误

1. 使用错误的存储配置
2. 尝试上传图片

**预期行为**：
- [ ] 显示"存储服务未配置"或"文件上传失败"
- [ ] 提供有用的错误信息

---

### 6. 浏览器兼容性测试

在以下浏览器中测试：

- [ ] Chrome（最新版本）
- [ ] Firefox（最新版本）
- [ ] Safari（最新版本）
- [ ] Edge（最新版本）

**验证项**：
- [ ] 拖放功能正常
- [ ] 文件选择对话框正常
- [ ] 预览图显示正常
- [ ] 进度显示正常
- [ ] 样式显示正确

---

### 7. 响应式测试

在不同设备尺寸测试：

#### 7.1 移动端（< 768px）
- [ ] 上传区域适配屏幕宽度
- [ ] 触摸上传正常
- [ ] 预览图正确缩放
- [ ] 按钮大小适合触摸

#### 7.2 平板（768px - 1024px）
- [ ] 布局合理
- [ ] 所有功能正常

#### 7.3 桌面（> 1024px）
- [ ] 充分利用空间
- [ ] 拖放体验流畅

---

### 8. 性能测试

#### 8.1 大文件上传
上传接近 5MB 的图片：
- [ ] 进度显示准确
- [ ] 上传时间合理（< 30 秒）
- [ ] 不阻塞 UI

#### 8.2 快速连续上传
快速清除并重新上传：
- [ ] 不出现内存泄漏
- [ ] Blob URL 正确清理
- [ ] 状态正确重置

#### 8.3 多个上传组件
同时在页面上使用多个上传组件：
- [ ] 互不干扰
- [ ] 各自独立工作

---

### 9. 安全测试

#### 9.1 认证检查
- [ ] 开发模式：允许无认证访问
- [ ] 生产模式：需要认证（待实现真实认证）

#### 9.2 文件验证
- [ ] 服务器端验证文件类型
- [ ] 服务器端验证文件大小
- [ ] 不能绕过客户端验证

#### 9.3 CORS
- [ ] 只允许配置的域名
- [ ] 正确处理 OPTIONS 预检请求

---

## ✅ 验收标准

所有以下标准必须通过：

### 功能性
- [x] 可以通过点击上传图片
- [x] 可以通过拖拽上传图片
- [x] 显示实时预览
- [x] 显示上传进度
- [x] 支持三种文件夹（references、prompts、temp）
- [x] 返回公开访问 URL

### 验证
- [x] 验证文件类型（仅图片）
- [x] 验证文件大小（最大 5MB）
- [x] 显示清晰的错误消息（中文）

### 用户体验
- [x] 流畅的动画
- [x] 清晰的状态反馈
- [x] 响应式设计
- [x] 无障碍支持

### 安全性
- [x] 使用预签名 URL（客户端直接上传）
- [x] 不暴露存储凭证
- [x] 认证检查（占位实现）
- [x] 服务器端验证

### 文档
- [x] README 更新
- [x] 完整的配置指南（STORAGE_SETUP.md）
- [x] 环境变量模板（.env.example）
- [x] 使用示例代码

---

## 🐛 已知问题

目前无已知问题。

---

## 📝 测试报告模板

测试完成后，填写此报告：

```markdown
# 图片上传功能测试报告

**测试日期**: YYYY-MM-DD
**测试人员**: [Your Name]
**环境**: 开发/生产
**存储服务**: Cloudflare R2 / AWS S3

## 测试结果摘要

- 总测试项: XX
- 通过: XX
- 失败: XX
- 跳过: XX

## 详细结果

### API 端点测试
- [ ] 配置状态检查：✅/❌
- [ ] 预签名 URL 生成：✅/❌

### UI 组件测试
- [ ] 点击上传：✅/❌
- [ ] 拖拽上传：✅/❌
- [ ] 文件验证：✅/❌
- [ ] 错误处理：✅/❌

### 集成测试
- [ ] 自定义页面集成：✅/❌
- [ ] 编辑模式：✅/❌

### 浏览器兼容性
- [ ] Chrome：✅/❌
- [ ] Firefox：✅/❌
- [ ] Safari：✅/❌
- [ ] Edge：✅/❌

### 响应式
- [ ] 移动端：✅/❌
- [ ] 平板：✅/❌
- [ ] 桌面：✅/❌

## 问题和建议

[列出发现的问题和改进建议]

## 结论

[通过/需要修复]
```

---

## 需要帮助？

如遇到问题：
1. 检查 [STORAGE_SETUP.md](./STORAGE_SETUP.md) 配置指南
2. 查看浏览器控制台错误
3. 检查服务器日志
4. 验证环境变量配置
5. 确认 CORS 设置正确
