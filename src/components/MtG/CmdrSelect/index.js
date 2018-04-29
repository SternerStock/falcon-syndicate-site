import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import Select from 'react-select'

import 'keyrune';
import 'mana-font';

class CmdrSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commanders: [],
      partners: [],
      cmdr1: {},
      cmdr2: {}
    };
    
    this.loadCommanders();
  }

  loadCommanders() {
    const urlBase = 'http://localhost:61650/api';

    fetch(urlBase + "/Cards/Commanders")
    .then(response => response.json())
    .then(commanders => {
      this.setState({
        commanders: commanders,
        partners: commanders.filter(cmdr => cmdr.hasPartner)
      });
    });
  }

  render() {
    return (
      <div className="cmdr-select">
        <Select options={this.state.commanders}
          placeholder="Surprise me"
          onChange={(cmdr) => this.setState({cmdr1: cmdr})}
          isOptionDisabled={(option) => option.value === this.state.cmdr2.value} />
        {this.state.cmdr1.hasPartner ?
          <Select options={this.state.partners}
            placeholder="Select a partner (optional)"
            onChange={(cmdr) => this.setState({cmdr2: cmdr})}
            isOptionDisabled={(option) => option.value === this.state.cmdr1.value} />
        : ''}
      </div>
    )
  }
}

export default CmdrSelect
