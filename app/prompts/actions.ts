'use server'

import { getActivePrompts } from '@/lib/prompts'

export async function getPublicPromptsAction() {
  return getActivePrompts()
}
