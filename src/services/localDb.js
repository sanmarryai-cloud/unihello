import { reactive } from 'vue'
import { createSeed } from '../data/seed.js'

export const STORAGE_KEY = 'super-card-db-v1'
const VISITOR_KEY = 'super-card-visitor'

export const store = reactive(load())

const CARD_DEFAULTS = {
  wechatId: '',
  wechatQr: '',
  verifiedPerson: false,
  verifiedCompany: false,
  legalName: '',
  creditCode: '',
  address: '',
  scope: '',
  founded: '',
}

export function sourceFromScene(scene) {
  const value = String(scene || '')
  if (/scan|qr|booth|code|event/i.test(value)) return '扫码'
  if (/group/i.test(value)) return '群聊'
  if (/moment|pengyou|share/i.test(value)) return '朋友圈'
  if (/search|direct/i.test(value)) return '搜索'
  return '单聊'
}

function hydrate(data) {
  const seed = createSeed()
  const lists = [
    'notices', 'threads', 'messages', 'campaigns', 'claims', 'teams', 'teamMembers',
    'contacts', 'posts', 'products', 'cases', 'embeds', 'imports', 'points',
    'groupBuys', 'liveLinks', 'stores', 'meetings', 'cloudFiles', 'tickets',
  ]
  for (const key of lists) {
    if (!Array.isArray(data[key])) data[key] = seed[key]
  }
  if (!data.voice || typeof data.voice !== 'object') data.voice = seed.voice
  if (!data.modules) data.modules = { ...seed.modules }
  if (!data.meta) data.meta = { ...seed.meta }
  else {
    if (data.meta.safety === undefined) data.meta.safety = true
    if (!data.meta.costRtc) data.meta.costRtc = 'agora'
    if (!data.meta.asrVendor) data.meta.asrVendor = 'volc'
  }
  for (const card of data.cards) {
    for (const [key, value] of Object.entries(CARD_DEFAULTS)) {
      if (card[key] === undefined) card[key] = value
    }
    if (card.meetingsAddon === undefined) card.meetingsAddon = card.id === 'card_main'
  }
  for (const visit of data.visits || []) {
    if (!visit.source) visit.source = sourceFromScene(visit.scene)
  }
  data.version = 2
  return data
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeed()
    const data = JSON.parse(raw)
    if (!data || !Array.isArray(data.cards) || (data.version !== 1 && data.version !== 2)) return createSeed()
    return hydrate(data)
  } catch {
    return createSeed()
  }
}

export function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function resetDemo() {
  const next = createSeed()
  for (const key of Object.keys(store)) delete store[key]
  Object.assign(store, next)
  localStorage.removeItem(VISITOR_KEY)
  persist()
}

export function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`
}

export function adminCardId() {
  const id = store.meta?.adminCardId
  if (id && getCard(id)) return id
  return 'card_main'
}

export function setAdminCard(id) {
  if (!getCard(id)) return null
  if (!store.meta) store.meta = {}
  store.meta.adminCardId = id
  persist()
  return id
}

export function currentVisitorId() {
  return localStorage.getItem(VISITOR_KEY) || ''
}

export function ensureVisitor() {
  const id = currentVisitorId()
  let user = id && store.users.find((item) => item.id === id)
  if (!user) {
    const nextId = uid('user')
    user = {
      id: nextId,
      name: '访客',
      phone: '',
      role: 'visitor',
      plan: 'free',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nextId}&backgroundColor=b6e3f4`,
      createdAt: Date.now(),
    }
    store.users.push(user)
    localStorage.setItem(VISITOR_KEY, nextId)
    persist()
  }
  return user
}

export function getCard(id) {
  return store.cards.find((card) => card.id === id) || null
}

export function listTabs(cardId) {
  return store.tabs
    .filter((tab) => tab.cardId === cardId)
    .slice()
    .sort((a, b) => a.sort - b.sort)
}

