module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'jest',
    'import',
    'promise',
    'unicorn',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
    'react/jsx-filename-extension': 0,
    'no-unused-vars': 0,
    'unicorn/no-null': 0,
    'unicorn/prefer-module': 0,
    'unicorn/prefer-node-protocol': 0,
    'unicorn/no-array-reduce': 0,
    'unicorn/prefer-object-from-entries': 0,
    'unicorn/consistent-function-scoping': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unnecessary-type-assertion': 0,
    'jest/no-test-prefixes': 0,
    'jest/no-disabled-tests': 0,
    'prefer-destructuring': [
      'warn',
      {
        array: false,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'function-call-argument-newline': ['error', 'consistent'],
    'array-bracket-newline': ['error', 'consistent'],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { multiline: true, minProperties: 10, consistent: true },
        ObjectPattern: { multiline: true, minProperties: 10, consistent: true },
        ImportDeclaration: { consistent: true },
        ExportDeclaration: { consistent: true },
      },
    ],
    semi: ['error', 'always'],
    '@typescript-eslint/indent': [ // https://github.com/typescript-eslint/typescript-eslint/issues/1824
      'error',
      2,
      {
        SwitchCase: 1,
        MemberExpression: 1,
        offsetTernaryExpressions: true,
      },
    ],
    'max-len': [
      'warn',
      {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-irregular-whitespace': 'error',
    'no-unused-expressions': 'error',
    '@typescript-eslint/return-await': ['error', 'always'], // https://v8.dev/blog/fast-async
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: false,
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', ['parent', 'sibling', 'index', 'internal']],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'unicorn/filename-case': [
      'error',
      {
        case: 'snakeCase',
      },
    ],
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    project: './tsconfig.lint.json',
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.json', '.ts', '.d.ts', '.tsx'],
        moduleDirectory: ['node_modules'],
      },
    },
  },
};
