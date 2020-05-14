import React, { Component } from 'react'
import styles from './styles.module.scss'

interface RandoRowProps {
  children: React.ReactNode
  label: string
  iconClass: string
  help: string
  for?: string
}

class RandoRow extends Component<RandoRowProps, {}> {
  render() {
    return (
      <div className={styles.row}>
        <label className={styles.controlLabel} htmlFor={this.props.for}>
          <i className={styles.icon + ' ' + this.props.iconClass} />
          <div className={styles.label}>{this.props.label}</div>
        </label>
        <div className={styles.controlContainer} title={this.props.help}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default RandoRow