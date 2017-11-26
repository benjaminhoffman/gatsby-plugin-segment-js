import React from "react";

exports.onRenderBody = ({ setHeadComponents, pluginOptions }) => {
  const { trackPage, prod_key, dev_key } = pluginOptions;

  // ensures Segment write key is present
  assert(prod_key.length, "segment prod_key option cannot be blank");

  // determines whether to use production or development write key
  const writeKey = process.env.NODE_ENV === "production" ? prod_key : dev_key;

  // determines whether we should include Segment's page call
  const includeTrackPage = trackPage ? "analytics.page();" : null;

  // Segment's minified snippet (version 4.0.0)
  const snippet = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0"; analytics.load(${
    writeKey
  }); ${includeTrackPage}}}();`;

  setHeadComponents([
    <script
      key="plugin-segment"
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  ]);
};
