exports.onRouteUpdate = ({ prevLocation }, { trackPage }) => {
  function trackSegmentPage() {
    // Adding a 50ms delay ensure that the segment route tracking is in sync with
    // the actual Gatsby route (otherwise you can end up in a state where the Segment
    // page tracking reports the previous page on route change).
    window.setTimeout(() => {
      if (trackPage) {
        window.analytics && window.analytics.page(document.title);
      }
    }, 50);
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
