---
title: "Decode：逐 Token 生成速度由哪些因素决定"
date: 2026-11-03 12:00:00
knowledge_order: 105
series_index: 10
series_total: 25
categories:
  - AI 工程
tags:
  - AI技术
  - AI 工程
---

专题：[AI 工程](/study/#python) · 知识点 10 / 25

Decode 阶段反复预测后续 token。每一步依赖已有前缀与缓存状态，因此输出长度会影响完成时间。每秒 token 数只是一个指标，还需要结合并发与用户等待时间理解。

## 测量输出间隔

在首个 token 之后记录后续到达间隔，注意网络缓冲可能把多个 token 合成一批。客户端收到的块数不等于模型真实生成 token 数，统计时应使用一致计数方式。

## 一个输出预算例子

只需要标签的任务不应允许输出长篇解释。限制格式与长度可以减少无用生成，但不能把必要证据说明也全部裁掉。预算由业务契约决定。

## 压测边界

同一模型在单请求和高并发下表现不同。报告模型、硬件、输入输出长度及成功率。只展示最高峰值速度，不能说明用户在生产负载下的体验。

## 参考与延伸阅读

[vLLM 缓存与推理实现](https://docs.vllm.ai/en/latest/design/paged_attention/)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[Prefill：输入上下文如何影响首 Token 延迟](/ai/inference-performance/)
- 下一篇：[批处理：用吞吐换取什么等待成本](/ai/engineering-batching/)
- [返回AI 工程全部知识点](/study/#python)
