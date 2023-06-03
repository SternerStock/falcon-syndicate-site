import React, { Component } from 'react'
import { Tooltip } from 'react-tooltip'
import * as styles from './styles.module.scss'

import { FaQuestionCircle } from 'react-icons/fa'

interface RandoRowProps {
  children: React.ReactNode
  label: string
  iconClass?: string
  help?: string
  for?: string
}

class RandoRow extends Component<RandoRowProps, {}> {
  render() {
    return (
      <div className={styles.row}>
        {this.props.iconClass && (
          <div className={styles.icon}>
            <i className={this.props.iconClass} />
          </div>
        )}
        <label className={styles.controlLabel} htmlFor={this.props.for}>
          {this.props.label}
        </label>
        <div className={styles.icon}>
          {this.props.help && (
            <FaQuestionCircle
              data-tooltip-id={`tt_${this.props.label}`}
              data-tooltip-content={this.props.help}
              className={styles.helpIcon}
            />
          )}
          <Tooltip id={`tt_${this.props.label}`} clickable={true} className={styles.tooltip}></Tooltip>
        </div>
        <div className={styles.controlContainer}>{this.props.children}</div>
      </div>
    )
  }
}

export default RandoRow
