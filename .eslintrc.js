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
    'operator-linebreak': ['error', 'before'],
    'space-before-function-paren': 'off', // 与prettier冲突，关闭校验
    'react/prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'react/no-did-update-set-state': 'off',
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: 'parens-new-line',
      },
    ],
    'handle-callback-err': 'off',
    camelcase: 'off',
    'standard/no-callback-literal': 'off',
    'react/jsx-handler-names': 'off',
    'unicorn/no-reduce': 'off',
    'unicorn/explicit-length-check': 'off', // 允许length不跟某个值比较， 如'xxx'.length?1:0
    'react/react-in-jsx-scope': 'error',
    // 允许使用new RegExp
    'prefer-regex-literals': 'off',
    // 允许使用require导入变量
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-extra-semi': 'off', // 跟prettier规则冲突
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用ts的any类型
    // 下面两行配置解决'React' was used before it was defined的报错
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        indent: 'off',
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-var-requires': 'warn',
        // "@typescript-eslint/class-name-casing": ["error"],// 兼容性有问题，先取消
        '@typescript-eslint/class-name-casing': 'off',
        '@typescript-eslint/type-annotation-spacing': ['error'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
          },
        ],
        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': ['error'],
        'import/export': 'off',
      },
    },
  ],
}
