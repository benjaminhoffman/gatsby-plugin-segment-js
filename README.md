# gatsby-plugin-segment-js

A lightweight & feature-rich Gatsby plugin to easily add [Segment JS snippet](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/) to your site.

## We need your help! 🙏🏽
We're looking for active contributors to this repo!  If you're interested, simply open an issue or PR of your own and indicate that you'd like to help.  Check out our open issues and PRs.  We also need to beef up testing.  Contributors get to:
- manage versioning and deploys by publishing new versions to NPM
- determine which features get launched by merging pull requests
- oversee the community through commenting on and managing pull requests and issues

⚜️ Being an active contributor is great for the community and your engineering resume.⚜️

## Features

Packed with features:

- use multiple write keys (one for prod env, another optional one for dev)
- disable page view tracking (just in case you want to add it later manually)
- will use a default Segment code snippet (currently `v4.15.3`), or you can provide your own custom snippet

## Install

- NPM: `$ npm install --save gatsby-plugin-segment-js`
- YARN: `$ yarn add gatsby-plugin-segment-js`

## How to use

### Setup

In your gatsby-config.js file:

```javascript
plugins: [
  {
    resolve: `gatsby-plugin-segment-js`,
    options: {
      // your segment write key for your production environment
      // when process.env.NODE_ENV === 'production'
      // required; non-empty string
      prodKey: 'SEGMENT_PRODUCTION_WRITE_KEY',

      // if you have a development env for your segment account, paste that key here
      // when process.env.NODE_ENV === 'development'
      // optional; non-empty string
      devKey: 'SEGMENT_DEV_WRITE_KEY',

      // Boolean indicating if you want this plugin to perform any automated analytics.page() calls
      // at all, or not.
      // If set to false, see below on how to track pageviews manually.
      // 
      // This plugin will attempt to intelligently prevent duplicate page() calls.
      // 
      // Default: true
      trackPage: true,

      // Boolean indicating if you want this plugin to perform a page() call immediately once the snippet
      // is loaded.
      // 
      // You might want to disable this if you *only* want page() calls to occur upon Client-side routing
      // updates. See `trackPageOnRouteUpdate` option.
      // 
      // This plugin will still attempt to intelligently prevent duplicate page() calls.
      // 
      // Default: true
      trackPageImmediately: true,

      // Boolean indicating whether to ignore `page` calls by this plugin before we call `analytics.load`
      // and/or the `ready` event has been emitted by `analytics`.
      // 
      // Useful in some cases to prevent issues "queuing" `page` events before Segment is fully loaded.
      trackPageOnlyIfReady: false,

      // Boolean indicating whether to perform any page() calls during Client-side routing updates.
      // 
      // You might want to disable `trackPageImmediately` if you *only* want page() calls to occur upon
      // Client-side routing updates.
      // 
      // This plugin will still attempt to intelligently prevent duplicate page() calls.
      // 
      // Default: true
      trackPageOnRouteUpdate: true,

      // Number indicating what delay (in ms) should be used when calling analytics.page() in response
      // to a Gatsby `onRouteUpdate` event. This can help to ensure that the segment route tracking is 
      // in sync with the actual Gatsby route. Otherwise you can end up in a state where the Segment
      // page tracking reports the previous page on route change.
      // 
      // See https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/ for more information.
      // 
      // Default: 50
      trackPageOnRouteUpdateDelay: 50,

      // Boolean indicating whether or not to add the document.title as the first argument to
      // the analytics.page() calls. Segment uses some san defaults, but some users of this plugin
      // have wanted to do this in the past.
      // 
      // E.g `analytics.page(document.title)`
      // 
      // Default: false
      includeTitleInTrackPage: false,
      
      // Boolean indicating whether to call analytics.load() immediately, or to delay it by a specified
      // number of ms. Can be useful if you want to wait a specifc amount of time before calling
      // analytics.load() and kicking off the activity that occurs with that call.
      // 
      // Default: false
      delayLoad: false,

      // Number indicating (in ms) how long to wait for before analytics.load() will be called if
      // the `delayLoad` option is set to `true`.
      // 
      // Default: 1000
      delayLoadDelay: 1000,

      // Boolean indicating whether to delay calling analytics.load() until either:
      // 1) The User interacts with the page by scrolling
      // OR
      // 2) The User triggers a Gatsby route change.
      // 
      // The `delayLoad` option can be used in addition to this option.
      // 
      // NOTE: 
      // The route change will only be triggered if you leverage client-side routing (ie, Gatsby <Link>)
      // So if you leverage server-side routing with this feature, only a User scroll will trigger
      // the `load` call. This is because client-side routing does not do
      // a full page refresh, but server-side routing does. Therfore server-side routing will never
      // appear to have been triggered by a User interaction.
      // 
      // This is an advanced feature most often used to try to help improve your website's TTI (for SEO, UX, etc).
      // 
      // See here for more context:
      // Client-side routing and browser code: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/
      // GIF: https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/19#issuecomment-559569483
      // TTI: https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md#performance
      // Problem/solution: https://marketingexamples.com/seo/performance
      delayLoadUntilActivity: false,

      // Number indicating (in ms) any additional delay to wait before calling analytics.load()
      // after User "activity" has occurred in conjunction with the `delayLoadUntilActivity` option.
      // 
      // Default: 0
      delayLoadUntilActivityAdditionalDelay: 0,

      // Whether to completely skip calling `analytics.load({writeKey})`.
      // ADVANCED FEATURE: only use if you are calling `analytics.load({writeKey})` manually
      // elsewhere in your code or are using a library
      // like: https://github.com/segmentio/consent-manager that will call it for you.
      // Useful for only loading the tracking script once a user has opted in to being tracked, for example.
      manualLoad: false,

      // If you need to proxy events through a custom endpoint,
      // add a `host` property (defaults to https://cdn.segment.io)
      // Segment docs:
      //   - https://segment.com/docs/connections/sources/custom-domains
      //   - https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#proxy
      host: 'https://override-segment-endpoint',

      // This package will use a default version of Segment's code snippet, but
      // if you'd like to include your own you can do so here. This is useful if
      // the version this package uses is different than the one you'd like to
      // use...or you need to do something custom.
      // While you should NOT use a back-ticked template string here, the string
      // will be evaluated as template literal with the following variables
      // available to it:
      //    - `writeKey`: The appropriate value from the `prodKey` and `devKey`
      //      options, based on the `NODE_ENV`
      //    - any of the other options passed here
      // 
      // NOTES: 
      // - If you provide a custom snippet, an immediate call to
      //   `analytics.load()` and/or `analytics.page()` will not be added by
      //   this plugin. You can - of course - add them yourself to your snippet.
      // - If your custom snippet does not include a call to `analytics.load()`
      //   then you must either:
      //   1. Manually load it and set the `manualLoad` option here to `true`
      //   2. Use the `delayLoad` option here
      customSnippet: '!function(){var analytics=window.analytics||[];...;analytics.load("${writeKey}");analytics.page();}}();'
    }
  }
];
```

