# Authentication Testing Guide

## 测试流程 - Testing Flow

### 1. 注册新用户 - Register New User

1. 访问注册页面: `http://localhost:3000/register`
2. 填写表单:
   - 姓名 (选填): 测试用户
   - 邮箱: test@example.com
   - 密码: test123456
   - 确认密码: test123456
3. 点击"注册"按钮
4. 应该看到成功消息并自动跳转到登录页

**预期结果:**
- ✅ 表单验证正常工作（密码长度、邮箱格式、密码匹配）
- ✅ 注册成功后显示成功消息
- ✅ 自动跳转到登录页

### 2. 登录 - Login

1. 访问登录页面: `http://localhost:3000/login`
2. 使用刚注册的账号登录:
   - 邮箱: test@example.com
   - 密码: test123456
3. 点击"登录"按钮

**预期结果:**
- ✅ 登录成功后显示成功消息
- ✅ 自动跳转到 dashboard 页面
- ✅ 导航栏显示用户信息和退出按钮

### 3. 查看用户信息 - View User Dashboard

1. 登录成功后应该在 `/dashboard` 页面
2. 检查页面显示的信息:
   - 用户名称/邮箱
   - 代币余额: 0
   - 会员状态: 普通用户

**预期结果:**
- ✅ 显示正确的用户信息
- ✅ 代币余额初始值为 0
- ✅ 会员状态显示为"普通用户"
- ✅ isMember 为 false

### 4. 访问保护路由 - Access Protected Routes

1. 退出登录
2. 尝试直接访问 `/dashboard`
3. 应该被自动重定向到登录页

**预期结果:**
- ✅ 未登录用户无法访问 dashboard
- ✅ 自动重定向到 `/login?callbackUrl=/dashboard`
- ✅ 登录后会跳转回 dashboard

### 5. 导航栏状态 - Header State

**未登录状态:**
- ✅ 显示"登录"和"注册"按钮
- ✅ 点击按钮可跳转到对应页面

**已登录状态:**
- ✅ 显示用户名/邮箱
- ✅ 显示"退出"按钮
- ✅ 点击退出按钮可以登出并跳转到首页

### 6. 移动端菜单 - Mobile Menu

1. 在移动端视图下打开菜单
2. 检查菜单底部的认证区域

**未登录状态:**
- ✅ 显示"登录"和"注册"按钮

**已登录状态:**
- ✅ 显示用户信息
- ✅ 显示"退出登录"按钮

### 7. 错误处理 - Error Handling

**注册错误:**
- 测试重复邮箱注册
- 测试密码不匹配
- 测试无效邮箱格式

**登录错误:**
- 测试错误的密码
- 测试不存在的邮箱
- 测试空表单提交

**预期结果:**
- ✅ 所有错误都显示友好的中文提示消息
- ✅ 表单验证在客户端和服务器端都工作正常

## 手动测试步骤 - Manual Testing Steps

### 完整注册登录流程 - Full Registration and Login Flow

```bash
# 1. 启动开发服务器
npm run dev

# 2. 打开浏览器访问
open http://localhost:3000

# 3. 依次测试以下页面:
# - 首页 (/)
# - 注册页面 (/register)
# - 登录页面 (/login)
# - Dashboard (/dashboard)
```

### 测试用例清单 - Test Case Checklist

- [ ] 用户可以成功注册
- [ ] 用户可以成功登录
- [ ] 登录后导航栏显示用户信息
- [ ] Dashboard 显示代币余额和会员状态
- [ ] 未登录用户访问 dashboard 会被重定向
- [ ] 用户可以成功退出登录
- [ ] 退出后导航栏显示登录/注册按钮
- [ ] 移动端菜单正确显示认证状态
- [ ] 密码加密存储（检查数据库）
- [ ] Session 正确包含用户数据

## 数据库检查 - Database Verification

```bash
# 使用 Prisma Studio 查看数据库
npx prisma studio

# 检查:
# 1. User 表中的 passwordHash 是否加密
# 2. tokenBalance 初始值是否为 0
# 3. isMember 初始值是否为 false
```

## 常见问题 - Common Issues

1. **登录后立即退出**: 检查 NEXTAUTH_SECRET 环境变量
2. **Session 未持久化**: 检查数据库连接和 Session 表
3. **类型错误**: 确保 types/next-auth.d.ts 被 TypeScript 正确加载

## 安全检查 - Security Checklist

- [x] 密码使用 bcrypt 加密存储
- [x] 敏感路由受保护
- [x] Session 使用 JWT 策略
- [x] 输入使用 Zod 验证
- [x] NEXTAUTH_SECRET 不提交到版本控制
- [x] 错误消息不泄露敏感信息
