import React, { Component } from 'react'
import Slider, { Range } from 'rc-slider'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'

interface MtGSliderProps {
  param: CountParam
  max: number
}

class MtGSlider extends Component<MtGSliderProps, {}> {
  constructor(props: MtGSliderProps) {
    super(props)
  }

  totalCardsMinus(subtract?: number) {
    const start = subtract || 0
    return (
      this.props.param.children?.reduce(
        (total, param) => total + param.count,
        0 - start
      ) || this.props.param.count
    )
  }

  render() {
    return (
      <div className={styles.mtgSlider}>
        <label>
          {this.props.param.label}:
          <span>{this.props.param.count}</span>
        </label>
        <div className="flex-container">
          <span>0</span>
          <Slider
            min={0}
            max={this.props.max}
            defaultValue={this.props.param.count}
            onChange={(val) => (this.props.param.count = val)}
          />
          <span>{this.props.max}</span>
        </div>
        {this.props.param.children?.map((child) => {
          return (
            <MtGSlider
              max={this.props.param.count - this.totalCardsMinus(child.count)}
              param={child}
            ></MtGSlider>
          )
        })}
      </div>
    )
  }
}

export default MtGSlider
