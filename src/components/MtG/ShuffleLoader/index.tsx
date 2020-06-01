import React, { Component } from 'react'

import styles from './styles.module.scss'
import mtgCardBackUrl from '../../../img/mtgcardback.jpg'

class ShuffleLoader extends Component {
  constructor(props: {}) {
    super(props)
  }

  render() {
    return (
      <figure className={styles.stack}>
        <div className={styles.card}>
          <img src={mtgCardBackUrl}></img>
        </div>
        <div className={styles.card}>
          <img src={mtgCardBackUrl}></img>
        </div>
        <div className={styles.card}>
          <img src={mtgCardBackUrl}></img>
        </div>
      </figure>
    )
  }
}

export default ShuffleLoader
