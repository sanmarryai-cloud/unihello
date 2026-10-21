/**
 * 页面只通过这里读写数据。
 * GitHub Pages 是静态站，默认走 localStorage（localDb）。
 * 若以后把同一组函数改成 fetch(VITE_API_BASE + path)，页面不用改路由。
 *
 * 建议的 HTTP 对照（未在 Pages 上启动服务）：
 * GET/PATCH /cards/:id
 * GET/POST/PATCH/DELETE /cards/:id/tabs
 * GET/POST/DELETE /tabs/:id/videos
 * POST /cards/:id/visits
 * POST /visits/:id/events
 * GET/POST /cards/:id/comments
 * POST /cards/:id/returns
 * GET /platform/users
 * GET /platform/referrals
 * GET /platform/audit
 * POST /meetings
 * POST /meetings/:id/join
 * POST /meetings/:id/end
 * GET /meetings/:id
 */
export const DATA_SOURCE = import.meta.env.VITE_API_BASE ? 'http' : 'local'

export {
  STORAGE_KEY,
  adminCardId,
  addComment,
  addEvent,
  allComments,
  auditQueue,
  childCards,
  createReturnCard,
  createTab,
  createVideo,
  currentVisitorId,
  dashboard,
  deleteTab,
  deleteVideo,
  ensureVisitor,
  EVENT_LABEL,
  getCard,
  likeCount,
  likedByMe,
  listCardVideos,
  listTabs,
  listUsers,
  listVideos,
  myCard,
  platformOverview,
  radar,
  recordOpen,
  referralRows,
  renameTab,
  resetDemo,
  setAdminCard,
  setAudit,
  setCommentStatus,
  setPlan,
  shareLink,
  sourceFromScene,
  store as dbState,
  toggleLike,
  TYPE_LABEL,
  updateCard,
  visibleComments,
} from './localDb.js'

export { resolveMedia, SAMPLE_MP4, signMediaUrl } from './media.js'
export { PLANS, TEMPLATES } from '../data/seed.js'
export {
  addCase,
  addEmbed,
  addFollow,
  addImport,
  addPost,
  addProduct,
  behaviorTags,
  buildReport,
  campaignOf,
  cannedReply,
  claimReward,
  createIdentity,
  intentScore,
  joinGroup,
  leaderboard,
  listCommissions,
  listContacts,
  listGroupBuys,
  listImports,
  listLive,
  listNotices,
  listPoints,
  listStores,
  listThreads,
  markAllRead,
  markNoticeRead,
  mintMemberCard,
  moduleOn,
  ownedCards,
  replyThread,
  saveCampaign,
  saveCompany,
  saveContact,
  saveGate,
  saveGroup,
  saveLive,
  saveStore,
  saveTeam,
  saveVoice,
  sendChat,
  setModule,
  setSubscribe,
  siteBundle,
  subscribeOn,
  teamDashboard,
  teamOfOwner,
  teamRoster,
  unreadCount,
  visitorInsights,
  visitorThread,
} from './features.js'
export {
  AI_DISCLAIMER,
  canViewMeeting,
  closeRoom,
  createMeeting,
  createTicket,
  deleteCloud,
  deleteMeeting,
  endMeeting,
  findMeeting,
  formatClock,
  formatWhen,
  getMeeting,
  joinMeeting,
  kickMember,
  leaveMeeting,
  listCloud,
  listMeetings,
  listTickets,
  MEETING_FEATURES,
  MEETING_PLAN,
  meetingsEnabled,
  muteAll,
  providerConfig,
  renameCloud,
  renameSpeaker,
  saveToCloud,
  setMeetingsAddon,
  setParticipantCamera,
  setParticipantMic,
  setProviderConfig,
  setShareAccess,
  setTicketStatus,
  sharePayload,
  usageReport,
} from './meetings.js'
