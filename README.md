# AI-Photo Admin Analytics System

一个用于AI照片生成平台的管理员分析系统，提供用户管理、交易监控和数据分析功能。

A comprehensive admin analytics system for AI photo generation platform with user management, transaction monitoring, and data analytics.

## 功能特性 (Features)

### 1. 管理员仪表盘 (Admin Dashboard)
- **路径**: `/admin`
- **功能**:
  - 总收入统计 (Total Revenue)
  - 活跃会员数 (Active Members Count)
  - 已使用代币总数 (Total Tokens Spent)
  - 总用户数 (Total Users)
  - 30天收入趋势图表 (30-day Revenue Trend Chart)
  - 最近7天收入柱状图 (Last 7 Days Revenue Bar Chart)

### 2. 用户管理 (User Management)
- **路径**: `/admin/users`
- **功能**:
  - 用户列表展示，包含以下字段：
    - 邮箱 (Email)
    - 用户名 (Username)
    - 代币余额 (Token Balance)
    - 会员状态 (Membership Status)
    - 会员过期日期 (Membership Expires At)
    - 创建日期 (Created At)
  - 搜索功能（按邮箱或用户名）
  - 列排序功能
  - 分页功能（每页10条记录）

### 3. 交易记录管理 (Transaction Management)
- **路径**: `/admin/transactions`
- **功能**:
  - 交易记录列表展示
  - 多维度过滤：
    - 按交易类型过滤（购买代币、使用代币、购买会员、退款）
    - 按交易状态过滤（已完成、处理中、失败、已退款）
    - 按日期范围过滤
  - Stripe付款ID外链支持
  - CSV导出功能（`/admin/transactions/export`）
  - 分页功能（每页20条记录）

## 技术栈 (Tech Stack)

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **数据库**: SQLite with Prisma ORM
- **样式**: Tailwind CSS
- **图表库**: Chart.js + react-chartjs-2
- **认证**: 简化版认证（生产环境建议使用NextAuth.js）

## 数据库模型 (Database Models)

### User（用户）
```prisma
model User {
  id                  String        @id @default(cuid())
  email               String        @unique
  username            String        @unique
  password            String
  tokenBalance        Int           @default(0)
  isMember            Boolean       @default(false)
  membershipExpiresAt DateTime?
  isAdmin             Boolean       @default(false)
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  transactions        Transaction[]
}
```

### Transaction（交易）
```prisma
model Transaction {
  id              String            @id @default(cuid())
  userId          String
  type            TransactionType
  status          TransactionStatus @default(PENDING)
  amount          Float
  tokenAmount     Int?
  stripePaymentId String?
  description     String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}
```

## 安装和运行 (Installation & Setup)

### 1. 安装依赖
```bash
npm install
```

### 2. 设置环境变量
创建 `.env` 文件（已包含）：
```
DATABASE_URL="file:./dev.db"
```

### 3. 初始化数据库
```bash
npx prisma generate
npx prisma db push
```

### 4. 填充测试数据
```bash
npx tsx prisma/seed.ts
```

这将创建：
- 1个管理员账户（admin@example.com）
- 20个测试用户
- 约95条测试交易记录

### 5. 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 查看主页和管理功能。

## 使用说明 (Usage Guide)

### 访问管理员功能
1. 访问首页 `/` 查看功能概览
2. 点击相应卡片访问：
   - 管理员仪表盘：`/admin`
   - 用户管理：`/admin/users`
   - 交易记录：`/admin/transactions`

### 用户管理操作
- **搜索用户**: 在搜索框输入邮箱或用户名，点击"搜索"按钮
- **排序**: 点击列标题进行升序/降序排序
- **分页**: 使用底部分页控件浏览不同页面

### 交易记录操作
- **过滤交易**: 
  - 选择交易类型（购买代币、使用代币等）
  - 选择交易状态（已完成、处理中等）
  - 设置日期范围
  - 点击"应用过滤器"
- **导出CSV**: 点击页面右上角"导出CSV"按钮下载当前过滤条件下的所有交易记录
- **查看Stripe付款**: 点击Stripe付款ID可直接跳转到Stripe Dashboard

### 仪表盘查看
- 查看4个关键指标卡片
- 查看30天收入趋势折线图
- 查看最近7天收入柱状图

## CSV导出功能 (CSV Export)

CSV导出功能位于 `/admin/transactions/export`，支持：
- 导出所有交易记录或根据过滤条件导出
- 包含所有交易字段
- UTF-8编码，支持中文
- Excel兼容格式（包含BOM）

导出的CSV包含以下列：
- 交易ID
- 用户邮箱
- 用户名
- 交易类型
- 交易状态
- 金额
- 代币数量
- Stripe付款ID
- 描述
- 创建时间

## 安全考虑 (Security Considerations)

当前实现是演示版本，在生产环境中需要：

1. **实现完整的认证系统**
   - 建议使用NextAuth.js或类似解决方案
   - 实现JWT token或session管理
   - 添加登录/登出功能

2. **添加授权中间件**
   - 验证用户的管理员权限
   - 保护所有 `/admin/*` 路由
   - 添加API路由保护

3. **数据库安全**
   - 生产环境使用PostgreSQL或MySQL
   - 启用SSL连接
   - 定期备份

4. **密码加密**
   - 使用bcrypt加密存储密码
   - 实现密码强度验证

## 代码注释说明 (Code Comments)

按照要求，所有业务逻辑和计算都添加了中英文双语注释：
- 数据查询和聚合计算
- 过滤和排序逻辑
- CSV生成逻辑
- 图表数据处理

## 性能优化 (Performance Optimizations)

1. **数据库索引**: Transaction表添加了索引以优化查询
2. **分页**: 用户和交易列表都实现了分页，避免一次加载大量数据
3. **服务器组件**: 使用Next.js服务器组件减少客户端JavaScript
4. **选择性查询**: 只查询需要的字段，减少数据传输

## 项目结构 (Project Structure)

```
/app
  /admin                      # 管理员功能模块
    /components              # 共享组件
      DashboardCharts.tsx    # 仪表盘图表组件
    /transactions            # 交易管理
      /export               # CSV导出API
        route.ts
      TransactionsTable.tsx
      TransactionFilters.tsx
      page.tsx
    /users                   # 用户管理
      UsersTable.tsx
      SearchAndFilter.tsx
      page.tsx
    page.tsx                # 管理员仪表盘
  page.tsx                  # 首页
/lib
  prisma.ts                 # Prisma客户端
  auth.ts                   # 认证工具
/prisma
  schema.prisma             # 数据库模型定义
  seed.ts                   # 数据填充脚本
```

## 测试数据 (Test Data)

运行seed脚本后，系统包含：
- 1个管理员账户
- 20个测试用户（部分为会员）
- 约95条交易记录（涵盖所有交易类型和状态）
- 分布在过去90天内的交易数据

管理员账户：
- 邮箱: admin@example.com
- 用户名: admin

## 未来改进 (Future Improvements)

1. 添加用户详情页面
2. 实现批量操作功能
3. 添加更多数据可视化图表
4. 实现实时数据更新
5. 添加导出为PDF功能
6. 实现数据缓存策略
7. 添加系统日志查看功能

## License

MIT

## 联系方式 (Contact)

如有问题或建议，请创建Issue或Pull Request。
