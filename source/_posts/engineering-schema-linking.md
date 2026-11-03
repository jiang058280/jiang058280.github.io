---
title: "Schema Linking：把业务问题对应到表和字段"
date: 2026-11-03 12:00:00
knowledge_order: 84
series_index: 4
series_total: 20
categories:
  - AI 工程
tags:
  - AI技术
  - AI 工程
---

专题：[AI 工程](/study/#python) · 知识点 04 / 20

Schema Linking 为自然语言中的指标、实体和条件找到数据库对应位置。它不仅是把问题里的词与列名做相似匹配，还需要理解关联关系、字段单位和枚举含义。

## 提供受控结构

按权限选择相关表和字段，附带必要描述、关联键和时间含义。数据库注释可能过时，需要与业务口径核对。样例数据应脱敏，不能为了方便生成泄露真实客户信息。

## 一个歧义

“成交额”可能对应订单金额、支付金额或结算金额。模型选中名字最相似的列，并不能证明指标正确。明确口径后再生成 SQL，可以减少可执行但语义错误的查询。

## 如何评估

检查表选择、字段选择和关联关系的准确性，保存正确映射。将映射错误与 SQL 语法错误分开统计，才能知道该补元数据还是调整生成过程。

## 参考与延伸阅读

[结构化输出与接口契约](https://docs.langchain.com/oss/python/langchain/structured-output)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[业务校验：格式正确之后还需要检查什么](/ai/engineering-business-validation/)
- 下一篇：[SQL 只读边界：为什么 SELECT 检查仍不充分](/ai/text-to-sql-safety/)
- [返回AI 工程全部知识点](/study/#python)
