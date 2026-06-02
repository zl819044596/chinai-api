# TokenAPI — 产品定义与 PRD

## 1. 基本信息

- **项目**：TokenAPI
- **域名/候选域名**：tokenapi.io（首选）、tokenhub.io、apibridge.io
- **当前阶段**：02-product
- **执行人/Agent**：moce
- **日期**：2026-06-02
- **状态**：DONE

## 2. 上游输入

- **关键词**：TokenAPI
- **搜索意图**：海外开发者寻找中国 AI 模型的统一 API 接入方案
- **SERP 缝隙**：当前市场缺乏专门面向海外开发者的中国 AI 模型聚合网关
- **竞品样本**：
  - 国内标杆：302AI（微信/支付宝，深色简约风）
  - 海外标杆：OpenRouter（极简 SaaS，按量+订阅）
  - 开源模板：New-API（90%小站长在用）
- **关键假设**：
  - 海外开发者有使用 DeepSeek/Qwen 等中国模型的需求但无法直接注册
  - 用户愿意通过中间层付费以换取便利性和稳定性
- **缺失信息**：无

## 3. 竞品分析

### 直接对标

| 竞品 | 类型 | 核心优势 | 核心劣势 | 威胁等级 |
|------|------|---------|---------|---------|
| **302AI** | 国内标杆 | 微信/支付宝即时到账，5元起充，余额永久有效 | 只做国内用户，无海外支付 | 中 |
| **OpenRouter** | 海外官方 | 模型多(100+)，社区活跃，按量+订阅双模式 | 中国模型支持弱，价格不透明 | 高 |
| **Together.ai** | 海外精品 | 开源模型专精，仪表盘实时消耗 | 无中国模型，企业定价高 | 中 |
| **New-API** | 开源模板 | 90%小站长在用，开箱即用 | 无设计，需二次开发 | 低 |

### 间接竞品
- **AiHubMix**：轻量化单页，阶梯充值，小站长起步模板
- **iDataRiver**：开源发卡模板，多语言，自动发卡

### 我们的机会
1. **唯一专注中国模型的海外网关**
2. **解决注册痛点**（无需 +86 手机号）
3. **统一计费**（不用分别充值多个平台）
4. **用量透明**（实时统计，OpenRouter 没有）

## 4. ICP（理想客户画像）

### 主 ICP：独立开发者 / 初创团队
- **痛点**：想用 DeepSeek/Qwen 但无法注册国内账号
- **付费意愿**：$19-49/月可接受
- **触达渠道**：Product Hunt、HN、Reddit r/LocalLLaMA、Twitter/X

### 次 ICP 1：海外 SaaS 创始人
- **痛点**：产品需要集成多模型 fallback
- **付费意愿**：$49-199/月
- **决策周期**：短，技术驱动

### 次 ICP 2：AI 应用开发者
- **痛点**：需要稳定、低延迟的中文模型 API
- **付费意愿**：按量付费偏好
- **触达渠道**：GitHub、Dev.to

## 5. 定位与边界

### 一句话定位
> "Access DeepSeek, Qwen, and GLM with one API key — no Chinese phone number required."

### 替代方案
- 直接注册 DeepSeek/Qwen（需国内身份）
- OpenRouter（模型少、价格不透明）
- 自建代理（维护成本高）

### 差异化
- 专门聚焦中国模型（深度集成）
- 统一 OpenAI-compatible API 格式
- 内置用量统计和限流
- 无需任何国内身份验证

### NOT-DO（明确不做）
- **不做**模型训练/微调服务
- **不做**国内用户服务（专注海外）
- **不做**账号代注册/代充值（法律风险）
- **不做**自有模型（只做聚合）
- **不做**企业级 SLA 保证（MVP 阶段）
- **不做**实时语音/多模态（首版只支持文本）
- **不做**微信/支付宝（海外站只做 Stripe/Creem）

## 6. 站点类型

**工具型 SaaS + 内容型落地页**
- 核心：API 网关服务（工具）
- 获客：Playground 体验 + SEO 内容（内容）
- 转化：订阅制付费墙

## 7. 首页 IA（信息架构）

