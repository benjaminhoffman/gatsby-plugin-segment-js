"use strict";

exports.onRouteUpdate = function (_ref, _ref2) {
  var prevLocation = _ref.prevLocation;
  var trackPage = _ref2.trackPage,
      _ref2$trackPageDelay = _ref2.trackPageDelay,
      trackPageDelay = _ref2$trackPageDelay === undefined ? 50 : _ref2$trackPageDelay;

  function trackSegmentPage() {
    var delay = Math.max(0, trackPageDelay);

    window.setTimeout(function () {
      if (trackPage) {
        window.analytics && window.analytics.page(document.title);
      }
    }, delay);
  }

  if (prevLocation && window.segmentSnippetLoaded === false) {
    window.segmentSnippetLoader(function () {
      trackSegmentPage();
    });
  } else {
    trackSegmentPage();
  }
};