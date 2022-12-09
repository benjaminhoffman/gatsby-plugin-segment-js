module.exports = {
  diff: true,
  delay: false,
  extension: ['js'],
  package: './package.json',
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  spec: [
    './test/**/*.test.js',
    '../tests/shared/**/*.test.js',
  ],
  require: [
    // https://mochajs.org/#-require-module-r-module
    // '@babel/register',
    './test/mocha-environment.js',
  ],
  file: './test/mocha-setup.js',
  exit: true,
}
