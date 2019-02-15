## 3.0.0

-   BREAKING CHANGE: you must now explicitly pass `trackPage: true` in your `gatsby-config.js` file if you want us to automatically track pageviews

-   BREAKING CHANGE: previously we would only fire `analytics.page()` on the initial page load. But now we will invoke it on each route transition. See README for more details.

-   Added example dir

-   Expanded README.md and adds CHANGELOG.md

## 2.1.2

-   Bumps Segment snippet from 4.0.0 to 4.1.0

## 2.0.0

-   Basic version working
