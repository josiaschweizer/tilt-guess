module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      curly: ['error', 'all'],
    },
  },
]
