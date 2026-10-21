import {
  addEvent,
  adminCardId,
  ensureVisitor,
  getCard,
  persist,
  setAdminCard,
  sourceFromScene,
  store,
  uid,
} from './localDb.js'

export function listNotices(cardId) {
  return (store.notices || [])
    .filter((item) => !cardId || item.cardId === cardId)
    .slice()
    .sort((a, b) => b.at - a.at)
}

export function unreadCount(cardId) {
  return listNotices(cardId).filter((item) => !item.read).length
}

export function markNoticeRead(id) {
  const notice = (store.notices || []).find((item) => item.id === id)
  if (!notice) return
  notice.read = true
  persist()
}

export function markAllRead(cardId) {
  for (const notice of store.notices || []) {
    if (!cardId || notice.cardId === cardId) notice.read = true
  }
  persist()
}

export function setSubscribe(on) {
  if (!store.meta) store.meta = {}
  store.meta.subscribe = !!on
  persist()
  return store.meta.subscribe
}

export function subscribeOn() {
  return !!store.meta?.subscribe
}

function eventsOf(cardId, visitorId) {
  return store.visit_events.filter((event) => event.cardId === cardId && event.visitorId === visitorId)
}

export function intentScore(events) {
  let score = 0
  const plays = events.filter((event) => event.type === 'video_play' || event.type === 'video_progress')
  if (events.some((event) => event.type === 'open')) score += 10
  if (plays.length) score += 15
  if (plays.length >= 2) score += 15
  const watch = plays.reduce((sum, event) => sum + (event.durationSec || 0), 0)
  score += Math.min(30, Math.floor(watch / 10) * 5)
  if (events.some((event) => event.type === 'contact_click')) score += 25
  if (events.some((event) => event.type === 'return_card')) score += 30
  if (events.some((event) => event.type === 'comment')) score += 10
  return Math.min(100, score)
}

export function behaviorTags(events, source) {
  const tags = [source || '单聊']
  const plays = events.filter((event) => event.type === 'video_play' || event.type === 'video_progress')
  if (plays.length >= 2) tags.push('反复看视频')
  if (events.some((event) => event.type === 'contact_click')) tags.push('点拨号')
  if (events.some((event) => event.type === 'return_card')) tags.push('回递')
  return tags
}

export function visitorInsights(cardId) {
  const ids = []
  for (const event of store.visit_events) {
    if (event.cardId === cardId && !ids.includes(event.visitorId)) ids.push(event.visitorId)
  }
  return ids
    .map((visitorId) => {
      const events = eventsOf(cardId, visitorId).slice().sort((a, b) => a.at - b.at)
      const visit = store.visits.find((item) => item.cardId === cardId && item.visitorId === visitorId)
      const source = visit?.source || sourceFromScene(visit?.scene)
      return {
        user: store.users.find((item) => item.id === visitorId) || null,
        source,
        tags: behaviorTags(events, source),
        score: intentScore(events),
        timeline: events,
        watchSec: events
          .filter((event) => event.type === 'video_progress')
          .reduce((sum, event) => sum + (event.durationSec || 0), 0),
      }
    })
    .sort((a, b) => b.score - a.score)
}

export function saveGate(cardId, patch) {
  const card = getCard(cardId)
  if (!card) return null
  if (patch.wechatId !== undefined) card.wechatId = String(patch.wechatId || '').trim()
  if (patch.wechatQr !== undefined) card.wechatQr = patch.wechatQr || ''
  persist()
  return card
}

export function listThreads(cardId) {
  return (store.threads || [])
    .filter((thread) => thread.cardId === cardId)
    .slice()
    .sort((a, b) => b.at - a.at)
    .map((thread) => ({
      ...thread,
      user: store.users.find((item) => item.id === thread.visitorId) || null,
      messages: (store.messages || []).filter((message) => message.threadId === thread.id),
    }))
}

