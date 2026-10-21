/**
 * 火山引擎 RTC 适配器。未接入，rtc/index.js 不会引用本文件。
 * TODO: 换火山 RTC Web SDK，录制完成回调走 onRecordingDone。
 */
export const volcAdapter = {
  id: 'volc',
  async createRoom() {
    throw new Error('火山 RTC 未接入')
  },
  async joinRoom() {
    throw new Error('火山 RTC 未接入')
  },
  async leaveRoom() {
    throw new Error('火山 RTC 未接入')
  },
  async setMic() {
    throw new Error('火山 RTC 未接入')
  },
  async setCamera() {
    throw new Error('火山 RTC 未接入')
  },
  async kick() {
    throw new Error('火山 RTC 未接入')
  },
  async closeRoom() {
    throw new Error('火山 RTC 未接入')
  },
  async startRecording() {
    throw new Error('火山 RTC 未接入')
  },
  async stopRecording() {
    throw new Error('火山 RTC 未接入')
  },
  onRecordingDone() {
    throw new Error('火山 RTC 未接入')
  },
}
