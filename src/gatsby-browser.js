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
      window.analytics && window.analytics.page(document.title);
    }, delay);
  }

  // This `if/then` logic relates to the `delayLoad` functionality to help prevent
  // calling `trackPage` twice. If you don't use that feature, you can ignore.
  // Here call `trackPage` only _after_ we change routes (on the client).
  if (prevLocation && window.segmentSnippetLoaded === false) {
    window.segmentSnippetLoader(() => {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};