### Loading

A typical Segment setup using this plugin will add an initial "snippet" for Segment to the page. Once that snippet is there, it needs to be "loaded" completely by making a call to `analytics.load(<your segment key here>)` before it will actually send over any events to Segment. This `load` call causes a flurry of XHR calls, and some people seem to be quite concerned with having those calls not occur until after some delay - usually for SEO scores, though it's not clear to me if the way Segment handles `load` calls will impact TTI, etc. Regardless, if you want this plugin to delay calling `load`, you have 2 options:
    1. `delayLoad`: This will cause a straightforward delay before `load` is called. Use in conjunction with `delayLoadDelay` to tweak the amount of the delay.
    2. `delayLoadUntilActivity`: This will wait to call `load` until __either__ (a) the user triggers a "scroll" event or (b) the user triggers route change. This option will take precendence over the `delayLoad` option.

### Track Events

If you want to track events, you simply invoke Segment as normal in your React components — (`window.analytics.track('Event Name', {...})` — and you should see the events within your Segment debugger! For example, if you wanted to track events on a click, it may look something like this:

```javascript
class IndexPage extends React.Component {
    ...
    _handleClick() {
        window.analytics.track("Track Event Fired", {
            userId: user.id,
            gender: 'male',
            age: 33,
        });
    }
    render() {
        return (
            <p>
                <Link onClick={this._handleClick} to="/">
                    Click here
                </Link>{" "}
                to see a track event
            </p>
        );
    }
}
```

### Track Pageviews

If you want to track pageviews automatically, set (or leave) `trackPage` to `true` in your `gatsby-config.js` file. What we mean by _"automatically"_ is that we will intelligently decide how or when to invoke `window.analytics.page()` for you.

This involves identifying if the last `page` call was made while the User was on the same `location.pathname` as the previous `page` call. If they appear to be the same, we will skip the duplicate call.

This plugin can also leverage Gatsby's `onRouteUpdate` API in the `gatsby-browser.js` file ([link][on-route-update]) if you so desire. This is accomplished by setting (or leaving) the `trackPageOnRouteUpdate` to `true`. If this option is enabled, we will make a `page` call every time that the `onRouteUpdate` handler is called. That includes the initial route, and any route changes.

If you only want to use this plugin to inject and load Segment, and not make any `page` calls, this can be done. Just set `trackPage: false`. But then you will have to make `page` calls yourself in your `gatsby-browser.js` file, like this:

```javascript
// gatsby-browser.js
exports.onRouteUpdate = () => {
  window.analytics && window.analytics.page();
};
```

[on-route-update]: https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate