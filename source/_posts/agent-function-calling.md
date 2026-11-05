---
title: "Function Calling：模型提出调用与程序真正执行"
date: 2026-11-03 12:00:00
knowledge_order: 46
series_index: 8
series_total: 38
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 08 / 38

工具调用通常分为两个阶段：模型生成工具名及参数，应用验证后调用真实函数，再把结果返回模型。生成了调用结构不等于操作已经完成，模型也不会因此自动获得执行权限。

## 请求与结果必须关联

保留调用 ID、工具名称、参数和执行状态。并行调用返回顺序可能与发出顺序不同，必须按 ID 对应，不能按列表下标随意配对。

## 一个空结果例子

查订单返回 `status=ok, rows=[]` 表示查询成功但没有记录；超时应使用不同状态。两种反馈会影响模型的下一步，不能都变成“没有数据”。

## 程序侧职责

验证工具白名单、参数类型、用户权限和响应大小。模型生成的参数只是候选输入，不能直接拼接到 SQL 或 shell 命令。评估要包含错误参数与虚构工具名。

## 参考与延伸阅读

[LangChain 工具接口](https://docs.langchain.com/oss/python/langchain/tools)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[ReAct：让观察结果参与下一步行动](/ai/react-tool-loop/)
- 下一篇：[工具 Schema：把能力描述成明确接口](/ai/agent-tool-schema/)
- [返回Agent 系统全部知识点](/study/#agent)
