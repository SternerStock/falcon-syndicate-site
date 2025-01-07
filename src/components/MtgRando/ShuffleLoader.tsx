import mtgCardBackUrl from '../../assets/MtG/mtgcardback.jpg'

import styles from './ShuffleLoader.module.scss'

const ShuffleLoader: React.FC = () => {
  return (
    <figure className={styles.stack}>
      <div className={styles.card}>
        <img src={mtgCardBackUrl} />
      </div>
      <div className={styles.card}>
        <img src={mtgCardBackUrl} />
      </div>
      <div className={styles.card}>
        <img src={mtgCardBackUrl} />
      </div>
    </figure>
  )
}

export default ShuffleLoader
