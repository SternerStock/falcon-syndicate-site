import React, { Component } from 'react'
import styles from './styles.module.scss'

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
      <div className={styles.row} title={this.props.help}>
        {this.props.iconClass && (
          <div className={styles.icon}>
            <i className={this.props.iconClass} />
          </div>
        )}
        <label className={styles.controlLabel} htmlFor={this.props.for}>
          {this.props.label}
        </label>
        <div className={styles.controlContainer}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default RandoRow
