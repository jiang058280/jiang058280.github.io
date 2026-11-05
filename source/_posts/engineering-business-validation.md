---
title: "业务校验：格式正确之后还需要检查什么"
date: 2026-11-03 12:00:00
knowledge_order: 98
series_index: 3
series_total: 25
categories:
  - AI 工程
tags:
  - AI技术
  - AI 工程
---

专题：[AI 工程](/study/#python) · 知识点 03 / 25

格式校验处理类型，业务校验处理真实约束。模型生成的金额可以是合法数字，却超过用户额度；时间可以格式正确，却不在可查询区间。两层职责不能混淆。

## 明确约束来源

额度、权限与产品状态来自可信服务，不能采用模型自己描述的规则。跨字段关系应写成可测试逻辑，并返回明确错误码，便于用户补充或调整请求。

## 小型示例

查询区间 start 大于 end 时拒绝执行；金额与币种不一致时要求确认；订单不属于当前租户时停止。不能仅因为模型给出了合理解释就放宽服务端校验。

## 验证重点

准备边界值、空值、状态变化和并发变更样本。执行前再次检查可能变化的条件，避免校验通过后数据已改变。失败要可追踪，但对外不泄露敏感系统细节。

## 参考与延伸阅读

[结构化输出与接口契约](https://docs.langchain.com/oss/python/langchain/structured-output)。文中的业务流程与数值示例用于解释设计思路，具体参数需在实际任务上验证。

## 同专题阅读

- 上一篇：[JSON Schema：约束对象字段、类型和额外属性](/ai/engineering-json-schema/)
- 下一篇：[Schema Linking：把业务问题对应到表和字段](/ai/engineering-schema-linking/)
- [返回AI 工程全部知识点](/study/#python)
