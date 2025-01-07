import { FaBan } from 'react-icons/fa6'
import Slider from 'rc-slider'

import 'keyrune'

import { CountParam } from './CountParam'
import RandoRow from './RandoRow'

import 'rc-slider/assets/index.css'
import '../../style/rc-slider-theme.scss'
import styles from './RandoRow.module.scss'

interface SliderGroupProps {
  params: CountParam[]
  min?: number
  max: number
  nonexclusive?: boolean
  format: string
  onChange: (value: CountParam[]) => void
}

const SliderGroup: React.FC<SliderGroupProps> = (props) => {
  const { params, min, max, nonexclusive, format, onChange } = props

  const maxCardsForChildren = (subtract?: number) => {
    if (nonexclusive) return max

    const start = subtract || 0
    return Math.max(
      0,
      max -
        params.reduce((total, param) => total + (param.count || 0), 0 - start)
    )
  }

  return (
    <>
      {params
        .filter(
          (item) =>
            !format ||
            !item.showForFormats ||
            item.showForFormats?.includes(format)
        )
        .map((param, index) => (
          <div key={param.name} className={styles.mtgSlider}>
            <RandoRow
              iconClass={param.iconClass}
              help={param.help}
              label={param.label}
            >
              <div className={styles.count}>
                {(param.isRange ?
                  (param.range && param.range.length === 2 && param.range[0]) ||
                  param.min ||
                  min ||
                  0
                : param.count || param.min || 0
                )
                  .toString()
                  .padStart(2, '0')}
              </div>
              <Slider
                range={param.isRange}
                className={styles.slider}
                min={param.min || 0}
                max={
                  param.isRange ?
                    param.max || max
                  : maxCardsForChildren(param.count)
                }
                value={param.isRange ? param.range : param.count}
                disabled={param.enabled !== undefined && !param.enabled}
                onChange={(newValue) => {
                  const newParams = [...params]
                  if (Array.isArray(newValue)) {
                    newParams[index].range = newValue
                  } else {
                    newParams[index].count = newValue
                  }

                  onChange(newParams)
                }}
              />
              <div className={styles.count}>
                {(param.isRange ?
                  (param.range && param.range.length === 2 && param.range[1]) ||
                  param.max ||
                  max
                : maxCardsForChildren(param.count)
                )
                  .toString()
                  .padStart(2, '0')}
              </div>
              {param.enabled !== undefined && (
                <FaBan
                  className={`${styles.disableIcon} ${
                    !param.enabled ? styles.disabled : ''
                  }`}
                  onClick={() => {
                    const newValue = !param.enabled

                    let count = param.count
                    if (!newValue) {
                      count = 0
                    }

                    const newParams = [...params]
                    newParams[index].enabled = newValue
                    newParams[index].count = count

                    onChange(newParams)
                  }}
                />
              )}
            </RandoRow>
            {param.children ?
              <SliderGroup
                max={param.count === undefined ? max : param.count}
                params={param.children}
                onChange={(newChildren) => {
                  const newParams = [...params]
                  newParams[index].children = newChildren

                  onChange(newParams)
                }}
                format={format}
              />
            : <></>}
          </div>
        ))}
    </>
  )
}

export default SliderGroup