export function listVideos(tabId, { includeHidden = false } = {}) {
  return store.videos
    .filter((video) => video.tabId === tabId)
    .filter((video) => includeHidden || video.auditStatus === 'ok')
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
}

export function listCardVideos(cardId) {
  return store.videos.filter((video) => video.cardId === cardId).slice()
}

function ensureVisit(cardId, extra = {}) {
  const user = ensureVisitor()
  let visit = store.visits.find((item) => item.cardId === cardId && item.visitorId === user.id)
  if (!visit) {
    visit = {
      id: uid('visit'),
      cardId,
      visitorId: user.id,
      scene: extra.scene || 'direct',
      fromCardId: extra.from || '',
      openedAt: Date.now(),
      lastSeenAt: Date.now(),
    }
    store.visits.push(visit)
  }
  return visit
}

export function addEvent(cardId, partial = {}) {
  const visit = ensureVisit(cardId, partial)
  if (partial.scene) {
    visit.scene = partial.scene
    visit.source = sourceFromScene(partial.scene)
  }
  if (!visit.source) visit.source = sourceFromScene(visit.scene)
  if (partial.from) visit.fromCardId = partial.from
  visit.lastSeenAt = Date.now()
  const event = {
    id: uid('evt'),
    visitId: visit.id,
    cardId,
    visitorId: visit.visitorId,
    type: partial.type || 'open',
    videoId: partial.videoId || '',
    durationSec: Number(partial.durationSec) || 0,
    at: Date.now(),
  }
  store.visit_events.push(event)
  const titles = {
    open: '有人打开了名片',
    contact_click: '有人点击了联系',
    return_card: '有人回递了名片',
  }
  if (titles[event.type]) {
    const who = store.users.find((item) => item.id === event.visitorId)
    if (!Array.isArray(store.notices)) store.notices = []
    store.notices.push({
      id: uid('ntc'),
      cardId,
      type: event.type,
      title: titles[event.type],
      body: `${who?.name || '访客'} · ${visit.source || '单聊'}`,
      at: event.at,
      read: false,
    })
  }
  persist()
  return event
}

export function recordOpen(cardId, { scene, from } = {}) {
  return addEvent(cardId, { type: 'open', scene: scene || 'direct', from: from || '' })
}

export function likeCount(cardId) {
  const card = getCard(cardId)
  const extra = store.visit_events.filter((event) => event.cardId === cardId && event.type === 'like').length
  return (card?.likeCount || 0) + extra
}

export function likedByMe(cardId) {
  const id = currentVisitorId()
  if (!id) return false
  return store.visit_events.some(
    (event) => event.cardId === cardId && event.visitorId === id && event.type === 'like',
  )
}

export function toggleLike(cardId) {
  const user = ensureVisitor()
  const index = store.visit_events.findIndex(
    (event) => event.cardId === cardId && event.visitorId === user.id && event.type === 'like',
  )
  if (index >= 0) {
    store.visit_events.splice(index, 1)
    persist()
    return false
  }
  addEvent(cardId, { type: 'like' })
  return true
}

export function visibleComments(cardId) {
  return store.comments
    .filter((comment) => comment.cardId === cardId && comment.status === 'visible')
    .slice()
    .sort((a, b) => b.at - a.at)
}

export function allComments(cardId) {
  return store.comments
    .filter((comment) => comment.cardId === cardId)
    .slice()
    .sort((a, b) => b.at - a.at)
}

export function addComment(cardId, text) {
  const user = ensureVisitor()
  const comment = {
    id: uid('cmt'),
    cardId,
    userId: user.id,
    nickname: user.name || '访客',
    avatar: user.avatar,
    text: String(text || '').trim(),
    status: 'visible',
    at: Date.now(),
  }
  if (!comment.text) return null
  store.comments.push(comment)
  addEvent(cardId, { type: 'comment' })
  return comment
}

export function setCommentStatus(id, status) {
  const comment = store.comments.find((item) => item.id === id)
  if (!comment) return null
  comment.status = status
  persist()
  return comment
}

