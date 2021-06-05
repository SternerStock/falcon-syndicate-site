import React, { Component } from 'react'

import * as styles from './styles.module.scss'
import 'mana-font'

interface ManaCheckProps {
  onChange: (checked: boolean) => void
  symbol: string
  selected: boolean
}

class ManaCheckbox extends Component<ManaCheckProps, {}> {
  constructor(props: ManaCheckProps) {
    super(props)
  }

  render() {
    return (
      <label className={styles.manaCheckbox}>
        <input
          type="checkbox"
          defaultChecked={this.props.selected}
          onChange={(e) => this.props.onChange(e.target.checked)}
        />
        <i
          className={
            'ms ms-' +
            this.props.symbol.toLowerCase() +
            ' ms-cost ms-shadow ms-2x ' +
            (this.props.selected ? styles.selected : '')
          }
        />
      </label>
    )
  }
}

export default ManaCheckbox