function ensureThread(cardId, visitorId) {
  let thread = (store.threads || []).find((item) => item.cardId === cardId && item.visitorId === visitorId)
  if (!thread) {
    thread = { id: uid('th'), cardId, visitorId, at: Date.now() }
    store.threads.push(thread)
    store.messages.push({
      id: uid('msg'),
      threadId: thread.id,
      from: 'owner',
      text: '你好，我是超级名片的在线接待。不必加好友，直接留言即可。',
      at: Date.now(),
    })
  }
  return thread
}

export function visitorThread(cardId) {
  const user = ensureVisitor()
  const thread = ensureThread(cardId, user.id)
  persist()
  return {
    ...thread,
    messages: store.messages.filter((message) => message.threadId === thread.id),
  }
}

export function cannedReply(text) {
  if (/价格|多少钱|费用/.test(text)) return '演示报价：套餐只是示意，不会真实扣款。'
  if (/地址|在哪|门店/.test(text)) return '演示门店：演示城市演示路 1 号。'
  if (/微信|加我/.test(text)) return '点「加我微信」可复制演示微信号。'
  return '已收到。名片主人会在收件箱回复。这是自动接待演示。'
}

export function sendChat(cardId, text, from) {
  const body = String(text || '').trim()
  if (!body) return null
  const user = from === 'visitor' ? ensureVisitor() : null
  const visitorId = from === 'visitor' ? user.id : null
  const thread = from === 'visitor'
    ? ensureThread(cardId, visitorId)
    : (store.threads || []).find((item) => item.id === from)
  if (!thread) return null
  const message = { id: uid('msg'), threadId: thread.id, from: from === 'visitor' ? 'visitor' : 'owner', text: body, at: Date.now() }
  store.messages.push(message)
  thread.at = message.at
  if (from === 'visitor') {
    store.messages.push({
      id: uid('msg'),
      threadId: thread.id,
      from: 'bot',
      text: cannedReply(body),
      at: Date.now() + 1,
    })
  }
  persist()
  return message
}

export function replyThread(threadId, text) {
  return sendChat('', text, threadId)
}

export function campaignOf(cardId) {
  return (store.campaigns || []).find((item) => item.cardId === cardId) || null
}

export function saveCampaign(cardId, patch) {
  let campaign = campaignOf(cardId)
  if (!campaign) {
    campaign = { id: uid('camp'), cardId, title: '扫码领红包', reward: '红包（演示）', rule: '', enabled: true }
    store.campaigns.push(campaign)
  }
  Object.assign(campaign, patch)
  persist()
  return campaign
}

export function claimReward(cardId) {
  const campaign = campaignOf(cardId)
  if (!campaign || !campaign.enabled) return null
  const user = ensureVisitor()
  if ((store.claims || []).some((item) => item.campaignId === campaign.id && item.userId === user.id)) {
    return { already: true, campaign }
  }
  store.claims.push({ id: uid('claim'), campaignId: campaign.id, userId: user.id, name: user.name || '访客', at: Date.now() })
  store.points.push({ id: uid('pt'), userId: user.id, name: user.name || '访客', delta: 8, reason: '领取演示红包', at: Date.now() })
  persist()
  return { already: false, campaign }
}

