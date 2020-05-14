import React, { Component } from 'react'

import mtgCardBackUrl from '../../../img/mtgcardback.jpg'
import styles from './styles.module.scss'
import 'mana-font'
import '@saeris/typeface-beleren-bold'

interface CardPreviewProps {
  selectedCard?: Card
}

interface CardPreviewState {
  cardToggle: boolean
  card1?: Card
  card2?: Card
}

class CardPreview extends Component<CardPreviewProps, CardPreviewState> {
  constructor(props: CardPreviewProps) {
    super(props)
    this.state = {
      cardToggle: false,
    }
  }

  componentWillReceiveProps(newProps: CardPreviewProps) {
    this.setState({
      cardToggle: !this.state.cardToggle,
      card1: this.state.cardToggle ? newProps.selectedCard : this.state.card1,
      card2: this.state.cardToggle ? this.state.card2 : newProps.selectedCard,
    })
  }

  selectCard(card: Card) {
    this.setState({
      cardToggle: !this.state.cardToggle,
      card1: this.state.cardToggle ? card : this.state.card1,
      card2: this.state.cardToggle ? this.state.card2 : card,
    })
  }

  reset() {
    this.setState({
      cardToggle: false,
      card1: {} as Card,
      card2: {} as Card,
    })
  }

  render() {
    return (
      <div>
        <div className={styles.cardImg}>
          <img
            className={this.state.cardToggle ? '' : styles.current}
            src={
              this.state.card1
                ? `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${this.state.card1.multiverseId}`
                : mtgCardBackUrl
            }
            alt={this.state.card1 ? this.state.card1.name : 'Card Preview'}
            title={this.state.card1 ? this.state.card1.name : 'Card Preview'}
          />
          <img
            className={this.state.cardToggle ? styles.current : ''}
            src={
              this.state.card2
                ? `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${this.state.card2.multiverseId}`
                : mtgCardBackUrl
            }
            alt={this.state.card2 ? this.state.card2.name : 'Card Preview'}
            title={this.state.card2 ? this.state.card2.name : 'Card Preview'}
          />
        </div>
        {this.props.selectedCard && (
          <div className={styles.oracle}>
            <div className={styles.nameRow}>
              <div>{this.props.selectedCard.name}</div>
              <div>{this.props.selectedCard.manaCost}</div>
            </div>
            <div className={styles.typeline}>{this.props.selectedCard.typeLine}</div>
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
