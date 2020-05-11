import React, { Component } from 'react'
import CardPreview from '../CardPreview'
import MtGSliderList from '../MtGSliderList'
import RandoRow from '../RandoRow'

import styles from './styles.module.scss'
import 'mana-font'
import 'keyrune'
import ColorSelect from '../ColorSelect'

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
  countParams: CountParam[]
  miscParams: CountParam[]
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
    this.state = {
      selectedDeckType: 'Commander',
      formats: [],
      selectedFormat: '',
      commanders: [],
      partners: [],
      signatureSpells: [],
      randomIdentity: true,
      selectedColors: ['W', 'U', 'B', 'R', 'G'],
      silverBorder: false,
      maxCards: 99,
      countParams: [
        {
          name: 'basicLands',
          iconClass: 'ms ms-land',
          label: 'Basic Lands',
          help:
            'The EXACT number of basic lands to include in the generated deck.',
          enabled: true,
          count: 24,
        },
        {
          name: 'nonbasicLands',
          iconClass: 'ms ms-land',
          label: 'Nonbasic Lands',
          help:
            'The EXACT number of nonbasic lands to include in the generated deck.',
          enabled: true,
          count: 15,
        },
        {
          name: 'creatures',
          iconClass: 'ms ms-creature',
          label: 'Creatures',
          help:
            'The MINIMUM number of creatures to include in the generated deck.',
          enabled: true,
          count: 20,
        },
        {
          name: 'artifacts',
          iconClass: 'ms ms-artifact',
          label: 'Artifacts',
          help:
            'The MINIMUM number of artifacts to include in the generated deck.',
          enabled: true,
          count: 5,
          children: [
            {
              name: 'equipment',
              iconClass: 'ms ms-artifact',
              label: 'Equipment',
              help:
                'The MINIMUM number of artifacts that will be equipment. If this bar is maxed, all artifacts will be equipment.',
              enabled: true,
              count: 0,
            },
            {
              name: 'vehicles',
              iconClass: 'ms ms-artifact',
              label: 'Vehicles',
              help:
                'The MINIMUM number of artifacts that will be vehicles. If this bar is maxed, all artifacts will be vehicles, or at least as many as possible.',
              enabled: true,
              count: 0,
            },
          ],
        },
        {
          name: 'enchantments',
          iconClass: 'ms ms-enchantment',
          label: 'Enchantments',
          help:
            'The MINIMUM number of enchantments to include in the generated deck.',
          enabled: true,
          count: 5,
          children: [
            {
              name: 'auras',
              iconClass: 'ms ms-enchantment',
              label: 'Auras',
              help:
                'The MINIMUM number of enchantments that will be auras (or creatures with bestow). If this bar is maxed, all enchantments will be auras.',
              enabled: true,
              count: 0,
            },
          ],
        },
        {
          name: 'planeswalkers',
          iconClass: 'ms ms-planeswalker',
          label: 'Planeswalkers',
          help:
            'The MINIMUM number of planeswalkers to include in the generated deck.',
          enabled: true,
          count: 1,
        },
        {
          name: 'spells',
          iconClass: 'ms ms-instant',
          label: 'Instants and Sorceries',
          help:
            'The MINIMUM number of non-permanent cards to include in the generated deck.',
          enabled: true,
          count: 10,
        },
      ],
      miscParams: [
        {
          name: 'manaProducing',
          iconClass: 'ms ms-c',
          label: 'Produces Mana',
          help:
            'The MINIMUM number of permanents (other than basic lands) to include that have a mana ability. If this bar is maxed, the generator will attempt to make all permanents have mana abilities.',
          enabled: true,
          count: 10,
        },
        {
          name: 'sharesTypes',
          iconClass: 'ms ms-infinity',
          label: 'Shares a Creature Type with Commander(s)',
          help:
            'The MINIMUM number of cards to include that share at least one creature type with your commander. If this bar is maxed, the generator will attempt to make all applicable cards share at least one creature type.',
          enabled: true,
          count: 0,
        },
        {
          name: 'legendary',
          iconClass: 'ss ss-s99',
          label: 'Legendary',
          help:
            'The MINIMUM number of permanents (other than basic lands) to include that are legendary. If this bar is maxed, the generator will attempt to make all permanents legendary.',
          enabled: true,
          count: 0,
        },
        {
          name: 'cmc',
          iconClass: 'ms ms-x',
          label: 'Converted Mana Cost Range',
          help:
            'The range of values within which all converted mana costs must sit.',
          enabled: true,
          isRange: true,
          range: [0, 16],
          min: 0,
          max: 16,
        },
        {
          name: 'edhrecrank',
          iconClass: 'ss ss-cmd',
          label: 'EDHREC Rank',
          help:
            'The "goodness" range of the cards to pick.',
          enabled: true,
          isRange: true,
          range: [1, 100],
          min: 1,
          max: 100,
        },
      ],
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
            <ColorSelect
              selectedColors={this.state.selectedColors}
              onChange={(params) => this.setState({ selectedColors: params })}
            />
          </div>
          <div>
            {`Cards: ${this.state.countParams.reduce(
              (total, param) => total + (param.count || 0),
              0
            )} / ${this.state.maxCards}`}
          </div>
          <MtGSliderList
            max={this.state.maxCards}
            params={this.state.countParams}
            onChange={(params) => this.setState({ countParams: params })}
          />
          <MtGSliderList
            max={this.state.maxCards}
            params={this.state.miscParams}
            nonexclusive={true}
            onChange={(params) => this.setState({ miscParams: params })}
          />
          <RandoRow iconClass="ss ss-pmtg1" help="" label="Sets" >
              <select></select>
          </RandoRow>
          <RandoRow iconClass="ss ss-htr" help="" label="Rarities" >
              <select></select>
          </RandoRow>
          <RandoRow iconClass="ss ss-izzet" help="" label="Watermarks" >
              <select></select>
          </RandoRow>
          <RandoRow iconClass="ss ss-pbook" help="" label="Artists" >
              <select></select>
          </RandoRow>
          <RandoRow iconClass="ss ss-bcore" help="" label="Frames" >
              <select></select>
          </RandoRow>
          <RandoRow iconClass="ss ss-ugl" help="" label="Share Link" >
              <input type="text" readOnly />
          </RandoRow>
        </div>
        <div className={`${styles.rightCol} gutter`}>
          {this.state.selectedDeckType === 'Commander' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3>Commander</h3>
                <CardPreview></CardPreview>
              </div>
              {this.state.selectedPartner && (
                <div>
                  <h3>Partner</h3>
                  <CardPreview></CardPreview>
                </div>
              )}
            </div>
          ) : this.state.selectedDeckType === 'Oathbreaker' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3>Oathbreaker</h3>
                <CardPreview></CardPreview>
              </div>
              <div>
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
