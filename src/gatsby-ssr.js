import React from "react";

exports.onRenderBody = ({ setHeadComponents }, pluginOptions) => {
    const { trackPage, prodKey, devKey, loadOnRender } = pluginOptions;

    // ensures Segment write key is present
    if (!prodKey || prodKey.length < 10)
        console.error("segment prodKey must be at least 10 char in length");

    // if dev key is present, ensures it is at least 10 car in length
    if (devKey && devKey.length < 10)
        console.error("if present, devKey must be at least 10 char in length");

    // use prod write key when in prod env, else use dev write key
    // note below, snippet wont render unless writeKey is truthy
    const writeKey = process.env.NODE_ENV === "production" ? prodKey : devKey;

    // Stops initial loading of scripts, this lets you build functionality for cookie settings to comply with EU cookie law.
    //  window.analytics.load() can then be called manually in app
    const includeLoadOnRender = !loadOnRender ? "" : `analytics.load('${writeKey}');`;

    // if trackPage option is falsy (undefined or false), remove analytics.page(), else keep it in by default
    const includeTrackPage = !trackPage || !loadOnRender ? "" : "analytics.page();";

    // Segment's minified snippet (version 4.1.0)

    let snippet = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
    ${includeLoadOnRender}
    ${includeTrackPage}
    }}();
  `;


    // only render snippet if write key exists
    if (writeKey) {
        setHeadComponents([
            <script
                key="plugin-segment"
                dangerouslySetInnerHTML={{ __html: snippet }}
            />
        ]);
    }
};
