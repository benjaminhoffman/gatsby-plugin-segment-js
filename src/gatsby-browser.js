// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
exports.onRouteUpdate = ({ prevLocation }, {
  trackPage,
  trackPageOnRouteUpdate = true,
  trackPageOnRouteUpdateDelay = 50,
  delayLoadUntilActivity = false,
  delayLoadUntilActivityAdditionalDelay = 0,
  includeTitleInTrackPage,
}) => {

  // If this is meant to be responsible for calling "load", then let's do it
  // and maybe also track the page
  if (delayLoadUntilActivity) {
    if (!prevLocation) {
      return
    }
    const delay = Math.max(0, delayLoadUntilActivityAdditionalDelay || 0)
    if (delay) {
      setTimeout(loaderCallback, delay)
    } else {
      loaderCallback()
    }
    return
  }

  // Just maybe track the page
  trackPageFn()
  return

  function pageviewCallback () {
    if (window.gatsbyPluginSegmentPageviewCaller) {
      window.gatsbyPluginSegmentPageviewCaller();
    } else if (window.analytics) {
      window.analytics.page(includeTitleInTrackPage ? document.title : undefined);
    }
  }

  function trackPageFn () {
    // Do we actually want to track the page?
    if (!(trackPage && trackPageOnRouteUpdate)) {
      return
    }

    // Adding a delay (defaults to 50ms when not provided by plugin option `trackPageDelay`)
    // helps to ensure that the segment route tracking is in sync with the actual Gatsby route.
    // Otherwise you can end up in a state where the Segment page tracking reports
    // the previous page on route change.
    const delay = Math.max(0, trackPageOnRouteUpdateDelay || 0)

    if (delay) {
      setTimeout(pageviewCallback, delay)
    } else {
      pageviewCallback()
    }
  }

  function loaderCallback () {
    if (window.gatsbyPluginSegmentLoader) {
       window.gatsbyPluginSegmentLoader(trackPageFn);
    }
  }
};
