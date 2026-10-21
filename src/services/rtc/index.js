import { mockAdapter } from './mockAdapter.js'

/**
 * Stage 1 固定走 mockAdapter。
 * 声网、火山适配器只作为未接线的文件放在同目录，配置里的厂商只影响演示报价。
 */
export function getRtcAdapter() {
  return mockAdapter
}
