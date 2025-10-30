import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: '演示用户',
    },
  })

  console.log('Created user:', user)

  // Create some prompts
  const prompts = [
    {
      name: '梦幻森林',
      description: '充满魔力的森林景观',
      content: '一片梦幻般的森林，阳光透过树叶洒下斑驳光影，仙境般的氛围',
      category: '风景',
    },
    {
      name: '未来城市',
      description: '科技感十足的城市夜景',
      content: '充满科技感的未来城市，霓虹灯光璀璨，赛博朋克风格',
      category: '风景',
    },
    {
      name: '宁静海滩',
      description: '黄昏时分的海滩',
      content: '黄昏时分的宁静海滩，海浪轻拍沙滩，天空渐变色彩',
      category: '风景',
    },
    {
      name: '山峰日出',
      description: '壮丽山峰上的日出',
      content: '壮丽的山峰上，太阳冉冉升起，云海翻滚',
      category: '风景',
    },
    {
      name: '星空夜景',
      description: '璀璨的星空',
      content: '璀璨的星空下，银河清晰可见，星辰闪烁',
      category: '风景',
    },
    {
      name: '樱花之春',
      description: '樱花盛开的春天',
      content: '盛开的樱花树下，花瓣随风飘落，浪漫的春日氛围',
      category: '风景',
    },
  ]

  const createdPrompts = await Promise.all(
    prompts.map((prompt) =>
      prisma.prompt.upsert({
        where: { id: prompt.name },
        update: {},
        create: {
          id: prompt.name,
          ...prompt,
        },
      })
    )
  )

  console.log('Created prompts:', createdPrompts.length)

  // Create some generated images for the user
  const images = []
  for (let i = 0; i < 15; i++) {
    const promptIndex = i % createdPrompts.length
    const prompt = createdPrompts[promptIndex]
    
    images.push({
      userId: user.id,
      promptId: prompt.id,
      referenceImageUrl: `https://picsum.photos/seed/ref${i}/400/300`,
      generatedImageUrl: `https://picsum.photos/seed/gen${i}/800/600`,
      tokenCost: Math.floor(Math.random() * 500) + 100,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Stagger by days
    })
  }

  await prisma.generatedImage.createMany({
    data: images,
  })

  console.log('Created generated images:', images.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
