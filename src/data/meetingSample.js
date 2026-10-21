export const SAMPLE_AUDIO_SEC = 84
export const SAMPLE_VIDEO_SEC = 48

export const SAMPLE_SPEAKERS = [
  { id: 'spk0', name: '林晓' },
  { id: 'spk1', name: '周宁' },
  { id: 'spk2', name: '陈可' },
  { id: 'spk3', name: '赵启' },
]

export const SAMPLE_LINES = [
  { speakerId: 'spk0', start: 0, end: 7, text: '先看训练营数据。上周开了三期，到课率比上月高四个点，完课还差一截。' },
  { speakerId: 'spk1', start: 7, end: 14, text: '完课可以靠提醒。我建议把第二天的作业提醒提前到晚上八点。' },
  { speakerId: 'spk0', start: 14, end: 21, text: '这条定了。周宁周五前交一版提醒文案，训练营群统一用。' },
  { speakerId: 'spk2', start: 21, end: 29, text: '会员增长本月新增一千二百人，续费卡在第二个月，券发出去打开率不高。' },
  { speakerId: 'spk3', start: 29, end: 36, text: '第二个月别只发券，送一次门店体验，让人愿意留下。' },
  { speakerId: 'spk0', start: 36, end: 44, text: '产品定价先不动季卡。月卡上调二十，避免和季卡倒挂。' },
  { speakerId: 'spk2', start: 44, end: 51, text: '同意。流量获取这边，信息流成本上来了，名片分享带来的线索更便宜。' },
  { speakerId: 'spk1', start: 51, end: 58, text: '那就把名片海报当成本周的主路径，少加一轮投放。' },
  { speakerId: 'spk0', start: 58, end: 66, text: '实体门店拓客上周扫码一百八十人，留手机不到一半，前台话术要改短。' },
  { speakerId: 'spk1', start: 66, end: 73, text: '店长周三前交一版，只留三个问题，不要念稿。' },
  { speakerId: 'spk2', start: 73, end: 80, text: '供应链招募还缺两个区域伙伴，条件是能覆盖五个门店的配送。' },
  { speakerId: 'spk3', start: 80, end: 84, text: '陈可下周一给出候选名单，招募页挂到名片上。散会。' },
]

export const SAMPLE_REVIEW = '林晓、周宁、陈可、赵启过了一遍经营例会：训练营完课靠提醒，会员第二个月改送门店体验，月卡上调二十、季卡不动，流量改走名片海报，门店话术改短，供应链下周一交候选名单。'

export const SAMPLE_LONGFORM = '会议先看训练营数据。上周三期到课率比上月高四个点，完课仍然偏弱。周宁提出把第二天作业提醒提前到晚上八点，林晓定为周五前交文案。\n\n会员增长本月新增一千二百人，续费卡在第二个月。赵启建议不要只发券，改送一次门店体验。\n\n产品定价上，季卡维持现价，月卡上调二十，避免和季卡倒挂。流量获取方面，信息流成本变高，名片分享的线索更便宜，本周主路径改为名片海报。\n\n实体门店上周扫码一百八十人，留手机不到一半。周宁负责让店长周三前改一版短话术。供应链还缺两个能覆盖五个门店配送的区域伙伴，陈可下周一给出候选名单。'

export const SAMPLE_MINUTES = {
  topics: ['训练营数据与完课', '会员增长与续费', '产品定价', '流量获取', '实体门店拓客', '供应链招募'],
  consensus: ['完课靠提醒，不再加课', '第二个月用门店体验，不只发券', '名片分享的线索比加投更便宜'],
  decisions: ['季卡价格不动，月卡上调二十', '本周主路径改为名片海报'],
  todos: [
    { text: '训练营作业提醒文案', owner: '周宁', due: '周五' },
    { text: '门店拓客话术，只留三个问题', owner: '周宁', due: '周三' },
    { text: '供应链候选名单，并把招募页挂到名片', owner: '陈可', due: '下周一' },
  ],
}

export const SAMPLE_DIGEST = '林晓主持并拍板定价和提醒节奏。周宁承接训练营文案和门店话术，发言集中在执行。陈可报了会员和供应链缺口。赵启补充了体验式续费，并收口候选名单的时间。'

export function sampleAudioUrl() {
  return `${import.meta.env.BASE_URL}media/meeting-sample.mp3`
}

export function sampleVideoUrl() {
  return `${import.meta.env.BASE_URL}media/meeting-sample.mp4`
}

export function scaleLines(lines, fromSec, toSec) {
  const ratio = toSec / fromSec
  return lines.map((line, index) => ({
    id: `ln${index}`,
    speakerId: line.speakerId,
    text: line.text,
    start: Math.round(line.start * ratio * 10) / 10,
    end: Math.round(Math.min(toSec, line.end * ratio) * 10) / 10,
  }))
}

export function withTalk(lines, speakers = SAMPLE_SPEAKERS) {
  return speakers.map((speaker) => {
    const talkSec = lines
      .filter((line) => line.speakerId === speaker.id)
      .reduce((sum, line) => sum + Math.max(0, line.end - line.start), 0)
    return { id: speaker.id, name: speaker.name, talkSec: Math.round(talkSec) }
  })
}

export function peaksFor(lines, durationSec, count = 56) {
  const peaks = []
  for (let index = 0; index < count; index += 1) {
    const at = (index / count) * durationSec
    const speaking = lines.some((line) => at >= line.start && at < line.end)
    const wobble = 0.35 + 0.65 * Math.abs(Math.sin(index * 1.7) * Math.cos(index * 0.41))
    peaks.push(Number((speaking ? 0.28 + wobble * 0.72 : 0.06 + wobble * 0.08).toFixed(3)))
  }
  return peaks
}

export function buildReadyMeeting({ id, code, title, type, recordMode, cardId, startAt }) {
  const video = type === 'av' && recordMode === 'mix'
  const durationSec = video ? SAMPLE_VIDEO_SEC : SAMPLE_AUDIO_SEC
  const transcript = scaleLines(SAMPLE_LINES, SAMPLE_AUDIO_SEC, durationSec).map((line) => ({
    ...line,
    id: `${id}_${line.id}`,
  }))
  return {
    id,
    code,
    title,
    type,
    recordMode,
    cardId,
    status: 'ready',
    hostId: 'user_owner',
    hostName: '超级名片演示',
    createdAt: startAt,
    startAt,
    endAt: startAt + durationSec * 1000,
    durationSec,
    mediaKind: video ? 'video' : 'audio',
    mediaUrl: video ? sampleVideoUrl() : sampleAudioUrl(),
    recording: false,
    shareAccess: 'link',
    source: 'room',
    participants: [
      { id: 'user_owner', name: '超级名片演示', role: 'host', mic: true, camera: false },
      { id: 'user_lin', name: '林晓', role: 'guest', mic: true, camera: video },
      { id: 'user_zhou', name: '周宁', role: 'guest', mic: true, camera: false },
      { id: 'user_chen', name: '陈可', role: 'guest', mic: true, camera: false },
    ],
    speakers: withTalk(transcript),
    transcript,
    peaks: peaksFor(transcript, durationSec),
    summary: { review: SAMPLE_REVIEW, longform: SAMPLE_LONGFORM },
    minutes: SAMPLE_MINUTES,
    speakerDigest: SAMPLE_DIGEST,
  }
}
