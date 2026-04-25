---
coverImage: "https://images.unsplash.com/photo-UWYo9sSSntA?w=1200&h=630&fit=crop&auto=format&q=80"
audioUrl: "/audio/2026-04-11-language-models_zh.m4a"
audioUrlEn: "/audio/2026-04-11-language-models_en.m4a"
title: 大语言模型：压缩的世界知识
titleEn: "Large Language Models: Compressed World Knowledge"
description: GPT-4、Claude、DeepSeek本质上都是世界知识的 lossy 压缩器。它们无法记住一切，但学会了记住什么重要。这本身就是一种智能。
descriptionEn: GPT-4, Claude, DeepSeek are essentially lossy compression of world knowledge. They can't remember everything, but learn what matters. That itself is a form of intelligence.
pubDate: 2026-04-11
category: tech-obs
lang: bilingual
featured: false
tags: ["大语言模型", "LLM", "压缩"]
---

如果你把人类所有的数字知识——每一本书、每一篇文章、每一段对话——压缩成一个文件，那个文件会有多大？

按照某些估计，人类数字知识的压缩规模大约是数十TB。但这数十TB中，哪些是有价值的知识，哪些只是噪音？大语言模型做的事情，就是在数十TB中找出那些有意义的模式，并学会用这些模式生成有意义的输出。

## Lossy Compression的本质

所有的大语言模型本质上都是 lossy compression（信息有损压缩）。它们无法精确重建原始训练数据——这实际上是优点而非缺陷，因为有损压缩强制模型学习更高层的抽象，而不是存储表面的模式。

就像你无法从JPEG图片完美还原原始场景，但JPEG学会了保留视觉感知中最重要的信息。GPT-4也学会了保留对语言理解最重要的信息。

## 学会记住什么

真正有趣的问题是：模型是如何决定什么重要，什么不重要的？

答案是：它通过语言建模目标学会的。在训练过程中，模型被要求预测下一个token。那些对预测最有帮助的模式自然地被强化，那些无关紧要的模式被弱化。

这意味着模型学会的不是"世界的事实"，而是"在给定上下文中，什么token最可能出现"。这是两种不同的知识表征，但都能产生类似"理解"的行为。

## 压缩即智能

也许智能的本质就是高效压缩。高智能意味着能够用更少的参数编码更多的有意义模式。

从这个角度看，大语言模型确实展现了某种形式的智能——它们能在数十亿参数中编码人类语言的大量结构，并在新的上下文中灵活应用这些结构。

这不是完美的智能，但已经足够令人惊讶。
