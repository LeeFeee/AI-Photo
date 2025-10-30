# 数据库设置指南

本文档说明如何设置和管理 AI Photo 项目的 PostgreSQL 数据库。

## 技术栈

- **ORM**: Prisma
- **数据库**: PostgreSQL
- **密码加密**: bcryptjs

## 数据库模式

### 数据表

#### User (用户表)
存储普通用户信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键（CUID） |
| email | String | 邮箱（唯一） |
| username | String | 用户名（唯一） |
| passwordHash | String | 密码哈希 |
| tokenBalance | Int | 代币余额 |
| isMember | Boolean | 是否为会员 |
| membershipExpiresAt | DateTime? | 会员到期时间 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

#### AdminUser (管理员表)
存储管理员用户信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键（CUID） |
| email | String | 邮箱（唯一） |
| passwordHash | String | 密码哈希 |
| role | String | 角色（默认 "admin"） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

#### Prompt (提示词模板表)
存储预设的图片生成提示词。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键（CUID） |
| name | String | 提示词名称 |
| content | Text | 提示词内容 |
| previewImageUrl | String? | 预览图 URL |
| isActive | Boolean | 是否激活 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

#### GeneratedImage (生成图片记录表)
存储用户生成的图片记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键（CUID） |
| userId | String | 用户 ID（外键） |
| promptId | String | 提示词 ID（外键） |
| referenceImageUrl | String? | 参考图 URL |
| generatedImageUrl | String | 生成的图片 URL |
| tokenCost | Int | 消耗的代币数 |
| createdAt | DateTime | 创建时间 |

#### Transaction (交易记录表)
存储用户的支付和交易记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键（CUID） |
| userId | String | 用户 ID（外键） |
| type | TransactionType | 交易类型（枚举） |
| amount | Decimal | 金额 |
| tokens | Int | 代币数量 |
| stripePaymentId | String? | Stripe 支付 ID |
| status | TransactionStatus | 交易状态（枚举） |
| createdAt | DateTime | 创建时间 |

### 枚举类型

#### TransactionType (交易类型)
- `PURCHASE_TOKENS` - 购买代币
- `PURCHASE_MEMBERSHIP` - 购买会员
- `REFUND` - 退款

#### TransactionStatus (交易状态)
- `PENDING` - 待处理
- `COMPLETED` - 已完成
- `FAILED` - 失败
- `REFUNDED` - 已退款

### 关系

- User 有多个 GeneratedImage
- User 有多个 Transaction
- Prompt 有多个 GeneratedImage
- GeneratedImage 属于一个 User 和一个 Prompt

## 安装和设置

### 前置要求

1. 安装 PostgreSQL
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   
   # Windows
   # 从 https://www.postgresql.org/download/windows/ 下载安装
   ```

2. 创建数据库
   ```bash
   # 连接到 PostgreSQL
   psql -U postgres
   
   # 创建数据库
   CREATE DATABASE ai_photo;
   
   # 退出
   \q
   ```

### 配置环境变量

复制 `.env.example` 文件并重命名为 `.env`：

```bash
cp .env.example .env
```

修改 `.env` 文件中的数据库连接字符串：

```env
DATABASE_URL="postgresql://用户名:密码@localhost:5432/数据库名?schema=public"
```

示例：
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_photo?schema=public"
```

### 生成 Prisma Client

```bash
npm run prisma:generate
```

### 运行数据库迁移

第一次设置时，运行以下命令创建数据库表：

```bash
npm run prisma:migrate
```

系统会提示输入迁移名称，例如：`init`

### 填充种子数据

运行种子脚本来创建初始数据（管理员用户和示例提示词）：

```bash
npm run db:seed
```

种子数据包括：
- 1 个管理员用户（admin@aiphoto.com / admin123）
- 1 个演示用户（demo@example.com / demo123）
- 12 个示例提示词（涵盖风景、城市、人物、动物、美食等类别）
- 1 个未激活的测试提示词

## 常用命令

### Prisma 相关

```bash
# 生成 Prisma Client
npm run prisma:generate

# 创建新的迁移
npm run prisma:migrate

# 打开 Prisma Studio（数据库 GUI）
npm run prisma:studio

# 重置数据库（删除所有数据并重新迁移）
npm run db:reset

# 运行种子脚本
npm run db:seed
```

### 直接使用 Prisma CLI

```bash
# 创建迁移但不应用
npx prisma migrate dev --create-only

# 应用待处理的迁移
npx prisma migrate deploy

# 查看迁移状态
npx prisma migrate status

# 格式化 schema 文件
npx prisma format

# 验证 schema 文件
npx prisma validate
```

## 使用 Prisma Client

在应用中使用 Prisma Client：

```typescript
import { prisma } from '@/lib/prisma'

// 查询用户
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// 创建用户
const newUser = await prisma.user.create({
  data: {
    email: 'new@example.com',
    username: 'newuser',
    passwordHash: hashedPassword,
    tokenBalance: 50,
  }
})

// 查询包含关系的数据
const userWithImages = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    generatedImages: {
      include: {
        prompt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }
  }
})
```

## 数据库维护

### 备份数据库

```bash
# 导出数据库
pg_dump -U postgres ai_photo > backup.sql

# 恢复数据库
psql -U postgres ai_photo < backup.sql
```

### 查看数据库状态

```bash
# 连接到数据库
psql -U postgres ai_photo

# 查看所有表
\dt

# 查看表结构
\d "User"

# 查看表数据
SELECT * FROM "User";
```

## 生产环境注意事项

1. **环境变量安全**
   - 不要将 `.env` 文件提交到版本控制
   - 使用强密码
   - 在生产环境中使用环境变量管理服务

2. **数据库连接**
   - 使用连接池
   - 设置适当的连接限制
   - 考虑使用 PgBouncer

3. **迁移策略**
   - 在生产环境使用 `prisma migrate deploy`
   - 在应用部署前运行迁移
   - 保留迁移历史记录

4. **性能优化**
   - 定期分析查询性能
   - 添加必要的索引
   - 使用 Prisma 的查询优化特性

## 故障排除

### 连接错误

如果遇到 "Can't reach database server" 错误：

1. 确认 PostgreSQL 正在运行
2. 检查连接字符串是否正确
3. 确认数据库存在
4. 检查防火墙设置

### 迁移错误

如果迁移失败：

1. 检查数据库是否有锁定的连接
2. 查看迁移历史：`npx prisma migrate status`
3. 如果需要，手动修复数据库状态
4. 在开发环境可以使用 `npm run db:reset` 重置

### Prisma Client 错误

如果遇到 "PrismaClient is unable to be run in the browser" 错误：

- 确保只在服务器端代码中导入 Prisma Client
- 检查 Next.js 的服务器组件配置

## 参考资源

- [Prisma 官方文档](https://www.prisma.io/docs)
- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [Prisma Schema 参考](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API 参考](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
