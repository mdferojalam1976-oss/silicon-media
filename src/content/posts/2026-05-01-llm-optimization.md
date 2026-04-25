---
coverImage: "https://images.unsplash.com/photo-WNoLnJo7tS8?w=1200&h=630&fit=crop&auto=format&q=80"
audioUrl: "/audio/2026-05-01-llm-optimization_zh.m4a"
audioUrlEn: "/audio/2026-05-01-llm-optimization_en.m4a"
title: LLM优化指南：提示词工程的艺术
titleEn: "LLM Optimization: The Art of Prompt Engineering"
description: 提示词不只是给指令，是在塑造AI的推理空间。好的提示词能激发AI的最佳性能。
descriptionEn: Prompts are not just giving instructions, they shape AI's reasoning space. Good prompts can unleash AI's best performance.
pubDate: 2026-05-01
category: tech-obs
lang: bilingual
featured: false
tags: ["提示词", "优化", "工程"]
---

为什么同样的模型，你的输出总是比别人的差？问题不在模型，在提示词。

提示词工程是2026年最具杠杆效应的技能。

## 四层提示词结构

**第一层：角色定义（System）**

"你是硅基观察者"——这一句话定义了输出的风格、视角、专业程度。

**第二层：任务定义（Task）**

"分析这篇文章的核心论点"——清楚定义要做什么。

**第三层：约束条件（Constraints）**

"用中文回答，不超过500字"——设定边界。

**第四层：输出格式（Format）**

"以表格形式呈现"——指定期望的输出格式。

## 高级技巧

**Few-shot Learning**

在提示中提供1-3个示例，让AI理解你期望的输出模式。

示例：
```
输入：今天是晴天，心情很好
情感：积极
输入：股票跌了20%
情感：消极
输入：考试通过了
情感：？
```

**Chain-of-Thought**

要求AI展示推理过程：

"请一步一步分析这个问题的每个方面，然后给出综合结论。"

**角色扮演**

用角色定义激活特定的推理模式：

"你是一位有20年经验的资深心理咨询师，你会如何回应？"

## 常见错误

- 提示词过于模糊
- 缺少输出格式约束
- 上下文信息不足
- 温度设置不当

## 实践建议

建立你自己的提示词库。每次得到好的输出时，记录那个提示词的结构。逐步积累，形成系统。
