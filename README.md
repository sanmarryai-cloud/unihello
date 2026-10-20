# 超级名片 · H5 演示

微信风格数字名片（超级名片 / HeyBoss 类）可运行 Demo。技术栈：**Vite + Vue 3 + Vue Router**，纯前端 Mock，无后端、无真实微信 API。

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
| `/#/` | 名片主页：封面、资料卡、点赞评论、分类 Tab、资源列表、底部「立即回递」 |
| `/#/auth` | 模拟微信授权（昵称 + 头像占位） |
| `/#/success` | 回递成功 → 创建「我的名片」 |
| `/#/my` | 我的名片占位页 |

## 交互说明

1. 主页切换 Tab（AI获客 / 项目介绍 / 产品介绍 / 私域课程 / 睡眠 / 高血压）查看不同资源列表（视频 / 图文 / 音频 Mock）。
2. 点击 **立即回递** → 授权页选头像、填昵称 → **同意授权并回递名片** → 成功页 → **打开我的名片**。
3. 资料存于 `localStorage`（键 `super-card-profile`），刷新后仍可进入「我的名片」。

## 部署（GitHub Pages）

推送到 `main` 会触发 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)：`npm ci` → `npm run build` → 将 `dist/` 作为 Pages artifact 部署。

公开地址：<https://sanmarryai-cloud.github.io/unihello/>

**Pages 来源必须是 GitHub Actions**（`build_type: workflow`），不要用 “Deploy from a branch”。分支发布会把未经构建的源码盖到站点上，手机打开后脚本无法运行。

仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。当前安装 token 没有 `pages: write` 或 `administration: write`，Pages API 返回 403，这项设置没法用 API 改掉，需要在网页上手动改一次。改之前，每次 push 还会触发 “Deploy from a branch”，可能用未经构建的源码盖住 Actions 发布的 `dist/`。改成 GitHub Actions 之后，只有本工作流会更新站点。

## 目录结构

```
├── public/
├── src/
│   ├── data/mock.js      # 名片与资源 Mock
│   ├── router/index.js   # hash 路由
│   ├── views/
│   │   ├── Home.vue      # 名片主页
│   │   ├── Auth.vue      # 授权
│   │   ├── Success.vue   # 成功
│   │   └── MyCard.vue    # 我的名片
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
└── vite.config.js        # base: './'
```

## 说明

- UI 按产品截图风格还原（藏青主色、底部回递条、横向 Tab），非像素级对齐。
- 封面图使用 Unsplash；头像使用 Dicebear SVG（需外网）。离线时头像可能空白，不影响主流程。
- 授权为本地模拟，不包含微信 AppId / Secret。
- 未使用 uni-app：脚手架更重；本 Demo 用 Vite H5 即可快速演示。后续可迁 uni-app 出小程序包。
