import React, { Component } from 'react'

import mtgCardBackUrl from '../../../img/mtgcardback.jpg'
import styles from './styles.module.scss'
import 'mana-font'
import '@saeris/typeface-beleren-bold'

class CardPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardToggle: false,
      card1: {
        multiverseId: 31821,
        name: 'Aboshan, Cephalid Emperor',
        manaCost: "{4}{U}{U}",
        oracleText: 'Tap an untapped Cephalid you control: Tap target permanent.{U}{U}{U}: Tap all creatures without flying.',
        power: 3,
        toughness: 3,
        typeLine: 'Legendary Creature - Cephalid',
        flavorText: '"No one can fight the tide forever."'
      },
      card2: null,
    }
  }

  selectCard(card) {
    this.setState({
      cardToggle: !this.cardToggle,
      card1: this.cardToggle ? card : this.card1,
      card2: this.cardToggle ? this.card2 : card,
    })
  }

  reset() {
    this.setState({
      cardToggle: false,
      card1: null,
      card2: null,
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
        <div className={styles.oracle}>
          <div className={styles.nameRow}>
            <div>
              {this.state.card1.name}
            </div>
            <div>
              {this.state.card1.manaCost}
            </div>
          </div>
          <div className={styles.typeline}>
            {this.state.card1.typeLine}
          </div>
          <div>{this.state.card1.oracleText}</div>
          <div className={styles.flavorText}>
            {this.state.card1.flavorText}
          </div>
          <div className={styles.power}>
            {this.state.card1.loyalty
              ? this.state.card1.loyalty
              : this.state.card1.power
              ? `${this.state.card1.power}/${this.state.card1.toughness}`
              : ''}
          </div>
        </div>
      </div>
    )
  }
}

export default CardPreview
