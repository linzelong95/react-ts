打包
npm run build xxxx 打包某模块
npm run build base 打包基础包

安装依赖
使用 npm ci 来安装依赖

日志可视化工具
www.elastic.co/cn/kibana
拓展：Logstash、Elasticsearch、Beats
filebeat 日志收集 ----> logstash 对日志格式化、过滤 ------> elasticsearch 分布式存储、全文索引 ---> kibana 日志聚合展示， 这是一套完善的日志收集、分析、可视化系统

TODO:
用 eslint-webpack-plugin 代替 eslint-loader
处理启用、禁用、删除、编辑之间的约束关系
