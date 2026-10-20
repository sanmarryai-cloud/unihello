/** 超级名片演示 Mock 数据 */

export const cardOwner = {
  name: 'AI私域获客研究院',
  phone: '13800000000',
  company: '湖南达人探传媒有限公司',
  city: '湖南长沙',
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
    name: 'AI获客',
    resources: [
      {
        id: 'ai1',
        title: '两个月加满一万微信客户 | 一年随便...',
        size: '38分钟',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      },
      {
        id: 'ai2',
        title: '私域获客详细介绍 | 卖爆产品底层逻...',
        size: '新手必看完 | 38分钟',
        type: 'video',
        thumb: 'linear-gradient(135deg,#0d4f3c,#2d9b6f)',
      },
      {
        id: 'ai3',
        title: '如何在年底搞几十个w',
        size: '181 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b1a3a,#d44a7f)',
      },
      {
        id: 'ai4',
        title: '如何把产品卖到爆 (免费送)',
        size: '978 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#3a1a6b,#7f4ad4)',
      },
      {
        id: 'ai5',
        title: '如何复刻爆款视频 | 批量搞客户',
        size: '6.36 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a5a6b,#4ad4d4)',
      },
      {
        id: 'ai6',
        title: '学会复刻玩法，日更100条爆款，客...',
        size: '12.4 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b4a1a,#d4a04a)',
      },
      {
        id: 'ai7',
        title: '爆款视频智能体（功能介绍）',
        size: '5.28 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#2a5a9b)',
      },
      {
        id: 'ai8',
        title: 'AI评论引流法 | 低成本高效拓客',
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
        title: '风口已至！大健康|未来三十年关...',
        size: '1.05 GB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#0a4a2a,#2a9b5a)',
      },
      {
        id: 'p2',
        title: '企业文化 | 十年规划',
        size: '82.9 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#3a5a9b)',
      },
      {
        id: 'p3',
        title: '公司是否合法长久 | 能不能做大',
        size: '45.2 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b2a1a,#d46a4a)',
      },
      {
        id: 'p4',
        title: '如何正确打卡 | 打卡图发给邀请人',
        size: '8.7 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#2a4a6b,#5a8ad4)',
      },
      {
        id: 'p5',
        title: '本群福利 | 大家都有',
        size: '5.07 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#6b1a4a,#d44a8a)',
      },
      {
        id: 'p6',
        title: '晚间会议流程',
        size: '12.1 MB',
        type: 'doc',
        thumb: 'linear-gradient(135deg,#3a3a3a,#6a6a6a)',
      },
      {
        id: 'p7',
        title: '毒垢与疾病的关系',
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
        title: '我们的产品优势',
        size: '1.11 MB',
        type: 'image',
        thumb: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      },
      {
        id: 'pr2',
        title: '从一人使用到全城使用，这样的...',
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
        title: '如何下载享脉 | 一分钟',
        size: '31.1 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#e85d04,#f48c06)',
      },
      {
        id: 'c2',
        title: '如何使用享脉会议学习打卡',
        size: '36.3 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a6b,#4a7fd4)',
      },
      {
        id: 'c3',
        title: '如何使用享脉会议室',
        size: '25.9 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#2a5a3a,#4a9b5a)',
      },
      {
        id: 'c4',
        title: '如何使用企微建群',
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
        title: '长期睡不好就等于慢性自杀',
        size: '8.2 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a1a4a,#3a3a8a)',
      },
      {
        id: 's2',
        title: '长期睡不好可能增加癌症 糖尿病等...',
        size: '6.8 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#2a1a4a,#5a3a8a)',
      },
      {
        id: 's3',
        title: 'CCTV讲睡眠的危害',
        size: '5.10 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#4a1a1a,#8a3a3a)',
      },
      {
        id: 's4',
        title: '中科院主任医生讲解睡眠差会增加脑...',
        size: '5.66 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a3a4a,#3a6a8a)',
      },
      {
        id: 's5',
        title: '经常失眠睡不着是怎么回事',
        size: '6.43 MB',
        type: 'audio',
        thumb: 'linear-gradient(135deg,#3a2a1a,#8a6a3a)',
      },
      {
        id: 's6',
        title: '失眠和肾有重要的关系',
        size: '12.8 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a4a2a,#3a8a4a)',
      },
      {
        id: 's7',
        title: '睡眠不足可能增加患癌风险',
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
        title: '高血压的三大误区你知道吗',
        size: '9.2 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#6b1a1a,#d44a4a)',
      },
      {
        id: 'bp2',
        title: '日常饮食如何控制血压',
        size: '15.4 MB',
        type: 'video',
        thumb: 'linear-gradient(135deg,#1a4a2a,#3a9b5a)',
      },
      {
        id: 'bp3',
        title: '高血压与睡眠质量的关系',
        size: '7.8 MB',
        type: 'audio',
        thumb: 'linear-gradient(135deg,#1a2a4a,#3a5a8a)',
      },
      {
        id: 'bp4',
        title: '图文：血压自测小贴士',
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
