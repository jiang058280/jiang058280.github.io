---
title: "Agent 状态：运行进度与消息记录的区别"
date: 2026-11-03 12:00:00
knowledge_order: 46
series_index: 16
series_total: 30
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 16 / 30

状态描述任务当前是什么情况。它可以包括已确认参数、计划、工具结果引用和当前阶段。聊天记录只是状态的一部分，不能单靠最后一句模型回复判断运行进度。

## 字段职责

把用户输入、派生结果和系统控制字段分开。模型可建议更新业务信息，但步骤计数、权限和取消标记由程序管理。每个字段应明确谁能写、何时清空及如何合并。

## 状态转移示例

订单分析从 pending 进入 running，再进入 succeeded、failed 或 waiting_input。返回无数据也可以是成功执行后的业务结果，不能一律记为异常。

## 验证原则

禁止不合法的回退，例如已取消任务被晚到响应改为成功。状态版本和操作 ID 有助于检测并发更新。数据设计清晰后，日志、恢复和前端进度才会一致。

## 参考与延伸阅读

[LangGraph 状态与图](https://docs.langchain.com/oss/python/langgraph/graph-api)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[终止条件：何时继续、完成或停止 Agent](/ai/agent-stop-condition/)
- 下一篇：[状态合并器：并行分支如何更新同一字段](/ai/agent-state-reducers/)
- [返回Agent 系统全部知识点](/study/#agent)
