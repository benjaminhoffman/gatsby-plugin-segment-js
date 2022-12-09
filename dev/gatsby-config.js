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
        prodKey: `ADD_API_KEY_PROD`,
        devKey: `ADD_API_KEY_DEV`,
        trackPage: true
      }
    },
  ],
}