export function leaderboard(cardId) {
  const counts = new Map()
  for (const edge of store.referral_edges) {
    if (edge.parentCardId !== cardId) continue
    const key = edge.parentUserId
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  for (const claim of store.claims || []) {
    const campaign = (store.campaigns || []).find((item) => item.id === claim.campaignId)
    if (campaign?.cardId !== cardId) continue
    counts.set(claim.userId, (counts.get(claim.userId) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([userId, score]) => ({
      user: store.users.find((item) => item.id === userId) || { name: '访客' },
      score,
    }))
    .sort((a, b) => b.score - a.score)
}

export function teamOfOwner() {
  return (store.teams || [])[0] || null
}

export function saveTeam(patch) {
  let team = teamOfOwner()
  if (!team) {
    team = { id: uid('team'), name: '超级名片团队', ownerId: 'user_owner', templateId: 'navy', slogan: '' }
    store.teams.push(team)
  }
  Object.assign(team, patch)
  persist()
  return team
}

export function teamRoster() {
  const team = teamOfOwner()
  if (!team) return []
  return (store.teamMembers || [])
    .filter((item) => item.teamId === team.id)
    .map((item) => ({ ...item, card: getCard(item.cardId) }))
}

export function mintMemberCard(name, phone) {
  const team = teamOfOwner() || saveTeam({})
  const boss = getCard(adminCardId()) || getCard('card_main')
  const userId = uid('user')
  store.users.push({
    id: userId,
    name: name || '成员',
    phone: phone || '',
    role: 'visitor',
    plan: 'free',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=c0aede`,
    createdAt: Date.now(),
  })
  const cardId = uid('card')
  store.cards.push({
    ...boss,
    id: cardId,
    ownerId: userId,
    name: name || '成员',
    phone: phone || boss.phone,
    company: boss.company,
    parentCardId: boss.id,
    likeCount: 0,
    templateId: team.templateId || boss.templateId,
    meetingsAddon: false,
    createdAt: Date.now(),
  })
  for (const tab of store.tabs.filter((item) => item.cardId === boss.id)) {
    const nextTab = uid('tab')
    store.tabs.push({ ...tab, id: nextTab, cardId })
    for (const video of store.videos.filter((item) => item.tabId === tab.id)) {
      store.videos.push({ ...video, id: uid('vid'), cardId, tabId: nextTab, createdAt: Date.now() })
    }
  }
  store.teamMembers.push({ id: uid('tm'), teamId: team.id, userId, cardId, name: name || '成员' })
  persist()
  return getCard(cardId)
}

export function teamDashboard() {
  const cards = teamRoster().map((item) => item.card).filter(Boolean)
  return {
    members: cards.length,
    visits: store.visits.filter((visit) => cards.some((card) => card.id === visit.cardId)).length,
    returns: store.referral_edges.filter((edge) => cards.some((card) => card.id === edge.parentCardId)).length,
  }
}

export function listContacts() {
  return (store.contacts || []).slice().sort((a, b) => (b.follows?.[0]?.at || 0) - (a.follows?.[0]?.at || 0))
}

export function saveContact(input) {
  const contact = {
    id: uid('crm'),
    ownerId: 'user_owner',
    cardId: adminCardId(),
    name: input.name || '未命名',
    phone: input.phone || '',
    group: input.group || '意向',
    ocrNote: input.ocrNote || 'OCR 为演示，字段为手工填写',
    notes: input.note ? [{ id: uid('note'), text: input.note, at: Date.now() }] : [],
    follows: [],
  }
  store.contacts.push(contact)
  persist()
  return contact
}

export function addFollow(contactId, text, remindAt) {
  const contact = store.contacts.find((item) => item.id === contactId)
  if (!contact) return null
  contact.follows.push({ id: uid('fu'), text, at: Date.now(), remindAt: remindAt || 0 })
  persist()
  return contact
}

export function saveCompany(cardId, patch) {
  const card = getCard(cardId)
  if (!card) return null
  const keys = ['legalName', 'creditCode', 'address', 'scope', 'founded', 'verifiedPerson', 'verifiedCompany', 'detail']
  for (const key of keys) {
    if (patch[key] !== undefined) card[key] = patch[key]
  }
  persist()
  return card
}

export function buildReport(cardId, days) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000
  const events = store.visit_events.filter((event) => event.cardId === cardId && event.at >= since)
  const opens = events.filter((event) => event.type === 'open').length
  const contacts = events.filter((event) => event.type === 'contact_click').length
  const returns = events.filter((event) => event.type === 'return_card').length
  const plays = events.filter((event) => event.type === 'video_play').length
  const title = days <= 1 ? '今晚日报' : '本周周报'
  return {
    title,
    days,
    opens,
    contacts,
    returns,
    plays,
    summary: `${title}：${opens} 次打开，${plays} 次播放，${contacts} 次拨号，${returns} 次回递。`,
  }
}

export function siteBundle(cardId) {
  return {
    posts: (store.posts || []).filter((item) => item.cardId === cardId),
    products: (store.products || []).filter((item) => item.cardId === cardId),
    cases: (store.cases || []).filter((item) => item.cardId === cardId),
    embeds: (store.embeds || []).filter((item) => item.cardId === cardId),
    voice: store.voice?.[cardId] || { title: '', autoplay: false },
  }
}

export function addPost(cardId, text) {
  const post = { id: uid('post'), cardId, text: String(text || '').trim(), image: '', at: Date.now() }
  if (!post.text) return null
  store.posts.unshift(post)
  persist()
  return post
}

export function addProduct(cardId, title) {
  if (!title) return null
  const product = {
    id: uid('prod'),
    cardId,
    title,
    cover: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
    priceText: '演示',
  }
  store.products.push(product)
  persist()
  return product
}

export function addCase(cardId, title, summary) {
  if (!title) return null
  const item = {
    id: uid('case'),
    cardId,
    title,
    summary: summary || '演示案例',
    cover: 'linear-gradient(135deg,#0d4f3c,#2d9b6f)',
  }
  store.cases.push(item)
  persist()
  return item
}

export function saveVoice(cardId, patch) {
  if (!store.voice) store.voice = {}
  store.voice[cardId] = { ...(store.voice[cardId] || { title: '语音介绍', autoplay: false }), ...patch }
  persist()
  return store.voice[cardId]
}

export function addEmbed(cardId, kind, title, url) {
  const embed = { id: uid('emb'), cardId, kind, title: title || kind, url: url || '' }
  store.embeds.push(embed)
  persist()
  return embed
}

export function ownedCards() {
  return store.cards.filter((card) => card.ownerId === 'user_owner')
}

export function createIdentity(name) {
  const base = getCard('card_main')
  const card = {
    ...base,
    id: uid('card'),
    name: name || '新身份',
    detail: '新建身份（演示）。',
    likeCount: 0,
    parentCardId: '',
    verifiedCompany: false,
    meetingsAddon: false,
    createdAt: Date.now(),
  }
  store.cards.push(card)
  store.tabs.push({ id: uid('tab'), cardId: card.id, name: '获客', sort: 0 })
  setAdminCard(card.id)
  return card
}

export function listImports(cardId) {
  return (store.imports || []).filter((item) => item.cardId === cardId)
}

export function addImport(cardId, platform, title, url) {
  const item = {
    id: uid('imp'),
    cardId,
    platform,
    title: title || platform,
    url: url || '',
    status: '待接入',
  }
  store.imports.push(item)
  persist()
  return item
}

export function moduleOn(name) {
  return !!store.modules?.[name]
}

export function setModule(name, on) {
  if (!store.modules) store.modules = {}
  store.modules[name] = !!on
  persist()
}

export function listPoints() {
  return (store.points || []).slice().sort((a, b) => b.at - a.at)
}

export function listCommissions() {
  return store.referral_edges.map((edge) => ({
    id: edge.id,
    from: getCard(edge.parentCardId)?.name || '名片',
    to: getCard(edge.childCardId)?.name || '名片',
    scene: edge.scene,
    amount: '10 演示积分',
    note: '按回递关系记一笔，不打款',
  }))
}

export function listGroupBuys() {
  return store.groupBuys || []
}

export function joinGroup(id) {
  const item = store.groupBuys.find((row) => row.id === id)
  if (!item) return null
  item.joined += 1
  persist()
  return item
}

export function saveGroup(title) {
  const item = { id: uid('gb'), title: title || '新拼团（演示）', need: 3, joined: 1, priceText: '演示价', enabled: true }
  store.groupBuys.push(item)
  persist()
  return item
}

export function listLive() {
  return store.liveLinks || []
}

export function saveLive(title, url) {
  const item = { id: uid('live'), title: title || '直播', url: url || '', enabled: true }
  store.liveLinks.push(item)
  persist()
  return item
}

export function listStores() {
  return store.stores || []
}

export function saveStore(name, address, phone) {
  const item = { id: uid('store'), name, address, phone }
  store.stores.push(item)
  persist()
  return item
}

export { addEvent }
