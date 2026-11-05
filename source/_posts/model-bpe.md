---
title: "BPE 分词：通过频繁合并构建子词词表"
date: 2026-11-03 12:00:00
knowledge_order: 72
series_index: 2
series_total: 25
categories:
  - 模型基础
tags:
  - AI技术
  - 模型基础
---

专题：[模型基础](/study/#prompt) · 知识点 02 / 25

BPE 的核心是迭代合并频繁相邻单位，逐渐形成较常见的子词。它让模型不必为每个完整词都单独建词条，也能拆解少见表达。具体实现还涉及预分词、字节表示和特殊 token 规则。

## 用小语料理解

若语料中某两个相邻符号经常一起出现，可以把它们合成新单位。训练反复进行，直到达到词表等停止条件。实际 tokenizer 的合并规则来自训练，使用时不应临时重新训练。

## 领域词的影响

生僻型号可能拆成许多 token，常见词却可能合为一个。给模型增加词条通常还需处理 embedding 与训练，不能只改 tokenizer 文件就认为模型学会了新概念。

## 验证方法

观察真实中文、英文、代码和型号的切分长度，检查编码与解码。BPE 解决的是表示问题，不会自动提供词义理解，也不保证一个 token 对应一个人类词语。

## 参考与延伸阅读

[Hugging Face BPE 分词](https://huggingface.co/learn/llm-course/chapter6/5)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[Token：模型处理文本的基本单位](/ai/model-token/)
- 下一篇：[Token Embedding：从离散 ID 到连续表示](/ai/model-token-embedding/)
- [返回模型基础全部知识点](/study/#prompt)
