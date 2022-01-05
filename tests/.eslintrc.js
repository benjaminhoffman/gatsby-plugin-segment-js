module.exports = {
  extends: '../.eslintrc.js',
  env: {
    mocha: true
  },
  plugins: [
    'mocha',
  ],
  rules: {
    'mocha/no-skipped-tests': 'error',
    'mocha/no-exclusive-tests': 'error',
  },
  globals: {
    expect: 'readonly',
    pathToProject: 'readonly'
  }
}
