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
          '@hocs': './src/hocs',
          '@domain': './src/domain',
          '@services': './src/services',
          '@pages': './src/pages',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@contexts': './src/contexts',
          '@views': './src/views',
          '@public': './public',
          '@theme': './src/themeConfig',
          '@icons': './src/assets/icons',
          '@images': './src/assets/images'
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    },
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-restricted-imports': ['error', { patterns: ['@mui/*/*/*'] }],
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
