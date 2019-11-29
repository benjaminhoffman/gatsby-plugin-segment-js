import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

class IndexPage extends React.Component {
  _handleClick() {
    // Invoke `window.analytics.track` and send any
    // add'l properties you'd like to send
    window.analytics.track("Track Event Fired", {
      plugin: "gatsby-plugin-segment",
      author: "Ben Hoffman",
      href: "https://github.com/benjaminhoffman/gatsby-plugin-segment"
    });

    console.log(`
          Check your network tab of your dev tools...
          you should see the track call there. And if
          you put in the correct API keys, you should also
          see the track event show up in your Segment account.
      `);
  }

  render() {
    return (
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        {/* Here is where we invoke our Segment track event
                via a click handler on Gatsby's <Link/> component */}
        <p>
          <Link onClick={this._handleClick} to="/">
            Click here
          </Link>{" "}
          to see a track event
        </p>
        <Link to="/page-2/">Go to page 2</Link>
        <br />
        <br />
        <a href="/page-2/">Check full page refresh</a>
        <br />
      </Layout>
    );
  }
}

export default IndexPage;
