/** 阿里云语音识别。未接入，asr/index.js 不会引用本文件。 TODO: 提交录音并返回带时间戳的转写。 */
export const aliyunAsr = {
  id: 'aliyun',
  async transcribe() {
    throw new Error('阿里云语音识别未接入')
  },
}
