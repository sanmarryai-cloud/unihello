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
      createdAt: now - 48 * hour,
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
      scene: 'home',
      fromCardId: 'card_main',
      openedAt: now - 20 * hour,
      lastSeenAt: now - 19 * hour,
    },
    {
      id: 'visit_chen',
      cardId: 'card_main',
      visitorId: 'user_chen',
      scene: 'booth',
      fromCardId: 'card_main',
      openedAt: now - 3 * hour,
      lastSeenAt: now - 3 * hour,
    },
    {
      id: 'visit_zhou',
      cardId: 'card_lin',
      visitorId: 'user_zhou',
      scene: 'home',
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

  return {
    version: 1,
    users,
    cards,
    tabs,
    videos,
    visits,
    visit_events,
    referral_edges,
    comments,
  }
}
