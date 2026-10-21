import { SAMPLE_AUDIO_SEC, SAMPLE_LINES, scaleLines } from '../../data/meetingSample.js'

export const mockAsr = {
  id: 'mock',
  async transcribe({ durationSec }) {
    const seconds = durationSec || SAMPLE_AUDIO_SEC
    return {
      provider: 'mock',
      lines: scaleLines(SAMPLE_LINES, SAMPLE_AUDIO_SEC, seconds),
    }
  },
}
