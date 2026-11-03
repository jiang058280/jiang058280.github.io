---
title: "长期记忆：哪些信息适合跨会话保存"
date: 2026-11-03 12:00:00
knowledge_order: 50
series_index: 20
series_total: 30
categories:
  - Agent 系统
tags:
  - AI技术
  - Agent 系统
---

专题：[Agent 系统](/study/#agent) · 知识点 20 / 30

长期记忆保存可复用事实和偏好，例如用户偏好的语言，而不是把每条对话都永久记录。写入前需要判断信息来源、可信程度、适用范围和保留期限。

## 事实与推测分开

用户明确说“报表使用人民币”与模型推测“用户大概偏好人民币”不是同一级证据。前者可以按授权存为偏好，后者应保留为未确认候选，不能影响关键计算。

## 更新与冲突

新会话中用户改为美元展示，应更新或限定作用域，而不是同时保存两个互相冲突的全局偏好。记忆项可以包含 source、confirmed_at 和 expires_at。

## 读取策略

按当前任务检索相关记忆，执行前检查权限，允许用户纠正和删除。长期记忆不是业务数据库的替代品，实时余额和库存仍应通过可信系统查询。

## 参考与延伸阅读

[LangGraph 持久化](https://docs.langchain.com/oss/python/langgraph/persistence)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[短期记忆：在同一会话中保留必要上下文](/ai/agent-short-memory/)
- 下一篇：[对话摘要：压缩历史时如何保留关键条件](/ai/agent-summary-memory/)
- [返回Agent 系统全部知识点](/study/#agent)
