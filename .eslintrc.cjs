module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 8,
    requireConfigFile: false,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: ['react', 'import', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/jsx-runtime'
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      'eslint-import-resolver-custom-alias': {
        alias: {
          '@constants': './src/constants',
          '@components': './src/components',
          '@hook': './src/hook',
          '@domain': 'src/domain',
          '@services': 'src/services',
          '@pages': './src/pages',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@public': './public'
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    react: {
      version: 'detect'
    }
  },
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'no-console': 'error',
    'import/no-unresolved': [2, { caseSensitive: true, ignore: ['.svg'] }],
    'import/order': ['error', { 'newlines-between': 'always' }],
    'react/jsx-curly-brace-presence': 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@typescript-eslint/no-floating-promises': ['error'],
    'react/prop-types': 'off',
    '@typescript-eslint/no-misused-promises': [
      2,
      {
        checksVoidReturn: {
          attributes: false
        }
      }
    ]
  }
};
