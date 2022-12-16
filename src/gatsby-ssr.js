// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
import React from "react";

export function onRenderBody({ setHeadComponents }, pluginOptions) {
  const {
    trackPage,
    prodKey,
    devKey,
    host = "https://cdn.segment.io",
    delayLoad,
    delayLoadTime,
    manualLoad,
    customSnippet,
    includeTitleInPageCall = true,
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

  const idempotentPageviewCode = `(function () {
    let segmentPageviewCalledAlready = false;
    window.gatsbyPluginSegmentPageviewCaller = function (force) {
      if (!window.analytics) {
        return
      }
      if (segmentPageviewCalledAlready === true && !force) {
        return
      }
      segmentPageviewCalledAlready = true;
      window.analytics.page(${ includeTitleInPageCall ? 'document.title' : ''});
    };
  })();`;

  let snippet
  if (customSnippet) {
    snippet = eval('`' + customSnippet + '`')
  } else {
    // Segment's snippet (version 4.15.3)
    // If this is updated, probably good to update the README to include the version
    snippet = `(function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="${host}/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${writeKey}";analytics.SNIPPET_VERSION="4.15.3";`
    // Should it be loaded right away?
    if (!(delayLoad || manualLoad)) {
      snippet += `\nanalytics.load('${writeKey}');`
      // Track the page right away, too?
      if (trackPage) {
        snippet += 'window.gatsbyPluginSegmentPageviewCaller();'
      }
    }
    snippet += '}})();'
  }

  const delayedLoader = `(function () {
    let segmentSnippetLoaded = false;
    let segmentSnippetLoading = false;
    let segmentSnippetCallbacks = [];

    window.gatsbyPluginSegmentSnippetLoader = function (cb) {
      if (segmentSnippetLoaded) {
        cb();
        return
      }

      if (segmentSnippetLoading) {
        segmentSnippetCallbacks.push(cb);
        return
      }

      segmentSnippetLoading = true;

      function loader() {
        window.analytics.load('${writeKey}');
        segmentSnippetLoading = false;
        segmentSnippetLoaded = true;
        let cb;
        while ((cb = segmentSnippetCallbacks.pop()) != null) {
          cb();
        }
        ${
          // Do this *after* the callbacks run, so that if one of them was
          // going to do a page() call and FORCE it, it would not result in 2 page()
          // calls
          trackPage ? 'window.gatsbyPluginSegmentPageviewCaller();' : ''
        }
      };

      setTimeout(
        function () {
          "requestIdleCallback" in window
            ? requestIdleCallback(loader)
            : loader();
        },
        ${delayLoadTime} || 1000
      );
    };
    window.addEventListener("scroll",function () {window.gatsbyPluginSegmentSnippetLoader()}, { once: true });
  })();`;

  // if `delayLoad` option is true, use the delayed loader
  const snippetToUse = `
(function () {
  ${idempotentPageviewCode}
  ${delayLoad && !manualLoad ? delayedLoader : ""}
  ${snippet}
})();`;

  // only render snippet if write key exists
  if (writeKey) {
    setHeadComponents([
      <script
        key="plugin-segment"
        dangerouslySetInnerHTML={{ __html: snippetToUse }}
      />,
    ]);
  }
}
