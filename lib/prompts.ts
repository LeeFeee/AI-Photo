// Prompt data model and store
export interface Prompt {
  id: string
  name: string
  content: string
  previewImage?: string
  isActive: boolean
  category?: string
  createdAt: Date
  updatedAt: Date
  updatedBy?: string
}

// In-memory store (in production, this would be a database)
let prompts: Prompt[] = [
  {
    id: '1',
    name: '山水画风景',
    content: 'A beautiful Chinese landscape painting with mountains, rivers, and mist, traditional ink wash style',
    previewImage: '/placeholder-landscape.jpg',
    isActive: true,
    category: '风景',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    updatedBy: 'admin',
  },
  {
    id: '2',
    name: '赛博朋克城市',
    content: 'Cyberpunk cityscape at night, neon lights, flying cars, futuristic architecture, rain-soaked streets',
    previewImage: '/placeholder-city.jpg',
    isActive: true,
    category: '建筑',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    updatedBy: 'admin',
  },
  {
    id: '3',
    name: '可爱小猫',
    content: 'Adorable fluffy kitten with big eyes, soft fur, playful pose, studio lighting',
    previewImage: '/placeholder-cat.jpg',
    isActive: true,
    category: '动物',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    updatedBy: 'admin',
  },
  {
    id: '4',
    name: '抽象艺术',
    content: 'Abstract art with vibrant colors, geometric shapes, modern design, dynamic composition',
    previewImage: '/placeholder-abstract.jpg',
    isActive: false,
    category: '抽象',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    updatedBy: 'admin',
  },
]

export function getAllPrompts(): Prompt[] {
  return prompts
}

export function getActivePrompts(): Prompt[] {
  return prompts.filter(p => p.isActive)
}

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find(p => p.id === id)
}

export function createPrompt(data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt {
  const newPrompt: Prompt = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  prompts.push(newPrompt)
  return newPrompt
}

export function updatePrompt(id: string, data: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Prompt | null {
  const index = prompts.findIndex(p => p.id === id)
  if (index === -1) return null
  
  prompts[index] = {
    ...prompts[index],
    ...data,
    updatedAt: new Date(),
  }
  return prompts[index]
}

export function deletePrompt(id: string): boolean {
  const index = prompts.findIndex(p => p.id === id)
  if (index === -1) return false
  
  prompts.splice(index, 1)
  return true
}

export function searchPrompts(query: string): Prompt[] {
  const lowerQuery = query.toLowerCase()
  return prompts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.content.toLowerCase().includes(lowerQuery) ||
    p.category?.toLowerCase().includes(lowerQuery)
  )
}
