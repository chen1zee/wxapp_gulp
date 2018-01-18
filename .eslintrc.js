module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.wpy files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'eqeqeq': 'off',
    // allow async-await
    'generator-star-spacing': 0,
    'prefer-promise-reject-errors': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0,
    'no-multiple-empty-lines': [2, {'max': 2}],
    'indent': [2, 4],
    'no-trailing-spaces': 0,
    'no-mixed-operators': 0,
    'func-call-spacing': 0
  }
}
