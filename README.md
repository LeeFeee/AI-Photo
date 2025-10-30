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
- **数据库**: Prisma + SQLite
- **支付**: Stripe

## 📦 安装

```bash
# 安装依赖
npm install

# 设置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 Stripe 密钥

# 初始化数据库
npx prisma migrate dev

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 💳 Stripe 支付配置

### 1. 获取 Stripe 密钥

1. 注册 [Stripe 账号](https://stripe.com)
2. 进入 Dashboard → Developers → API keys
3. 复制 Publishable key 和 Secret key（测试模式）

### 2. 创建产品和价格

在 Stripe Dashboard 中创建产品和价格 ID：

1. 进入 Products → Add product
2. 创建以下产品：
   - 入门套餐：¥10.00 → 100 代币
   - 基础套餐：¥45.00 → 500 代币（+50 赠送）
   - 专业套餐：¥80.00 → 1000 代币（+200 赠送）
   - 企业套餐：¥350.00 → 5000 代币（+1500 赠送）
3. 复制每个价格的 Price ID（格式：`price_xxxxx`）

### 3. 配置环境变量

在 `.env` 文件中设置：

```env
# Stripe 配置（测试模式）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# 可选：配置具体的 Price ID
STRIPE_PRICE_ID_STARTER=price_xxxxx
STRIPE_PRICE_ID_BASIC=price_xxxxx
STRIPE_PRICE_ID_PRO=price_xxxxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx
```

### 4. 测试 Webhook（使用 Stripe CLI）

安装 Stripe CLI：

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# 下载二进制文件：https://github.com/stripe/stripe-cli/releases
```

登录并测试 webhook：

```bash
# 登录 Stripe
stripe login

# 转发 webhook 事件到本地开发服务器
stripe listen --forward-to localhost:3000/api/stripe/webhook

# CLI 会输出 webhook 签名密钥（whsec_xxxxx）
# 复制密钥到 .env 的 STRIPE_WEBHOOK_SECRET
```

### 5. 测试支付流程

```bash
# 启动开发服务器
npm run dev

# 在另一个终端启动 Stripe CLI 监听
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 访问 http://localhost:3000/pricing/tokens
# 点击"立即购买"，使用测试卡号：
# - 卡号：4242 4242 4242 4242
# - 有效期：任意未来日期
# - CVC：任意3位数字
# - 邮编：任意5位数字

# 查看终端输出的 webhook 事件日志
```

### 6. 测试支付场景

使用不同的测试卡号模拟不同场景：

```bash
# 成功支付
4242 4242 4242 4242

# 需要 3D 验证
4000 0025 0000 3155

# 支付失败（资金不足）
4000 0000 0000 9995

# 支付失败（卡被拒绝）
4000 0000 0000 0002
```

### 7. 手动触发 Webhook 测试

```bash
# 模拟 checkout.session.completed 事件
stripe trigger checkout.session.completed

# 模拟 payment_intent.succeeded 事件
stripe trigger payment_intent.succeeded

# 模拟 payment_intent.payment_failed 事件
stripe trigger payment_intent.payment_failed
```

### 8. 查看测试日志

```bash
# 查看最近的 webhook 事件
stripe events list --limit 10

# 查看具体事件详情
stripe events retrieve evt_xxxxx
```

## 🎯 Webhook 处理说明

Webhook 端点：`/api/stripe/webhook`

处理的事件：
- ✅ `checkout.session.completed` - 结账完成，更新交易状态和用户余额
- ✅ `payment_intent.succeeded` - 支付成功，记录日志
- ✅ `payment_intent.payment_failed` - 支付失败，标记交易失败

特性：
- ✅ **幂等性**: 重复的 webhook 事件不会重复处理
- ✅ **事务性**: 使用 Prisma 事务确保数据一致性
- ✅ **签名验证**: 验证 Stripe webhook 签名，防止伪造请求
- ✅ **错误处理**: 完整的错误日志和异常处理

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
- `/dashboard` - 我的作品，查看生成历史和代币余额
- `/pricing/tokens` - 代币购买页面，展示套餐和价格

## 🔌 API 路由

- `POST /api/stripe/create-checkout` - 创建 Stripe Checkout Session
- `POST /api/stripe/webhook` - 处理 Stripe Webhook 事件

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

## 🚀 未来增强

- Storybook 组件文档
- 用户认证
- 实际 AI API 集成
- 高级提示词构建器
- 图片编辑功能
- 社交分享
- 用户偏好设置

## 📄 许可

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

使用 ❤️ 和 Next.js 构建
