exports.onRouteUpdate = ({}, { trackPage }) => {
    if (trackPage) {
        window.analytics && window.analytics.page();
    }
};
