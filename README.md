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
- 💎 **代币系统** - 完整的代币管理和交易记录
- 🔐 **会员机制** - 会员专属提示词和权限控制
- 🤖 **AI 集成** - Google Gemini AI 服务集成
- 💾 **数据持久化** - Prisma + SQLite/PostgreSQL

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Prisma + SQLite (开发) / PostgreSQL (生产)
- **AI 服务**: Google Generative AI (Gemini)
- **UI 组件**: Radix UI
- **图标**: Lucide React
- **通知**: React Hot Toast

## 📦 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 设置数据库
DATABASE_URL="file:./dev.db" npx prisma generate
DATABASE_URL="file:./dev.db" npx prisma db push
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts

# 3. 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始使用！

详细步骤请查看 [QUICKSTART.md](./QUICKSTART.md)

### 其他命令

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 查看数据库
DATABASE_URL="file:./dev.db" npx prisma studio
```

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
- `/generate` - **生成页面**，选择提示词、上传参考图、生成 AI 图片
- `/dashboard` - **我的作品**，查看生成历史和下载图片

## 🎯 核心功能

### 图片生成流程

1. **选择提示词** - 9 个预设提示词（6 个公开，3 个会员专属）
2. **上传参考图**（可选）- 支持最大 5MB 的图片文件
3. **确认代币消耗** - 查看所需代币和余额
4. **生成图片** - 多步骤进度指示（验证 → 生成 → 保存）
5. **查看结果** - 即时显示，支持下载
6. **查看作品集** - 在仪表板查看所有生成的图片

### 代币系统

- 初始余额：100 代币
- 公开提示词：5 代币/次
- 会员提示词：10 代币/次
- 原子化扣除：确保数据一致性
- 交易记录：完整的消费历史

### 会员机制

- 会员专属提示词
- 带锁图标标识
- 非会员无法选择
- 服务端权限验证

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

## 📚 文档

- [QUICKSTART.md](./QUICKSTART.md) - 5 分钟快速上手指南
- [IMAGE_GENERATION_IMPLEMENTATION.md](./IMAGE_GENERATION_IMPLEMENTATION.md) - 完整技术实现文档
- [GENERATION_FLOW_TESTS.md](./GENERATION_FLOW_TESTS.md) - 测试指南和场景
- [TICKET_COMPLETION_SUMMARY.md](./TICKET_COMPLETION_SUMMARY.md) - 功能实现总结
- [POLISH_NOTES.md](./POLISH_NOTES.md) - UI/UX 设计笔记

## 🗄️ 数据库

使用 Prisma ORM，支持多种数据库：

### 模型结构
- **User** - 用户账户、代币余额、会员状态
- **Prompt** - AI 提示词、分类、定价
- **GeneratedImage** - 生成的图片记录
- **Transaction** - 代币交易历史

### 查看数据
```bash
DATABASE_URL="file:./dev.db" npx prisma studio
```

## 🤖 AI 集成

当前集成 Google Gemini AI：

- 提示词增强
- 智能内容生成
- Mock 模式（无需 API 密钥即可开发）

配置真实 API：
```bash
# .env
GEMINI_API_KEY="your-api-key-here"
```

## 🚀 生产部署

部署前检查清单：

- [ ] 替换演示用户为真实认证系统
- [ ] 配置图片存储服务（S3, Cloudinary）
- [ ] 迁移到 PostgreSQL 数据库
- [ ] 设置真实 AI API
- [ ] 添加速率限制
- [ ] 配置监控和日志
- [ ] 安全审计

详见 [IMAGE_GENERATION_IMPLEMENTATION.md](./IMAGE_GENERATION_IMPLEMENTATION.md)

## 📄 许可

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

使用 ❤️ 和 Next.js 构建
