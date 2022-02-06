const path = require('path')
const fs = require('fs')

const pathToPublic = path.resolve(pathToProject, 'public')
const fileNames = fs.readdirSync(pathToPublic)

const indexFilePath = path.resolve(pathToPublic, 'index.html')

const appJsFileName = fileNames.find((fileName) => fileName.startsWith('app-') && fileName.endsWith('.js'))
if (!appJsFileName) {
  throw Error('Could not find app-*.js filename')
}
const appJsFilePath = path.resolve(pathToPublic, appJsFileName)

const appJsMapFileName = fileNames.find((fileName) => fileName.startsWith('app-') && fileName.endsWith('.js.map'))
if (!appJsMapFileName) {
  throw Error('Could not find app-*.js.map filename')
}
const appJsMapFilePath = path.resolve(pathToPublic, appJsMapFileName)

// As Node versions and Gatsby versions etc change + the fact that there is not lock file, things may
// change a little bit in insignificant ways...so let's remove the whitespace chars before doing
// comparisons
function removeWhitespace (str) {
  return str.replace(/\s+/g, '')
}

describe('Code is there', function () {
  it('has snippet in the <head>', function () {
    const indexText = fs.readFileSync(indexFilePath).toString()
    const indexOfHeadOpen = indexText.indexOf('<head>')
    const indexOfHeadClose = indexText.indexOf('</head>')
    const indexOfFirstThing = indexText.indexOf('analytics._writeKey="ADD_API_KEY_PROD";')
    expect(indexOfFirstThing).to.be.gt(indexOfHeadOpen)
    expect(indexOfFirstThing).to.be.lt(indexOfHeadClose)

    expect(indexText).to.include('analytics._writeKey="ADD_API_KEY_PROD";')
    expect(indexText).to.include("analytics.load('ADD_API_KEY_PROD');")
    expect(indexText).to.include('analytics.page();')

    const indexOfLastThing = indexText.indexOf('analytics.page();')
    expect(indexOfLastThing).to.be.gt(indexOfHeadOpen)
    expect(indexOfLastThing).to.be.lt(indexOfHeadClose)
  })

  it('has segment code in app-*.js', function () {
    const jsText = fs.readFileSync(appJsFilePath).toString()
    expect(jsText).to.include('window.segmentSnippetLoaded?window.segmentSnippetLoader((function(){')
  })

  it('has segment code in app-*.js.map', function () {
    const appCode = String.raw`if (!trackPage) {\n    return;\n  }\n\n  function trackSegmentPage() {\n    var delay = Math.max(0, trackPageDelay);\n\n    window.setTimeout(function () {\n      window.analytics && window.analytics.page(document.title);\n    }, delay);\n  }\n\n  if (prevLocation && window.segmentSnippetLoaded === false) {\n    window.segmentSnippetLoader(function () {\n      trackSegmentPage();\n    });\n  } else {\n    trackSegmentPage();\n  }\n};`
    const jsMapText = fs.readFileSync(appJsMapFilePath).toString()
    expect(removeWhitespace(jsMapText)).to.include(removeWhitespace(appCode))
  })
})
