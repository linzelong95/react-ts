module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
    ecmaVersion: 11,
    sourceType: 'module', // 当前项目是 ES Module 模块
    // allowImportExportEverywhere: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
      },
      typescript: {},
    },
  },
  globals: {
    __SERVER_ORIGIN__: 'readonly',
    __IS_DEV_MODE__: 'readonly',
  },
  extends: [
    'standard',
    'standard-react',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    // 使得 @typescript-eslint 中的样式规范失效，遵循 prettier 中的样式规范
    'prettier/@typescript-eslint',
    // eslint 使用 prettier 中的样式规范，且如果使得 ESLint 检测到 prettier 的格式问题，将以 error 的形式抛出
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', 'unicorn', 'promise', '@typescript-eslint'],
  // 全局变量的校验规则
  // globals: {
  //   _: 'readonly',
  // },
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    'comma-dangle': ['error', 'always-multiline'],
    'operator-linebreak': 'off', // 与prettier冲突，关闭校验
    'space-before-function-paren': 'off', // 与prettier冲突，关闭校验
    'react/prop-types': 'off',
    // 'react/jsx-no-bind': 'off',
    'react/jsx-uses-react': 'off', // react 17 import react是非必要的
    'react/react-in-jsx-scope': 'off', // react 17 import react是非必要的
    'react/jsx-handler-names': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    // 'react/no-did-update-set-state': 'off',
    // 'react/jsx-fragments': ['error', 'syntax'],
    'lines-between-class-members': ['error', 'always'],
    'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: 'parens-new-line',
      },
    ],
    'handle-callback-err': 'off',
    indent: 'off',
    camelcase: 'warn',
    'promise/always-return': 'off',
    'standard/no-callback-literal': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-nested-ternary': 'off', // 旨在允许使用多个三目表达式
    'unicorn/no-useless-undefined': 'off', // 允许设置undefined
    'unicorn/explicit-length-check': 'off', // 允许length不跟某个值比较， 如'xxx'.length?1:0
    'unicorn/no-unreadable-array-destructuring': 'off', // 此配置旨在允许不读取多个元组元素，如[, , fileKey]
    'prefer-regex-literals': 'off', // 允许使用new RegExp
    'no-use-before-define': 'off', // 解决'React' was used before it was defined的报错以及在上方调用下方声明的函数时的报错
    'node/no-path-concat': 'off', // 该配置旨在允许使用`${__dirname}/app/entity/**/*{.ts,.js}`，而非必要通过path.resolve()来达到目的
    'no-unused-vars': 'warn',
    'promise/no-callback-in-promise': 'off', // 此配置旨在允许在promise中执行callback
    '@typescript-eslint/no-extra-semi': 'off', // 跟prettier规则冲突
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用ts的any类型
    '@typescript-eslint/no-var-requires': 'off', // 允许使用require导入变量const LruCache = require('lru-cache')
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-var-requires': 'off', // 允许使用require导入变量const LruCache = require('lru-cache')
        // "@typescript-eslint/class-name-casing": ["error"],// 兼容性有问题，先取消
        '@typescript-eslint/class-name-casing': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off', // 此配置意在允许使用!断言
        '@typescript-eslint/type-annotation-spacing': ['error'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
          },
        ],
        'import/export': 'off',
      },
    },
  ],
}
