---
title: "工具 Schema：把能力描述成明确接口"
date: 2026-11-03 12:00:00
knowledge_order: 47
series_index: 9
series_total: 38
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 09 / 38

Schema 让模型与程序对参数结构形成共同约定。字段名字、类型和描述都会影响调用稳定性。一个只收 `input: string` 的通用工具虽然灵活，却把大量解释责任推给运行时。

## 字段设计

查询工具可以把时间、指标和维度分开，明确必需项与枚举。日期格式、单位和默认行为写清楚。身份类字段由服务端注入，不应被暴露成模型自由填写的权限入口。

## 示例与反例

`amount` 不说明币种容易误用，可以改为明确金额单位与 currency 字段。可选字段缺失、空字符串和 null 的含义也需要区分，否则下游可能错误使用默认值。

## 迭代方法

根据真实调用失败修订描述，保存 schema 版本与负向用例。字段越多不一定越好，应只暴露完成任务所需的能力。格式通过仍需业务校验。

## 参考与延伸阅读

[LangChain 工具接口](https://docs.langchain.com/oss/python/langchain/tools)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[Function Calling：模型提出调用与程序真正执行](/ai/agent-function-calling/)
- 下一篇：[工具参数校验：从类型正确到业务合法](/ai/agent-argument-validation/)
- [返回Agent 系统全部知识点](/study/#agent)
