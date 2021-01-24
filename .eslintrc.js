module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    jsx: true,
    useJSXTextNode: true,
    ecmaVersion: 11,
    sourceType: 'module',
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
  extends: [
    'standard',
    'standard-react',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'react-hooks', 'unicorn', 'promise', '@typescript-eslint'],
  // 全局变量的校验规则
  globals: {
    _: 'readonly',
  },
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
    'react/jsx-no-bind': 'off',
    'react/no-did-update-set-state': 'off',
    'react/jsx-fragments': ['error', 'syntax'],
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
    'react/jsx-handler-names': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    'unicorn/no-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/explicit-length-check': 'off', // 允许length不跟某个值比较， 如'xxx'.length?1:0
    'react/react-in-jsx-scope': 'error',
    'prefer-regex-literals': 'off', // 允许使用new RegExp
    'no-use-before-define': 'off', // 解决'React' was used before it was defined的报错以及在上方调用下方声明的函数时的报错
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-var-requires': 'off', // 允许使用require导入变量
    '@typescript-eslint/no-extra-semi': 'off', // 跟prettier规则冲突
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用ts的any类型
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-var-requires': 'warn',
        // "@typescript-eslint/class-name-casing": ["error"],// 兼容性有问题，先取消
        '@typescript-eslint/class-name-casing': 'off',
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
