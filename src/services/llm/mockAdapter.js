import { SAMPLE_DIGEST, SAMPLE_LONGFORM, SAMPLE_MINUTES, SAMPLE_REVIEW } from '../../data/meetingSample.js'
import { PROMPTS } from './ai-prompts.js'

export const mockLlm = {
  id: 'mock',
  async quickReview() {
    return { promptId: PROMPTS.quickReview.id, prompt: PROMPTS.quickReview.text, text: SAMPLE_REVIEW }
  },
  async meetingSummary() {
    return { promptId: PROMPTS.summary.id, prompt: PROMPTS.summary.text, text: SAMPLE_LONGFORM }
  },
  async structuredMinutes() {
    return { promptId: PROMPTS.minutes.id, prompt: PROMPTS.minutes.text, data: SAMPLE_MINUTES }
  },
  async speakerDigest() {
    return { promptId: PROMPTS.speakers.id, prompt: PROMPTS.speakers.text, text: SAMPLE_DIGEST }
  },
}
