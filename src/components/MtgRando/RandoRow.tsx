import { FaCircleQuestion } from 'react-icons/fa6'
import { Tooltip } from 'react-tooltip'

import styles from './RandoRow.module.scss'

export interface RandoRowProps {
  label: string
  iconClass?: string
  help?: string
  for?: string
  children: React.ReactNode
}

const RandoRow: React.FC<RandoRowProps> = (props) => (
  <div className={styles.row}>
    {props.iconClass && (
      <div className={styles.icon}>
        <i className={props.iconClass} />
      </div>
    )}
    <label className={styles.controlLabel} htmlFor={props.for}>
      {props.label}
    </label>
    <div className={styles.icon}>
      {props.help && (
        <FaCircleQuestion
          data-tooltip-id={`tt_${props.label}`}
          data-tooltip-content={props.help}
          className={styles.helpIcon}
        />
      )}
      <Tooltip
        id={`tt_${props.label}`}
        clickable={true}
        className={styles.tooltip}
      />
    </div>
    <div className={styles.controlContainer}>{props.children}</div>
  </div>
)

export default RandoRow
