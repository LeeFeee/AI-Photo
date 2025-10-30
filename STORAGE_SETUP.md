# 云存储配置指南

本指南详细说明如何配置 Cloudflare R2 或 AWS S3 用于图片上传功能。

## 📋 目录

- [Cloudflare R2 配置](#cloudflare-r2-配置)
- [AWS S3 配置](#aws-s3-配置)
- [CORS 配置](#cors-配置)
- [存储桶策略](#存储桶策略)
- [环境变量配置](#环境变量配置)
- [测试上传功能](#测试上传功能)

---

## Cloudflare R2 配置

### 1. 创建 R2 存储桶

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **R2** 服务
3. 点击 **创建存储桶**
4. 输入存储桶名称（例如：`ai-photo-uploads`）
5. 选择位置提示（建议选择离用户最近的区域）
6. 点击 **创建存储桶**

### 2. 获取访问密钥

1. 在 R2 控制台，点击右上角的 **管理 R2 API 令牌**
2. 点击 **创建 API 令牌**
3. 选择权限：
   - **对象读写**（Object Read & Write）
   - 应用于您创建的存储桶
4. 点击 **创建 API 令牌**
5. **重要**：立即复制并保存：
   - Access Key ID
   - Secret Access Key
   - Endpoint URL（格式：`https://<account_id>.r2.cloudflarestorage.com`）

### 3. 配置公开访问（可选）

如果需要公开访问上传的图片：

1. 在存储桶设置中，找到 **自定义域**
2. 添加您的域名（例如：`cdn.yoursite.com`）
3. 按照指示配置 DNS 记录
4. 或使用 R2.dev 子域（在存储桶设置中启用）

---

## AWS S3 配置

### 1. 创建 S3 存储桶

1. 登录 [AWS Console](https://console.aws.amazon.com/s3/)
2. 点击 **创建存储桶**
3. 输入存储桶名称（例如：`ai-photo-uploads`）
4. 选择区域（例如：`us-east-1`）
5. 取消勾选 **阻止所有公开访问**（如需公开访问上传的图片）
6. 启用 **存储桶版本控制**（可选）
7. 点击 **创建存储桶**

### 2. 创建 IAM 用户和访问密钥

1. 进入 **IAM 控制台**
2. 创建新用户（例如：`ai-photo-uploader`）
3. 选择 **编程访问**
4. 附加策略（见下方存储桶策略）
5. 完成创建后，保存：
   - Access Key ID
   - Secret Access Key

---

## CORS 配置

为了允许浏览器直接上传到 R2/S3，必须配置 CORS。

### Cloudflare R2 CORS 配置

1. 在 R2 存储桶设置中，找到 **CORS 策略**
2. 添加以下配置：

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

### AWS S3 CORS 配置

1. 在 S3 存储桶中，进入 **权限** 选项卡
2. 滚动到 **CORS 配置**
3. 添加以下配置：

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

**重要提示**：
- 将 `https://yourdomain.com` 替换为您的实际域名
- 生产环境中应该移除 `http://localhost:3000`
- 避免使用 `*` 通配符在生产环境中

---

## 存储桶策略

### AWS S3 存储桶策略（IAM 用户）

创建 IAM 策略并附加到上传用户：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowUploadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::ai-photo-uploads/*"
      ]
    },
    {
      "Sid": "AllowListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::ai-photo-uploads"
      ]
    }
  ]
}
```

### R2 权限

R2 的权限通过 API 令牌创建时设置。确保令牌具有：
- **对象读写** 权限
- 应用于特定存储桶

---

## 环境变量配置

### 1. 复制环境变量模板

```bash
cp .env.example .env.local
```

### 2. 配置 Cloudflare R2

编辑 `.env.local`：

```env
# Cloudflare R2 配置
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=ai-photo-uploads
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_REGION=auto
R2_PUBLIC_URL=https://cdn.yoursite.com

# 上传限制
MAX_UPLOAD_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
```

### 3. 配置 AWS S3

如果使用 AWS S3，配置如下：

```env
# AWS S3 配置
R2_ACCESS_KEY_ID=your_aws_access_key_id
R2_SECRET_ACCESS_KEY=your_aws_secret_access_key
R2_BUCKET_NAME=ai-photo-uploads
R2_ACCOUNT_ID=not_applicable
R2_ENDPOINT=https://s3.us-east-1.amazonaws.com
R2_REGION=us-east-1
R2_PUBLIC_URL=https://ai-photo-uploads.s3.us-east-1.amazonaws.com

# 上传限制
MAX_UPLOAD_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
```

---

## 测试上传功能

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 测试 API 端点

检查配置状态：

```bash
curl http://localhost:3000/api/uploads/presign
```

预期响应：

```json
{
  "success": true,
  "configured": true,
  "limits": {
    "maxSize": 5242880,
    "maxSizeMB": "5.00",
    "allowedTypes": ["image/jpeg", "image/png", "image/webp", "image/gif"],
    "allowedExtensions": ["jpeg", "png", "webp", "gif"]
  }
}
```

### 3. 测试预签名 URL 生成

```bash
curl -X POST http://localhost:3000/api/uploads/presign \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test.jpg",
    "fileType": "image/jpeg",
    "fileSize": 1024000,
    "folder": "temp"
  }'
```

### 4. 在应用中测试上传

1. 导入 `ImageUpload` 组件：

```tsx
import { ImageUpload } from '@/components/ui/image-upload'

function MyComponent() {
  const handleUploadComplete = (result) => {
    if (result.success) {
      console.log('上传成功！', result.url)
      // 保存 URL 到状态或数据库
    } else {
      console.error('上传失败：', result.error)
    }
  }

  return (
    <ImageUpload
      folder="prompts"
      onUploadComplete={handleUploadComplete}
    />
  )
}
```

2. 测试上传流程：
   - 拖拽图片到上传区域
   - 或点击选择图片
   - 观察上传进度
   - 确认上传成功或失败消息

---

## 安全建议

### 1. 环境变量安全

- ✅ **永远不要**提交 `.env.local` 到版本控制
- ✅ 在 `.gitignore` 中包含 `.env*.local`
- ✅ 使用环境变量管理服务（如 Vercel、AWS Secrets Manager）
- ✅ 定期轮换访问密钥

### 2. 访问控制

- ✅ 使用最小权限原则（只授予必要的权限）
- ✅ 为不同环境使用不同的密钥（开发/生产）
- ✅ 实施请求速率限制
- ✅ 验证所有上传请求的用户身份

### 3. 文件验证

- ✅ 在服务器端验证文件类型和大小
- ✅ 扫描上传的文件（可选：病毒扫描）
- ✅ 限制文件名字符
- ✅ 实施上传配额

### 4. CORS 配置

- ✅ 只允许特定的域名
- ✅ 生产环境移除开发域名
- ✅ 避免使用通配符 `*`

### 5. 公开访问

- ✅ 考虑是否需要公开访问
- ✅ 使用 CDN 提升性能和安全性
- ✅ 实施访问日志监控
- ✅ 设置对象过期策略（自动清理临时文件）

---

## 故障排查

### 问题：上传失败，提示 "存储服务未配置"

**解决方案**：
1. 检查 `.env.local` 文件是否存在
2. 确认所有必需的环境变量都已设置
3. 重启开发服务器

### 问题：CORS 错误

**解决方案**：
1. 检查 CORS 配置中的域名是否正确
2. 确认包含了正确的请求方法
3. 清除浏览器缓存
4. 检查浏览器控制台的详细错误信息

### 问题：权限被拒绝

**解决方案**：
1. 验证访问密钥是否正确
2. 检查 IAM/API 令牌权限
3. 确认存储桶名称正确
4. 验证存储桶策略

### 问题：预签名 URL 过期

**解决方案**：
1. 默认过期时间为 1 小时
2. 可在 `lib/storage.ts` 中调整 `expiresIn` 参数
3. 确保用户在过期前完成上传

---

## 生产部署检查清单

在部署到生产环境前，确保：

- [ ] 所有环境变量已在生产环境中设置
- [ ] CORS 配置只包含生产域名
- [ ] 移除了开发环境的域名
- [ ] 启用了访问日志
- [ ] 实施了用户认证
- [ ] 配置了 CDN（推荐）
- [ ] 设置了存储桶生命周期规则（清理临时文件）
- [ ] 实施了速率限制
- [ ] 测试了上传流程
- [ ] 配置了错误监控

---

## 相关资源

### Cloudflare R2
- [R2 文档](https://developers.cloudflare.com/r2/)
- [R2 API 参考](https://developers.cloudflare.com/r2/api/)
- [R2 定价](https://www.cloudflare.com/products/r2/)

### AWS S3
- [S3 文档](https://docs.aws.amazon.com/s3/)
- [S3 CORS 配置](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html)
- [S3 预签名 URL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)

### SDK 文档
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

---

## 需要帮助？

如遇到问题，请检查：
1. 环境变量配置
2. CORS 设置
3. 存储桶权限
4. 浏览器控制台错误
5. 服务器日志

如问题仍未解决，请提供以下信息：
- 错误消息
- 浏览器控制台日志
- 服务器日志
- 使用的存储服务（R2 或 S3）
