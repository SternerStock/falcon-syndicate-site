import React, { Component } from 'react'
import Layout from "../components/layout"
import { iframeResizer } from 'iframe-resizer';

class CmdrEmbed extends Component {
  componentDidMount() {
    iframeResizer();
  }
  render() {
    return (
      <Layout>
        <div className="page-interior">
          <iframe className="full-embed" src="https://www.falconsyndicate.net/EDH/Bravery"></iframe>
        </div>
      </Layout>
    )
  }
}

export default CmdrEmbed
