# 超级名片 · H5 演示

微信风格数字名片演示。技术栈：**Vite + Vue 3 + Vue Router**，纯前端 Mock，无后端、无真实微信 API。资料与公司名均为虚构。

手机打开：<https://sanmarryai-cloud.github.io/unihello/>

路由使用 hash（`#/`），静态资源 `base` 为 `./`，可直接部署在 GitHub Pages 项目站点。

## 快速启动

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址（默认 `http://localhost:5173`）。桌面端会以 **375px** 手机框居中展示；手机访问即为全屏 H5。

其他命令：

```bash
npm run build    # 产出 dist/
npm run preview  # 预览构建结果
```

## 页面

| 路径 | 说明 |
|------|------|
| `/#/` | 访客名片。可用 `?card=&scene=&from=` 指定名片和推荐场景 |
| `/#/auth` | 模拟授权（昵称、头像） |
| `/#/fill` | 填写姓名和手机，生成自己的名片并绑定上级 |
| `/#/success` | 回递成功 |
| `/#/my` | 我的名片 |
| `/#/share` | 复制带 scene 的链接，二维码为占位 |
| `/#/poster` | 海报：头像字、姓名、公司、二维码占位，下载图片并复制朋友圈文案 |
| `/#/site` | 微官网：产品、案例、动态、语音介绍、公众号和视频号链接 |
| `/#/admin` | 概览和每晚日报 |
| `/#/admin/profile` | 编辑资料 |
| `/#/admin/library` | 视频库 |
| `/#/admin/radar` | 访客时间线、来源标签、意向分 |
| `/#/admin/notices` | 通知中心，微信订阅消息为开关桩 |
| `/#/admin/comments` | 评论审核 |
| `/#/admin/qrcode` | 获客活码：微信号和二维码 |
| `/#/admin/inbox` | 在线接待收件箱 |
| `/#/admin/rewards` | 扫码领红包（演示，不到账）和邀请榜 |
| `/#/admin/team` | 团队名片和团队数据 |
| `/#/admin/crm` | 客户、跟进、提醒；名片识别标为演示 |
| `/#/admin/company` | 工商简介，实名和企业认证标记 |
| `/#/admin/reports` | 今晚日报和本周周报 |
| `/#/admin/site` | 编辑微官网内容 |
| `/#/admin/identities` | 多张名片，切换正在管理的身份 |
| `/#/admin/imports` | 粘贴腾讯会议、抖音、快手、视频号、B 站链接，抓取标为待接入 |
| `/#/platform` | 平台总览 |
| `/#/platform/users` | 用户与套餐 |
| `/#/platform/templates` | 名片模板 |
| `/#/platform/audit` | 内容审核 |
| `/#/platform/referrals` | 推荐关系 |
| `/#/platform/modules` | 开关：积分、分佣、拼团、直播、门店 |
| `/#/platform/points` | 积分流水 |
| `/#/platform/commission` | 分佣记录（不打款） |
| `/#/platform/group-buy` | 拼团演示 |
| `/#/platform/live` | 直播入口 |
| `/#/platform/stores` | 门店列表 |

右上角「···」可进名片管理和平台后台。访客名片上还有微官网、加微信、在线咨询、海报和领红包。

## 数据

页面只调用 `src/services/api.js`。默认把名片、访问、通知、咨询、客户、团队、微官网和可选模块存在 `localStorage` 键 `super-card-db-v1`，刷新还在。`signMediaUrl` 只生成演示签名，不拦截播放。

GitHub Pages 不能跑数据库。若要换真实接口，设置 `VITE_API_BASE` 并把 `api.js` 里的函数改成对应的 `fetch`，页面路由不用改。红包、拼团、积分和分佣都是演示数字，没有真实支付。

## 部署（GitHub Pages）

推送到 `main` 会触发 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)：`npm ci` → `npm run build` → 将 `dist/` 作为 Pages artifact 部署。

公开地址：<https://sanmarryai-cloud.github.io/unihello/>

**Pages 来源必须是 GitHub Actions**（`build_type: workflow`），不要用 “Deploy from a branch”。分支发布会把未经构建的源码盖到站点上，手机打开后脚本无法运行。

仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。当前安装 token 没有 `pages: write` 或 `administration: write`，Pages API 返回 403，这项设置没法用 API 改掉，需要在网页上手动改一次。

改之前，每次 push 还会触发 “Deploy from a branch”，把未经构建的源码发到同一地址。工作流会等这次分支发布结束，再用 `dist/` 盖回去，这样手机打开的仍是构建结果。改成 GitHub Actions 之后，只有本工作流会更新站点。

## 目录结构

```
├── src/
│   ├── data/seed.js          # 初始演示数据
│   ├── services/api.js       # 页面用的数据入口
│   ├── services/localDb.js   # localStorage 实现
│   ├── services/media.js     # 示例片源与签名桩
│   ├── views/admin/          # 名片主人
│   └── views/platform/       # 平台
└── vite.config.js            # base: './'
```

## 说明

- UI 按产品截图风格还原（藏青主色、底部回递条、横向 Tab），非像素级对齐。
- 封面图使用 Unsplash；头像使用 Dicebear SVG（需外网）。离线时头像可能空白，不影响主流程。
- 授权为本地模拟，不包含微信 AppId / Secret。
- 未使用 uni-app：脚手架更重；本 Demo 用 Vite H5 即可快速演示。后续可迁 uni-app 出小程序包。
