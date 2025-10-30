// 管理员配置工具
// Admin configuration utilities

import { TOKEN_PACKAGES, type TokenPackage } from './token-packages'

/**
 * 验证代币套餐配置
 * Validate token package configuration
 */
export function validateTokenPackages(): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  TOKEN_PACKAGES.forEach((pkg) => {
    // 检查必需字段
    if (!pkg.id) errors.push(`套餐缺少 ID: ${JSON.stringify(pkg)}`)
    if (!pkg.name) errors.push(`套餐 ${pkg.id} 缺少名称`)
    if (!pkg.tokens || pkg.tokens <= 0) errors.push(`套餐 ${pkg.id} 的代币数量无效`)
    if (!pkg.price || pkg.price <= 0) errors.push(`套餐 ${pkg.id} 的价格无效`)
    if (!pkg.stripePriceId) errors.push(`套餐 ${pkg.id} 缺少 Stripe Price ID`)

    // 检查价格是否为整数（以分为单位）
    if (!Number.isInteger(pkg.price)) {
      errors.push(`套餐 ${pkg.id} 的价格必须为整数（以分为单位）`)
    }

    // 检查代币数量是否为整数
    if (!Number.isInteger(pkg.tokens)) {
      errors.push(`套餐 ${pkg.id} 的代币数量必须为整数`)
    }

    // 检查赠送代币是否为整数
    if (pkg.bonus && !Number.isInteger(pkg.bonus)) {
      errors.push(`套餐 ${pkg.id} 的赠送代币数量必须为整数`)
    }
  })

  // 检查是否有重复的 ID
  const ids = TOKEN_PACKAGES.map(pkg => pkg.id)
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    errors.push(`发现重复的套餐 ID: ${duplicateIds.join(', ')}`)
  }

  // 检查是否有重复的 Stripe Price ID
  const priceIds = TOKEN_PACKAGES.map(pkg => pkg.stripePriceId)
  const duplicatePriceIds = priceIds.filter((id, index) => priceIds.indexOf(id) !== index)
  if (duplicatePriceIds.length > 0) {
    errors.push(`发现重复的 Stripe Price ID: ${duplicatePriceIds.join(', ')}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * 获取代币套餐配置摘要
 * Get token package configuration summary
 */
export function getPackageSummary(): string {
  const summary = TOKEN_PACKAGES.map((pkg) => {
    const totalTokens = pkg.tokens + (pkg.bonus || 0)
    const priceYuan = (pkg.price / 100).toFixed(2)
    const pricePerToken = (pkg.price / totalTokens / 100).toFixed(4)
    
    return [
      `【${pkg.name}】`,
      `  ID: ${pkg.id}`,
      `  价格: ¥${priceYuan}`,
      `  基础代币: ${pkg.tokens}`,
      pkg.bonus ? `  赠送代币: ${pkg.bonus}` : null,
      `  总代币: ${totalTokens}`,
      `  单价: ¥${pricePerToken}/代币`,
      `  Stripe Price ID: ${pkg.stripePriceId}`,
      pkg.popular ? `  🔥 热门套餐` : null,
    ].filter(Boolean).join('\n')
  }).join('\n\n')

  return `代币套餐配置摘要\n${'='.repeat(50)}\n\n${summary}\n\n${'='.repeat(50)}\n总套餐数: ${TOKEN_PACKAGES.length}`
}

/**
 * 计算套餐统计信息
 * Calculate package statistics
 */
export function getPackageStatistics() {
  const totalPackages = TOKEN_PACKAGES.length
  const popularPackages = TOKEN_PACKAGES.filter(pkg => pkg.popular).length
  const packagesWithBonus = TOKEN_PACKAGES.filter(pkg => pkg.bonus).length
  
  const minPrice = Math.min(...TOKEN_PACKAGES.map(pkg => pkg.price))
  const maxPrice = Math.max(...TOKEN_PACKAGES.map(pkg => pkg.price))
  const avgPrice = TOKEN_PACKAGES.reduce((sum, pkg) => sum + pkg.price, 0) / totalPackages
  
  const minTokens = Math.min(...TOKEN_PACKAGES.map(pkg => pkg.tokens + (pkg.bonus || 0)))
  const maxTokens = Math.max(...TOKEN_PACKAGES.map(pkg => pkg.tokens + (pkg.bonus || 0)))
  const avgTokens = TOKEN_PACKAGES.reduce((sum, pkg) => sum + pkg.tokens + (pkg.bonus || 0), 0) / totalPackages

  return {
    totalPackages,
    popularPackages,
    packagesWithBonus,
    price: {
      min: minPrice / 100,
      max: maxPrice / 100,
      avg: avgPrice / 100,
    },
    tokens: {
      min: minTokens,
      max: maxTokens,
      avg: Math.round(avgTokens),
    },
  }
}

/**
 * 运行配置检查
 * Run configuration checks
 * 
 * 可以在服务器启动时调用此函数进行配置验证
 * Can be called during server startup for configuration validation
 */
export function runConfigurationCheck() {
  console.log('\n' + '='.repeat(60))
  console.log('🔍 代币套餐配置检查')
  console.log('='.repeat(60))
  
  const validation = validateTokenPackages()
  
  if (validation.valid) {
    console.log('✅ 配置验证通过\n')
    console.log(getPackageSummary())
    
    const stats = getPackageStatistics()
    console.log('\n📊 统计信息:')
    console.log(`  - 总套餐数: ${stats.totalPackages}`)
    console.log(`  - 热门套餐: ${stats.popularPackages}`)
    console.log(`  - 含赠送套餐: ${stats.packagesWithBonus}`)
    console.log(`  - 价格范围: ¥${stats.price.min} - ¥${stats.price.max}`)
    console.log(`  - 代币范围: ${stats.tokens.min} - ${stats.tokens.max}`)
  } else {
    console.error('❌ 配置验证失败:\n')
    validation.errors.forEach((error) => {
      console.error(`  - ${error}`)
    })
  }
  
  console.log('='.repeat(60) + '\n')
  
  return validation.valid
}
