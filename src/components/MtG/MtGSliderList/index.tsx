import React, { Component } from 'react'
import update from 'immutability-helper'
import Slider, {createSliderWithTooltip} from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import 'keyrune'

const SliderWithTooltip = createSliderWithTooltip(Slider)

interface MtGSliderListProps {
  onChange: (value: CountParam[]) => void
  params: CountParam[]
  max: number
}

class MtGSliderList extends Component<MtGSliderListProps, {}> {
  constructor(props: MtGSliderListProps) {
    super(props)
    this.maxCardsForChildren = this.maxCardsForChildren.bind(this)
  }

  maxCardsForChildren(subtract?: number) {
    const start = subtract || 0
    return Math.max(0, this.props.max - this.props.params.reduce(
      (total, param) => total + param.count,
      0 - start
    ))
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

  updateChildParams(index: number) {
    return (newValue: CountParam[]) => {
      this.props.onChange(
        update(this.props.params, {
          [index]: { $merge: { children: newValue } },
        })
      )
    }
  }

  render() {
    return (
      <div>
        {this.props.params.map((param, index) => {
          return (
            <div className={styles.mtgSlider} key={param.name}>
              <div className={styles.row}>
                <label className={styles.sliderLabel}>
                  <i className={styles.icon + " " + param.iconClass} />
                  <div className={styles.label}>{param.label}</div>
                </label>
                <div className={styles.sliderContainer} title={param.help}>
                  <div className={styles.count}>0</div>
                  <SliderWithTooltip
                    className={styles.slider}
                    min={0}
                    max={this.maxCardsForChildren(param.count)}
                    defaultValue={param.count}
                    disabled={!param.enabled}
                    onChange={this.updateCount(index)}
                  />
                  <div className={styles.count}>{this.maxCardsForChildren(param.count).toString().padStart(2, "0")}</div>
                </div>
              </div>
              {param.children && (
                <MtGSliderList
                  max={param.count}
                  params={param.children}
                  onChange={this.updateChildParams(index)}
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
