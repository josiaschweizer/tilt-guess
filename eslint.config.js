const tsParser = require('@typescript-eslint/parser')

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      curly: ['error', 'all'],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      curly: ['error', 'all'],
    },
  },
]
