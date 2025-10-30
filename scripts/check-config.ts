#!/usr/bin/env ts-node
/**
 * 配置检查脚本
 * Configuration check script
 * 
 * 运行此脚本以验证代币套餐配置
 * Run this script to validate token package configuration
 * 
 * Usage: npx ts-node scripts/check-config.ts
 */

import { runConfigurationCheck } from '../lib/admin-config'

runConfigurationCheck()
