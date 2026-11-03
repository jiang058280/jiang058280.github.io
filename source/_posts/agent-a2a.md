---
title: "Agent 间通信：任务消息与工具调用的区别"
date: 2026-11-03 12:00:00
knowledge_order: 57
series_index: 27
series_total: 30
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 27 / 30

Agent 间协作传递的是目标、进度与结果，工具调用通常描述一次明确操作。协议可以统一消息格式，但无法替代任务拆分、依赖管理与业务验收。不要只靠“双方都能聊天”判断协作可靠。

## 最小消息契约

可以包含 task_id、目标、输入引用、期望结果结构、截止时间和可取消状态。跨服务还需身份认证、重试及版本兼容。敏感上下文应只传完成子任务所需部分。

## 示例

分析 Agent 向查数 Agent 请求某时间范围指标，返回结果应注明口径、单位和是否完整。不能只回复一段“数据很好”的自然语言，让上游猜测能否生成报告。

## 验收要点

检查重复消息、断线恢复、任务取消和晚到结果。明确谁负责最终任务成功状态。这里描述的是通信设计原则，具体 A2A 实现应再核对对应规范与版本。

## 参考与延伸阅读

[A2A 核心概念](https://a2a-protocol.org/latest/topics/key-concepts/)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[MCP：Host、Client 与 Server 的职责](/ai/tool-contract-mcp/)
- 下一篇：[多 Agent 拆分：依据上下文和能力边界分工](/ai/multi-agent-design/)
- [返回Agent 系统全部知识点](/study/#agent)
