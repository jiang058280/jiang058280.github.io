---
title: "状态合并器：并行分支如何更新同一字段"
date: 2026-11-03 12:00:00
knowledge_order: 47
series_index: 17
series_total: 30
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 17 / 30

多个节点同时写状态时，需要明确合并规则。覆盖、追加、集合去重和数值累加的语义不同。默认使用最后一次写入，可能丢掉其他分支结果。

## 按字段定义规则

工具结果可按 task_id 放入映射，消息可以按消息标识更新，指标计数则按明确事件累加。不能把所有字段都用列表追加，否则重试会制造重复记录。

## 一个并发例子

A 分支返回华北数据，B 分支返回华南数据。如果都写 `result`，其中一个可能覆盖另一个；写入 `results[A]` 和 `results[B]` 后，再由汇总节点检查完整性更清楚。

## 重放与幂等

恢复运行时同一更新可能再次出现，合并器应考虑重复事件。测试交换分支完成顺序和重复提交，确认最终状态符合业务预期，而不是依赖偶然调度顺序。

## 参考与延伸阅读

[LangGraph 状态与图](https://docs.langchain.com/oss/python/langgraph/graph-api)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[Agent 状态：运行进度与消息记录的区别](/ai/agent-state/)
- 下一篇：[检查点：保存哪些信息才能恢复 Agent 任务](/ai/state-memory-recovery/)
- [返回Agent 系统全部知识点](/study/#agent)
