import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { id: 'demo-user-123' },
    update: {},
    create: {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: '演示用户',
      tokens: 100,
      isMember: true,
    },
  })

  console.log('Created demo user:', user)

  // Create prompts
  const prompts = [
    {
      title: '梦幻森林',
      content: '一片梦幻般的森林，阳光透过树叶洒下斑驳光影，营造出神秘而宁静的氛围',
      description: '适合创作自然风景主题的作品',
      category: '自然',
      membersOnly: false,
      tokenCost: 5,
    },
    {
      title: '未来城市',
      content: '充满科技感的未来城市，霓虹灯光璀璨，高耸的摩天大楼林立，飞行器在空中穿梭',
      description: '科幻题材的首选',
      category: '科幻',
      membersOnly: false,
      tokenCost: 5,
    },
    {
      title: '宁静海滩',
      content: '黄昏时分的宁静海滩，海浪轻拍沙滩，天空渐变成温暖的橙色和粉色',
      description: '放松心情的海景',
      category: '自然',
      membersOnly: false,
      tokenCost: 5,
    },
    {
      title: '山峰日出',
      content: '壮丽的山峰上，太阳冉冉升起，金色的光芒洒满大地，云海翻涌',
      description: '壮美的山景',
      category: '自然',
      membersOnly: false,
      tokenCost: 5,
    },
    {
      title: '星空夜景',
      content: '璀璨的星空下，银河清晰可见，流星划过天际，远处的山脉形成完美的剪影',
      description: '浪漫的星空主题',
      category: '自然',
      membersOnly: false,
      tokenCost: 5,
    },
    {
      title: '樱花之春',
      content: '盛开的樱花树下，花瓣随风飘落，形成粉色的花雨，营造出浪漫的春日氛围',
      description: '春天的代表',
      category: '自然',
      membersOnly: false,
      tokenCost: 5,
    },
    {
      title: '赛博朋克街道',
      content: '雨后的赛博朋克风格街道，霓虹招牌反射在湿漉漉的地面上，人群熙攘，充满未来感',
      description: '赛博朋克风格（会员专属）',
      category: '科幻',
      membersOnly: true,
      tokenCost: 10,
    },
    {
      title: '魔法城堡',
      content: '矗立在云端的魔法城堡，闪烁着神秘的光芒，周围环绕着飞舞的光点和魔法能量',
      description: '奇幻主题（会员专属）',
      category: '奇幻',
      membersOnly: true,
      tokenCost: 10,
    },
    {
      title: '水下世界',
      content: '五彩斑斓的珊瑚礁，各种热带鱼在其间游弋，阳光从水面透下，形成迷人的光影',
      description: '海洋世界（会员专属）',
      category: '自然',
      membersOnly: true,
      tokenCost: 10,
    },
  ]

  for (const prompt of prompts) {
    const created = await prisma.prompt.upsert({
      where: { id: `prompt-${prompt.title}` },
      update: {},
      create: {
        id: `prompt-${prompt.title}`,
        ...prompt,
      },
    })
    console.log('Created prompt:', created.title)
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
