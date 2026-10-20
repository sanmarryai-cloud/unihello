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
| `/#/admin` | 主人：概览、资料、视频库、访客雷达、评论 |
| `/#/platform` | 平台：总览、用户套餐、模板、内容审核、推荐树 |

右上角「···」可进名片管理和平台后台。

## 数据

页面只调用 `src/services/api.js`。默认把 users、cards、tabs、videos、visits、visit_events、referral_edges、comments 存在 `localStorage` 键 `super-card-db-v1`，刷新还在。`signMediaUrl` 只生成演示签名，不拦截播放。

GitHub Pages 不能跑数据库。若要换真实接口，设置 `VITE_API_BASE` 并把 `api.js` 里的函数改成对应的 `fetch`，页面路由不用改。没有商城、支付或预约。

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
