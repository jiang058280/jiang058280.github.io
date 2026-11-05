---
title: "MCP：Host、Client 与 Server 的职责"
date: 2026-11-03 12:00:00
knowledge_order: 61
series_index: 26
series_total: 35
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 26 / 35

MCP 是应用与外部能力交换上下文和工具信息的协议。Host 管理应用体验和连接，Client 与服务通信，Server 暴露约定能力。具体传输和版本细节需要按采用的规范核对。

## 工具发现与调用

应用获取可用能力描述后，可以把符合任务与权限的工具提供给模型。模型提出调用，应用再执行实际请求。MCP 统一接口，不会自动决定任务计划和业务合法性。

## 接入示例

一个订单服务可暴露查询工具，参数和返回值仍需清晰契约。服务端校验租户、时间与数据量，应用处理错误和结果展示。采用标准协议并不意味着无需鉴权。

## 选型边界

少量本地函数也可以直接注册，不必为所有能力增加远程服务。需要跨应用复用时，再评估协议化的收益、连接维护与安全成本。工具能连通只是验收起点。

## 参考与延伸阅读

[MCP 架构](https://modelcontextprotocol.io/docs/learn/architecture)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[最小权限：让 Agent 只拥有任务需要的能力](/ai/agent-least-privilege/)
- 下一篇：[Agent 间通信：任务消息与工具调用的区别](/ai/agent-a2a/)
- [返回Agent 系统全部知识点](/study/#agent)
