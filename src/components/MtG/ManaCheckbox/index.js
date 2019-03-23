import React, { Component } from 'react'

import 'mana-font';

class ManaCheckbox extends Component {
  constructor(props) {
    super(props);
  }

  toggleColor(color, checked) {
    var selectedColors = this.state.colors;
    var index = selectedColors.indexOf(color);

    if (checked && index === -1) {
      selectedColors.push(color);
    }

    if (!checked && index > -1) {
      selectedColors.splice(index, 1);
    }
    
    this.setState({
      colors: selectedColors
    });
  }

  render() {
    return (
      <label className="icon-checkbox">
        <input type="checkbox" defaultChecked={true}
          onChange={(e) => this.props.toggleColor(this.props.symbol.toUpperCase(), e.target.checked)} />
        <i className={"ms ms-" + this.props.symbol.toLowerCase() + " ms-cost ms-shadow ms-2x " + (this.props.selected ? "selected" : "") } />
      </label>
    )
  }
}

export default ManaCheckbox
