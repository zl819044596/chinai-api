# ChinaAI API - MVP

## 项目结构

```
src/
  app/
    page.tsx          # 首页 Landing
    layout.tsx        # 根布局
    playground/       # API 测试页面
      page.tsx
    docs/             # 文档页面
      page.tsx
    api/
      chat/           # API 路由
        route.ts
```

## 本地开发

```bash
npm run dev          # 本地开发
npm run build        # 构建
npm run pages:build  # Cloudflare Pages 构建
npm run pages:deploy # 部署到 Cloudflare
```

## 环境变量

复制 `.env.local.example` 为 `.env.local`，填入你的 API Keys：

```
DEEPSEEK_API_KEY=your_key
QWEN_API_KEY=your_key
GLM_API_KEY=your_key
```

## 部署

需要设置 `CLOUDFLARE_API_TOKEN` 环境变量：

```bash
export CLOUDFLARE_API_TOKEN=your_token
npm run pages:deploy
```

## 当前状态

- [x] 首页 Landing
- [x] Playground 测试页面
- [x] 文档页面
- [x] API 路由 (/api/chat)
- [ ] 用户认证
- [ ] 用量限制
- [ ] 支付集成
- [ ] 数据库
