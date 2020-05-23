import React, { Component } from 'react'
import CrossfadeImage from 'react-crossfade-image'
import reactStringReplace from 'react-string-replace'

import mtgCardBackUrl from '../../../img/mtgcardback.jpg'
import styles from './styles.module.scss'
import 'mana-font'
import '@saeris/typeface-beleren-bold'

interface CardPreviewProps {
  selectedCard?: Card
}

class CardPreview extends Component<CardPreviewProps> {
  symbolRegex: RegExp
  loyaltyRegex: RegExp
  reminderRegex: RegExp

  constructor(props: CardPreviewProps) {
    super(props)
    this.symbolRegex = /\{([^}]+)\}/g
    this.loyaltyRegex = /\[([^\]]+)\]/g
    this.reminderRegex = /(\([^)]+\))/g
  }

  replaceManaSymbols(text: React.ReactNodeArray) {
    return reactStringReplace(
      text,
      this.symbolRegex,
      (segment: string, index: number) => {
        let className
        if (segment === 'T') {
          className = 'ms-tap'
        } else if (segment.match(/(^[WUBRGCXYZPSE∞]$)|(^\d+$)/)) {
          className = 'ms-' + segment.toLowerCase()
        } else if (segment.match(/(^H[WUBRG]$)/)) {
          className = 'ms-half ms-' + segment[1].toLowerCase()
        } else if (segment === '½') {
          className = 'ms-1-2'
        } else if (segment.indexOf('/') === 1) {
          className = 'ms-' + segment.replace('/', '').toLowerCase()
        }

        if (className) {
          return (
            <i
              key={this.props.selectedCard?.id + '-mana-' + index}
              className={`ms ms-cost ${className}`}
            ></i>
          )
        } else {
          return segment
        }
      }
    )
  }

  replaceReminderText(text: string) {
    return reactStringReplace(
      text,
      this.reminderRegex,
      (segment: string, index: number) => {
        const replaced = this.replaceLoyalty(this.replaceManaSymbols([segment]))
        return <em key={this.props.selectedCard?.id + '-reminder-' + index}>{replaced}</em>
      }
    )
  }

  replaceLoyalty(text: React.ReactNodeArray) {
    return reactStringReplace(
      text,
      this.loyaltyRegex,
      (segment: string, index: number) => {
        let className
        if (segment.startsWith('+') || segment === '0') {
          className = 'ms-loyalty-up'
        } else if (segment.startsWith('−')) {
          className = 'ms-loyalty-down'
        } else {
          return segment
        }

        className += ' ms-loyalty-' + segment.replace(/[+−]/, '').toLowerCase()
        return (
          <i
            key={this.props.selectedCard?.id + '-loyalty-' + index}
            className={`ms ${className}`}
          ></i>
        )
      }
    )
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
              <div>
                {this.replaceManaSymbols([this.props.selectedCard.manaCost])}
              </div>
            </div>
            <div className={styles.typeline}>
              {this.props.selectedCard.typeLine}
            </div>
            <div>
              {this.replaceLoyalty(this.replaceManaSymbols(this.replaceReminderText(this.props.selectedCard.oracleText)))}
            </div>
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
