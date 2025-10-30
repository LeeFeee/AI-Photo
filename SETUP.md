# AI Photo - 项目设置指南

本指南将帮助您完成 AI Photo 项目的初始设置。

## 前置要求

- Node.js 18+ 
- PostgreSQL 15+ 
- npm 或 yarn

## 快速开始

### 1. 克隆项目并安装依赖

```bash
# 进入项目目录
cd ai-photo

# 安装依赖
npm install
```

### 2. 设置 PostgreSQL 数据库

#### macOS (使用 Homebrew)

```bash
# 安装 PostgreSQL
brew install postgresql@15

# 启动 PostgreSQL 服务
brew services start postgresql@15

# 创建数据库
createdb ai_photo
```

#### Ubuntu/Debian

```bash
# 更新包列表
sudo apt update

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 切换到 postgres 用户
sudo -u postgres psql

# 在 PostgreSQL 提示符下创建数据库
CREATE DATABASE ai_photo;
\q
```

#### Windows

1. 从 [PostgreSQL 官网](https://www.postgresql.org/download/windows/) 下载安装程序
2. 运行安装程序并设置密码
3. 使用 pgAdmin 或命令行创建数据库 `ai_photo`

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
nano .env  # 或使用您喜欢的编辑器
```

修改 `DATABASE_URL` 以匹配您的数据库配置：

```env
DATABASE_URL="postgresql://用户名:密码@localhost:5432/ai_photo?schema=public"
```

常见配置示例：

```env
# 默认本地配置（用户名和密码都是 postgres）
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_photo?schema=public"

# macOS Homebrew 安装（通常无需密码）
DATABASE_URL="postgresql://用户名@localhost:5432/ai_photo?schema=public"

# 自定义配置
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/ai_photo?schema=public"
```

### 4. 设置数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移（创建表结构）
npm run prisma:migrate
# 当提示输入迁移名称时，输入: init

# 填充种子数据（创建测试用户和提示词）
npm run db:seed
```

成功后，您会看到：

```
✓ 创建管理员用户: admin@aiphoto.com
✓ 创建示例用户: demo@example.com
✓ 创建提示词: 日落海滩 (激活状态: true)
...
✓ 数据库种子数据填充完成！

默认账户信息：
管理员: admin@aiphoto.com / admin123
演示用户: demo@example.com / demo123
```

### 5. 验证设置

```bash
# 运行验证脚本
npx tsx test-prisma-setup.ts
```

如果一切正常，您会看到：

```
✓ Prisma Client 导入成功
✓ 类型定义验证成功
✓ 所有模型方法验证成功

所有检查通过! Prisma 设置配置正确。
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 可选：使用 Prisma Studio

Prisma Studio 是一个可视化数据库管理工具：

```bash
npm run prisma:studio
```

这将在浏览器中打开 http://localhost:5555，您可以在这里查看和编辑数据。

## 数据库管理

### 查看数据库状态

```bash
# 查看迁移状态
npx prisma migrate status

# 查看数据库中的表
psql -U postgres ai_photo -c "\dt"
```

### 重置数据库

⚠️ **警告**：这将删除所有数据！

```bash
npm run db:reset
```

此命令会：
1. 删除所有表
2. 重新运行所有迁移
3. 自动运行种子脚本

### 备份数据库

```bash
# 导出数据库
pg_dump -U postgres ai_photo > backup_$(date +%Y%m%d).sql

# 恢复数据库
psql -U postgres ai_photo < backup_20241030.sql
```

## 常见问题

### 问题 1：无法连接到数据库

**错误信息**：`Can't reach database server at localhost:5432`

**解决方案**：
1. 确认 PostgreSQL 正在运行
   ```bash
   # macOS
   brew services list | grep postgresql
   
   # Ubuntu
   sudo systemctl status postgresql
   ```

2. 检查端口是否正确（默认 5432）
   ```bash
   psql -U postgres -h localhost -p 5432
   ```

### 问题 2：认证失败

**错误信息**：`password authentication failed`

**解决方案**：
1. 确认 `.env` 文件中的用户名和密码正确
2. 尝试重置 PostgreSQL 密码：
   ```bash
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'newpassword';
   ```

### 问题 3：数据库不存在

**错误信息**：`database "ai_photo" does not exist`

**解决方案**：
```bash
# 使用 createdb 命令
createdb ai_photo

# 或使用 psql
psql -U postgres
CREATE DATABASE ai_photo;
\q
```

### 问题 4：端口已被占用

**错误信息**：`Port 3000 is already in use`

**解决方案**：
1. 找到占用端口的进程：
   ```bash
   # macOS/Linux
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

2. 结束该进程或使用其他端口：
   ```bash
   PORT=3001 npm run dev
   ```

### 问题 5：Prisma Client 未生成

**错误信息**：`Cannot find module '@prisma/client'`

**解决方案**：
```bash
npm run prisma:generate
```

## 开发工作流

### 修改数据库结构

1. 编辑 `prisma/schema.prisma`
2. 创建新迁移：
   ```bash
   npm run prisma:migrate
   ```
3. 生成新的 Prisma Client：
   ```bash
   npm run prisma:generate
   ```

### 添加新的种子数据

1. 编辑 `prisma/seed.ts`
2. 运行种子脚本：
   ```bash
   npm run db:seed
   ```

### 查看数据库数据

使用 Prisma Studio（推荐）：
```bash
npm run prisma:studio
```

或直接使用 psql：
```bash
psql -U postgres ai_photo
SELECT * FROM "User";
\q
```

## 下一步

✅ 项目设置完成后，您可以：

1. 📖 阅读 [项目文档](./README.md)
2. 🗄️ 查看 [数据库详细文档](./docs/database.md)
3. 🧪 查看 [测试指南](./TESTING_GUIDE.md)
4. 🎨 探索 [设计系统](./POLISH_NOTES.md)
5. 🚀 开始开发新功能

## 获取帮助

- 📝 查看项目文档：`/docs` 目录
- 🐛 报告问题：在 GitHub 创建 Issue
- 💬 讨论功能：在 GitHub 创建 Discussion

---

祝您开发愉快! 🎉
