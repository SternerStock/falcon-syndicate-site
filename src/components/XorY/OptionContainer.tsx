import kidshowBgUrl from '../../assets/ska/CheckerRainbow.png'
import skaBgUrl from '../../assets/ska/CheckerTile.png'

import fonts from './Fonts.module.scss'
import styles from './XorY.module.scss'

const bgMappings: Record<string, string> = {
    ["Kids' Show"]: kidshowBgUrl,
    ["Ska Band"]: skaBgUrl
}

const textMappings: Record<string, string> = {
    ["Kids' Show"]: fonts.kidshowText,
    ["Ska Band"]: fonts.skaText
}

interface OptionContainerProps {
  category: string
  selected?: boolean
  correct?: boolean
  onClick?: () => void
}

const OptionContainer: React.FC<OptionContainerProps> = ({category, selected, correct, onClick}) => {
  return (
    <div
      className={`${styles.option} ${selected ? styles.selected : ''} ${correct ? styles.correct : ''} ${correct === false ? styles.incorrect : ''}`}
      style={{ backgroundImage: `url(${bgMappings[category] ?? skaBgUrl})` }}
      onClick={onClick}
    >
      <div className={styles.optionBg}>
        <div className={styles.optionText}>
          <span className={textMappings[category] ?? ''}>{category}</span>
        </div>
      </div>
    </div>
  )
}

export default OptionContainer