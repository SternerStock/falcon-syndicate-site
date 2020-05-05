import React, { Component } from 'react'

import styles from './styles.module.scss'
import 'mana-font'

interface ManaCheckProps {
  toggleColor: Function
  symbol: string
  selectedColors: string[]
}

class ManaCheckbox extends Component<ManaCheckProps, {}> {
  constructor(props: ManaCheckProps) {
    super(props)
    this.toggleColor = this.toggleColor.bind(this)
  }

  toggleColor(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.toggleColor(this.props.symbol, e.target.checked)
  }

  render() {
    return (
      <label className={styles.manaCheckbox}>
        <input
          type="checkbox"
          defaultChecked={
            this.props.selectedColors.indexOf(this.props.symbol) > -1
          }
          onChange={(e) =>
            this.props.toggleColor(
              this.props.symbol.toUpperCase(),
              e.target.checked
            )
          }
        />
        <i
          className={
            'ms ms-' +
            this.props.symbol.toLowerCase() +
            ' ms-cost ms-shadow ms-2x ' +
            (this.props.selectedColors.indexOf(this.props.symbol) > -1
              ? styles.selected
              : '')
          }
        />
      </label>
    )
  }
}

export default ManaCheckbox
