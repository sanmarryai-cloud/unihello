import { buildReadyMeeting, peaksFor, SAMPLE_AUDIO_SEC, SAMPLE_SPEAKERS, SAMPLE_VIDEO_SEC, sampleAudioUrl, sampleVideoUrl, withTalk } from '../data/meetingSample.js'
import { getAsrAdapter } from './asr/index.js'
import { AI_DISCLAIMER } from './llm/ai-prompts.js'
import { getLlmAdapter } from './llm/index.js'
import { adminCardId, currentVisitorId, ensureVisitor, persist, store, uid } from './localDb.js'
import { getRtcAdapter } from './rtc/index.js'

export { AI_DISCLAIMER }

export const MEETING_PLAN = {
  key: 'meetings',
  name: '会议录制增值包',
  priceText: '演示价 ¥199/年',
}

export const MEETING_FEATURES = [
  '创建纯音频或音视频会议，得到唯一会议号',
  '入会后自动录音，成员列表、静音和画面占位',
  '主持人可移出、全员静音、关闭房间',
  '结束会议后生成回放、总结、纪要、转写和发言人',
  '转写可搜索，点一句就跳到对应时间',
  '转存到云盘，分享回放并设置谁能看',
  '举报进入工单，由超级名片自己的后台处置',
]

const EXTRAS = [
  { id: 'user_lin', name: '林晓' },
  { id: 'user_zhou', name: '周宁' },
  { id: 'user_chen', name: '陈可' },
]

const RATES = {
  agora: { id: 'agora', name: '声网', audioCall: 0.016, videoCall: 0.032, audioRec: 0.008, videoRec: 0.02, asr: 0.012, llm: 0.05 },
  volc: { id: 'volc', name: '火山', audioCall: 0.014, videoCall: 0.028, audioRec: 0.007, videoRec: 0.018, asr: 0.01, llm: 0.04 },
}

export function meetingsEnabled(cardId) {
  const card = store.cards.find((item) => item.id === cardId)
  return !!card?.meetingsAddon
}

export function setMeetingsAddon(cardId, on) {
  const card = store.cards.find((item) => item.id === cardId)
  if (!card) return null
  card.meetingsAddon = !!on
  persist()
  return card
}

export function listMeetings(cardId) {
  return (store.meetings || [])
    .filter((item) => !cardId || item.cardId === cardId)
    .slice()
    .sort((a, b) => (b.startAt || b.createdAt || 0) - (a.startAt || a.createdAt || 0))
}

export function getMeeting(id) {
  return (store.meetings || []).find((item) => item.id === id) || null
}

export function findMeeting(codeOrId) {
  const key = String(codeOrId || '').trim()
  return (store.meetings || []).find((item) => item.id === key || item.code === key) || null
}

function nextCode() {
  for (let index = 0; index < 30; index += 1) {
    const code = String(100000 + Math.floor(Math.random() * 900000))
    if (!(store.meetings || []).some((item) => item.code === code)) return code
  }
  return String(Date.now()).slice(-6)
}

function addMember(meeting, member) {
  if (meeting.participants.some((item) => item.id === member.id)) return
  meeting.participants.push({
    id: member.id,
    name: member.name || '成员',
    role: member.id === meeting.hostId ? 'host' : 'guest',
    mic: member.mic !== false,
    camera: !!member.camera,
  })
}

export function createMeeting({ title, type, recordMode }) {
  const cardId = adminCardId()
  if (!meetingsEnabled(cardId)) return null
  const host = ensureVisitor()
  const meeting = {
    id: uid('m'),
    code: nextCode(),
    title: String(title || '').trim() || '未命名会议',
    type: type === 'av' ? 'av' : 'audio',
    recordMode: type === 'av' && recordMode === 'mix' ? 'mix' : 'audio',
    cardId,
    status: 'scheduled',
    hostId: host.id,
    hostName: host.name || '主持人',
    createdAt: Date.now(),
    startAt: null,
    endAt: null,
    durationSec: 0,
    mediaKind: 'audio',
    mediaUrl: '',
    recording: false,
    shareAccess: 'link',
    source: 'room',
    participants: [],
    speakers: [],
    transcript: [],
    peaks: [],
    summary: { review: '', longform: '' },
    minutes: { topics: [], consensus: [], decisions: [], todos: [] },
    speakerDigest: '',
  }
  store.meetings.unshift(meeting)
  persist()
  return meeting
}

