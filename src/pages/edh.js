import React, { Component } from 'react'
import EDHBravery from '../Components/MtG/EDHBravery';

import '../sass/edh.scss';

class CmdrEmbed extends Component {
  render() {
    return (
      <div className="page-interior">
        <EDHBravery />
      </div>
    )
  }
}

export default CmdrEmbed
