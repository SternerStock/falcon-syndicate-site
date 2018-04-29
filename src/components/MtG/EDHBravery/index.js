import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import CmdrSelect from '../CmdrSelect'

import 'keyrune';
import 'mana-font';

class EDHBravery extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <CmdrSelect />
      </div>
    )
  }
}

export default EDHBravery
