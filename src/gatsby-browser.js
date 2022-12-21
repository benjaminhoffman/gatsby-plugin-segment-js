// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
exports.onRouteUpdate = ({ prevLocation }, {
  // For now this option is SSR only
  // delayLoad = false,
  // For now this option is SSR only
  // delayLoadTime = 1000,

  trackPage = true,

  // For now this option is SSR only
  // trackOnlyIfLoaded = false,
  // For now this option is SSR only
  // trackPageOnlyIfReady = false,

  // For now, trackPageImmediately should ONLY be a thing that's used in the
  // SSR code, while trackPageOnRouteUpdate is more for the Broser code
  // trackPageImmediately = true,

  trackPageOnRouteUpdate = true,
  trackPageOnRouteUpdateDelay = 50,
  delayLoadUntilActivity = false,
  delayLoadUntilActivityAdditionalDelay = 0,
  includeTitleInTrackPage = false,
}) => {
  console.log({
    prevLocation,
    trackPage,
    trackPageOnRouteUpdate,
    trackPageOnRouteUpdateDelay,
    delayLoadUntilActivity,
    delayLoadUntilActivityAdditionalDelay,
    includeTitleInTrackPage,
  })

  // If this is meant to be responsible for calling "load", then let's do it
  // and maybe also track the page once loading is done.
  if (delayLoadUntilActivity && prevLocation) {
    const additionalLoadDelay = Math.max(0, delayLoadUntilActivityAdditionalDelay || 0)

    console.log({additionalLoadDelay})

    if (additionalLoadDelay) {
      const trackPageCb = () => {
        console.log('track page cb');
        // Just maybe track the page. Since we've already delayed, don't delay more.
        return trackPageFn(additionalLoadDelay)
      }

      setTimeout(
        function () {
          console.log('delayed load timeout')
          const callbackWasQueued = loaderCallback(trackPageCb)
          console.log({callbackWasQueued})
          if (!callbackWasQueued) {
            trackPageCb()
          }
        },
        additionalLoadDelay,
      )
    } else {
      const callbackWasQueued = loaderCallback(trackPageFn)
      if (!callbackWasQueued) {
        // Just maybe track the page
        trackPageFn()
      }
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

  // "page" if necessary. delaoyed if necessary
  function trackPageFn (alreadyDelayedBy = 0) {
    // Do we actually want to track the page?
    if (!(trackPage && trackPageOnRouteUpdate)) {
      return
    }

    // Adding a delay (defaults to 50ms when not provided by plugin option `trackPageDelay`)
    // helps to ensure that the segment route tracking is in sync with the actual Gatsby route.
    // Otherwise you can end up in a state where the Segment page tracking reports
    // the previous page on route change.
    const delay = Math.max(0, trackPageOnRouteUpdateDelay || 0) - alreadyDelayedBy
    console.log({
      delay,
      trackPageOnRouteUpdateDelay,
      alreadyDelayedBy
    })
    if (delay > 0) {
      setTimeout(pageviewCallback, delay)
    } else {
      pageviewCallback()
    }
  }

  // "load" then "page" if necessary
  function loaderCallback (cb) {
    if (window.gatsbyPluginSegmentLoader) {
      window.gatsbyPluginSegmentLoader(cb);
      return true;
    }
  }
};
