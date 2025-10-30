import { PrismaClient } from '@prisma/client';

// 交易类型和状态枚举 - Transaction type and status enums
enum TransactionType {
  TOKEN_PURCHASE = 'TOKEN_PURCHASE',
  TOKEN_USAGE = 'TOKEN_USAGE',
  MEMBERSHIP_PURCHASE = 'MEMBERSHIP_PURCHASE',
  REFUND = 'REFUND',
}

enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子...');

  // 创建管理员用户 - Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: 'hashed_password_here', // 实际应该使用bcrypt加密
      tokenBalance: 1000,
      isMember: true,
      membershipExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isAdmin: true,
    },
  });

  console.log('管理员用户已创建:', admin.email);

  // 创建测试用户 - Create test users
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        username: `user${i}`,
        password: 'hashed_password_here',
        tokenBalance: Math.floor(Math.random() * 500),
        isMember: i % 3 === 0,
        membershipExpiresAt: i % 3 === 0 
          ? new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000)
          : null,
        isAdmin: false,
      },
    });
    users.push(user);
  }

  console.log(`已创建 ${users.length} 个测试用户`);

  // 创建测试交易记录 - Create test transactions
  const transactionTypes = [
    TransactionType.TOKEN_PURCHASE,
    TransactionType.TOKEN_USAGE,
    TransactionType.MEMBERSHIP_PURCHASE,
    TransactionType.REFUND,
  ];

  const transactionStatuses = [
    TransactionStatus.COMPLETED,
    TransactionStatus.COMPLETED,
    TransactionStatus.COMPLETED,
    TransactionStatus.PENDING,
    TransactionStatus.FAILED,
  ];

  let transactionCount = 0;
  for (const user of users) {
    const numTransactions = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 0; i < numTransactions; i++) {
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const status = transactionStatuses[Math.floor(Math.random() * transactionStatuses.length)];
      const amount = type === TransactionType.MEMBERSHIP_PURCHASE 
        ? 9.99 
        : Math.floor(Math.random() * 100) + 10;
      
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type,
          status,
          amount,
          tokenAmount: type === TransactionType.TOKEN_PURCHASE ? Math.floor(amount * 10) : 
                       type === TransactionType.TOKEN_USAGE ? -Math.floor(Math.random() * 50) : null,
          stripePaymentId: status === TransactionStatus.COMPLETED ? `pi_${Math.random().toString(36).substring(7)}` : null,
          description: `${type} transaction for user ${user.username}`,
          createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        },
      });
      transactionCount++;
    }
  }

  console.log(`已创建 ${transactionCount} 个交易记录`);
  console.log('数据库种子完成！');
}

main()
  .catch((e) => {
    console.error('种子错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