export function childCards(cardId) {
  const ids = store.referral_edges.filter((edge) => edge.parentCardId === cardId).map((edge) => edge.childCardId)
  return ids.map((id) => getCard(id)).filter(Boolean)
}

export function updateCard(id, patch) {
  const card = getCard(id)
  if (!card) return null
  const allowed = ['name', 'phone', 'company', 'city', 'detail', 'banner', 'avatar', 'templateId', 'scene']
  for (const key of allowed) {
    if (patch[key] !== undefined) card[key] = patch[key]
  }
  const owner = store.users.find((item) => item.id === card.ownerId)
  if (owner) {
    if (patch.name) owner.name = patch.name
    if (patch.phone) owner.phone = patch.phone
    if (patch.avatar) owner.avatar = patch.avatar
  }
  persist()
  return card
}

export function createTab(cardId, name) {
  const tabs = listTabs(cardId)
  const tab = {
    id: uid('tab'),
    cardId,
    name: String(name || '').trim() || '未命名',
    sort: tabs.length ? tabs[tabs.length - 1].sort + 1 : 0,
  }
  store.tabs.push(tab)
  persist()
  return tab
}

export function renameTab(id, name) {
  const tab = store.tabs.find((item) => item.id === id)
  if (!tab) return null
  tab.name = String(name || '').trim() || tab.name
  persist()
  return tab
}

export function deleteTab(id) {
  const tabIndex = store.tabs.findIndex((item) => item.id === id)
  if (tabIndex < 0) return
  store.tabs.splice(tabIndex, 1)
  for (let i = store.videos.length - 1; i >= 0; i -= 1) {
    if (store.videos[i].tabId === id) store.videos.splice(i, 1)
  }
  persist()
}

export function createVideo(cardId, tabId, input) {
  const video = {
    id: uid('vid'),
    cardId,
    tabId,
    title: String(input.title || '').trim() || '未命名视频（演示）',
    size: input.size || '演示',
    type: input.type || 'video',
    cover: input.cover || 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
    src: input.src || '',
    note: input.note || '',
    auditStatus: input.auditStatus || 'ok',
    createdAt: Date.now(),
  }
  store.videos.push(video)
  persist()
  return video
}

export function deleteVideo(id) {
  const index = store.videos.findIndex((video) => video.id === id)
  if (index >= 0) store.videos.splice(index, 1)
  persist()
}

export function setAudit(id, status) {
  const video = store.videos.find((item) => item.id === id)
  if (!video) return null
  video.auditStatus = status
  persist()
  return video
}

export function createReturnCard({ parentCardId, scene, name, phone, avatar }) {
  const parent = getCard(parentCardId) || getCard('card_main')
  const user = ensureVisitor()
  user.name = String(name || '').trim() || user.name
  user.phone = String(phone || '').trim()
  if (avatar) user.avatar = avatar
  let card = store.cards.find((item) => item.ownerId === user.id && item.parentCardId === parent.id)
  let created = false
  if (!card) {
    created = true
    card = {
      id: uid('card'),
      ownerId: user.id,
      name: user.name,
      phone: user.phone,
      company: '',
      city: '',
      detail: '回递生成的演示名片。',
      banner: parent.banner,
      avatar: user.avatar,
      likeCount: 0,
      parentCardId: parent.id,
      scene: scene || 'return',
      templateId: 'navy',
      meetingsAddon: false,
      createdAt: Date.now(),
    }
    store.cards.push(card)
    store.tabs.push({ id: uid('tab'), cardId: card.id, name: '获客', sort: 0 })
    store.referral_edges.push({
      id: uid('edge'),
      parentCardId: parent.id,
      childCardId: card.id,
      parentUserId: parent.ownerId,
      childUserId: user.id,
      scene: scene || 'return',
      createdAt: Date.now(),
    })
  } else {
    card.name = user.name
    card.phone = user.phone
    card.avatar = user.avatar
  }
  if (created) addEvent(parent.id, { type: 'return_card', scene: scene || 'return', from: parent.id })
  else persist()
  return card
}

