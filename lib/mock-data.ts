// Mock data for prompts - simulates Prisma query results
// In production, this would be replaced with actual Prisma queries

import { Prompt } from './types'

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    name: '赛博朋克城市夜景',
    content: 'cyberpunk city at night, neon lights, flying cars, futuristic skyscrapers, rain-soaked streets, high detail, cinematic lighting, 8k resolution',
    description: '充满未来感的赛博朋克风格城市夜景，霓虹灯闪烁，高科技建筑林立',
    category: '风景',
    previewImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '梦幻森林',
    content: 'magical forest, ethereal lighting, glowing mushrooms, fairy lights, mystical atmosphere, soft colors, fantasy art style, ultra detailed',
    description: '神秘的魔法森林，发光的蘑菇和精灵般的光芒营造出梦幻氛围',
    category: '风景',
    previewImage: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: '古典肖像',
    content: 'classical portrait, renaissance style, oil painting, dramatic lighting, detailed facial features, period clothing, museum quality, masterpiece',
    description: '文艺复兴风格的古典肖像画，精致的面部细节和戏剧性光影',
    category: '人物',
    previewImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: '抽象几何',
    content: 'abstract geometric art, vibrant colors, minimalist design, modern art, clean lines, gradient backgrounds, 3D elements, artistic composition',
    description: '现代抽象几何艺术，鲜艳的色彩和简洁的线条构成',
    category: '抽象',
    previewImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: '可爱的猫咪',
    content: 'adorable kitten, fluffy fur, playful expression, bright eyes, soft lighting, cute pose, professional pet photography, high resolution',
    description: '超级可爱的小猫咪，毛茸茸的外表和顽皮的表情',
    category: '动物',
    previewImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: '现代建筑',
    content: 'modern architecture, glass facade, minimalist design, geometric shapes, urban landscape, blue sky, architectural photography, sharp details',
    description: '简约的现代建筑设计，玻璃幕墙和几何造型',
    category: '建筑',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: '水彩艺术',
    content: 'watercolor painting, soft brushstrokes, pastel colors, flowing pigments, artistic texture, dreamy atmosphere, delicate details, fine art',
    description: '柔和的水彩画作，淡雅的色彩和流动的质感',
    category: '艺术',
    previewImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: '山脉日出',
    content: 'mountain sunrise, golden hour, dramatic clouds, misty valleys, epic landscape, nature photography, vibrant colors, breathtaking view',
    description: '壮丽的山脉日出景观，金色的阳光和云雾缭绕的山谷',
    category: '风景',
    previewImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: '时尚模特',
    content: 'fashion model, editorial photography, elegant pose, stylish clothing, professional lighting, studio quality, high fashion, vogue style',
    description: '时尚杂志风格的模特照片，优雅的姿态和时尚的服装',
    category: '人物',
    previewImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: '野生狮子',
    content: 'wild lion, majestic pose, golden mane, natural habitat, wildlife photography, powerful expression, detailed fur, national geographic style',
    description: '威严的野生狮子，金色的鬃毛和强大的气场',
    category: '动物',
    previewImage: 'https://images.unsplash.com/photo-1552410260-0fd9b577afa6?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: '流体艺术',
    content: 'fluid art, liquid paint, marbling effect, abstract patterns, vibrant color mixing, acrylic pouring technique, organic shapes, modern art',
    description: '流动的液体艺术，色彩混合形成抽象的有机图案',
    category: '抽象',
    previewImage: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: '古堡建筑',
    content: 'ancient castle, medieval architecture, stone walls, historical monument, dramatic sky, gothic style, detailed textures, architectural heritage',
    description: '中世纪古堡建筑，石墙和哥特式风格的历史建筑',
    category: '建筑',
    previewImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Simulates Prisma query: prisma.prompt.findMany({ where: { isActive: true } })
export async function getActivePrompts(): Promise<Prompt[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return mockPrompts.filter(prompt => prompt.isActive)
}

// Simulates Prisma query: prisma.prompt.findUnique({ where: { id } })
export async function getPromptById(id: string): Promise<Prompt | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return mockPrompts.find(prompt => prompt.id === id) || null
}
