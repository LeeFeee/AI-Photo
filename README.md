# AI Photo - 智能图片生成平台

使用 AI 技术根据预设提示词生成精美图片

## ✨ 特性

- 🎨 **简洁+创意设计** - 清晰的界面设计，创意的交互体验
- 📱 **完全响应式** - 完美适配移动端、平板和桌面设备
- ♿ **无障碍支持** - 符合 WCAG AA 标准，支持键盘导航和屏读器
- 🚀 **高性能** - Next.js 14 + TypeScript，优化的加载速度
- 🎯 **SEO 优化** - 完整的 SEO 元数据和 OpenGraph 支持
- 🎭 **微交互** - 流畅的动画和过渡效果
- 🌏 **中文本地化** - 完整的简体中文界面

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI
- **图标**: Lucide React
- **通知**: React Hot Toast
- **云存储**: Cloudflare R2 / AWS S3

## 📦 安装

```bash
# 安装依赖
npm install

# 配置环境变量（云存储）
cp .env.example .env.local
# 编辑 .env.local 并填入您的存储配置

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## ☁️ 云存储配置

本应用支持安全的图片上传到 Cloudflare R2 或 AWS S3。

### 快速开始

1. **复制环境变量模板**
   ```bash
   cp .env.example .env.local
   ```

2. **配置存储服务**
   
   选择 Cloudflare R2（推荐）或 AWS S3，并在 `.env.local` 中配置：
   
   ```env
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=your_bucket_name
   R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   R2_REGION=auto
   R2_PUBLIC_URL=https://your-cdn-domain.com
   ```

3. **配置 CORS 和存储桶策略**
   
   详细配置步骤请参阅 [STORAGE_SETUP.md](./STORAGE_SETUP.md)

### 功能特性

- ✅ **预签名 URL 上传** - 客户端直接上传，无需通过服务器
- ✅ **文件验证** - 类型和大小验证（默认最大 5MB）
- ✅ **拖放上传** - 支持拖拽和点击上传
- ✅ **实时进度** - 显示上传进度和状态
- ✅ **图片预览** - 上传前后实时预览
- ✅ **错误处理** - 完整的错误提示（中文）
- ✅ **安全认证** - 只有已认证用户可上传

### 使用示例

```tsx
import { ImageUpload } from '@/components/ui/image-upload'

function MyComponent() {
  const handleUploadComplete = (result) => {
    if (result.success) {
      console.log('上传成功！URL:', result.url)
      // 保存 URL 到数据库
    }
  }

  return (
    <ImageUpload
      folder="prompts"
      onUploadComplete={handleUploadComplete}
    />
  )
}
```

详细配置指南：**[STORAGE_SETUP.md](./STORAGE_SETUP.md)**

## 🎨 设计系统

### 颜色
- **品牌色**: 蓝色系 (brand-*)
- **强调色**: 紫色系 (accent-*)
- **语义色**: 灰色系用于文本和背景

### 排版
- 系统字体栈，包含中文字体支持
- 清晰的层级结构

### 动画
- `fade-in`: 渐入动画
- `slide-in`: 滑入动画（抽屉导航）
- `scale-in`: 缩放动画（交互反馈）
- `spin-slow`: 加载动画

## 📱 页面结构

- `/` - 首页，展示主要功能和 CTA
- `/prompts` - 提示词库，浏览和搜索提示词
- `/generate` - 生成页面，输入提示词生成图片
- `/dashboard` - 我的作品，查看生成历史

## ♿ 无障碍特性

- ✅ 语义化 HTML
- ✅ ARIA 标签
- ✅ 键盘导航
- ✅ 屏幕阅读器支持
- ✅ 颜色对比度符合 WCAG AA
- ✅ 焦点状态清晰可见

## 🔍 SEO 优化

- ✅ 页面级元数据
- ✅ OpenGraph 标签
- ✅ Twitter Card 支持
- ✅ Robots.txt
- ✅ 结构化数据准备就绪
- ✅ 语义化 HTML 结构

## 📊 Lighthouse 目标分数

- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## 🎯 设计理念: 简洁+创意

### 简洁
- 清晰的界面，无杂乱元素
- 一致的间距和对齐
- 清晰的视觉层次
- 直观的导航

### 创意
- 渐变色 CTA
- 流畅的动画
- 趣味的悬停效果
- 个性化的品牌色彩

## 📝 开发笔记

详细的实施笔记和前后对比请参阅 [POLISH_NOTES.md](./POLISH_NOTES.md)

云存储配置指南请参阅 [STORAGE_SETUP.md](./STORAGE_SETUP.md)

## 🚀 未来增强

- Storybook 组件文档
- 用户认证系统（当前为占位实现）
- 实际 AI API 集成
- 高级提示词构建器
- 图片编辑功能
- 社交分享
- 用户偏好设置
- 数据库集成（持久化上传记录）

## 📄 许可

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

使用 ❤️ 和 Next.js 构建
