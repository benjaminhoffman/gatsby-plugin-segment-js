exports.onRouteUpdate = ({ prevLocation }, { trackPage }) => {
  function trackSegmentPage() {
    if (trackPage) {
      window.analytics && window.analytics.page();
    }
  }

  if (
    prevLocation &&
    window.segmentSnippetLoaded === false &&
    wiindow.segmentSnippetLoading === false
  ) {
    window.segmentSnippetLoader(() => {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};
