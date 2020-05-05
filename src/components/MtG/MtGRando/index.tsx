import React, { Component } from 'react'
import ManaCheckbox from '../ManaCheckbox'
import CardPreview from '../CardPreview'

import styles from './styles.module.scss'
import 'mana-font'
import 'keyrune'

interface MtGRandoState {
  selectedDeckType: string
  formats: string[]
  selectedFormat: string
  commanders: Card[]
  partners: Card[]
  selectedCommander?: Card
  selectedPartner?: Card
  signatureSpells: Card[]
  selectedSpell?: Card
  randomIdentity: boolean
  selectedColors: string[]
  silverBorder: boolean
  maxCards: number
  basicLands: number
  nonbasicLands: number
  creatures: number
  artifacts: number
  enchantments: number
  planeswalkers: number
  spells: number
  mana: number
  cmc: CmcRange
  selectedRarities: string[]
  sets: string[]
  selectedSets: string[]
  watermarks: string[]
  selectedWatermarks: string[]
  artists: string[]
  selectedArtists: string[]
}

class MtGRando extends React.Component<{}, MtGRandoState> {
  deckTypes: string[]
  cmdrFormats: string[]
  normalFormats: string[]
  rarities: string[]
  colors: string[]

  constructor(props: {}) {
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
      //selectedCommander: {} as Card,
      partners: [],
      //selectedPartner: {} as Card,
      signatureSpells: [],
      //selectedSpell: {} as Card,
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

  toggleColor(color: string, checked: boolean) {
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

  selectDeckType(e: React.ChangeEvent<HTMLSelectElement>) {
    let formatsArray: string[]

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

  selectCommander(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      selectedCommander: this.state.commanders.find(
        (cmdr) => cmdr.id.toString() === e.target.value
      ),
    })
  }

  selectSignatureSpell(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      selectedSpell: this.state.signatureSpells.find(
        (spell) => spell.id.toString() === e.target.value
      ),
    })
  }

  componentDidMount() {
    fetch(process.env.GATSBY_API_URL + '/Card/Commanders')
  }

  render() {
    return (
      <div className={styles.mtgContainerOuter}>
        <div className={`${styles.leftCol} gutter`}>
          <div>
            <label htmlFor="deck-type">Type of Deck</label>
            <select
              id="deck-type"
              value={this.state.selectedDeckType}
              onChange={this.selectDeckType}
            >
              {this.deckTypes.map((deckType) => {
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
                onChange={(e) =>
                  this.setState({
                    selectedFormat: e.target.value,
                  })
                }
              >
                {this.state.formats.map((format) => {
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
                  this.state.commanders.map((cmdr) => {
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
                value={this.state.selectedSpell && this.state.selectedSpell.id}
                onSelect={this.selectSignatureSpell}
              >
                {this.state.signatureSpells.length > 0 &&
                  this.state.signatureSpells.map((spell) => {
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
                onChange={(e) =>
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
            {this.colors.map((color) => {
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
            {`Cards: ${
              this.state.basicLands +
              this.state.nonbasicLands +
              this.state.creatures +
              this.state.artifacts +
              this.state.enchantments +
              this.state.planeswalkers +
              this.state.spells
            } / ${this.state.maxCards}`}
          </div>
        </div>
        <div className={`${styles.rightCol} gutter`}>
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
