---
title: "SQL 只读边界：为什么 SELECT 检查仍不充分"
date: 2026-11-03 12:00:00
knowledge_order: 109
series_index: 5
series_total: 28
categories:
  - AI 工程
tags:
  - AI技术
  - AI 工程
---

专题：[AI 工程](/study/#python) · 知识点 05 / 28

只读执行需要数据库权限、语句结构和资源约束共同保证。检查字符串是否以 SELECT 开头很脆弱，也不能阻止访问不应读取的表或发起昂贵查询。

## 分层防护

使用最小权限只读账号，限制可访问表与字段；采用可靠解析器分析语句结构，限制多语句、函数和复杂度；同时设置超时与结果上限。具体允许范围取决于数据库语义。

## 一个常见问题

查询没有写操作，但跨租户读取全部订单，同样越权。即使 LIMIT 为 10，聚合或连接仍可能扫描大量数据，因此结果行数限制不能替代资源限制。

## 负向测试

覆盖写操作、系统表、越权条件、注释、嵌套查询和高成本请求。解析不支持时保守拒绝。参数化有助于安全传值，但动态标识符和整体生成 SQL 仍需单独验证。

## 参考与延伸阅读

[OWASP SQL 注入防护](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[Schema Linking：把业务问题对应到表和字段](/ai/engineering-schema-linking/)
- 下一篇：[指标口径：让同一个业务名对应同一种计算](/ai/engineering-metric-definition/)
- [返回AI 工程全部知识点](/study/#python)
