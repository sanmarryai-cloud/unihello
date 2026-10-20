/** 超级名片演示 Mock 数据 */

export const cardOwner = {
  name: '超级名片演示',
  phone: '13800000000',
  company: '超级名片科技',
  city: '演示城市',
  banner:
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
  avatar:
    'https://api.dicebear.com/7.x/avataaars/svg?seed=owner&backgroundColor=1a3a6b',
  likeCount: 51,
  returnCount: 143,
  commentPreview: {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pin',
    nickname: '拼***',
    text: '讲得好！字眼清晰，易听懂，透明。给老师...',
  },
  returnAvatars: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=a1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=a2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=a3',
  ],
}

/** type: video | image | audio | doc */
export const tabs = [
  {
    id: 'ai',
    name: '获客',
    resources: [
      {
        id: 'ai1',
        title: '如何用超级名片获客（演示）',
        size: '38分钟',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      },
      {
        id: 'ai2',
        title: '产品介绍视频（演示）',
        size: '新手必看完 | 38分钟',
        type: 'video',
        thumb: 'linear-gradient(135deg,#0d4f3c,#2d9b6f)',
      },
      {
        id: 'ai3',
        title: '案例分享（演示）',
        size: '181 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b1a3a,#d44a7f)',
      },
      {
        id: 'ai4',
        title: '产品卖点讲解（演示）',
        size: '978 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#3a1a6b,#7f4ad4)',
      },
      {
        id: 'ai5',
        title: '短视频示例（演示）',
        size: '6.36 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a5a6b,#4ad4d4)',
      },
      {
        id: 'ai6',
        title: '内容更新示例（演示）',
        size: '12.4 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b4a1a,#d4a04a)',
      },
      {
        id: 'ai7',
        title: '功能介绍（演示）',
        size: '5.28 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#2a5a9b)',
      },
      {
        id: 'ai8',
        title: '评论互动示例（演示）',
        size: '18.3 MB',
        type: 'audio',
        thumb: 'linear-gradient(135deg,#4a1a6b,#9b4ad4)',
      },
    ],
  },
  {
    id: 'project',
    name: '项目介绍',
    resources: [
      {
        id: 'p1',
        title: '项目概览（演示）',
        size: '1.05 GB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#0a4a2a,#2a9b5a)',
      },
      {
        id: 'p2',
        title: '团队介绍（演示）',
        size: '82.9 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#3a5a9b)',
      },
      {
        id: 'p3',
        title: '公司介绍（演示）',
        size: '45.2 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b2a1a,#d46a4a)',
      },
      {
        id: 'p4',
        title: '打卡说明（演示）',
        size: '8.7 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#2a4a6b,#5a8ad4)',
      },
      {
        id: 'p5',
        title: '资料包说明（演示）',
        size: '5.07 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#6b1a4a,#d44a8a)',
      },
      {
        id: 'p6',
        title: '会议流程（演示）',
        size: '12.1 MB',
        type: 'doc',
        thumb: 'linear-gradient(135deg,#3a3a3a,#6a6a6a)',
      },
      {
        id: 'p7',
        title: '专题讲解（演示）',
        size: '28.5 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a4a3a,#3a9b6a)',
      },
    ],
  },
  {
    id: 'product',
    name: '产品介绍',
    resources: [
      {
        id: 'pr1',
        title: '产品优势（演示）',
        size: '1.11 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      },
      {
        id: 'pr2',
        title: '使用场景（演示）',
        size: '3.78 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#1a1a2a,#3a3a5a)',
      },
    ],
  },
  {
    id: 'course',
    name: '私域课程',
    resources: [
      {
        id: 'c1',
        title: '下载说明（演示）',
        size: '31.1 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#e85d04,#f48c06)',
      },
      {
        id: 'c2',
        title: '会议打卡（演示）',
        size: '36.3 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      },
      {
        id: 'c3',
        title: '会议室使用（演示）',
        size: '25.9 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#2a5a3a,#4a9b5a)',
      },
      {
        id: 'c4',
        title: '建群说明（演示）',
        size: '8.12 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a1a2a,#3a4a6a)',
      },
    ],
  },
  {
    id: 'sleep',
    name: '睡眠',
    resources: [
      {
        id: 's1',
        title: '睡眠专题一（演示）',
        size: '8.2 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a1a4a,#3a3a8a)',
      },
      {
        id: 's2',
        title: '睡眠专题二（演示）',
        size: '6.8 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#2a1a4a,#5a3a8a)',
      },
      {
        id: 's3',
        title: '睡眠专题三（演示）',
        size: '5.10 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#4a1a1a,#8a3a3a)',
      },
      {
        id: 's4',
        title: '睡眠专题四（演示）',
        size: '5.66 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a4a,#3a6a8a)',
      },
      {
        id: 's5',
        title: '失眠问答（演示）',
        size: '6.43 MB',
        type: 'audio',
        thumb: 'linear-gradient(135deg,#3a2a1a,#8a6a3a)',
      },
      {
        id: 's6',
        title: '睡眠专题五（演示）',
        size: '12.8 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a4a2a,#3a8a4a)',
      },
      {
        id: 's7',
        title: '睡眠专题六（演示）',
        size: '3.57 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#4a1a3a,#8a3a5a)',
      },
    ],
  },
  {
    id: 'bp',
    name: '高血压',
    resources: [
      {
        id: 'bp1',
        title: '血压专题一（演示）',
        size: '9.2 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b1a1a,#d44a4a)',
      },
      {
        id: 'bp2',
        title: '饮食示例（演示）',
        size: '15.4 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a4a2a,#3a9b5a)',
      },
      {
        id: 'bp3',
        title: '血压与睡眠（演示）',
        size: '7.8 MB',
        type: 'audio',
        thumb: 'linear-gradient(135deg,#1a2a4a,#3a5a8a)',
      },
      {
        id: 'bp4',
        title: '自测小贴士（演示）',
        size: '2.1 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#4a3a1a,#9b8a4a)',
      },
    ],
  },
]

export const typeLabel = {
  video: '视频',
  audio: '音频',
  image: '图文',
  doc: '文档',
}
