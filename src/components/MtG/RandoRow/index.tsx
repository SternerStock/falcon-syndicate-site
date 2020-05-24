import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import styles from './styles.module.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

interface RandoRowProps {
  children: React.ReactNode
  label: string
  iconClass?: string
  help: string
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
          <FontAwesomeIcon
            icon={faQuestionCircle}
            data-tip={this.props.help}
            className={styles.helpIcon}
          ></FontAwesomeIcon>
          <ReactTooltip type="info" clickable={true}></ReactTooltip>
        </div>
        <div className={styles.controlContainer}>{this.props.children}</div>
      </div>
    )
  }
}

export default RandoRow
