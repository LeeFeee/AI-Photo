import { PrismaClient } from '../lib/generated/prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 创建默认管理员账户 - Create default admin account
  // 用户名: admin, 密码: admin123 - Username: admin, Password: admin123
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
      email: 'admin@ai-photo.app',
    },
  })

  console.log('✅ 管理员账户已创建 - Admin account created:', {
    username: admin.username,
    email: admin.email,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
