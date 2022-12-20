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
  if (delayLoadUntilActivity && prevLocation) {
    setTimeout(
      function () {
        if (window.gatsbyPluginSegmentLoader) {
          window.gatsbyPluginSegmentLoader();
        }
      },
      Math.max(0, delayLoadUntilActivityAdditionalDelay || 0)
    )
  }

  // Anything else to do?
  if (!(trackPage && trackPageOnRouteUpdate)) {
    return
  }

  setTimeout(
    function () {
      if (window.gatsbyPluginSegmentPageviewCaller) {
        window.gatsbyPluginSegmentPageviewCaller();
      } else if (window.analytics) {
        window.analytics.page(includeTitleInTrackPage ? document.title : undefined);
      }
    },
    // Adding a delay (defaults to 50ms when not provided by plugin option `trackPageDelay`)
    // helps to ensure that the segment route tracking is in sync with the actual Gatsby route.
    // Otherwise you can end up in a state where the Segment page tracking reports
    // the previous page on route change.
    Math.max(0, trackPageOnRouteUpdateDelay || 0)
  );
};
