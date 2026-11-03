---
title: "SSE 流式输出：事件边界、重连与完成状态"
date: 2026-11-03 12:00:00
knowledge_order: 88
series_index: 8
series_total: 20
categories:
  - AI 工程
tags:
  - AI技术
  - AI 工程
---

专题：[AI 工程](/study/#python) · 知识点 08 / 20

SSE 允许服务端通过事件流持续向客户端发送消息，适合展示生成文本和任务进度。网络分片不等于完整事件，更不等于完整 JSON，客户端必须按协议边界解析。

## 定义事件类型

可以区分进度、文本增量、工具结果、错误和完成事件。完成事件表达业务结束，连接关闭本身可能只是网络中断，不能直接当成任务成功。

## 重连示例

用户网络短断后重新连接，应能知道上次收到哪个事件，或者明确从当前状态恢复。事件 ID 和任务 ID 的职责不同，不能每次重连都重新发起一次有副作用的工具操作。

## 运行验证

检查代理缓冲、心跳、慢客户端和取消。避免在流式正文里泄露模型内部错误和凭据。流式输出改善反馈体验，但不会自动减少生成计算量。

## 参考与延伸阅读

[MDN SSE 事件流](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[异步 I/O：AI 接口等待外部服务时如何并发](/ai/engineering-async-io/)
- 下一篇：[Prefill：输入上下文如何影响首 Token 延迟](/ai/inference-performance/)
- [返回AI 工程全部知识点](/study/#python)
