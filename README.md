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
- **代码质量**: ESLint + Prettier + Husky

## 📦 快速开始

### 安装依赖

项目支持 `npm`、`pnpm` 或 `yarn`。推荐使用 `npm`:

```bash
npm install
# 或使用 pnpm
pnpm install
# 或使用 yarn
yarn install
```

### 环境变量配置

1. 复制环境变量示例文件：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入必要的配置：

```env
# Database - PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/ai_photo?schema=public"

# Authentication - NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI - Google Gemini
GEMINI_API_KEY="your-gemini-api-key-here"

# Storage - AWS S3 or Cloudflare R2
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="ai-photo-bucket"

# Payment - Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **注意**: 开发环境下，某些服务可以选择性配置。生产环境部署前需完整配置所有必需的环境变量。

### 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

页面会在你编辑文件时自动热重载。

### 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

### 代码质量检查

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 错误
npm run lint:fix

# 运行 Prettier 格式化
npm run format

# 检查代码格式
npm run format:check

# TypeScript 类型检查
npm run typecheck
```

## 📁 项目结构

```
ai-photo/
├── app/                    # Next.js 14 App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   ├── prompts/           # 提示词库页面
│   ├── generate/          # 生成页面
│   └── dashboard/         # 仪表盘页面
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── layout/           # 布局组件
│       ├── header.tsx
│       ├── footer.tsx
│       └── mobile-menu.tsx
├── lib/                  # 工具函数和配置
│   ├── utils.ts         # 通用工具函数
│   ├── env.ts           # 环境变量验证
│   ├── seo.ts           # SEO 辅助函数
│   └── analytics.ts     # 分析工具
├── types/               # TypeScript 类型定义
│   └── index.ts
├── hooks/               # 自定义 React Hooks
│   ├── use-async.ts
│   └── index.ts
├── styles/              # 额外样式文件
├── public/              # 静态资源
├── .env.example         # 环境变量示例
├── .eslintrc.json       # ESLint 配置
├── .prettierrc.json     # Prettier 配置
├── tailwind.config.ts   # Tailwind CSS 配置
├── tsconfig.json        # TypeScript 配置
└── next.config.js       # Next.js 配置
```

## 🎨 设计系统

### 颜色

- **品牌色**: 蓝色系 (brand-50 到 brand-950)
- **强调色**: 紫色系 (accent-50 到 accent-950)
- **语义色**: 灰色系用于文本和背景

### 排版

- 系统字体栈，包含中文字体支持
- 清晰的层级结构

### 动画

项目预置了多个自定义动画：

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

## 🔧 开发工具

### Git Hooks

项目配置了 Husky 和 lint-staged，在提交代码前自动运行检查：

- **pre-commit**: 运行 lint-staged，对暂存文件执行 ESLint 和 Prettier
- 确保提交的代码符合项目规范

### 环境变量验证

使用 `lib/env.ts` 中的工具函数验证环境变量：

```typescript
import { validateEnv, hasEnv, isDevelopment } from '@/lib/env'

// 验证必需的环境变量
validateEnv(['DATABASE_URL', 'NEXTAUTH_SECRET'])

// 检查某个环境变量是否存在
if (hasEnv('GEMINI_API_KEY')) {
  // 使用 Gemini API
}

// 检查当前环境
if (isDevelopment()) {
  console.log('Running in development mode')
}
```

## 📊 Lighthouse 目标分数

- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## 🚀 部署

### Vercel (推荐)

最简单的部署方式是使用 [Vercel](https://vercel.com):

1. 将代码推送到 Git 仓库（GitHub、GitLab 或 Bitbucket）
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署！

### 其他平台

项目支持所有支持 Node.js 的平台：

- Netlify
- AWS Amplify
- Railway
- Render
- 等等

确保在部署前配置好所有必需的环境变量。

## 📝 开发笔记

详细的实施笔记和前后对比请参阅 [POLISH_NOTES.md](./POLISH_NOTES.md)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 PR 前请确保：

1. 代码通过所有 lint 检查：`npm run lint`
2. 代码格式化正确：`npm run format`
3. TypeScript 类型检查通过：`npm run typecheck`
4. 添加了必要的中文注释

## 📄 许可

MIT

---

使用 ❤️ 和 Next.js 构建
