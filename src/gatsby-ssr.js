import React from "react";

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
  const {
    trackPage,
    prodKey,
    devKey,
    host = "https://cdn.segment.io",
    delayLoad,
    delayLoadTime,
    manualLoad,
  } = pluginOptions;

  // ensures Segment write key is present
  if (!prodKey || prodKey.length < 10)
    console.error("segment prodKey must be at least 10 char in length");

  // if dev key is present, ensures it is at least 10 car in length
  if (devKey && devKey.length < 10)
    console.error("if present, devKey must be at least 10 char in length");

  // use prod write key when in prod env, else use dev write key
  // note below, snippet wont render unless writeKey is truthy
  const writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

  // if trackPage option is falsy (undefined or false), remove analytics.page(), else keep it in by default
  // NOTE: do not remove per https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/18
  const includeTrackPage = !trackPage ? "" : "analytics.page();";

  // Segment's minified snippet (version 4.1.0)
  const snippet = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="${host}/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
  ${delayLoad || manualLoad ? `` : `analytics.load('${writeKey}');` }
  }}();`;

  const delayedLoader = `
      window.segmentSnippetLoaded = false;
      window.segmentSnippetLoading = false;

      window.segmentSnippetLoader = function (callback) {
        if (!window.segmentSnippetLoaded && !window.segmentSnippetLoading) {
          window.segmentSnippetLoading = true;

          function loader() {
            window.analytics.load('${writeKey}');
            window.segmentSnippetLoading = false;
            window.segmentSnippetLoaded = true;
            if(callback) {callback()}
          };

          setTimeout(
            function () {
              "requestIdleCallback" in window
                ? requestIdleCallback(function () {loader()})
                : loader();
            },
            ${delayLoadTime} || 1000
          );
        }
      }
      window.addEventListener('scroll',function () {window.segmentSnippetLoader()}, { once: true });
    `;

  // if `delayLoad` option is true, use the delayed loader
  const snippetToUse = `
      ${delayLoad && !manualLoad ? delayedLoader : ""}
      ${snippet}
    `;

  // only render snippet if write key exists
  if (writeKey) {
    setHeadComponents([
      <script
        key="plugin-segment"
        dangerouslySetInnerHTML={{ __html: snippetToUse }}
      />,
    ]);
  }
};
