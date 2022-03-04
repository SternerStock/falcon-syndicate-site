import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
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
              data-tip={this.props.help}
              className={styles.helpIcon}
            />
          )}
          <ReactTooltip type="info" clickable={true} multiline={true} className={styles.tooltip}></ReactTooltip>
        </div>
        <div className={styles.controlContainer}>{this.props.children}</div>
      </div>
    )
  }
}

export default RandoRow
