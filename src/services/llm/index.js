import { mockLlm } from './mockAdapter.js'

/** Stage 1 固定走本地纪要。提示词在 ai-prompts.js，换模型时仍使用这四段。 */
export function getLlmAdapter() {
  return mockLlm
}
