import React, { Component } from 'react'
import CrossfadeImage from 'react-crossfade-image'

import mtgCardBackUrl from '../../../img/mtgcardback.jpg'
import styles from './styles.module.scss'
import 'mana-font'
import '@saeris/typeface-beleren-bold'

interface CardPreviewProps {
  selectedCard?: Card
}

class CardPreview extends Component<CardPreviewProps> {
  constructor(props: CardPreviewProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className={styles.cardImg}>
          <CrossfadeImage
            src={
              this.props.selectedCard
                ? `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${this.props.selectedCard.multiverseId}`
                : mtgCardBackUrl
            }
          />
        </div>
        {this.props.selectedCard && (
          <div className={styles.oracle}>
            <div className={styles.nameRow}>
              <div>{this.props.selectedCard.name}</div>
              <div>{this.props.selectedCard.manaCost}</div>
            </div>
            <div className={styles.typeline}>
              {this.props.selectedCard.typeLine}
            </div>
            <div>{this.props.selectedCard.oracleText}</div>
            <div className={styles.flavorText}>
              {this.props.selectedCard.flavorText}
            </div>
            <div className={styles.power}>
              {this.props.selectedCard.loyalty
                ? this.props.selectedCard.loyalty
                : this.props.selectedCard.power
                ? `${this.props.selectedCard.power}/${this.props.selectedCard.toughness}`
                : ''}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default CardPreview
