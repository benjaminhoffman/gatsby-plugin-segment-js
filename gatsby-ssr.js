"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  var trackPage = pluginOptions.trackPage,
      prodKey = pluginOptions.prodKey,
      devKey = pluginOptions.devKey,
      _pluginOptions$host = pluginOptions.host,
      host = _pluginOptions$host === undefined ? "https://cdn.segment.io" : _pluginOptions$host,
      delayLoad = pluginOptions.delayLoad,
      delayLoadTime = pluginOptions.delayLoadTime,
      manualLoad = pluginOptions.manualLoad,
      customSnippet = pluginOptions.customSnippet;

  if (!prodKey || prodKey.length < 10) console.error("segment prodKey must be at least 10 char in length");

  if (devKey && devKey.length < 10) console.error("if present, devKey must be at least 10 char in length");

  var writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  var snippet = void 0;
  if (customSnippet) {
    snippet = eval('`' + customSnippet + '`');
  } else {
    snippet = "!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error(\"Segment snippet included twice.\");else{analytics.invoked=!0;analytics.methods=[\"trackSubmit\",\"trackClick\",\"trackLink\",\"trackForm\",\"pageview\",\"identify\",\"reset\",\"group\",\"track\",\"ready\",\"alias\",\"debug\",\"page\",\"once\",\"off\",\"on\",\"addSourceMiddleware\",\"addIntegrationMiddleware\",\"setAnonymousId\",\"addDestinationMiddleware\"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement(\"script\");n.type=\"text/javascript\";n.async=!0;n.src=\"" + host + "/analytics.js/v1/\"+t+\"/analytics.min.js\";var a=document.getElementsByTagName(\"script\")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION=\"4.1.0\";";

    if (!(delayLoad || manualLoad)) {
      snippet += "analytics.load('" + writeKey + "');";

      if (trackPage) {
        snippet += 'analytics.page();';
      }
    }
  }

  var delayedLoader = "\n      window.segmentSnippetLoaded = false;\n      window.segmentSnippetLoading = false;\n\n      window.segmentSnippetLoader = function (callback) {\n        if (!window.segmentSnippetLoaded && !window.segmentSnippetLoading) {\n          window.segmentSnippetLoading = true;\n\n          function loader() {\n            window.analytics.load('" + writeKey + "');" + (trackPage ? 'window.analytics.page();' : '') + "\n            window.segmentSnippetLoading = false;\n            window.segmentSnippetLoaded = true;\n            if(callback) {callback()}\n          };\n\n          setTimeout(\n            function () {\n              \"requestIdleCallback\" in window\n                ? requestIdleCallback(function () {loader()})\n                : loader();\n            },\n            " + delayLoadTime + " || 1000\n          );\n        }\n      }\n      window.addEventListener('scroll',function () {window.segmentSnippetLoader()}, { once: true });\n    ";

  var snippetToUse = "\n      " + (delayLoad && !manualLoad ? delayedLoader : "") + "\n      " + snippet + "\n    ";

  if (writeKey) {
    setHeadComponents([_react2.default.createElement("script", {
      key: "plugin-segment",
      dangerouslySetInnerHTML: { __html: snippetToUse }
    })]);
  }
};