export function myCard() {
  const id = currentVisitorId()
  if (!id) return null
  return (
    store.cards
      .filter((card) => card.ownerId === id)
      .sort((a, b) => b.createdAt - a.createdAt)[0] || null
  )
}

export function dashboard(cardId) {
  const events = store.visit_events.filter((event) => event.cardId === cardId)
  return {
    visits: store.visits.filter((visit) => visit.cardId === cardId).length,
    opens: events.filter((event) => event.type === 'open').length,
    plays: events.filter((event) => event.type === 'video_play').length,
    watchSec: events
      .filter((event) => event.type === 'video_progress')
      .reduce((sum, event) => sum + (event.durationSec || 0), 0),
    contacts: events.filter((event) => event.type === 'contact_click').length,
    returns: store.referral_edges.filter((edge) => edge.parentCardId === cardId).length,
    comments: store.comments.filter((comment) => comment.cardId === cardId).length,
  }
}

export function radar(cardId) {
  const ids = []
  for (const event of store.visit_events) {
    if (event.cardId === cardId && !ids.includes(event.visitorId)) ids.push(event.visitorId)
  }
  return ids
    .map((visitorId) => {
      const events = store.visit_events
        .filter((event) => event.cardId === cardId && event.visitorId === visitorId)
        .slice()
        .sort((a, b) => b.at - a.at)
      return {
        user: store.users.find((item) => item.id === visitorId) || null,
        events,
        watchSec: events
          .filter((event) => event.type === 'video_progress')
          .reduce((sum, event) => sum + (event.durationSec || 0), 0),
        contacts: events.filter((event) => event.type === 'contact_click').length,
        returns: events.filter((event) => event.type === 'return_card').length,
      }
    })
    .sort((a, b) => (b.events[0]?.at || 0) - (a.events[0]?.at || 0))
}

export function listUsers() {
  return store.users.slice()
}

export function setPlan(userId, plan) {
  const user = store.users.find((item) => item.id === userId)
  if (!user) return null
  user.plan = plan
  persist()
  return user
}

export function platformOverview() {
  return {
    users: store.users.length,
    cards: store.cards.length,
    visits: store.visits.length,
    events: store.visit_events.length,
    referrals: store.referral_edges.length,
    comments: store.comments.length,
    pendingVideos: store.videos.filter((video) => video.auditStatus === 'pending').length,
  }
}

export function auditQueue() {
  return {
    videos: store.videos.filter((video) => video.auditStatus !== 'ok'),
    comments: store.comments.slice().sort((a, b) => b.at - a.at),
  }
}

export function referralRows() {
  const rows = []
  const walk = (parentId, depth) => {
    const edges = store.referral_edges.filter((edge) => edge.parentCardId === parentId)
    for (const edge of edges) {
      rows.push({
        depth,
        edge,
        card: getCard(edge.childCardId),
        user: store.users.find((item) => item.id === edge.childUserId) || null,
      })
      walk(edge.childCardId, depth + 1)
    }
  }
  walk('card_main', 1)
  return rows
}

export function shareLink(cardId, scene = 'share') {
  const origin = window.location.origin
  const path = window.location.pathname
  const params = new URLSearchParams({
    card: cardId,
    scene: scene || 'share',
    from: cardId,
  })
  return `${origin}${path}#/?${params.toString()}`
}

export const EVENT_LABEL = {
  open: '打开名片',
  video_play: '播放视频',
  video_progress: '观看视频',
  contact_click: '点击联系',
  return_card: '回递名片',
  like: '点赞',
  comment: '发表评论',
}

export const TYPE_LABEL = {
  video: '视频',
  audio: '音频',
  image: '图文',
  doc: '文档',
  live: '直播',
}
