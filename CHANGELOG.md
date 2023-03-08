## 5.0.0
- BREAKING CHANGE: The `options` now support more complex things, and some thing are renamed. Please check out all of the options in the `README`.

## 4.0.3
- Ensure that cb is a function before calling it. https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/57

## 4.0.2
- Fix syntax error in delayed loader code. https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/56

## 4.0.1
- Better idempotency. https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/54

## 4.0.0

- Add `includeTitleInPageCall` option, and set it to `true` by default. Strictly speaking, this was a "breaking change", hence the new major version.
- Fix bug where `analytics.page()` would be called twice.

## 3.7.2

- Updated `gatsby` peer dependency to support `^2 || ^3 || ^4 || ^5` https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/52

## 3.7.1

- Updated `gatsby` peer dependency to support `^2 || ^3 || ^4` https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/43

## 3.7.0

- Updated default snippet to `4.13.2`
- Added `customSnippet` option to allow for providing arbitrary snippet code
- Decreased NPM package size
- Some small optimizations
- Added linting for developers

- Added correct peer dependencies(thanks @LekoArts) and updated readme to show correct usage of analytics.load(thanks @seankovacs)

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