export async function joinMeeting(codeOrId) {
  const meeting = findMeeting(codeOrId)
  if (!meeting) return null
  if (meeting.status === 'ready' || meeting.status === 'closed' || meeting.status === 'processing') return meeting
  const rtc = getRtcAdapter()
  if (meeting.status === 'scheduled') {
    await rtc.createRoom(meeting)
    meeting.status = 'live'
    meeting.startAt = Date.now()
    await rtc.startRecording(meeting.code, meeting.recordMode)
    meeting.recording = true
  }
  const me = ensureVisitor()
  await rtc.joinRoom(meeting.code, { id: me.id, name: me.name })
  if (!meeting.hostId) meeting.hostId = me.id
  addMember(meeting, { id: meeting.hostId, name: meeting.hostName || me.name, mic: true, camera: false })
  addMember(meeting, { id: me.id, name: me.name || '我', mic: true, camera: false })
  for (const extra of EXTRAS) {
    addMember(meeting, {
      ...extra,
      mic: true,
      camera: meeting.type === 'av' && extra.id === 'user_lin',
    })
  }
  persist()
  return meeting
}

export async function leaveMeeting(id) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  const me = currentVisitorId()
  await getRtcAdapter().leaveRoom(meeting.code, me)
  return meeting
}

export async function setParticipantMic(id, userId, on) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  const member = meeting.participants.find((item) => item.id === userId)
  if (member) member.mic = !!on
  await getRtcAdapter().setMic(meeting.code, userId, !!on)
  persist()
  return meeting
}

export async function setParticipantCamera(id, userId, on) {
  const meeting = getMeeting(id)
  if (!meeting || meeting.type !== 'av') return meeting
  const member = meeting.participants.find((item) => item.id === userId)
  if (member) member.camera = !!on
  await getRtcAdapter().setCamera(meeting.code, userId, !!on)
  persist()
  return meeting
}

export async function kickMember(id, userId) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  if (userId === meeting.hostId) return meeting
  meeting.participants = meeting.participants.filter((item) => item.id !== userId)
  await getRtcAdapter().kick(meeting.code, userId)
  persist()
  return meeting
}

export async function muteAll(id) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  for (const member of meeting.participants) {
    if (member.id !== meeting.hostId) member.mic = false
  }
  await getRtcAdapter().setMic(meeting.code, '*', false)
  persist()
  return meeting
}

export async function closeRoom(id) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  await getRtcAdapter().closeRoom(meeting.code)
  meeting.status = 'closed'
  meeting.recording = false
  meeting.endAt = Date.now()
  persist()
  return meeting
}

