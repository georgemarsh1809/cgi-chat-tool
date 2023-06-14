// Eslint config file. it picks the rules for style guide and code quality
// the reason its great is it does most of the work for you
// first install
//✖ 102 problems (102 errors, 0 warnings)
// 94 errors and 0 warnings potentially fixable with the `--fix` option.

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
