module.exports = {
    siteMetadata: {
        title: `Gatsby Default Starter`,
        description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
        author: `@gatsbyjs`
    },
    plugins: [
        {
            resolve: `gatsby-plugin-segment-js`,
            options: {
                // your segment write key for your production environment
                // when process.env.NODE_ENV === 'production'
                // required; non-empty string
                prodKey: `SEGMENT_PRODUCTION_WRITE_KEY`,

                // if you have a development env for your segment account, paste that key here
                // when process.env.NODE_ENV === 'development'
                // optional; non-empty string
                devKey: `SEGMENT_DEV_WRITE_KEY`,

                // whether you want to include analytics.page()
                // optional; boolean that defaults to true
                // if false, then don't forget to manually add it to your codebase manually!
                trackPage: true
            }
        },
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`
            }
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/gatsby-icon.png` // This path is relative to the root of the site.
            }
        }
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ]
};
