---
title: "Embedding：把文本映射到可比较的向量"
date: 2026-11-03 12:00:00
knowledge_order: 10
series_index: 10
series_total: 38
categories:
  - RAG 检索
tags:
  - AI技术
  - RAG 检索
---

专题：[RAG 检索](/study/#rag) · 知识点 10 / 38

Embedding 模型把文本编码为固定维度的表示，检索系统据此比较查询与资料。向量接近表示模型认为两者在训练目标下相似，不等于资料一定能回答问题，更不等于事实正确。

## 查询与文档要兼容

使用同一模型体系和约定的编码方式。有些模型区分 query 与 document 输入，使用时应遵循模型说明。更换模型后，即使维度没变，也不能把新查询向量与旧文档向量默认混用。

## 示范对照

“怎么退货”与“商品退回流程”可能语义接近；“AB-17”与“AB-71”却可能因文字相似而混淆。业务数据同时包含语义和精确标识时，需要结合词项检索与字段约束。

## 选型与更新

使用真实中文术语、短查询和长段落评估召回，记录延迟、维度和存储成本。模型升级应先构建新索引并比较，再切换流量。不要只凭通用榜单决定私有语料上的效果。

## 参考与延伸阅读

[Sentence Transformers 语义检索](https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[RAG 元数据：版本、权限与来源字段的设计](/ai/rag-metadata/)
- 下一篇：[余弦相似度：数值含义与检索阈值](/ai/rag-cosine/)
- [返回RAG 检索全部知识点](/study/#rag)
