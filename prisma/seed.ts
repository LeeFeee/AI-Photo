import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始数据库种子数据填充...')

  // 创建管理员用户
  // 密码: admin123 (实际生产环境应使用更强密码)
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@aiphoto.com' },
    update: {},
    create: {
      email: 'admin@aiphoto.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  })
  console.log('✓ 创建管理员用户:', admin.email)

  // 创建示例用户 (用于演示)
  const demoPasswordHash = await bcrypt.hash('demo123', 10)
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      username: 'demo_user',
      passwordHash: demoPasswordHash,
      tokenBalance: 100,
      isMember: false,
    },
  })
  console.log('✓ 创建示例用户:', demoUser.email)

  // 创建示例提示词 - 风景类
  const prompts = [
    {
      name: '日落海滩',
      content: '一个宁静的海滩，金色的日落照耀着平静的海面，椰子树随风摇曳，细腻的沙滩上有贝壳点缀',
      previewImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
      isActive: true,
    },
    {
      name: '山间瀑布',
      content: '壮丽的瀑布从高山倾泻而下，水雾在阳光下形成彩虹，周围是茂密的森林和青苔覆盖的岩石',
      previewImageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400',
      isActive: true,
    },
    {
      name: '樱花小径',
      content: '春天盛开的樱花树形成的小径，粉色的花瓣飘落在石板路上，阳光透过花枝洒下斑驳的光影',
      previewImageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400',
      isActive: true,
    },
    {
      name: '星空银河',
      content: '深邃的夜空中，银河横跨天际，繁星点点，远处是连绵起伏的山脉剪影',
      previewImageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
      isActive: true,
    },
    {
      name: '秋日森林',
      content: '秋天的森林，树叶呈现出红色、橙色和金色的渐变，林间小道被落叶覆盖，薄雾弥漫',
      previewImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      isActive: true,
    },
    // 城市建筑类
    {
      name: '未来都市',
      content: '科幻风格的未来城市，高耸的摩天大楼，悬浮的交通工具，霓虹灯闪烁，充满赛博朋克氛围',
      previewImageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400',
      isActive: true,
    },
    {
      name: '古城黄昏',
      content: '古老的欧式城堡，黄昏时分，温暖的灯光从窗户透出，护城河倒映着天空的余晖',
      previewImageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
      isActive: true,
    },
    // 人物肖像类
    {
      name: '文艺女孩',
      content: '一个优雅的女孩，穿着复古连衣裙，在咖啡馆里读书，柔和的自然光从窗外洒进来，温馨而宁静',
      previewImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      isActive: true,
    },
    {
      name: '朋克少年',
      content: '街头朋克风格的少年，色彩鲜艳的发型，皮夹克和破洞牛仔裤，背景是涂鸦墙',
      previewImageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400',
      isActive: true,
    },
    // 动物宠物类
    {
      name: '可爱小猫',
      content: '毛茸茸的小猫咪，大大的眼睛，好奇地看着镜头，柔软的皮毛在阳光下闪闪发光',
      previewImageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      isActive: true,
    },
    {
      name: '森林小鹿',
      content: '一只优雅的小鹿站在阳光洒落的森林空地上，周围是高大的树木和晨雾',
      previewImageUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=400',
      isActive: true,
    },
    // 美食类
    {
      name: '精致甜品',
      content: '精美的法式甜品，层次分明的马卡龙和蛋糕，摆放在大理石桌面上，柔和的灯光，温馨的下午茶氛围',
      previewImageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
      isActive: true,
    },
    // 暂停状态的提示词（用于测试）
    {
      name: '测试提示词（未激活）',
      content: '这是一个未激活的提示词，用于测试筛选功能',
      previewImageUrl: null,
      isActive: false,
    },
  ]

  for (const promptData of prompts) {
    const prompt = await prisma.prompt.upsert({
      where: { id: `seed-${promptData.name}` },
      update: {},
      create: {
        ...promptData,
        id: `seed-${promptData.name}`,
      },
    })
    console.log(`✓ 创建提示词: ${prompt.name} (激活状态: ${prompt.isActive})`)
  }

  console.log('✓ 数据库种子数据填充完成！')
  console.log('\n默认账户信息：')
  console.log('管理员: admin@aiphoto.com / admin123')
  console.log('演示用户: demo@example.com / demo123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('种子数据填充失败:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
