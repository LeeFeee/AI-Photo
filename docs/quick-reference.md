# 快速参考手册

## 数据库命令速查

### Prisma 命令

```bash
# 生成 Prisma Client
npm run prisma:generate

# 创建并应用迁移
npm run prisma:migrate

# 打开 Prisma Studio
npm run prisma:studio

# 填充种子数据
npm run db:seed

# 重置数据库（⚠️ 删除所有数据）
npm run db:reset

# 查看迁移状态
npx prisma migrate status

# 格式化 schema 文件
npx prisma format

# 验证 schema 文件
npx prisma validate
```

### PostgreSQL 命令

```bash
# 连接到数据库
psql -U postgres ai_photo

# 列出所有表
\dt

# 查看表结构
\d "User"

# 查询数据
SELECT * FROM "User";

# 退出
\q

# 备份数据库
pg_dump -U postgres ai_photo > backup.sql

# 恢复数据库
psql -U postgres ai_photo < backup.sql
```

## 数据模型速查

### User（用户）

```typescript
{
  id: string
  email: string          // 唯一
  username: string       // 唯一
  passwordHash: string
  tokenBalance: number   // 默认 0
  isMember: boolean      // 默认 false
  membershipExpiresAt: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### AdminUser（管理员）

```typescript
{
  id: string
  email: string          // 唯一
  passwordHash: string
  role: string          // 默认 "admin"
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Prompt（提示词）

```typescript
{
  id: string
  name: string
  content: string
  previewImageUrl: string?
  isActive: boolean      // 默认 true
  createdAt: DateTime
  updatedAt: DateTime
}
```

### GeneratedImage（生成的图片）

```typescript
{
  id: string
  userId: string
  promptId: string
  referenceImageUrl: string?
  generatedImageUrl: string
  tokenCost: number
  createdAt: DateTime
}
```

### Transaction（交易记录）

```typescript
{
  id: string
  userId: string
  type: TransactionType
  amount: Decimal
  tokens: number         // 默认 0
  stripePaymentId: string?  // 唯一
  status: TransactionStatus // 默认 PENDING
  createdAt: DateTime
}
```

### 枚举类型

```typescript
enum TransactionType {
  PURCHASE_TOKENS      // 购买代币
  PURCHASE_MEMBERSHIP  // 购买会员
  REFUND              // 退款
}

enum TransactionStatus {
  PENDING   // 待处理
  COMPLETED // 已完成
  FAILED    // 失败
  REFUNDED  // 已退款
}
```

## Prisma Client 使用示例

### 查询操作

```typescript
import { prisma } from '@/lib/prisma'

// 查找单个用户
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// 查找多个用户
const users = await prisma.user.findMany({
  where: { isMember: true }
})

// 查询并包含关联数据
const userWithImages = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    generatedImages: {
      include: { prompt: true },
      orderBy: { createdAt: 'desc' }
    }
  }
})

// 分页查询
const prompts = await prisma.prompt.findMany({
  where: { isActive: true },
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' }
})
```

### 创建操作

```typescript
// 创建用户
const newUser = await prisma.user.create({
  data: {
    email: 'new@example.com',
    username: 'newuser',
    passwordHash: hashedPassword,
    tokenBalance: 50
  }
})

// 创建提示词
const newPrompt = await prisma.prompt.create({
  data: {
    name: '新提示词',
    content: '提示词内容...',
    previewImageUrl: 'https://example.com/image.jpg',
    isActive: true
  }
})

// 创建生成记录（带关联）
const image = await prisma.generatedImage.create({
  data: {
    userId: user.id,
    promptId: prompt.id,
    generatedImageUrl: 'https://example.com/generated.jpg',
    tokenCost: 10
  }
})
```

### 更新操作

```typescript
// 更新用户代币余额
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: {
    tokenBalance: {
      increment: 100  // 增加 100 代币
    }
  }
})

// 更新提示词状态
const deactivatedPrompt = await prisma.prompt.update({
  where: { id: promptId },
  data: { isActive: false }
})

// 批量更新
const result = await prisma.prompt.updateMany({
  where: { isActive: false },
  data: { isActive: true }
})
```

### 删除操作

```typescript
// 删除单个记录
await prisma.user.delete({
  where: { id: userId }
})

// 批量删除
await prisma.generatedImage.deleteMany({
  where: {
    createdAt: {
      lt: new Date('2024-01-01')
    }
  }
})
```

### 事务操作

```typescript
// 使用事务确保多个操作同时成功或失败
const result = await prisma.$transaction(async (tx) => {
  // 扣除用户代币
  const user = await tx.user.update({
    where: { id: userId },
    data: {
      tokenBalance: {
        decrement: 10
      }
    }
  })

  // 创建生成记录
  const image = await tx.generatedImage.create({
    data: {
      userId: userId,
      promptId: promptId,
      generatedImageUrl: imageUrl,
      tokenCost: 10
    }
  })

  return { user, image }
})
```

### 聚合查询

```typescript
// 统计用户总数
const userCount = await prisma.user.count()

// 统计活跃提示词数量
const activePromptsCount = await prisma.prompt.count({
  where: { isActive: true }
})

// 计算总收入
const totalRevenue = await prisma.transaction.aggregate({
  where: { status: 'COMPLETED' },
  _sum: { amount: true }
})

// 分组统计
const imagesByUser = await prisma.generatedImage.groupBy({
  by: ['userId'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } }
})
```

## 常用环境变量

```env
# 数据库连接
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_photo?schema=public"

# Next.js
NODE_ENV="development"  # development | production | test

# 认证（预留）
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe（预留）
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI API（预留）
OPENAI_API_KEY="sk-..."
```

## 默认测试账户

```
管理员：
邮箱: admin@aiphoto.com
密码: admin123

演示用户：
邮箱: demo@example.com
密码: demo123
```

## 项目结构

```
ai-photo/
├── app/              # Next.js App Router 页面
├── components/       # React 组件
├── lib/             # 工具函数和共享代码
│   ├── prisma.ts    # Prisma Client 单例
│   ├── utils.ts     # 工具函数
│   └── seo.ts       # SEO 辅助函数
├── prisma/          # Prisma 配置
│   ├── schema.prisma  # 数据库 schema
│   ├── seed.ts        # 种子数据脚本
│   └── migrations/    # 迁移文件
├── docs/            # 项目文档
│   ├── database.md      # 数据库详细文档
│   └── quick-reference.md  # 快速参考
├── public/          # 静态资源
├── .env             # 环境变量（不提交到 Git）
├── .env.example     # 环境变量模板
└── package.json     # 项目依赖和脚本
```

## 开发工作流

### 添加新功能

1. 创建新分支：`git checkout -b feature/new-feature`
2. 编写代码
3. 测试功能
4. 提交更改：`git commit -m "feat: add new feature"`
5. 推送分支：`git push origin feature/new-feature`

### 修改数据库

1. 编辑 `prisma/schema.prisma`
2. 创建迁移：`npm run prisma:migrate`
3. 更新种子数据（如需要）：编辑 `prisma/seed.ts`
4. 测试迁移：`npm run db:reset`

### 部署前检查

```bash
# 类型检查
npx tsc --noEmit

# 代码检查
npm run lint

# 构建测试
npm run build

# 验证 Prisma
npx prisma validate

# 查看迁移状态
npx prisma migrate status
```

## 故障排除

### 问题：无法连接数据库

```bash
# 检查 PostgreSQL 是否运行
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# 测试连接
psql -U postgres -h localhost
```

### 问题：Prisma Client 过期

```bash
# 重新生成 Prisma Client
npm run prisma:generate

# 清理缓存
rm -rf node_modules/.prisma
npm run prisma:generate
```

### 问题：迁移失败

```bash
# 查看迁移状态
npx prisma migrate status

# 标记迁移为已应用（谨慎使用）
npx prisma migrate resolve --applied "20241030000000_migration_name"

# 回滚到特定迁移
npx prisma migrate resolve --rolled-back "20241030000000_migration_name"
```

## 有用的链接

- [Prisma 官方文档](https://www.prisma.io/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
