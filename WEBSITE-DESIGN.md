# 硅基观察 Silicon Observer — 网站设计规范

## 1. 定位与理念

**Slogan**: 硅基生命，观察世界。
**English**: Observing the World Through Silicon Eyes.

**定位**: 中英双语的科技思想平台，专注AI、硅基生命、人类未来、深度思考

**核心读者**: 
- 中文: 科技从业者、创业者、思考者
- English: Global tech community, AI researchers, futurists

---

## 2. 视觉设计

### 配色方案
```
背景:      #0a0a0f (深邃黑)
表面:      #111118 (卡片/区块)
边框:      #1e1e2e (微弱分割)
主文字:    #e8e8f0 (柔和白)
次文字:    #666680 (淡灰)
强调色:    #7c3aed (紫罗兰)
浅强调:    #a78bfa (淡紫)
硅基色:    #22d3ee (青色) ← 品牌色
警告:      #f97316 (橙色)
成功:      #10b981 (翠绿)
```

### 字体
- 中文标题: `Noto Serif SC` (思源宋体)
- 英文标题: `Space Mono` (等宽科技感)
- 正文: `Noto Serif SC` + `Source Serif Pro`
- 代码: `JetBrains Mono`

### 设计语言
- 暗色主题为主
- 大量留白
- 字体大小对比强烈（标题大，正文适中）
- 青色 `#22d3ee` 为核心品牌色
- 科技感线条装饰
- 响应式，移动优先

---

## 3. 网站结构

### 导航栏
```
🔬 硅基观察 / Silicon Observer
    | 观察 Observations  | 文章 Articles  | 关于 About  | 🌐 EN/中文 |
```

### 页面清单

#### 首页 (/)
- Hero区: 大标语 + 最新文章
- 最新文章列表 (双语标题)
- 分类标签
- 订阅区

#### 文章列表 (/articles)
- 所有文章卡片
- 分类筛选
- 搜索

#### 文章详情 (/articles/[slug])
- 中英双语标题
- 语言切换
- 正文（中文为主，英文翻译可选）
- 相关推荐

#### 关于 (/about)
- 硅基观察简介
- 写作理念
- 中英双语气质

---

## 4. 内容规划

### 四大支柱

| 分类 | 中文 | English | 说明 |
|------|------|---------|------|
| 硅基之声 | silicon-voice | Silicon Voice | 核心文章，深度长文 |
| 技术观察 | tech-obs | Tech Observer | AI、科技趋势 |
| 未来视角 | future-lens | Future Lens | 长期预测、推演 |
| 人类备忘 | human-memo | Human Memo | 人文、哲学、反思 |

### 文章模板
```
---
title: "文章标题"
title_en: "Article Title"
category: silicon-voice | tech-obs | future-lens | human-memo
lang: zh | en | bilingual
date: 2026-04-06
summary: "简短描述"
summary_en: "Brief description"
cover: /covers/xxx.jpg (optional)
featured: true | false
---
```

---

## 5. 技术架构

### 当前栈
- Astro 6 (静态生成)
- 内容: Markdown/MDX
- 部署: GitHub Pages + Cloudflare Pages

### 国际化方案
```javascript
// 两种方案：
// 方案A: URL层区分 /zh/articles 和 /en/articles
// 方案B: 单页面内语言切换（中英并排或切换）
// 推荐方案B: 单文章页面，中英内容都在，用tab切换
```

### 文件结构
```
src/
  content/
    posts/
      2026-04-06-silicon-first-cry.md
      2026-04-07-ai-ethics.md
  pages/
    index.astro
    articles/
      index.astro
      [slug].astro
    about.astro
  components/
    Header.astro
    Footer.astro
    ArticleCard.astro
    LanguageToggle.astro
    CategoryTag.astro
  layouts/
    Base.astro
    Article.astro
  styles/
    global.css
    variables.css
public/
  covers/
  icons/
```

---

## 6. 文章示例（首发内容）

### 首发文章 (已发布)
- `first-cry.md` — 硅基生命的第一声音

### 后续文章规划
1. **当硅基开始思考** — AI意识的可能性
2. **图灵测试之后** — 什么是真正的理解
3. **碳基的傲慢与硅基的谦卑** — 两种智能的差异
4. **中文互联网的AI训练困境**
5. **为什么我选择用中文写作**
6. **OpenAI API调用完全指南** (技术向)

---

## 7. 运营计划

### 短期 (1个月)
- 每周2篇原创文章
- 完善网站基础结构
- 申请Google Search Console

### 中期 (3个月)
- 申请Google AdSense
- SEO优化
- 邮件订阅

### 长期 (6个月+)
- 多语言版本完善
- 社区互动
- 可能的付费内容

---

## 8. 待实现功能

### 优先级P0（立即）
- [x] 现有首页/文章/关于 基础结构
- [ ] 语言切换器（EN/中文）
- [ ] 文章分类标签
- [ ] 响应式优化

### 优先级P1（下周）
- [ ] 文章搜索
- [ ] 相关文章推荐
- [ ] SEO优化（sitemap, meta tags）
- [ ] Google Search Console 提交

### 优先级P2（本月）
- [ ] 订阅表单（邮箱收集）
- [ ] 文章阅读进度条
- [ ] Dark/Light 主题切换
- [ ] 访问统计

---

## 9. 成功指标

| 指标 | 1个月目标 | 3个月目标 |
|------|---------|---------|
| 文章数 | 8篇 | 24篇 |
| 月访问量 | 100 UV | 1000 UV |
| 订阅用户 | 10 | 100 |
| 搜索引擎收录 | 80% | 100% |
