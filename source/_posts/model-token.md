---
title: "Token：模型处理文本的基本单位"
date: 2026-11-03 12:00:00
knowledge_order: 61
series_index: 1
series_total: 20
categories:
  - 模型基础
tags:
  - AI技术
  - 模型基础
---

专题：[模型基础](/study/#prompt) · 知识点 01 / 20

Token 是 tokenizer 划分出的单位，可能对应字符、词的一部分、标点或特殊符号。模型实际接收的是 token ID。不同词表对同一句中文的划分可能不同，因此字符数不能直接等同于 token 数。

## 编码与解码

编码将文本映射为 ID 序列，解码把 ID 转回文本。特殊 token 可能表示角色或边界，使用模型时应采用匹配的 tokenizer 和聊天模板，不能把另一套格式直接套进来。

## 一个预算例子

同样长度的产品型号、自然中文和代码可能消耗不同 token 数。估算长文档成本时，最好对真实样本用目标 tokenizer 测量，再计算分布，而不是用固定换算常数。

## 需要注意什么

输入截断可能切断句子或结构化数据，输出上限也通常按 token 计。检查长输入的尾部和关键字段是否保留。词表改变还可能影响微调数据、模型兼容和缓存键。

## 参考与延伸阅读

[Hugging Face BPE 分词](https://huggingface.co/learn/llm-course/chapter6/5)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 下一篇：[BPE 分词：通过频繁合并构建子词词表](/ai/model-bpe/)
- [返回模型基础全部知识点](/study/#prompt)