export async function endMeeting(id) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  if (meeting.status === 'ready') return meeting
  const rtc = getRtcAdapter()
  await rtc.stopRecording(meeting.code)
  meeting.status = 'processing'
  meeting.recording = false
  meeting.endAt = Date.now()
  const video = meeting.type === 'av' && meeting.recordMode === 'mix'
  const durationSec = video ? SAMPLE_VIDEO_SEC : SAMPLE_AUDIO_SEC
  const asr = await getAsrAdapter().transcribe({ durationSec, mediaKind: video ? 'video' : 'audio' })
  const llm = getLlmAdapter()
  const review = await llm.quickReview(asr.lines)
  const longform = await llm.meetingSummary(asr.lines)
  const minutes = await llm.structuredMinutes(asr.lines)
  const digest = await llm.speakerDigest(asr.lines)
  const transcript = asr.lines.map((line) => ({ ...line, id: `${meeting.id}_${line.id}` }))
  meeting.durationSec = durationSec
  meeting.mediaKind = video ? 'video' : 'audio'
  meeting.mediaUrl = video ? sampleVideoUrl() : sampleAudioUrl()
  meeting.transcript = transcript
  meeting.speakers = withTalk(transcript, SAMPLE_SPEAKERS)
  meeting.peaks = peaksFor(transcript, durationSec)
  meeting.summary = { review: review.text, longform: longform.text }
  meeting.minutes = minutes.data
  meeting.speakerDigest = digest.text
  meeting.promptIds = [review.promptId, longform.promptId, minutes.promptId, digest.promptId]
  meeting.status = 'ready'
  persist()
  rtc.emitRecordingDone({ meetingId: meeting.id })
  return meeting
}

export function deleteMeeting(id) {
  const index = (store.meetings || []).findIndex((item) => item.id === id)
  if (index < 0) return false
  store.meetings.splice(index, 1)
  store.cloudFiles = (store.cloudFiles || []).filter((item) => item.meetingId !== id)
  persist()
  return true
}

export function renameSpeaker(id, speakerId, name) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  const speaker = (meeting.speakers || []).find((item) => item.id === speakerId)
  if (speaker) speaker.name = String(name || '').trim() || speaker.id
  persist()
  return meeting
}

export function setShareAccess(id, mode) {
  const meeting = getMeeting(id)
  if (!meeting) return null
  meeting.shareAccess = mode === 'creator' ? 'creator' : 'link'
  persist()
  return meeting
}

export function canViewMeeting(meeting, guest) {
  if (!meeting) return false
  if (meeting.shareAccess !== 'creator') return true
  if (guest) return false
  const me = currentVisitorId()
  if (me && me === meeting.hostId) return true
  return meeting.hostId === 'user_owner'
}

export function sharePayload(meeting) {
  const path = `/meeting/${meeting.id}`
  const link = `${location.origin}${location.pathname}${location.search}#${path}`
  return {
    title: `会议录制：${meeting.title}`,
    path,
    link,
    imageUrl: `${import.meta.env.BASE_URL}media/meeting-cover.svg`,
  }
}

export function saveToCloud(id) {
  const meeting = getMeeting(id)
  if (!meeting || meeting.status !== 'ready') return null
  const existing = (store.cloudFiles || []).find((item) => item.meetingId === id)
  if (existing) return { already: true, file: existing }
  const file = {
    id: uid('cloud'),
    meetingId: id,
    cardId: meeting.cardId,
    title: meeting.title,
    kind: meeting.mediaKind === 'video' ? 'mp4' : 'mp3',
    mediaUrl: meeting.mediaUrl,
    durationSec: meeting.durationSec,
    savedAt: Date.now(),
  }
  store.cloudFiles.unshift(file)
  persist()
  return { already: false, file }
}

export function listCloud() {
  return (store.cloudFiles || []).slice().sort((a, b) => b.savedAt - a.savedAt)
}

export function renameCloud(id, title) {
  const file = (store.cloudFiles || []).find((item) => item.id === id)
  if (!file) return null
  file.title = String(title || '').trim() || file.title
  persist()
  return file
}

export function deleteCloud(id) {
  const index = (store.cloudFiles || []).findIndex((item) => item.id === id)
  if (index < 0) return false
  store.cloudFiles.splice(index, 1)
  persist()
  return true
}

export function createTicket({ meetingId, reason }) {
  const meeting = getMeeting(meetingId)
  const reporter = ensureVisitor()
  const safety = providerConfig().safety
  const ticket = {
    id: uid('ticket'),
    meetingId: meeting?.id || '',
    meetingTitle: meeting?.title || '会议',
    reason: String(reason || '').trim() || '其他',
    reporterId: reporter.id,
    reporterName: reporter.name || '访客',
    status: 'open',
    actionNote: '',
    alert: safety ? '已回调业务后端（演示）' : '内容安全未开启，未回调',
    createdAt: Date.now(),
  }
  store.tickets.unshift(ticket)
  persist()
  return ticket
}

