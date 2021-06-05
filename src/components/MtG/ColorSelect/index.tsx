import React, { Component } from 'react'
import ManaCheckbox from '../ManaCheckbox'
import update from 'immutability-helper'

import * as styles from './styles.module.scss'
import 'mana-font'

interface ColorSelectProps {
  onChange: (value: string[]) => void
  selectedColors: string[]
}

class ColorSelect extends Component<ColorSelectProps, {}> {
  colors: string[]

  constructor(props: ColorSelectProps) {
    super(props)
    this.colors = ['W', 'U', 'B', 'R', 'G']
    this.toggleColor = this.toggleColor.bind(this)
  }

  toggleColor(color: string) {
    return (checked: boolean) => {
      const index = this.props.selectedColors.indexOf(color)
      const add = index === -1 && checked
      const remove = index > -1 && !checked

      if (add) {
        this.props.onChange(
          update(this.props.selectedColors, { $push: [color] })
        )
      } else if (remove) {
        this.props.onChange(
          update(this.props.selectedColors, { $splice: [[index, 1]] })
        )
      }
    }
  }

  render() {
    return (
      <div className={styles.colorSelect}>
        {this.colors.map((color) => {
          return (
            <ManaCheckbox
              key={color}
              symbol={color}
              selected={this.props.selectedColors.indexOf(color) > -1}
              onChange={this.toggleColor(color)}
            ></ManaCheckbox>
          )
        })}
      </div>
    )
  }
}

export default ColorSelect
