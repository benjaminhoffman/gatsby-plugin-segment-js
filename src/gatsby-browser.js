exports.onRouteUpdate = ({ prevLocation }, { trackPage }) => {
  function trackSegmentPage() {
    if (trackPage) {
      window.analytics && window.analytics.page();
    }
  }

  // This `if/then` logic relates to the `delayLoad` functionality to help prevent
  // calling `trackPage` twice. If you don't use that feature, you can ignore. Here
  // call `trackPage` only _after_ we change routes (on the client).
  if (prevLocation && window.segmentSnippetLoaded === false) {
    window.segmentSnippetLoader(() => {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};
