import { buildReadyMeeting } from './meetingSample.js'
import { SAMPLE_MP4 } from '../services/media.js'

const hour = 60 * 60 * 1000

function user(id, name, role, plan, phone, seed) {
  return {
    id,
    name,
    phone,
    role,
    plan,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`,
    createdAt: Date.now() - 5 * hour,
  }
}

export const TEMPLATES = [
  { id: 'navy', name: '藏青名片', desc: '默认样式，适合手机全屏' },
  { id: 'light', name: '浅色名片', desc: '白底轻阴影（演示模板）' },
  { id: 'poster', name: '海报名片', desc: '更高的封面区（演示模板）' },
]

export const PLANS = [
  { id: 'free', name: '免费版' },
  { id: 'pro', name: '专业版' },
]

export function createSeed() {
  const now = Date.now()
  const users = [
    user('user_owner', '超级名片演示', 'owner', 'pro', '13800000000', 'owner'),
    user('user_platform', '平台管理员', 'platform', 'pro', '13900000000', 'platform'),
    user('user_lin', '林晓', 'visitor', 'free', '13700000001', 'lin'),
    user('user_zhou', '周宁', 'visitor', 'free', '13700000002', 'zhou'),
    user('user_chen', '陈可', 'visitor', 'free', '13700000003', 'chen'),
  ]
  users[0].avatar =
    'https://api.dicebear.com/7.x/avataaars/svg?seed=owner&backgroundColor=1a3a6b'

  const cards = [
    {
      id: 'card_main',
      ownerId: 'user_owner',
      name: '超级名片演示',
      phone: '13800000000',
      company: '超级名片科技',
      city: '演示城市',
      detail: '演示名片，公司与资料均为虚构。',
      banner:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      avatar: users[0].avatar,
      likeCount: 8,
      parentCardId: '',
      scene: 'home',
      templateId: 'navy',
      wechatId: 'supercard-demo',
      wechatQr: '',
      verifiedPerson: true,
      verifiedCompany: true,
      legalName: '超级名片科技',
      creditCode: '91430000DEMO00000X',
      address: '演示城市演示路 1 号',
      scope: '数字名片与客户连接的演示业务',
      founded: '2024-01',
      createdAt: now - 48 * hour,
    },
    {
      id: 'card_event',
      ownerId: 'user_owner',
      name: '超级名片演示',
      phone: '13800000000',
      company: '超级名片科技',
      city: '演示城市',
      detail: '会务身份，用于切换名片演示。',
      banner:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      avatar: users[0].avatar,
      likeCount: 0,
      parentCardId: '',
      scene: 'event',
      templateId: 'poster',
      wechatId: 'supercard-demo',
      wechatQr: '',
      verifiedPerson: true,
      verifiedCompany: false,
      legalName: '超级名片科技',
      creditCode: '',
      address: '',
      scope: '',
      founded: '',
      createdAt: now - 2 * hour,
    },
    {
      id: 'card_lin',
      ownerId: 'user_lin',
      name: '林晓',
      phone: '13700000001',
      company: '',
      city: '演示城市',
      detail: '回递生成的演示名片。',
      banner:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      avatar: users[2].avatar,
      likeCount: 1,
      parentCardId: 'card_main',
      scene: 'home',
      templateId: 'navy',
      createdAt: now - 20 * hour,
    },
    {
      id: 'card_zhou',
      ownerId: 'user_zhou',
      name: '周宁',
      phone: '13700000002',
      company: '',
      city: '',
      detail: '二级回递演示。',
      banner:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      avatar: users[3].avatar,
      likeCount: 0,
      parentCardId: 'card_lin',
      scene: 'home',
      templateId: 'light',
      createdAt: now - 6 * hour,
    },
    {
      id: 'card_chen',
      ownerId: 'user_chen',
      name: '陈可',
      phone: '13700000003',
      company: '',
      city: '演示城市',
      detail: '展台场景回递演示。',
      banner:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
      avatar: users[4].avatar,
      likeCount: 0,
      parentCardId: 'card_main',
      scene: 'booth',
      templateId: 'navy',
      createdAt: now - 3 * hour,
    },
  ]

  const tabs = [
    { id: 'tab_get', cardId: 'card_main', name: '获客', sort: 0 },
    { id: 'tab_proj', cardId: 'card_main', name: '项目介绍', sort: 1 },
    { id: 'tab_prod', cardId: 'card_main', name: '产品介绍', sort: 2 },
    { id: 'tab_course', cardId: 'card_main', name: '课程', sort: 3 },
    { id: 'tab_lin', cardId: 'card_lin', name: '获客', sort: 0 },
    { id: 'tab_zhou', cardId: 'card_zhou', name: '获客', sort: 0 },
    { id: 'tab_chen', cardId: 'card_chen', name: '获客', sort: 0 },
    { id: 'tab_event', cardId: 'card_event', name: '会务', sort: 0 },
  ]

  const videos = [
    {
      id: 'vid_intro',
      cardId: 'card_main',
      tabId: 'tab_get',
      title: '如何用超级名片获客（演示）',
      size: '示例 mp4',
      type: 'video',
      cover: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      src: SAMPLE_MP4,
      auditStatus: 'ok',
      createdAt: now - 10 * hour,
    },
    {
      id: 'vid_product',
      cardId: 'card_main',
      tabId: 'tab_get',
      title: '产品介绍视频（演示）',
      size: '封面',
      type: 'video',
      cover: 'linear-gradient(135deg,#0d4f3c,#2d9b6f)',
      src: '',
      auditStatus: 'ok',
      createdAt: now - 9 * hour,
    },
    {
      id: 'vid_live',
      cardId: 'card_main',
      tabId: 'tab_get',
      title: '直播流占位（演示）',
      size: 'm3u8',
      type: 'live',
      cover: 'linear-gradient(135deg,#6b1a3a,#d44a7f)',
      src: 'https://example.com/live/demo.m3u8',
      auditStatus: 'ok',
      createdAt: now - 8 * hour,
    },
    {
      id: 'vid_project',
      cardId: 'card_main',
      tabId: 'tab_proj',
      title: '项目概览（演示）',
      size: '示例 mp4',
      type: 'video',
      cover: 'linear-gradient(135deg,#1a3a6b,#3a5a9b)',
      src: SAMPLE_MP4,
      auditStatus: 'ok',
      createdAt: now - 7 * hour,
    },
    {
      id: 'vid_team',
      cardId: 'card_main',
      tabId: 'tab_proj',
      title: '团队介绍（演示）',
      size: '图文',
      type: 'image',
      cover: 'linear-gradient(135deg,#2a4a6b,#5a8ad4)',
      src: '',
      auditStatus: 'ok',
      createdAt: now - 6 * hour,
    },
    {
      id: 'vid_adv',
      cardId: 'card_main',
      tabId: 'tab_prod',
      title: '产品优势（演示）',
      size: '图文',
      type: 'image',
      cover: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      src: '',
      auditStatus: 'ok',
      createdAt: now - 5 * hour,
    },
    {
      id: 'vid_scene',
      cardId: 'card_main',
      tabId: 'tab_prod',
      title: '使用场景（演示）',
      size: '封面',
      type: 'video',
      cover: 'linear-gradient(135deg,#1a1a2a,#3a3a5a)',
      src: '',
      auditStatus: 'pending',
      createdAt: now - 4 * hour,
    },
    {
      id: 'vid_course',
      cardId: 'card_main',
      tabId: 'tab_course',
      title: '课程导学（演示）',
      size: '示例 mp4',
      type: 'video',
      cover: 'linear-gradient(135deg,#e85d04,#f48c06)',
      src: SAMPLE_MP4,
      auditStatus: 'ok',
      createdAt: now - 3 * hour,
    },
  ]

  const visits = [
    {
      id: 'visit_lin',
      cardId: 'card_main',
      visitorId: 'user_lin',
      scene: 'chat',
      source: '单聊',
      fromCardId: 'card_main',
      openedAt: now - 20 * hour,
      lastSeenAt: now - 19 * hour,
    },
    {
      id: 'visit_chen',
      cardId: 'card_main',
      visitorId: 'user_chen',
      scene: 'booth',
      source: '扫码',
      fromCardId: 'card_main',
      openedAt: now - 3 * hour,
      lastSeenAt: now - 3 * hour,
    },
    {
      id: 'visit_zhou',
      cardId: 'card_lin',
      visitorId: 'user_zhou',
      scene: 'group',
      source: '群聊',
      fromCardId: 'card_lin',
      openedAt: now - 6 * hour,
      lastSeenAt: now - 6 * hour,
    },
  ]

  const visit_events = [
    { id: 'evt1', visitId: 'visit_lin', cardId: 'card_main', visitorId: 'user_lin', type: 'open', videoId: '', durationSec: 0, at: now - 20 * hour },
    { id: 'evt2', visitId: 'visit_lin', cardId: 'card_main', visitorId: 'user_lin', type: 'video_play', videoId: 'vid_intro', durationSec: 0, at: now - 20 * hour + 60000 },
    { id: 'evt3', visitId: 'visit_lin', cardId: 'card_main', visitorId: 'user_lin', type: 'video_progress', videoId: 'vid_intro', durationSec: 42, at: now - 20 * hour + 120000 },
    { id: 'evt4', visitId: 'visit_lin', cardId: 'card_main', visitorId: 'user_lin', type: 'contact_click', videoId: '', durationSec: 0, at: now - 19 * hour },
    { id: 'evt5', visitId: 'visit_lin', cardId: 'card_main', visitorId: 'user_lin', type: 'return_card', videoId: '', durationSec: 0, at: now - 19 * hour },
    { id: 'evt6', visitId: 'visit_chen', cardId: 'card_main', visitorId: 'user_chen', type: 'open', videoId: '', durationSec: 0, at: now - 3 * hour },
    { id: 'evt7', visitId: 'visit_chen', cardId: 'card_main', visitorId: 'user_chen', type: 'video_progress', videoId: 'vid_project', durationSec: 15, at: now - 3 * hour + 90000 },
    { id: 'evt8', visitId: 'visit_chen', cardId: 'card_main', visitorId: 'user_chen', type: 'return_card', videoId: '', durationSec: 0, at: now - 3 * hour + 180000 },
    { id: 'evt9', visitId: 'visit_zhou', cardId: 'card_lin', visitorId: 'user_zhou', type: 'open', videoId: '', durationSec: 0, at: now - 6 * hour },
    { id: 'evt10', visitId: 'visit_zhou', cardId: 'card_lin', visitorId: 'user_zhou', type: 'return_card', videoId: '', durationSec: 0, at: now - 6 * hour + 60000 },
  ]

  const referral_edges = [
    {
      id: 'edge_lin',
      parentCardId: 'card_main',
      childCardId: 'card_lin',
      parentUserId: 'user_owner',
      childUserId: 'user_lin',
      scene: 'home',
      createdAt: now - 19 * hour,
    },
    {
      id: 'edge_zhou',
      parentCardId: 'card_lin',
      childCardId: 'card_zhou',
      parentUserId: 'user_lin',
      childUserId: 'user_zhou',
      scene: 'home',
      createdAt: now - 6 * hour,
    },
    {
      id: 'edge_chen',
      parentCardId: 'card_main',
      childCardId: 'card_chen',
      parentUserId: 'user_owner',
      childUserId: 'user_chen',
      scene: 'booth',
      createdAt: now - 3 * hour,
    },
  ]

  const comments = [
    {
      id: 'cmt1',
      cardId: 'card_main',
      userId: 'user_lin',
      nickname: '林晓',
      avatar: users[2].avatar,
      text: '演示评论：页面清楚，方便转给同事。',
      status: 'visible',
      at: now - 18 * hour,
    },
    {
      id: 'cmt2',
      cardId: 'card_main',
      userId: 'user_chen',
      nickname: '陈可',
      avatar: users[4].avatar,
      text: '这条待审核的演示评论。',
      status: 'hidden',
      at: now - 2 * hour,
    },
  ]

  const notices = [
    {
      id: 'ntc1',
      cardId: 'card_main',
      type: 'open',
      title: '有人打开了名片',
      body: '林晓 · 单聊',
      at: now - 20 * hour,
      read: false,
    },
    {
      id: 'ntc2',
      cardId: 'card_main',
      type: 'return_card',
      title: '有人回递了名片',
      body: '陈可 · 扫码',
      at: now - 3 * hour,
      read: false,
    },
  ]

  const threads = [
    { id: 'th1', cardId: 'card_main', visitorId: 'user_lin', at: now - 5 * hour },
  ]
  const messages = [
    { id: 'msg1', threadId: 'th1', from: 'owner', text: '你好，我是超级名片的在线接待。不必加好友，直接留言即可。', at: now - 5 * hour },
    { id: 'msg2', threadId: 'th1', from: 'visitor', text: '价格怎么算？', at: now - 5 * hour + 60000 },
    { id: 'msg3', threadId: 'th1', from: 'bot', text: '演示报价：专业版只是套餐示意，不会真实扣款。', at: now - 5 * hour + 70000 },
  ]

  const campaigns = [
    {
      id: 'camp1',
      cardId: 'card_main',
      title: '扫码领红包',
      reward: '8.8 元红包（演示，不到账）',
      rule: '留下手机或回递名片即可上榜',
      enabled: true,
    },
  ]
  const claims = [
    { id: 'claim1', campaignId: 'camp1', userId: 'user_lin', name: '林晓', at: now - 18 * hour },
  ]

  const teams = [
    {
      id: 'team1',
      name: '超级名片演示团队',
      ownerId: 'user_owner',
      templateId: 'navy',
      slogan: '统一模板和资料，成员各自发名片',
    },
  ]
  const teamMembers = [
    { id: 'tm1', teamId: 'team1', userId: 'user_owner', cardId: 'card_main', name: '超级名片演示' },
    { id: 'tm2', teamId: 'team1', userId: 'user_owner', cardId: 'card_event', name: '会务身份' },
  ]

  const contacts = [
    {
      id: 'crm1',
      ownerId: 'user_owner',
      cardId: 'card_main',
      name: '林晓',
      phone: '13700000001',
      group: '意向',
      ocrNote: '',
      notes: [{ id: 'note1', text: '从单聊来，看过介绍视频。', at: now - 10 * hour }],
      follows: [{ id: 'fu1', text: '约明天再发资料', at: now - 9 * hour, remindAt: now + 20 * hour }],
    },
  ]

  const posts = [
    { id: 'post1', cardId: 'card_main', text: '今天把演示名片更新了一版，欢迎转给同事。', image: '', at: now - 8 * hour },
  ]
  const products = [
    { id: 'prod1', cardId: 'card_main', title: '超级名片专业版（演示）', cover: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)', priceText: '价格待定' },
  ]
  const cases = [
    { id: 'case1', cardId: 'card_main', title: '展台获客案例（演示）', summary: '扫码后留下手机，第二天回访。', cover: 'linear-gradient(135deg,#0d4f3c,#2d9b6f)' },
  ]
  const embeds = [
    { id: 'emb1', cardId: 'card_main', kind: '公众号', title: '超级名片', url: 'https://mp.weixin.qq.com/' },
    { id: 'emb2', cardId: 'card_main', kind: '视频号', title: '超级名片演示', url: '' },
  ]
  const voice = {
    card_main: { title: '你好，我是超级名片演示', autoplay: false },
  }

  const imports = [
    { id: 'imp1', cardId: 'card_main', platform: '视频号', title: '演示视频', url: 'https://channels.weixin.qq.com/', status: '待接入' },
  ]

  const points = [
    { id: 'pt1', userId: 'user_lin', name: '林晓', delta: 20, reason: '回递名片', at: now - 18 * hour },
  ]
  const groupBuys = [
    { id: 'gb1', title: '演示拼团', need: 3, joined: 1, priceText: '¥99（演示，不支付）', enabled: true },
  ]
  const liveLinks = [
    { id: 'live1', title: '超级名片公开课', url: 'https://example.com/live/demo', enabled: true },
  ]
  const stores = [
    { id: 'store1', name: '演示城市旗舰店', address: '演示路 1 号', phone: '13800000000' },
  ]

  for (const card of cards) {
    if (card.meetingsAddon === undefined) card.meetingsAddon = card.id === 'card_main'
  }

  const meetings = [
    buildReadyMeeting({
      id: 'm_audio',
      code: '882610',
      title: '超级名片经营例会',
      type: 'audio',
      recordMode: 'audio',
      cardId: 'card_main',
      startAt: now - 3 * hour,
    }),
    buildReadyMeeting({
      id: 'm_video',
      code: '882611',
      title: '门店与供应链碰头',
      type: 'av',
      recordMode: 'mix',
      cardId: 'card_main',
      startAt: now - 26 * hour,
    }),
  ]
  const cloudFiles = [
    {
      id: 'cloud1',
      meetingId: 'm_audio',
      cardId: 'card_main',
      title: '超级名片经营例会',
      kind: 'mp3',
      mediaUrl: meetings[0].mediaUrl,
      durationSec: meetings[0].durationSec,
      savedAt: now - 2 * hour,
    },
  ]
  const tickets = [
    {
      id: 'ticket1',
      meetingId: 'm_audio',
      meetingTitle: '超级名片经营例会',
      reason: '演示工单',
      reporterId: 'user_lin',
      reporterName: '林晓',
      status: 'open',
      actionNote: '',
      alert: '已回调业务后端（演示）',
      createdAt: now - hour,
    },
  ]

  return {
    version: 2,
    meta: { adminCardId: 'card_main', subscribe: false, safety: true, costRtc: 'agora', asrVendor: 'volc' },
    modules: { points: true, commission: true, groupBuy: true, live: true, stores: true },
    users,
    cards,
    tabs,
    videos,
    visits,
    visit_events,
    referral_edges,
    comments,
    notices,
    threads,
    messages,
    campaigns,
    claims,
    teams,
    teamMembers,
    contacts,
    posts,
    products,
    cases,
    embeds,
    voice,
    imports,
    points,
    groupBuys,
    liveLinks,
    stores,
    meetings,
    cloudFiles,
    tickets,
  }
}
