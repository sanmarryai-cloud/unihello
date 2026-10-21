import { mockAsr } from './mockAdapter.js'

/** Stage 1 固定走本地转写。火山、阿里云、讯飞文件未接线。 */
export function getAsrAdapter() {
  return mockAsr
}
