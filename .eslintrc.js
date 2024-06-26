module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    '@typescript-eslint/no-unused-vars': ['error']
  }
}
