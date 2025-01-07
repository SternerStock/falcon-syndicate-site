import 'mana-font'

import styles from './ManaCheckbox.module.scss'

interface ManaCheckboxProps {
  symbol: string
  selected: boolean
  onChange: (checked: boolean) => void
}

const ManaCheckbox: React.FC<ManaCheckboxProps> = ({
  symbol,
  selected,
  onChange,
}) => {
  return (
    <label className={styles.manaCheckbox}>
      <input
        type="checkbox"
        defaultChecked={selected}
        onChange={(e) => onChange(e.target.checked)}
      />
      <i
        className={
          'ms ms-' +
          symbol.toLowerCase() +
          ' ms-cost ms-shadow ms-2x ' +
          (selected ? styles.selected : '')
        }
      />
    </label>
  )
}

export default ManaCheckbox
