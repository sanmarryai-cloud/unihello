/**
 * 声网 RTC 适配器。未接入，rtc/index.js 不会引用本文件。
 * TODO: 换 Agora Web SDK 实现 createRoom / joinRoom / setMic / setCamera /
 * kick / closeRoom / startRecording / stopRecording，并在云端录制完成时调用 onRecordingDone。
 */
export const agoraAdapter = {
  id: 'agora',
  async createRoom() {
    throw new Error('声网 RTC 未接入')
  },
  async joinRoom() {
    throw new Error('声网 RTC 未接入')
  },
  async leaveRoom() {
    throw new Error('声网 RTC 未接入')
  },
  async setMic() {
    throw new Error('声网 RTC 未接入')
  },
  async setCamera() {
    throw new Error('声网 RTC 未接入')
  },
  async kick() {
    throw new Error('声网 RTC 未接入')
  },
  async closeRoom() {
    throw new Error('声网 RTC 未接入')
  },
  async startRecording() {
    throw new Error('声网 RTC 未接入')
  },
  async stopRecording() {
    throw new Error('声网 RTC 未接入')
  },
  onRecordingDone() {
    throw new Error('声网 RTC 未接入')
  },
}
