# Prisma 迁移

此目录包含数据库迁移文件。

## 创建新迁移

当您修改 `schema.prisma` 文件后，运行以下命令创建新的迁移：

```bash
npm run prisma:migrate
```

系统会提示您输入迁移名称（例如：`add_user_avatar_field`）。

## 迁移说明

- 迁移文件按时间戳排序
- 每个迁移都包含 SQL 文件和元数据
- 不要手动修改已应用的迁移文件
- 迁移会自动应用于开发环境
- 生产环境使用 `npx prisma migrate deploy`

## 首次设置

第一次设置数据库时：

1. 确保 PostgreSQL 服务正在运行
2. 在 `.env` 文件中配置 `DATABASE_URL`
3. 运行 `npm run prisma:migrate` 创建所有表
4. 运行 `npm run db:seed` 填充初始数据

## 重置数据库

如果需要重置数据库（⚠️ 会删除所有数据）：

```bash
npm run db:reset
```

此命令会：
1. 删除所有表
2. 重新运行所有迁移
3. 运行种子脚本
