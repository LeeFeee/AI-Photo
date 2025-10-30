# Stripe 支付测试指南

本文档提供完整的 Stripe 支付流程测试步骤。

## 前置准备

### 1. 安装 Stripe CLI

根据您的操作系统选择安装方式：

**macOS (使用 Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Windows (使用 Scoop):**
```bash
scoop install stripe
```

**Linux:**
```bash
# 下载最新版本
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz

# 解压
tar -xvf stripe_linux_x86_64.tar.gz

# 移动到系统路径
sudo mv stripe /usr/local/bin/
```

### 2. 配置 Stripe 账号

1. 注册 Stripe 测试账号：https://dashboard.stripe.com/register
2. 切换到测试模式（Dashboard 左侧切换开关）
3. 获取 API 密钥：
   - 进入 Developers → API keys
   - 复制 Publishable key 和 Secret key

### 3. 配置环境变量

编辑 `.env` 文件：

```env
# Stripe 测试密钥
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # 稍后从 CLI 获取

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 测试步骤

### Step 1: 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动。

### Step 2: 登录 Stripe CLI

```bash
stripe login
```

浏览器会打开授权页面，授权后返回终端。

### Step 3: 监听 Webhook 事件

在**新的终端窗口**中运行：

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

CLI 会输出类似以下内容：

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**重要**: 复制 webhook 签名密钥（`whsec_xxxxx`）到 `.env` 文件的 `STRIPE_WEBHOOK_SECRET`。

### Step 4: 重启开发服务器

更新 `.env` 后，重启开发服务器以加载新的环境变量：

```bash
# 按 Ctrl+C 停止服务器
npm run dev
```

### Step 5: 测试购买流程

1. 访问 http://localhost:3000/pricing/tokens
2. 点击任意套餐的"立即购买"按钮
3. 在 Stripe Checkout 页面填入测试卡信息：
   - **卡号**: `4242 4242 4242 4242`
   - **有效期**: 任意未来日期（如 `12/34`）
   - **CVC**: 任意3位数字（如 `123`）
   - **邮编**: 任意5位数字（如 `12345`）
4. 点击"支付"
5. 支付成功后会重定向到 `/dashboard?success=true`
6. 查看代币余额是否已更新

### Step 6: 查看 Webhook 日志

在运行 `stripe listen` 的终端窗口中，您应该看到类似的输出：

```
2024-10-30 12:34:56   --> checkout.session.completed [evt_xxxxx]
2024-10-30 12:34:56   <-- [200] POST http://localhost:3000/api/stripe/webhook [evt_xxxxx]
```

## 测试场景

### 1. 成功支付

**测试卡号**: `4242 4242 4242 4242`

**预期结果**:
- ✅ 支付成功
- ✅ 重定向到 dashboard
- ✅ 显示成功提示
- ✅ 代币余额增加
- ✅ 交易记录状态为 `completed`

### 2. 需要 3D 验证

**测试卡号**: `4000 0025 0000 3155`

**预期结果**:
- ✅ 显示 3D 验证页面
- ✅ 点击"Complete"完成验证
- ✅ 支付成功，余额更新

### 3. 支付失败（卡被拒绝）

**测试卡号**: `4000 0000 0000 0002`

**预期结果**:
- ❌ 支付失败
- ❌ 显示错误信息
- ❌ 交易记录状态为 `failed`
- ❌ 代币余额不变

### 4. 支付失败（资金不足）

**测试卡号**: `4000 0000 0000 9995`

**预期结果**:
- ❌ 支付失败，提示资金不足
- ❌ 交易记录状态为 `failed`

### 5. 测试幂等性

**步骤**:
1. 完成一次成功支付
2. 在 Stripe CLI 中手动重放 webhook：
   ```bash
   stripe events resend evt_xxxxx
   ```

**预期结果**:
- ✅ Webhook 处理成功
- ✅ 代币余额不重复增加
- ✅ 日志显示"交易已处理，跳过"

## 手动触发 Webhook 测试

### 模拟成功支付

```bash
stripe trigger checkout.session.completed
```

### 模拟支付成功事件

```bash
stripe trigger payment_intent.succeeded
```

### 模拟支付失败事件

```bash
stripe trigger payment_intent.payment_failed
```

## 查看测试数据

### 在 Stripe Dashboard

1. 进入 https://dashboard.stripe.com/test/payments
2. 查看支付记录
3. 点击具体支付查看详情和 webhook 日志

### 在本地数据库

```bash
# 打开 Prisma Studio
npx prisma studio

# 或使用 SQLite 客户端
sqlite3 prisma/dev.db

# 查询交易记录
SELECT * FROM Transaction ORDER BY createdAt DESC;

# 查询用户余额
SELECT id, email, tokenBalance FROM User;
```

### 在终端日志

开发服务器会输出详细日志：

```
收到 Stripe 事件: checkout.session.completed
处理 checkout.session.completed: cs_test_xxxxx
用户 demo-user 购买成功，增加 100 代币
```

## 常见问题排查

### Webhook 签名验证失败

**错误**: `Webhook 签名验证失败`

**原因**: 
- `STRIPE_WEBHOOK_SECRET` 配置错误
- 未重启服务器

**解决**:
1. 确认 `.env` 中的 `STRIPE_WEBHOOK_SECRET` 与 CLI 输出的一致
2. 重启开发服务器

### 代币未到账

**可能原因**:
1. Webhook 未触发
2. Webhook 处理失败
3. 数据库写入失败

**排查步骤**:
1. 检查 Stripe CLI 终端是否收到 webhook
2. 检查开发服务器日志是否有错误
3. 查询数据库确认交易状态：
   ```sql
   SELECT * FROM Transaction WHERE stripeSessionId = 'cs_test_xxxxx';
   ```

### 支付页面无法打开

**错误**: `创建支付会话失败`

**可能原因**:
- `STRIPE_SECRET_KEY` 配置错误
- Stripe 账号未激活

**解决**:
1. 确认测试模式密钥正确
2. 检查 Stripe Dashboard 账号状态

## 生产环境配置

切换到生产环境前，需要：

### 1. 创建生产环境 Price ID

在 Stripe Dashboard（生产模式）中：
1. 进入 Products
2. 为每个套餐创建生产环境的 Price
3. 更新 `.env.production` 或环境变量

### 2. 配置生产 Webhook

1. 进入 Developers → Webhooks
2. 点击 "Add endpoint"
3. 输入 webhook URL：`https://your-domain.com/api/stripe/webhook`
4. 选择监听事件：
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. 复制 Webhook 签名密钥到生产环境变量

### 3. 更新环境变量

```env
# 生产环境密钥
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # 从 Dashboard 获取

# 生产环境 Price ID
STRIPE_PRICE_ID_STARTER=price_xxxxx
STRIPE_PRICE_ID_BASIC=price_xxxxx
STRIPE_PRICE_ID_PRO=price_xxxxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxxxx

# 生产环境 URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. 测试生产环境

在正式上线前：
1. 使用真实信用卡进行小额测试
2. 确认 webhook 正常接收和处理
3. 验证退款流程（如需要）

## 安全最佳实践

1. ✅ **验证 Webhook 签名**: 已在代码中实现
2. ✅ **使用 HTTPS**: 生产环境必须使用 HTTPS
3. ✅ **环境变量保护**: 不要将密钥提交到代码仓库
4. ✅ **幂等性处理**: 防止重复处理同一事件
5. ✅ **错误日志**: 记录所有错误以便排查
6. ✅ **数据库事务**: 使用事务确保数据一致性

## 相关资源

- [Stripe 测试卡号](https://stripe.com/docs/testing)
- [Stripe CLI 文档](https://stripe.com/docs/stripe-cli)
- [Stripe Webhook 文档](https://stripe.com/docs/webhooks)
- [Stripe Checkout 文档](https://stripe.com/docs/payments/checkout)

---

**提示**: 如遇到问题，请查看服务器日志和 Stripe Dashboard 的 webhook 日志以获取详细错误信息。
