const listeners = new Set()

/** 本地房间。不采集麦克风和摄像头。 */
export const mockAdapter = {
  id: 'mock',
  async createRoom(input) {
    return { provider: 'mock', roomId: input?.code || input?.roomId || 'room' }
  },
  async joinRoom(roomId, user) {
    return { provider: 'mock', roomId, user }
  },
  async leaveRoom(roomId, userId) {
    return { provider: 'mock', roomId, userId, left: true }
  },
  async setMic(roomId, userId, on) {
    return { provider: 'mock', roomId, userId, mic: !!on }
  },
  async setCamera(roomId, userId, on) {
    return { provider: 'mock', roomId, userId, camera: !!on }
  },
  async kick(roomId, userId) {
    return { provider: 'mock', roomId, userId, kicked: true }
  },
  async closeRoom(roomId) {
    return { provider: 'mock', roomId, closed: true }
  },
  async startRecording(roomId, mode) {
    return { provider: 'mock', roomId, mode: mode || 'audio', recordingId: `rec_${roomId}` }
  },
  async stopRecording(roomId) {
    return { provider: 'mock', roomId, stopped: true }
  },
  onRecordingDone(handler) {
    listeners.add(handler)
    return () => listeners.delete(handler)
  },
  emitRecordingDone(payload) {
    for (const handler of listeners) handler(payload)
  },
}
