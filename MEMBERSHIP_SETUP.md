# 会员订阅系统设置指南 (Membership Subscription Setup Guide)

## 概述 (Overview)

本系统实现了基于 Stripe 的会员订阅功能，包括：
- 月度和年度订阅计划
- Stripe Checkout 支付流程
- Webhook 自动更新会员状态
- 会员门户管理订阅
- 会员权限门控

## 🔧 环境配置 (Environment Setup)

### 1. 创建 .env 文件 (Create .env file)

复制 `.env.example` 并填入实际值：

```bash
cp .env.example .env
```

### 2. 配置 Stripe

#### a. 获取 API 密钥 (Get API Keys)
1. 访问 [Stripe Dashboard](https://dashboard.stripe.com)
2. 切换到测试模式 (Test mode)
3. 进入 Developers → API keys
4. 复制 Secret key 和 Publishable key

#### b. 创建产品和价格 (Create Products and Prices)
1. 进入 Products → Add product
2. 创建 "会员订阅" 产品
3. 添加两个价格：
   - 月度：¥29/月 (recurring)
   - 年度：¥299/年 (recurring)
4. 复制价格 ID（以 `price_` 开头）

#### c. 配置 Webhook (Configure Webhook)
1. 进入 Developers → Webhooks → Add endpoint
2. 端点 URL：`https://your-domain.com/api/stripe/webhook`
3. 选择事件：
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
4. 复制 Webhook 签名密钥（以 `whsec_` 开头）

### 3. 配置数据库 (Configure Database)

#### a. 创建数据库
```bash
# 使用 PostgreSQL
createdb ai_photo
```

#### b. 运行迁移
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 📁 文件结构 (File Structure)

```
app/
├── api/
│   ├── stripe/
│   │   ├── checkout/route.ts    # 创建支付会话
│   │   ├── webhook/route.ts     # 处理 Stripe 事件
│   │   └── portal/route.ts      # 客户门户
│   └── user/route.ts            # 用户信息 API
├── pricing/
│   └── membership/page.tsx      # 会员定价页面
└── prompts/
    └── [id]/page.tsx            # 提示词详情（带会员门控）

components/
└── membership/
    ├── membership-status.tsx    # 会员状态卡片
    └── checkout-button.tsx      # 结账按钮

lib/
├── prisma.ts                    # Prisma 客户端
├── stripe.ts                    # Stripe 客户端
└── membership.ts                # 会员检查函数

prisma/
└── schema.prisma                # 数据库模型
```

## 🔄 工作流程 (Workflow)

### 订阅流程 (Subscription Flow)

1. **用户访问定价页面**
   - `/pricing/membership`
   - 查看月度/年度计划

2. **点击订阅按钮**
   - 调用 `/api/stripe/checkout`
   - 创建 Stripe Checkout Session
   - 重定向到 Stripe 支付页面

3. **完成支付**
   - Stripe 触发 `checkout.session.completed` webhook
   - 创建交易记录
   - 更新会员状态

4. **订阅生效**
   - Stripe 触发 `customer.subscription.created` webhook
   - 设置 `isMember = true`
   - 设置 `membershipExpiresAt` = 订阅周期结束时间

### 续费和取消 (Renewal and Cancellation)

- **自动续费**：Stripe 自动处理，webhook 更新 `membershipExpiresAt`
- **用户取消**：通过客户门户，webhook 在周期结束时设置 `isMember = false`
- **订阅删除**：触发 `customer.subscription.deleted` webhook

## 🎯 会员权益实现 (Membership Benefits Implementation)

### 1. 提示词门控 (Prompt Gating)

```typescript
// app/prompts/[id]/page.tsx
const { isMember } = await checkMembershipStatus(userId)
const canView = !prompt.isPremium || isMember
```

### 2. 会员状态显示 (Membership Status Display)

```tsx
// 在 dashboard 中使用
import { MembershipStatus } from '@/components/membership/membership-status'

<MembershipStatus 
  isMember={user.isMember}
  membershipExpiresAt={user.membershipExpiresAt}
  userId={user.id}
/>
```

### 3. 实时检查 (Real-time Checks)

会员状态通过 webhook 自动更新，无需手动干预：
- 订阅成功 → 立即成为会员
- 订阅取消 → 周期结束时失去权限
- 订阅续费 → 自动延长到期时间

## 💾 数据库模型 (Database Models)

### User (用户)
```prisma
model User {
  isMember            Boolean   // 是否是会员
  membershipExpiresAt DateTime? // 会员到期时间
  stripeCustomerId    String?   // Stripe 客户 ID
  tokens              Int       // 代币余额（独立于会员）
}
```

### Transaction (交易)
```prisma
model Transaction {
  type   String  // membership_purchase, token_purchase, token_consumption
  amount Float   // 金额
  tokens Int     // 代币变化（会员购买时为 0）
  status String  // pending, completed, failed
}
```

## 🔐 会员与代币的区别 (Membership vs Tokens)

### 会员订阅 (Membership)
- **用途**：解锁高级提示词库访问权限
- **特点**：
  - 按月/年订阅
  - 自动续费
  - 不影响代币余额
  - 到期后失去访问权限

### 代币系统 (Tokens)
- **用途**：消耗生成图片
- **特点**：
  - 单独购买
  - 按次消耗
  - 会员和非会员都需要
  - 年费会员额外赠送 100 代币

## 🧪 测试 (Testing)

### Stripe 测试卡号

```
成功支付：4242 4242 4242 4242
需要 3D 验证：4000 0027 6000 3184
支付失败：4000 0000 0000 0002

任意未来日期 + 任意 CVC
```

### 测试流程

1. **订阅测试**
   ```bash
   # 访问定价页面
   http://localhost:3000/pricing/membership
   
   # 点击订阅，使用测试卡号完成支付
   # 检查 dashboard 会员状态
   ```

2. **Webhook 测试**
   ```bash
   # 使用 Stripe CLI 转发 webhook
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # 触发测试事件
   stripe trigger customer.subscription.created
   ```

3. **取消测试**
   ```bash
   # 在 dashboard 点击"管理订阅"
   # 进入客户门户取消订阅
   # 检查状态更新
   ```

## 📊 监控和日志 (Monitoring and Logging)

所有 webhook 事件都会记录到控制台：
- 订阅创建/更新
- 订阅删除
- 交易记录创建

在生产环境中建议添加：
- 错误监控 (Sentry)
- 日志服务 (LogRocket)
- 数据库监控

## 🚀 部署注意事项 (Deployment Notes)

1. **环境变量**：确保所有生产环境变量已配置
2. **Webhook URL**：更新为生产域名
3. **Stripe 模式**：切换到生产模式并重新配置价格和 webhook
4. **数据库迁移**：在部署前运行 `prisma migrate deploy`
5. **客户门户**：在 Stripe 中启用并配置品牌

## 📞 故障排除 (Troubleshooting)

### Webhook 未触发
- 检查 webhook 签名密钥是否正确
- 查看 Stripe Dashboard 的 webhook 日志
- 确认端点 URL 可访问

### 会员状态未更新
- 检查数据库连接
- 查看 API 日志
- 验证 userId 是否正确传递

### 支付失败
- 检查 Stripe API 密钥
- 确认价格 ID 正确
- 查看 Stripe Dashboard 的支付日志

## 📚 相关文档 (Related Documentation)

- [Stripe 文档](https://stripe.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
