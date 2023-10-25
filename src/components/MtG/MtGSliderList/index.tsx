import React, { Component } from 'react'
import update from 'immutability-helper'
import Slider from 'rc-slider'
import RandoRow from '../RandoRow'

import 'rc-slider/assets/index.css'
import * as styles from './styles.module.scss'
import '../../../styles-global/rc-slider-theme.scss'
import 'keyrune'

import { FaBan } from 'react-icons/fa'

interface MtGSliderListProps {
  onChange: (value: CountParam[]) => void
  params: CountParam[]
  min?: number
  max: number
  nonexclusive?: boolean
  format: string
}

class MtGSliderList extends Component<MtGSliderListProps, {}> {
  constructor(props: MtGSliderListProps) {
    super(props)
    this.maxCardsForChildren = this.maxCardsForChildren.bind(this)
    this.toggleEnabled = this.toggleEnabled.bind(this)
  }

  maxCardsForChildren(subtract?: number) {
    if (this.props.nonexclusive) {
      return this.props.max
    }

    const start = subtract || 0
    return Math.max(
      0,
      this.props.max -
        this.props.params.reduce(
          (total, param) => total + (param.count || 0),
          0 - start
        )
    )
  }

  updateCount(index: number) {
    return (newValue: number | number[]) => {
      newValue = Math.max(0, newValue as number)
      this.props.onChange(
        update(this.props.params, {
          [index]: { $merge: { count: newValue } },
        })
      )
    }
  }

  updateRange(index: number) {
    return (newValue: number | number[]) => {
      this.props.onChange(
        update(this.props.params, {
          [index]: { $merge: { range: newValue as number[] } },
        })
      )
    }
  }

  updateChildParams(index: number) {
    return (newValue: CountParam[]) => {
      this.props.onChange(
        update(this.props.params, {
          [index]: { $merge: { children: newValue } },
        })
      )
    }
  }

  toggleEnabled(index: number) {
    return () => {
      const newValue = !this.props.params[index].enabled

      let count = this.props.params[index].count
      if (!newValue) {
        count = 0
      }

      this.props.onChange(
        update(this.props.params, {
          [index]: {
            $merge: {
              enabled: !this.props.params[index].enabled,
              count: count,
            },
          },
        })
      )
    }
  }

  render() {
    return (
      <div>
        {this.props.params
          .filter(
            (item) =>
              !this.props.format ||
              !item.showForFormats ||
              item.showForFormats.indexOf(this.props.format) > -1
          )
          .map((param, index) => {
            return (
              <div className={styles.mtgSlider} key={param.name}>
                <RandoRow
                  iconClass={param.iconClass}
                  help={param.help}
                  label={param.label}
                >
                  <div className={styles.count}>
                    {(param.isRange
                      ? (param.range && param.range.length === 2 && param.range[0]) || param.min || this.props.min || 0
                      : param.count || param.min || 0
                    ).toString().padStart(2, '0')}
                  </div>
                  {param.isRange ? (
                    <Slider
                      range
                      className={styles.slider}
                      min={param.min || 0}
                      max={param.max || this.props.max}
                      value={param.range}
                      disabled={param.enabled !== undefined && !param.enabled}
                      onChange={this.updateRange(index)}
                    />
                  ) : (
                    <Slider
                      className={styles.slider}
                      min={this.props.min || 0}
                      max={this.maxCardsForChildren(param.count)}
                      value={param.count}
                      disabled={param.enabled !== undefined && !param.enabled}
                      onChange={this.updateCount(index)}
                    />
                  )}
                  <div className={styles.count}>
                    {(param.isRange
                      ? (param.range && param.range.length === 2 && param.range[1]) || param.max || this.props.max
                      : this.maxCardsForChildren(param.count)
                    ).toString().padStart(2, '0')}
                  </div>
                  {param.enabled !== undefined && (
                    <FaBan
                      className={`${styles.disableIcon} ${
                        !param.enabled ? styles.disabled : ''
                      }`}
                      onClick={this.toggleEnabled(index)}
                    />
                  )}
                </RandoRow>
                {param.children && (
                  <MtGSliderList
                    max={param.count === undefined ? this.props.max : param.count}
                    params={param.children}
                    onChange={this.updateChildParams(index)}
                    format={this.props.format}
                  ></MtGSliderList>
                )}
              </div>
            )
          })}
      </div>
    )
  }
}

export default MtGSliderList
