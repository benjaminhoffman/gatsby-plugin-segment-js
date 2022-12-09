// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
exports.onRouteUpdate = ({ prevLocation }, { trackPage, trackPageDelay = 50 }) => {
  if (!trackPage) {
    return
  }

  function trackSegmentPage() {
    // Adding a delay (defaults to 50ms when not provided by plugin option `trackPageDelay`)
    // ensure that the segment route tracking is in sync with the actual Gatsby route
    // (otherwise you can end up in a state where the Segment page tracking reports
    // the previous page on route change).
    const delay = Math.max(0, trackPageDelay)

    window.setTimeout(() => {
      window.gatsbyPluginSegmentPageviewCaller && window.gatsbyPluginSegmentPageviewCaller(!!prevLocation);
    }, delay);
  }

  if (window.gatsbyPluginSegmentSnippetLoader) {
    window.gatsbyPluginSegmentSnippetLoader(trackSegmentPage);
  } else {
    trackSegmentPage();
  }
};
