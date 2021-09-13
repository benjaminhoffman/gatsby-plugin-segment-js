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
    customSnippet,
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

  let snippet
  if (customSnippet) {
    snippet = eval('`' + customSnippet + '`')
  } else {
    // Segment's snippet (version 4.13.2)
    // If this is updated, probably good to update the README to include the version
    snippet = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="${host}/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${writeKey}";analytics.SNIPPET_VERSION="4.13.2";`

    // Should it be loaded right away?
    if (!(delayLoad || manualLoad)) {
      snippet += `\nanalytics.load('${writeKey}');`
      // Track the page right away, too?
      if (trackPage) {
        snippet += 'analytics.page();'
      }
    }
    snippet += '\n}}();'
  }

  const delayedLoader = `
      window.segmentSnippetLoaded = false;
      window.segmentSnippetLoading = false;

      window.segmentSnippetLoader = function (callback) {
        if (!window.segmentSnippetLoaded && !window.segmentSnippetLoading) {
          window.segmentSnippetLoading = true;

          function loader() {
            window.analytics.load('${writeKey}');${ trackPage ? 'window.analytics.page();' : ''}
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
