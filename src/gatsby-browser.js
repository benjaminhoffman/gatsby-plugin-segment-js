exports.onRouteUpdate = ({ prevLocation }, { trackPage }) => {
  function trackSegmentPage() {
    if (trackPage) {
      window.analytics && window.analytics.page();
    }
  }

  // If this is a second page loaded via Gatsby routing, and the delayed loader has 
  // not been loaded yet, we want to load it and then track the page.
  if (prevLocation && window.segmentSnippetLoaded === false) {
    window.segmentSnippetLoader(() => {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};
