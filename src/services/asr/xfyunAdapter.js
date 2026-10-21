/** 讯飞语音识别。未接入，asr/index.js 不会引用本文件。 TODO: 提交录音并返回带时间戳的转写。 */
export const xfyunAsr = {
  id: 'xfyun',
  async transcribe() {
    throw new Error('讯飞语音识别未接入')
  },
}
