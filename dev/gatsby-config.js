/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: require.resolve('..'),
      options: {
        prodKey: `Sy0LGznWXipqk72a6SJ8Dd1wqAonKqxR`,
        devKey: `Sy0LGznWXipqk72a6SJ8Dd1wqAonKqxR`,
        trackPage: true,
        trackPageOnRouteUpdateDelay: 5000,

        delayLoad: true,
        delayLoadTime: 5000,

        delayLodUntilActivity: true,
        delayLoadUntilActivityAdditionalDelay: 1000,
      }
    },
  ],
}
