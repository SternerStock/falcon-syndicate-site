import React, { Component } from 'react'
import { iframeResizer } from 'iframe-resizer';

class CmdrEmbed extends Component {
  componentDidMount() {
    iframeResizer();
  }
  render() {
    return (
      <div className="page-interior">
        <iframe className="full-embed" src="https://www.falconsyndicate.net/EDH/Bravery"></iframe>
      </div>
    )
  }
}

export default CmdrEmbed
