import React, { Component } from 'react'
import ManaCheckbox from '../ManaCheckbox'

//import styles from 'styles.module.scss'
import 'mana-font';
import 'keyrune';

class EdhRando extends Component {
  constructor(props) {
    super(props);
    this.toggleColor = this.toggleColor.bind(this);
    this.state = {
      colors: ["W", "U", "B", "R", "G"]
    };
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
      <div>
        <ManaCheckbox symbol="W" toggleColor={this.toggleColor} selectedColors={this.state.colors}></ManaCheckbox>
        <ManaCheckbox symbol="U" toggleColor={this.toggleColor} selectedColors={this.state.colors}></ManaCheckbox>
        <ManaCheckbox symbol="B" toggleColor={this.toggleColor} selectedColors={this.state.colors}></ManaCheckbox>
        <ManaCheckbox symbol="R" toggleColor={this.toggleColor} selectedColors={this.state.colors}></ManaCheckbox>
        <ManaCheckbox symbol="G" toggleColor={this.toggleColor} selectedColors={this.state.colors}></ManaCheckbox>
      </div>
    )
  }
}

export default EdhRando
