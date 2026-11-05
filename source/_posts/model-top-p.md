---
title: "Top-p 采样：从累计概率定义候选集合"
date: 2026-11-03 12:00:00
knowledge_order: 91
series_index: 15
series_total: 28
categories:
  - 模型基础
tags:
  - AI技术
  - 模型基础
---

专题：[模型基础](/study/#prompt) · 知识点 15 / 28

Top-p 按概率排序 token，选取累计概率达到阈值的最小候选集合，再在其中采样。集合大小随当前分布变化，与固定保留若干 token 的 Top-k 不同。

## 一个数字例子

候选概率依次为 0.5、0.3、0.15、0.05，若 p=0.8，前两个已达到阈值。实际实现的边界处理应以库为准，但这个例子说明候选由累计概率控制。

## 与温度的关系

温度改变分布后，Top-p 集合也可能改变。若同时大幅调整多个采样参数，很难定位差异来源。应固定其他参数做对照，并保存多次生成结果。

## 常见误解

截断低概率 token 不等于保证不出现幻觉。高概率文本也可能在业务上错误。事实约束仍需检索、工具和校验，采样主要控制表达与选择的不确定性。

## 参考与延伸阅读

[生成与解码策略](https://huggingface.co/docs/transformers/main/en/generation_strategies)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[Temperature：调整采样分布而非控制事实准确率](/ai/model-temperature/)
- 下一篇：[KV Cache：自回归解码为什么需要缓存历史](/ai/model-kv-cache/)
- [返回模型基础全部知识点](/study/#prompt)