export function listTickets() {
  return (store.tickets || []).slice().sort((a, b) => b.createdAt - a.createdAt)
}

export function setTicketStatus(id, status, note) {
  const ticket = (store.tickets || []).find((item) => item.id === id)
  if (!ticket) return null
  if (status === 'handled' || status === 'archived' || status === 'open') ticket.status = status
  if (note !== undefined) ticket.actionNote = String(note || '')
  persist()
  return ticket
}

export function providerConfig() {
  const meta = store.meta || {}
  const asrVendor = ['volc', 'aliyun', 'xfyun'].includes(meta.asrVendor) ? meta.asrVendor : 'volc'
  return {
    costRtc: meta.costRtc === 'volc' ? 'volc' : 'agora',
    asrVendor,
    safety: meta.safety !== false,
  }
}

export function setProviderConfig(patch) {
  if (!store.meta) store.meta = {}
  if (patch.costRtc === 'agora' || patch.costRtc === 'volc') store.meta.costRtc = patch.costRtc
  if (['volc', 'aliyun', 'xfyun'].includes(patch.asrVendor)) store.meta.asrVendor = patch.asrVendor
  if (patch.safety !== undefined) store.meta.safety = !!patch.safety
  persist()
  return providerConfig()
}

function money(value) {
  return `¥${value.toFixed(2)}`
}

export function usageReport() {
  const config = providerConfig()
  const rates = RATES[config.costRtc]
  const ready = (store.meetings || []).filter((item) => item.status === 'ready')
  const audioCall = ready.filter((item) => item.type !== 'av').reduce((sum, item) => sum + item.durationSec, 0) / 60
  const videoCall = ready.filter((item) => item.type === 'av').reduce((sum, item) => sum + item.durationSec, 0) / 60
  const audioRec = ready.filter((item) => item.recordMode !== 'mix').reduce((sum, item) => sum + item.durationSec, 0) / 60
  const videoRec = ready.filter((item) => item.recordMode === 'mix').reduce((sum, item) => sum + item.durationSec, 0) / 60
  const asrMin = ready.reduce((sum, item) => sum + item.durationSec, 0) / 60
  const llmCount = ready.length
  const rows = [
    { key: 'audioCall', name: '音频通话', usage: `${audioCall.toFixed(1)} 分钟`, amount: audioCall * rates.audioCall },
    { key: 'videoCall', name: '视频通话', usage: `${videoCall.toFixed(1)} 分钟`, amount: videoCall * rates.videoCall },
    { key: 'audioRec', name: '音频录制', usage: `${audioRec.toFixed(1)} 分钟`, amount: audioRec * rates.audioRec },
    { key: 'videoRec', name: '视频录制', usage: `${videoRec.toFixed(1)} 分钟`, amount: videoRec * rates.videoRec },
    { key: 'asr', name: '语音识别', usage: `${asrMin.toFixed(1)} 分钟`, amount: asrMin * rates.asr },
    { key: 'llm', name: '纪要模型', usage: `${llmCount} 次`, amount: llmCount * rates.llm },
  ]
  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  return {
    label: '演示数据',
    providerName: rates.name,
    rates,
    rows: rows.map((row) => ({ ...row, amountText: money(row.amount) })),
    totalText: money(total),
  }
}

export function formatClock(sec) {
  const whole = Math.max(0, Math.floor(Number(sec) || 0))
  const minute = Math.floor(whole / 60)
  const second = whole % 60
  return `${minute}:${String(second).padStart(2, '0')}`
}

export function formatWhen(stamp) {
  if (!stamp) return '未开始'
  const date = new Date(stamp)
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
