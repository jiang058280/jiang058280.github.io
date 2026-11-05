---
title: "JSON Schema：约束对象字段、类型和额外属性"
date: 2026-11-03 12:00:00
knowledge_order: 97
series_index: 2
series_total: 25
categories:
  - AI 工程
tags:
  - AI技术
  - AI 工程
---

专题：[AI 工程](/study/#python) · 知识点 02 / 25

JSON Schema 描述数据应该符合什么结构。对象属性、必需字段和额外字段策略是不同概念：声明一个属性并不自动要求它存在，允许 null 也不等于字段可以省略。

## 写清合法范围

字符串可限制枚举，数值可限制范围，数组可限制元素结构。额外属性是否允许也应明确，避免模型输出未定义字段被下游误用。具体关键字支持取决于采用的规范与工具。

## 一个接口场景

退款分析结果要求 metric、unit 与 value，缺少 value 时应使用定义好的错误结构。不能一会儿返回字符串“未知”，一会儿返回数字零，却要求同一个客户端猜测含义。

## 验证顺序

先解析，再执行 schema 校验，最后做跨字段业务检查。开始日期是否早于结束日期等规则通常还需额外代码。为契约准备合法与非法样本，并在升级时做兼容回归。

## 参考与延伸阅读

[JSON Schema 对象约束](https://json-schema.org/understanding-json-schema/reference/object)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[结构化生成：让模型输出成为可消费的数据](/ai/structured-generation/)
- 下一篇：[业务校验：格式正确之后还需要检查什么](/ai/engineering-business-validation/)
- [返回AI 工程全部知识点](/study/#python)
