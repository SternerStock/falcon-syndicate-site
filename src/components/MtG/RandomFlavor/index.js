import React, { Component } from 'react'

import styles from './styles.module.scss'

class CardPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cardToggle: false,
    }
  }

  selectCard(name, multiverseId) {
    this.setState({
      cardToggle: !this.cardToggle,
      card1Id: this.cardToggle ? multiverseId : this.card1,
      card1Name: this.cardToggle ? name : this.card1,
      card2Id: this.cardToggle ? this.card2 : multiverseId,
      card2Name: this.cardToggle ? this.card2 : name,
    })
  }

  reset() {
    this.setState({
      cardToggle: false,
      card1Id: '',
      card1Name: '',
      card2Id: '',
      card2Name: '',
    })
  }

  render() {
    return (
      <div className={styles.cardImg}>
        <img
          className={this.state.cardToggle ? 'current' : ''}
          src={
            this.state.card1Id
              ? `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${this.state.card1Id}`
              : '/img/mtgcardback.jpg'
          }
          alt={this.state.card1Name ? this.state.card1Name : 'Card Preview'}
          title={this.state.card1Name ? this.state.card1Name : 'Card Preview'}
        />
        <img
          className={this.state.cardToggle ? '' : 'current'}
          src={
            this.state.card2Id
              ? `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${this.state.card2Id}`
              : '/img/mtgcardback.jpg'
          }
          alt={this.state.card2Name ? this.state.card2Name : 'Card Preview'}
          title={this.state.card2Name ? this.state.card2Name : 'Card Preview'}
        />
      </div>
    )
  }
}

export default CardPreview
