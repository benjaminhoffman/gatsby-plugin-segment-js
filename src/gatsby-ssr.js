// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
import React from "react";

export function onRenderBody({ setHeadComponents }, pluginOptions) {
  const {

    prodKey,
    devKey,
    host = "https://cdn.segment.io",

    trackPage = true,
    trackPageImmediately = true,
    trackPageOnlyIfReady = false,

    // This is ONLY for the Browser side code
    // trackPageOnRouteUpdateDelay = true,

    includeTitleInTrackPage = true,

    delayLoad,
    delayLoadTime,

    delayLoadUntilActivity,
    delayLoadUntilActivityAdditionalDelay = 0,

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

  const loadImmediately = !(delayLoad || delayLoadUntilActivity || manualLoad);
  const reallyTrackPageImmediately = trackPageImmediately && trackPage

  console.log({
    trackPage,
    trackPageImmediately,

    trackPageOnlyIfReady,

    loadImmediately,
    reallyTrackPageImmediately,

    includeTitleInTrackPage,

    delayLoad,
    delayLoadTime,

    delayLoadUntilActivity,
    delayLoadUntilActivityAdditionalDelay,

    manualLoad,
  })

  const idempotentPageviewCode = `(function () {
    let lastPageviewPath;
    window.gatsbyPluginSegmentPageviewCaller = function () {
      console.log({
        gatsbyPluginSegmentPageviewCaller: true,
        lastPageviewPath,
        thisPageviewPath: window.location.pathname,
        // trackOnlyIfReady,
      });

      if (!window.analytics) {
        return
      }${ trackPageOnlyIfReady ? `
      if (!gatsbyPluginSegmentReady) {
        console.log('gatsbyPluginSegmentReady seems falsey', gatsbyPluginSegmentReady);
        return
      }` : ''}

      if (!gatsbyPluginSegmentReady) {
        console.log('gatsbyPluginSegmentReady seems falsey', gatsbyPluginSegmentReady);
        return
      }

      let thisPageviewPath = window.location.pathname;
      if (thisPageviewPath === lastPageviewPath) {
        console.log("paths are the same. not duplciating page view");
        return
      }
      console.log("making page call with " + thisPageviewPath);
      lastPageviewPath = thisPageviewPath;
      window.analytics.page(${ includeTitleInTrackPage ? 'document.title' : ''});
    };
  })();`;

  let delayedLoadingCode = `(function () {
    let segmentLoaded = false;
    let segmentLoading = false;
    var callbacks = [];
    function safeExecCallback (cb, i) {
      if (typeof cb === "function") {
        console.log("about to do callback " + i);
        cb();
      }
    }

    window.gatsbyPluginSegmentLoader = function (cb) {
      console.log({
        gatsbyPluginSegmentLoader: true,
        segmentLoaded,
        segmentLoading,
        cb,
        callbacks,
      })

      if (segmentLoaded) {
        console.log("segment loaded already. doing callbacks");
        safeExecCallback(cb);
        return;
      }

      callbacks.push(cb);
      if (segmentLoading) {
        console.log("segment still loading. added to callbacks");
        return;
      }

      segmentLoading = true;

      function loader() {
        console.log("loader called");
        if (typeof window.analytics.load !== "function") {
          console.error("Gatsby Plugin Segment: analytics.load is not a function.");
          return
        }
        gatsbySegmentLoad('${writeKey}');
        segmentLoading = false;
        segmentLoaded = true;
        let cb;
        let i = 0;
        while ((cb = callbacks.pop()) != null) {
          safeExecCallback(cb, ++i);
        }${reallyTrackPageImmediately ? `
        window.gatsbyPluginSegmentPageviewCaller();` : ''}
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(loader);
      } else {
        loader();
      }
    };`
    if (delayLoadUntilActivity) {
      delayedLoadingCode += `
      console.log("adding scroll event listener");
    window.addEventListener(
      "scroll",
      function () {
        setTimeout(
          function () {
            console.log("scroll event listener activated!");
            window.gatsbyPluginSegmentLoader && window.gatsbyPluginSegmentLoader();
          },
          ${Math.max(0, delayLoadUntilActivityAdditionalDelay || 0)},
        )
      },
      { once: true },
    );`
    } else if (delayLoad) {
      delayedLoadingCode += `
      console.log("adding timeout loader");
    setTimeout(
      function () {
        console.log("timeout loader called!");
        window.gatsbyPluginSegmentLoader && window.gatsbyPluginSegmentLoader();
      },
      ${delayLoadTime || 1000},
    );`
    }
  delayedLoadingCode += `
  })();`;

  let snippet
  if (customSnippet) {
    snippet = eval('`' + customSnippet + '`')
    snippet += `
    window.analytics.ready(function () {
      console.log("READY");
      gatsbyPluginSegmentReady = true;
    })
    `
  } else {
    // Segment's snippet (version 4.15.3)
    // If this is updated, probably good to update the README to include the version
    snippet = `(function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="${host}/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="${writeKey}";analytics.SNIPPET_VERSION="4.15.3";`
    if (loadImmediately) {
      snippet += `
      console.log("loading immediately!");
    gatsbySegmentLoad('${writeKey}');`
      // Only track if it has been loaded
      if (reallyTrackPageImmediately) {
        snippet += `
        console.log("calling page immediately");
    window.gatsbyPluginSegmentPageviewCaller();`
      }
    }
    snippet += `
  }})();`
  }

  const gatsbySegmentLoadStuff = `let gatsbyPluginSegmentReady = ${ trackPageOnlyIfReady ? 'false' : 'true' };
  function gatsbySegmentLoad (writeKey) {
    if (window.analytics && window.analytics.load) {
      window.analytics.load(writeKey);
    }
    gatsbyPluginSegmentReady = true;
  };
  `

  // if `delayLoad` option is true, use the delayed loader
  const pluginCode = `
(function () {
  ${gatsbySegmentLoadStuff}
  ${idempotentPageviewCode}
  ${(delayLoad || delayLoadUntilActivity) && !manualLoad ? delayedLoadingCode : ""}
  ${snippet}
})();`;

  // only render snippet if write key exists
  if (writeKey) {
    setHeadComponents([
      <script
        key="plugin-segment"
        dangerouslySetInnerHTML={{ __html: pluginCode }}
      />,
    ]);
  }
}
