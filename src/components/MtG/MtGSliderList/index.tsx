import React, { Component } from 'react'
import update from 'immutability-helper'
import Slider, { Range, createSliderWithTooltip } from 'rc-slider'
import RandoRow from '../RandoRow'

import 'rc-slider/assets/index.css'
import * as styles from './styles.module.scss'
import '../../../styles-global/rc-slider-theme.scss'
import 'keyrune'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'

const SliderWithTooltip = createSliderWithTooltip(Slider)
const RangeWithTooltip = createSliderWithTooltip(Range)

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
    return (newValue: number) => {
      newValue = Math.max(0, newValue)
      this.props.onChange(
        update(this.props.params, {
          [index]: { $merge: { count: newValue } },
        })
      )
    }
  }

  updateRange(index: number) {
    return (newValue: number[]) => {
      this.props.onChange(
        update(this.props.params, {
          [index]: { $merge: { range: newValue } },
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
                    {param.count?.toString().padStart(2, '0') || param.min?.toString().padStart(2, '0') || '00'}
                  </div>
                  {param.isRange ? (
                    <RangeWithTooltip
                      className={styles.slider}
                      min={param.min || 0}
                      max={param.max || this.props.max}
                      value={param.range}
                      disabled={param.enabled !== undefined && !param.enabled}
                      onChange={this.updateRange(index)}
                    />
                  ) : (
                    <SliderWithTooltip
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
                      ? param.max || this.props.max
                      : this.maxCardsForChildren(param.count)
                    )
                      .toString()
                      .padStart(2, '0')}
                  </div>
                  {param.enabled !== undefined && (
                    <FontAwesomeIcon
                      icon={faBan}
                      className={`${styles.disableIcon} ${
                        !param.enabled ? styles.disabled : ''
                      }`}
                      onClick={this.toggleEnabled(index)}
                    ></FontAwesomeIcon>
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
