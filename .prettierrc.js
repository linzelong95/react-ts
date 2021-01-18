module.exports = {
  // 开启eslint支持
  eslintIntegration: true,
  // 一行最多 140 字符
  printWidth: 140,
  // 行尾不要有分号
  semi: false,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾需要逗号
  trailingComma: 'all', // none|es5|all
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 auto
  endOfLine: 'auto',
  //---------------以下配置与官方默认配置一样，可以不写-------------------
  // 一个tab代表 2 个空格
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 大括号内的首尾需要空格
  bracketSpacing: true,
}
