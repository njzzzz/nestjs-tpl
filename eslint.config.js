// eslint.config.js
const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  typescript: {
    overrides: {
      'ts/consistent-type-exports': 'off',
      'ts/consistent-type-imports': 'off',
    },
  },
})
