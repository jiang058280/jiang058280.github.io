---
title: "Token Embedding：从离散 ID 到连续表示"
date: 2026-11-03 12:00:00
knowledge_order: 63
series_index: 3
series_total: 20
categories:
  - 模型基础
tags:
  - AI技术
  - 模型基础
---

专题：[模型基础](/study/#prompt) · 知识点 03 / 20

Token ID 本身只是索引，没有数值大小上的语义。Embedding 层按 ID 查找一个可学习向量，为后续网络提供连续输入。ID 相差一并不意味着含义接近。

## 与检索向量的区别

Token embedding 是模型内部序列表示的一部分；句向量检索通常需要专门的训练目标或聚合方式。不能随便取生成模型某层一个向量，就认为它具备可靠的语义检索能力。

## 示例

句子中“银行”和“河岸”可以在上下文中形成不同表示。初始查表向量本身不包含完整句子信息，经过注意力层后，位置表示才会与周围 token 交互。

## 常见误区

新增 token 需要初始化和学习相应参数，不能只在词表里赋一个 ID。检查 tokenizer 与权重是否匹配，尤其在模型保存、微调和部署迁移时，避免索引错位。

## 参考与延伸阅读

[Transformer 的训练与使用](https://huggingface.co/learn/llm-course/chapter1/4)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[BPE 分词：通过频繁合并构建子词词表](/ai/model-bpe/)
- 下一篇：[自注意力：Q、K、V 如何聚合上下文](/ai/transformer-foundations/)
- [返回模型基础全部知识点](/study/#prompt)
