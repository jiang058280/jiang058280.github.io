---
title: "Handoff：交接任务时如何转移控制权与上下文"
date: 2026-11-05 12:00:00
knowledge_order: 73
series_index: 35
series_total: 38
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 35 / 38

Handoff 表示当前处理者把后续控制权交给另一个 Agent 或处理流程。它与调用一个工具后返回结果不同：交接后可能由接收方继续与用户沟通，因此需要明确谁负责当前会话和完成状态。

## 最小交接内容

传递目标、已确认条件、完成步骤、未解决问题和必要结果引用。不要复制所有历史或敏感数据。接收方还需验证自身权限，交接消息不能扩大真实授权范围。

## 客服示例

通用助手确认用户要处理账单，交给账单 Agent 时说明订单、争议金额和已核实步骤。若只是重复整段对话，接收方仍可能重新追问甚至再次执行已经完成的操作。

## 循环与失联

限制交接次数，避免两个 Agent 反复互相转交。对接收失败定义退回或转人工策略，并记录控制权归属。测试重复消息、用户改口与中途取消，确保始终只有明确的任务责任方。

## 参考与延伸阅读

[参考资料](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs)。文中业务流程和数值用于教学说明，具体配置需结合实际任务验证。

## 同专题阅读

- 上一篇：[状态 Schema 迁移：运行中的 Agent 如何跨版本恢复](/ai/agent-state-migration/)
- 下一篇：[Agent 子图：把可复用流程封装成有边界的模块](/ai/agent-subgraphs/)
- [返回Agent 系统全部知识点](/study/#agent)
