// For future developers: create a .env file in this directory an populate it
// with the ENV keys below to use them and not risk checking in your keys to
// version control
require('dotenv').config()

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
        prodKey: process.env.SEGMENT_KEY_PROD || 'SEGMENT_PROD_KEY',
        devKey: process.env.SEGMENT_KEY_DEV || 'SEGMENT_DEV_KEY',

        trackPage: true,
        trackPageImmediately: false,
        trackPageOnRouteUpdateDelay: 5000,

        delayLoad: true,
        delayLoadTime: 5000,

        delayLoadUntilActivity: true,
        delayLoadUntilActivityAdditionalDelay: 1000,
      }
    },
  ],
}
