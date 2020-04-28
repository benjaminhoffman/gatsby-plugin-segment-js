"use strict";

exports.onRouteUpdate = function (_ref, _ref2) {
  var prevLocation = _ref.prevLocation;
  var trackPage = _ref2.trackPage;

  function trackSegmentPage() {
    if (trackPage) {
      window.analytics && window.analytics.page();
    }
  }

  if (prevLocation && window.segmentSnippetLoaded === false) {
    window.segmentSnippetLoader(function () {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};