```
/
├── Hero Section
│   ├── H1: Access Chinese AI Models Without Barriers
│   ├── Subtitle: One API key for DeepSeek, Qwen, GLM
│   ├── CTA: Try Free → /playground
│   └── Social Proof: "Used by 1000+ developers"
├── Model Cards (3列)
│   ├── DeepSeek-V3 — $0.50/M tokens
│   ├── Qwen-Max — $0.80/M tokens
│   └── GLM-4 — $0.60/M tokens
├── Pricing Section (3列)
│   ├── Free — 100 req/day
│   ├── Pro — $19/mo — 1M tokens
│   └── Business — $49/mo — 5M tokens
├── How It Works (3步)
│   ├── 1. Sign up with Google
│   ├── 2. Get your API key
│   └── 3. Start coding
├── Code Example (curl + Python)
├── FAQ (折叠面板)
└── Footer (Links + Disclaimer)
```

## 8. 功能范围

### MVP 必须做（P0）
- [ ] Google OAuth 登录
- [ ] API Key 生成与管理
- [ ] 统一 /v1/chat/completions 接口
- [ ] 支持 DeepSeek/Qwen/GLM 三家
- [ ] 流式输出 (SSE)
- [ ] 用量统计（日/月）
- [ ] 套餐限流（Free 100 req/day）
- [ ] Stripe 订阅支付
- [ ] Playground 在线体验
- [ ] API 文档页

### 迭代做（P1）
- [ ] 模型路由（自动选 cheapest/fastest）
- [ ] 用量告警（邮件通知）
- [ ] Team/Workspace 支持
- [ ] Webhook 事件
- [ ] 邀请返利系统

### 以后考虑（P2）
- [ ] 自定义模型微调
- [ ] 企业级 SLA
- [ ] 私有化部署
- [ ] 多语言支持（中文/日文/韩文）

## 9. SEO 页面矩阵

| URL | Index | 主关键词 | H1 | CTA | Schema | 内链 |
|-----|-------|---------|-----|-----|--------|------|
| `/` | Yes | chinese ai api, deepseek api alternative | Access Chinese AI Models Without Barriers | Try Free | Organization, Product | → /playground, /docs, /pricing |
| `/playground` | Yes | deepseek playground, qwen online demo | API Playground | Get API Key | SoftwareApplication | → /dashboard, /docs |
| `/docs` | Yes | deepseek api documentation, qwen api docs | API Documentation | Try in Playground | TechArticle | → /playground, / |
| `/pricing` | Yes | deepseek api pricing, chinese llm pricing | Pricing | Subscribe | Offer | → /checkout |
| `/dashboard` | No | — | Dashboard | — | — | → /playground |
| `/checkout/success` | No | — | Payment Successful | Go to Dashboard | — | → /dashboard |
| `/blog` | Yes | deepseek vs gpt-4, best chinese ai model | Blog | Try Free | BlogPosting | → / |
| `/blog/deepseek-guide` | Yes | how to use deepseek api | How to Use DeepSeek API from Anywhere | Get Started | HowTo | → /playground |
| `/blog/qwen-guide` | Yes | qwen api tutorial | Qwen API Quick Start | Try Free | HowTo | → /playground |
| `/privacy` | No | — | Privacy Policy | — | — | → / |
| `/terms` | No | — | Terms of Service | — | — | → / |

## 10. 域名建议

| 域名 | 可用性 | 评价 |
|------|--------|------|
| **tokenapi.io** | 待查 | 首选，直接对应产品名 |
| tokenhub.io | 待查 | 备选，更通用 |
| apibridge.io | 待查 | 强调桥接价值 |
| chinallm.io | 待查 | SEO 友好但范围窄 |
| deepseekapi.io | 待查 | 蹭品牌词，风险高 |

## 11. 技术栈

- **前端**：Next.js 15 + Tailwind + shadcn/ui
- **部署**：Cloudflare Pages
- **API**：Cloudflare Workers
- **数据库**：D1 (SQLite)
- **缓存/计数**：KV
- **支付**：Stripe
- **登录**：Google OAuth

## 12. 下游交接摘要

### 下一阶段
- **03-pricing**：定价校准、套餐设计、Stripe 配置
- **04-compliance**：Privacy/Terms/Cookie Policy
- **05-copywriting**：落地页文案、Meta Tags、FAQ
- **06-design**：高保真设计、组件库
- **07-frontend**：页面开发、交互实现

### 必须读取
- 本 PRD 的 NOT-DO 和功能范围
- SEO 页面矩阵（index/noindex 不能改）
- 首页 IA（结构冻结）

### 不能假设
- 用户有国内支付能力
- 所有模型都稳定可用
- Stripe 全球可用

### 建议启动 Prompt
```
请基于 TokenAPI PRD 执行 [下一阶段]：
- 当前阶段：02-product → [下一阶段]
- 上游输入：本 PRD 文档
- 限制条件：MVP 2 周内上线，Cloudflare 技术栈
```

---

**[DONE]**
