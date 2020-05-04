import React, { Component } from 'react'
import ManaCheckbox from '../ManaCheckbox'
import CardPreview from '../CardPreview'
import Slider, { Range } from 'rc-slider'

import styles from './styles.module.scss'
import 'mana-font'
import 'keyrune'

class MtGRando extends Component {
  constructor(props) {
    super(props)
    this.toggleColor = this.toggleColor.bind(this)
    this.selectDeckType = this.selectDeckType.bind(this)
    this.selectCommander = this.selectCommander.bind(this)
    this.selectSignatureSpell = this.selectSignatureSpell.bind(this)
    this.deckTypes = ['Commander', 'Oathbreaker', '60 card']
    this.cmdrFormats = ['Normal', 'Brawl', 'Pauper', 'Tiny Leaders']
    this.normalFormats = [
      'Standard',
      'Modern',
      'Pioneer',
      'Legacy',
      'Vintage',
      'Pauper',
    ]
    this.rarities = ['Common', 'Uncommon', 'Rare', 'Mythic Rare']
    this.colors = ['W', 'U', 'B', 'R', 'G']
    this.state = {
      selectedDeckType: 'Commander',
      formats: [],
      selectedFormat: '',
      commanders: [],
      selectedCommander: {},
      signatureSpells: [],
      selectedSpell: {},
      randomIdentity: true,
      selectedColors: ['W', 'U', 'B', 'R', 'G'],
      silverBorder: false,
      maxCards: 99,
      basicLands: 24,
      nonbasicLands: 15,
      creatures: 20,
      artifacts: 0,
      enchantments: 0,
      planeswalkers: 0,
      spells: 0,
      mana: 0,
      cmc: {
        min: 0,
        max: 16,
      },
      selectedRarities: [],
      sets: [],
      selectedSets: [],
      watermarks: [],
      selectedWatermarks: [],
      artists: [],
      selectedArtists: [],
    }
  }

  toggleColor(color, checked) {
    let selectedColors

    if (this.state.randomIdentity) {
      selectedColors = ['W', 'U', 'B', 'R', 'G']
    } else {
      selectedColors = this.state.selectedColors
      let index = selectedColors.indexOf(color)

      if (checked && index === -1) {
        selectedColors.push(color)
      }

      if (!checked && index > -1) {
        selectedColors.splice(index, 1)
      }
    }

    this.setState({
      selectedColors: selectedColors,
    })
  }

  selectDeckType(e) {
    let formatsArray

    switch (e.target.value) {
      case 'Commander':
        formatsArray = this.cmdrFormats
        break
      case '60 card':
        formatsArray = this.normalFormats
        break
      default:
        formatsArray = []
    }

    this.setState({
      selectedDeckType: e.target.value,
      formats: formatsArray,
      selectedFormat: '',
    })
  }

  selectCommander(e) {
    this.setState({
      selectedCommander: this.state.commanders.find(
        cmdr => cmdr.id === e.target.value
      ),
    })
  }

  selectSignatureSpell(e) {
    this.setState({
      selectedSpell: this.state.spells.find(
        spell => spell.id === e.target.value
      ),
    })
  }

  componentDidMount() {
    fetch(process.env.GATSBY_API_URL + '/Card/Commanders')
  }

  render() {
    return (
      <div className={styles.mtgContainerOuter}>
        <div className={styles.leftCol}>
          <div>
            <label htmlFor="deck-type">Type of Deck</label>
            <select
              id="deck-type"
              value={this.state.selectedDeckType}
              onChange={this.selectDeckType}
            >
              {this.deckTypes.map(deckType => {
                return <option key={deckType}>{deckType}</option>
              })}
            </select>
          </div>
          {this.state.formats.length > 0 && (
            <div>
              <label htmlFor="format">Format</label>
              <select
                id="format"
                value={this.state.selectedFormat}
                onChange={e =>
                  this.setState({
                    selectedFormat: e.target.value,
                  })
                }
              >
                {this.state.formats.map(format => {
                  return <option key={format}>{format}</option>
                })}
              </select>
            </div>
          )}
          {(this.state.selectedDeckType === 'Commander' ||
            this.state.selectedDeckType === 'Oathbreaker') && (
            <div>
              <label htmlFor="commander">{this.state.selectedDeckType}</label>
              <select
                id="commander"
                value={
                  this.state.selectedCommander &&
                  this.state.selectedCommander.id
                }
                onChange={this.selectCommander}
              >
                {this.state.commanders.length > 0 &&
                  this.state.commanders.map(cmdr => {
                    return (
                      <option key={cmdr.id} value={cmdr.id}>
                        {cmdr.name}
                      </option>
                    )
                  })}
              </select>
            </div>
          )}
          {this.state.selectedDeckType === 'Oathbreaker' && (
            <div>
              <label htmlFor="signature-spell">Signature Spell</label>
              <select
                id="signature-spell"
                value={
                  this.state.selectedSignatureSpell &&
                  this.state.selectedSignatureSpell.id
                }
                onSelect={this.selectSignatureSpell}
              >
                {this.state.signatureSpells.length > 0 &&
                  this.state.signatureSpells.map(spell => {
                    return (
                      <option key={spell.id} value={spell.id}>
                        {spell.name}
                      </option>
                    )
                  })}
              </select>
            </div>
          )}
          <div>
            <label>
              <input
                type="checkbox"
                defaultChecked={this.state.randomIdentity}
                onChange={e =>
                  this.setState({
                    randomIdentity: e.target.checked,
                    selectedColors: e.target.checked
                      ? ['W', 'U', 'B', 'R', 'G']
                      : [],
                  })
                }
              />
              Random Color(s)
            </label>
            {this.colors.map(color => {
              return (
                <ManaCheckbox
                  key={color}
                  symbol={color}
                  toggleColor={this.toggleColor}
                  selectedColors={this.state.selectedColors}
                ></ManaCheckbox>
              )
            })}
          </div>
          <div>
            {`Cards: ${this.state.basicLands +
              this.state.nonbasicLands +
              this.state.creatures +
              this.state.artifacts +
              this.state.enchantments +
              this.state.planeswalkers +
              this.state.spells} / ${this.state.maxCards}`}
          </div>
        </div>
        <div className={styles.rightCol}>
          {this.state.selectedDeckType === 'Commander' ? (
            <div className="gutter">
              <h3>Commander</h3>
              <CardPreview></CardPreview>
            </div>
          ) : this.state.selectedDeckType === 'Oathbreaker' ? (
            <div className="flex-container">
              <div className="gutter">
                <h3>Oathbreaker</h3>
                <CardPreview></CardPreview>
              </div>
              <div className="gutter">
                <h3>Signature Spell</h3>
                <CardPreview></CardPreview>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    )
  }
}

export default MtGRando
