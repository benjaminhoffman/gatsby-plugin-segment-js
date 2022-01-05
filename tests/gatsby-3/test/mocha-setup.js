const path = require('path')

// All the tests will be the same, so we'll share them. But we need to tell it where
// to look for things
global.pathToProject = path.resolve(__dirname, '../')
