---
title: "工具错误建模：区分空结果、失败与业务拒绝"
date: 2026-11-03 12:00:00
knowledge_order: 46
series_index: 11
series_total: 35
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 11 / 35

工具返回值应表达发生了什么，而不是只返回一段字符串。空结果、参数错误、权限拒绝和暂时不可用对应不同决策。混在一起会让 Agent 误重试或编造结论。

## 结构化状态

可以包含 status、error_code、retryable 和用户可见摘要。内部堆栈、数据库地址和凭据不应直接传给模型或用户。日志保留详细原因，外部只提供必要信息。

## 示例

库存查询成功但为零，不应重试；网关临时超时可以有限重试；当前用户无权访问则应停止。业务规则拒绝也不属于服务故障，不能计为同一种错误。

## 验证与监控

检查每类错误是否进入正确分支，记录重试后的最终结果。避免只监控 HTTP 200，因为业务错误可能封装在成功响应中；也不要把异常文本当作普通检索证据引用。

## 参考与延伸阅读

[LangChain 工具接口](https://docs.langchain.com/oss/python/langchain/tools)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[工具参数校验：从类型正确到业务合法](/ai/agent-argument-validation/)
- 下一篇：[有限重试：恢复暂时故障而不放大副作用](/ai/agent-retry/)
- [返回Agent 系统全部知识点](/study/#agent)
