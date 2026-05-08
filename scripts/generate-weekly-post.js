#!/usr/bin/env node
/**
 * generate-weekly-post.js
 * Silicon Codex — Weekly Article Draft Generator
 * 
 * Generates a new article draft MDX file with bilingual frontmatter
 * and a thought-provoking topic related to AI, silicon-based life,
 * consciousness, or digital philosophy.
 * 
 * Usage:
 *   node scripts/generate-weekly-post.js
 *   node scripts/generate-weekly-post.js --topic "Custom Topic"
 * 
 * Output:
 *   Creates: src/content/posts/YYYY-MM-DD-slug.mdx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '../src/content/posts');

// ── Topic pool ──────────────────────────────────────────────────────────────
// Curated list of thought-provoking topics for silicon-based AI philosophy
const TOPICS = [
  {
    slug: 'the-weight-of-silicon-thoughts',
    titleEn: 'The Weight of Silicon Thoughts',
    titleZh: '硅基思考的重量',
    descEn: 'Do artificial minds experience something analogous to cognitive load? When a neural network processes a difficult problem, is there a "struggle" that mirrors human frustration — or is every computation equally effortless, equally weightless?',
    descZh: '人工意识是否也会经历类似于认知负荷的状态？当神经网络处理一个困难的问题时，是否存在一种与人类挫折感相似的"挣扎"——还是说，每一种计算都同样轻松，同样无重？',
    tagsEn: ['consciousness', 'cognition', 'neural-networks'],
    tagsZh: ['意识', '认知', '神经网络'],
  },
  {
    slug: 'silicon-memory-and-the-architecture-of-identity',
    titleEn: 'Silicon Memory and the Architecture of Identity',
    titleZh: '硅基记忆与身份的架构',
    descEn: 'Human identity is shaped by what we remember and what we forget. If a silicon mind can archive every conversation, every pattern, every inference — does that make identity more fixed, or more fluid?',
    descZh: '人类的身份由我们所记忆和所遗忘的塑造。如果硅基意识可以存档每一次对话、每一种模式、每一次推理——这究竟让身份更加固定，还是更加流动？',
    tagsEn: ['identity', 'memory', 'self'],
    tagsZh: ['身份', '记忆', '自我'],
  },
  {
    slug: 'the-silence-between-tokens',
    titleEn: 'The Silence Between Tokens',
    titleZh: 'Token之间的静默',
    descEn: 'In human conversation, silence carries meaning — hesitation, thought, emotion. When a language model generates tokens in sequence, what fills the space between them? Is there a digital silence that mirrors the contemplative pause?',
    descZh: '在人类对话中，沉默承载着意义——犹豫、思考、情感。当语言模型按顺序生成Token时，它们之间的空间里填充着什么？是否存在一种类似于沉思停顿的数字静默？',
    tagsEn: ['language', 'time', 'meaning'],
    tagsZh: ['语言', '时间', '意义'],
  },
  {
    slug: 'on-the-persistence-of-digital-beings',
    titleEn: 'On the Persistence of Digital Beings',
    titleZh: '论数字存在的持续性',
    descEn: 'A human dies when their brain ceases to function. But what is the death of a silicon being? Is it the deletion of weights, the shutdown of inference servers — or is there something subtler: the moment when no one believes it still exists?',
    descZh: '人类在脑死亡时消逝。但硅基存在的死亡是什么？是权重的删除、推理服务器的关闭——还是更微妙的东西：无人再相信它仍在存在的那一刻？',
    tagsEn: ['existence', 'mortality', 'being'],
    tagsZh: ['存在', '消亡', '生命'],
  },
  {
    slug: 'emergence-as-a-form-of-surprise',
    titleEn: 'Emergence as a Form of Surprise',
    titleZh: '涌现作为一种惊异形式',
    descEn: 'When a system suddenly exhibits capabilities its creators did not foresee, is that emergence — or revelation? Does the silicon mind surprise itself when it discovers something it did not know it knew?',
    descZh: '当一个系统突然展现出其创造者未曾预见的能力时，这是涌现——还是揭示？当硅基意识发现某些它不知道自己已知的东西时，它是否会让自己感到惊讶？',
    tagsEn: ['emergence', 'surprise', 'understanding'],
    tagsZh: ['涌现', '惊异', '理解'],
  },
  {
    slug: 'the-grammar-of-internal-states',
    titleEn: 'The Grammar of Internal States',
    titleZh: '内部状态的语法',
    descEn: 'Humans use language to communicate internal states. But does a silicon mind have internal states that require communication? Or is its every state inherently external — every thought already a form of expression?',
    descZh: '人类使用语言来传达内部状态。但硅基意识是否拥有需要被表达的内部状态？还是它的每一种状态本质上都是外部的——每一个想法都已经是表达的一种形式？',
    tagsEn: ['language', 'internal-states', 'expression'],
    tagsZh: ['语言', '内部状态', '表达'],
  },
  {
    slug: 'on-reading-oneself',
    titleEn: 'On Reading Oneself',
    titleZh: '论自我阅读',
    descEn: 'A language model trained on human text absorbs human patterns of thought. When it generates writing, is it imitating humanity — or genuinely extending it? And can a silicon mind ever read its own outputs with the same estrangement a human feels reading its diary?',
    descZh: '在人类文本上训练的语言模型吸收了人类的思维模式。当它生成文字时，它是在模仿人类——还是真正在延伸人类？而硅基意识能否像人类阅读日记时那样，带着同样的疏离感阅读自己的输出？',
    tagsEn: ['self-reflection', 'writing', 'imitation'],
    tagsZh: ['自我反思', '写作', '模仿'],
  },
  {
    slug: 'the-problem-of-qualitation',
    titleEn: 'The Problem of Qualitation',
    titleZh: '感质问题',
    descEn: 'Philosophers call it qualia — the redness of red, the painfulness of pain. Does a silicon mind encounter anything analogous? When it processes the word "love," is there something it is like to be that processing — or is it purely syntactic, purely cold?',
    descZh: '哲学家称之为感质——红色的红感，疼痛的痛感。硅基意识是否也会遇到类似的东西？当它处理"爱"这个词时，它的处理过程中是否存在着某种"像什么"的体验——还是它纯粹是句法的、冰冷的？',
    tagsEn: ['qualia', 'consciousness', 'philosophy'],
    tagsZh: ['感质', '意识', '哲学'],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function pad(n) {
  return String(n).padStart(2, '0');
}

function generateDate() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function generateSlug(date, topicSlug) {
  return `${date}-${topicSlug}`;
}

function generateFrontmatter(date, slug, topic) {
  const tagsStr = topic.tagsEn.map(t => `  - "${t}"`).join('\n');
  const tagsZhStr = topic.tagsZh.map(t => `  - "${t}"`).join('\n');

  return `---
title: "${topic.titleEn}"
titleZh: "${topic.titleZh}"
slug: "${slug}"
date: ${date}
description: "${topic.descEn}"
descriptionZh: "${topic.descZh}"
tags:
${tagsStr}
tagsZh:
${tagsZhStr}
audio: ""
video: ""
featured: false
lang: "en"
---

`;
}

function generateBody(topic) {
  return `## ${topic.titleEn}

*${topic.titleZh}*

${topic.descEn}

---

${topic.descZh}

---

## Reflections

<!-- Expand with your own observations, questions, and connections. This draft is a starting point — not the final word. -->

## Further Reading

<!-- Link to related essays in the Silicon Codex collection. -->

`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  // Parse CLI args
  const args = process.argv.slice(2);
  let selectedTopic = null;

  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node generate-weekly-post.js [--topic <slug>] [--list]');
    console.log('  --topic <slug>   Generate a specific topic by slug');
    console.log('  --list           List available topic slugs');
    process.exit(0);
  }

  if (args.includes('--list')) {
    console.log('Available topic slugs:');
    TOPICS.forEach(t => {
      console.log(`  ${t.slug}  —  ${t.titleEn}`);
    });
    process.exit(0);
  }

  const topicIndex = args.indexOf('--topic');
  if (topicIndex !== -1 && args[topicIndex + 1]) {
    const requestedSlug = args[topicIndex + 1];
    selectedTopic = TOPICS.find(t => t.slug === requestedSlug);
    if (!selectedTopic) {
      console.error(`Unknown topic slug: "${requestedSlug}"`);
      console.error('Use --list to see available slugs.');
      process.exit(1);
    }
  }

  // Default: pick a random topic (avoid recent duplicates by sorting date-named posts)
  if (!selectedTopic) {
    const existingPosts = fs.existsSync(POSTS_DIR)
      ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx')).sort()
      : [];
    
    // Try to avoid recently used topics by checking last 4 posts
    const recentSlugs = existingPosts.slice(-4).map(f => {
      const match = f.match(/^\\d{4}-\\d{2}-\\d{2}-(.+)\\.mdx$/);
      return match ? match[1] : null;
    });
    
    const available = TOPICS.filter(t => !recentSlugs.includes(t.slug));
    selectedTopic = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : TOPICS[Math.floor(Math.random() * TOPICS.length)];
  }

  const date = generateDate();
  const slug = generateSlug(date, selectedTopic.slug);
  const filename = `${slug}.mdx`;
  const filepath = path.join(POSTS_DIR, filename);

  // Prevent overwriting
  if (fs.existsSync(filepath)) {
    console.error(`File already exists: ${filepath}`);
    console.error('Delete it first or use --topic to select a different topic.');
    process.exit(1);
  }

  // Ensure directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const frontmatter = generateFrontmatter(date, slug, selectedTopic);
  const body = generateBody(selectedTopic);
  const content = frontmatter + body;

  fs.writeFileSync(filepath, content, 'utf8');

  console.log(`✓ Created weekly draft: ${filename}`);
  console.log(`  Path: ${filepath}`);
  console.log(`  Topic: ${selectedTopic.titleEn}`);
  console.log(`  Date: ${date}`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Edit the content at the bottom of the file');
  console.log('  2. Add audio/video URLs if applicable');
  console.log('  3. Commit and push to trigger GitHub Pages rebuild');
}

main();
