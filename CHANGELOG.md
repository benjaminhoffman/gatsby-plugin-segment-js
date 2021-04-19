## 3.6.1

- Added correct peer dependencies(thanks @LekoArts) and updated readme to show correct usage of analytics.load(thanks @seankovacs)
## 3.6.0

- Added `trackPageDelay` option that allows specifying the amount of time to wait before calling `trackPage`. Thanks to @sreucherand!

## 3.5.0

- Added `addSourceMiddleware`, `addIntegrationMiddleware`, `setAnonymousId`, and `addDestinationMiddleware` methods to Segment snippet

## 3.4.0

- Adds `manualLoad` plugin option to allow users to manually load Segment snippet, e.g. waiting for a user to opt into being tracked for GDPR

## 3.3.1

- Send `document.title` with page tracking events for enhanced event data

## 3.3.0

- Adds a 50ms delay to page tracking calls to prevent erroneously sending duplicate page events

## 3.2.1

- Delete package-lock.json

## 3.2.0

- Bug: Built files not uploaded to npm

## 3.1.1

- Updated README.md

## 3.1.0

- NEW FEATURE: we've added one new feature with two options: `delayLoad` and its friend `delayLoadTime`. When the former is set to true, we will delay loading Segment `delayLoadTime` seconds _after_ either a route change or user page scroll, whichever comes first. This functionality was built to help with SEO, UX, etc by preventing Segment from increasing your TTI.

## 3.0.0

- BREAKING CHANGE: you must now explicitly pass `trackPage: true` in your `gatsby-config.js` file if you want us to automatically track pageviews

- BREAKING CHANGE: previously we would only fire `analytics.page()` on the initial page load. But now we will invoke it on each route transition. See README for more details.

- Added example dir

- Expanded README.md and adds CHANGELOG.md

## 2.1.2

- Bumps Segment snippet from 4.0.0 to 4.1.0

## 2.0.0

- Basic version working
