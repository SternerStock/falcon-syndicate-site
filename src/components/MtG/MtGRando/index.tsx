import React, { Component } from 'react'
import CardPreview from '../CardPreview'
import MtGSliderList from '../MtGSliderList'
import ColorSelect from '../ColorSelect'
import RandoRow from '../RandoRow'
import DropdownList from 'react-widgets/lib/DropdownList'
import Multiselect from 'react-widgets/lib/Multiselect'
import Collapsible from 'react-collapsible'
import update from 'immutability-helper'

import '../../../styles-global/react-widgets-theme.scss'
import styles from './styles.module.scss'
import 'keyrune'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faMinus,
  faTimes,
  faRandom,
  faDice,
} from '@fortawesome/free-solid-svg-icons'

interface RandoRequest {
  deckType: string
  format: string
  commanderId: number
  partnerId: number
  signatureSpellId: number
  colorIdentity: string[]
  silverBorder: boolean
  setIds: number[]
  rarityIds: number[]
  watermarkIds: number[]
  artistIds: number[]
  edhrecRanks: number[]
}

interface Format {
  group: string
  name: string
  deckSize: number
  allowSilver: boolean
}

interface MtGRandoState {
  formats: Format[]
  selectedFormat: Format
  commanders: Card[]
  commandersLoading: boolean
  partners: Card[]
  partnersLoading: boolean
  selectedCommander?: Card
  selectedPartner?: Card
  signatureSpells: Card[]
  selectedSpell?: Card
  spellsLoading: boolean
  selectedColors: string[]
  silverBorder: boolean
  countParams: CountParam[]
  nonbasicParams: CountParam[]
  restrictionParams: CountParam[]
  creatureTypeParams: CountParam[]
  rarities: Lookup[]
  selectedRarities: Lookup[]
  raritiesLoading: boolean
  sets: MtGSet[]
  selectedSets: MtGSet[]
  setsLoading: boolean
  artists: Lookup[]
  selectedArtists: Lookup[]
  artistsLoading: boolean
  frames: Lookup[]
  selectedFrames: Lookup[]
  framesLoading: boolean
  restrictionsOpen: boolean
  cardTypesOpen: boolean
}

class MtGRando extends React.Component<{}, MtGRandoState> {
  formats: Format[]

  constructor(props: {}) {
    super(props)
    this.selectCommander = this.selectCommander.bind(this)
    this.selectPartner = this.selectPartner.bind(this)
    this.selectFormat = this.selectFormat.bind(this)
    this.generateDeck = this.generateDeck.bind(this)
    this.formats = [
      {
        group: 'Commander',
        name: 'Commander',
        deckSize: 99,
        allowSilver: true,
      },
      {
        group: 'Commander',
        name: 'Brawl',
        deckSize: 59,
        allowSilver: false,
      },
      {
        group: 'Commander',
        name: 'Pauper',
        deckSize: 99,
        allowSilver: true,
      },
      {
        group: 'Commander',
        name: 'Tiny Leaders',
        deckSize: 49,
        allowSilver: true,
      },
      {
        group: 'Oathbreaker',
        name: 'Oathbreaker',
        deckSize: 58,
        allowSilver: true,
      },
      {
        group: 'Normal MtG',
        name: 'Standard',
        deckSize: 60,
        allowSilver: false,
      },
      {
        group: 'Normal MtG',
        name: 'Modern',
        deckSize: 60,
        allowSilver: false,
      },
      {
        group: 'Normal MtG',
        name: 'Pioneer',
        deckSize: 60,
        allowSilver: false,
      },
      {
        group: 'Normal MtG',
        name: 'Legacy',
        deckSize: 60,
        allowSilver: false,
      },
      {
        group: 'Normal MtG',
        name: 'Vintage',
        deckSize: 60,
        allowSilver: true,
      },
      {
        group: 'Normal MtG',
        name: 'Pauper',
        deckSize: 60,
        allowSilver: true,
      },
      {
        group: 'Normal MtG',
        name: 'Penny Dreadful',
        deckSize: 60,
        allowSilver: true,
      },
    ]
    this.state = {
      formats: [],
      selectedFormat: this.formats[0],
      commanders: [],
      commandersLoading: false,
      partners: [],
      partnersLoading: false,
      signatureSpells: [],
      spellsLoading: false,
      selectedColors: ['W', 'U', 'B', 'R', 'G'],
      silverBorder: false,
      restrictionParams: [
        {
          name: 'edhrecrank',
          iconClass: 'ss ss-cmd ss-2x',
          label: 'EDHREC Rank Percentile',
          help:
            'The "goodness" range of the cards to pick. This value is relative to the pool of possible cards.',
          isRange: true,
          range: [1, 100],
          min: 1,
          max: 100,
          showForFormats: ['Commander', 'Oathbreaker'],
        },
        {
          name: 'cmc',
          iconClass: 'ms ms-x ms-2x',
          label: 'Converted Mana Cost Range',
          help:
            'The range of values within which all converted mana costs must sit.',
          isRange: true,
          range: [0, 16],
          min: 0,
          max: 16,
        },
      ],
      countParams: [
        {
          name: 'basicLands',
          iconClass: 'ms ms-land ms-2x',
          label: 'Basic Lands',
          help:
            'The EXACT number of basic lands to include in the generated deck.',
          enabled: true,
          count: 24,
        },
        {
          name: 'nonbasicLands',
          iconClass: 'ms ms-land ms-2x',
          label: 'Nonbasic Lands',
          help:
            'The EXACT number of nonbasic lands to include in the generated deck.',
          enabled: true,
          count: 15,
        },
        {
          name: 'creatures',
          iconClass: 'ms ms-creature ms-2x',
          label: 'Creatures',
          help:
            'The MINIMUM number of creatures to include in the generated deck.',
          enabled: true,
          count: 20,
        },
        {
          name: 'artifacts',
          iconClass: 'ms ms-artifact ms-2x',
          label: 'Artifacts',
          help:
            'The MINIMUM number of artifacts to include in the generated deck.',
          enabled: true,
          count: 5,
          children: [
            {
              name: 'equipment',
              iconClass: 'ms ms-artifact ms-2x',
              label: 'Equipment',
              help:
                'The MINIMUM number of artifacts that will be equipment. If this bar is maxed, all artifacts will be equipment.',
              enabled: true,
              count: 0,
            },
            {
              name: 'vehicles',
              iconClass: 'ms ms-artifact ms-2x',
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
          iconClass: 'ms ms-enchantment ms-2x',
          label: 'Enchantments',
          help:
            'The MINIMUM number of enchantments to include in the generated deck.',
          enabled: true,
          count: 5,
          children: [
            {
              name: 'auras',
              iconClass: 'ms ms-enchantment ms-2x',
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
          iconClass: 'ms ms-planeswalker ms-2x',
          label: 'Planeswalkers',
          help:
            'The MINIMUM number of planeswalkers to include in the generated deck.',
          enabled: true,
          count: 1,
        },
        {
          name: 'spells',
          iconClass: 'ms ms-instant ms-2x',
          label: 'Instants and Sorceries',
          help:
            'The MINIMUM number of non-permanent cards to include in the generated deck.',
          enabled: true,
          count: 10,
        },
      ],
      nonbasicParams: [
        {
          name: 'manaProducing',
          iconClass: 'ms ms-c ms-2x',
          label: 'Produces Mana',
          help:
            'The MINIMUM number of permanents (other than basic lands) to include that have a mana ability. If this bar is maxed, the generator will attempt to make all permanents have mana abilities.',
          enabled: true,
          count: 10,
        },
        {
          name: 'legendary',
          iconClass: 'ss ss-s99 ss-2x',
          label: 'Legendary',
          help:
            'The MINIMUM number of permanents (other than basic lands) to include that are legendary. If this bar is maxed, the generator will attempt to make all permanents legendary.',
          enabled: true,
          count: 0,
        },
      ],
      creatureTypeParams: [
        {
          name: 'sharesTypes',
          iconClass: 'ms ms-infinity ms-2x',
          label: 'Shares a Creature Type with Commander(s)',
          help:
            'The MINIMUM number of cards to include that share at least one creature type with your commander. If this bar is maxed, the generator will attempt to make all applicable cards share at least one creature type.',
          enabled: true,
          count: 0,
          showForFormats: ['Commander'],
        },
      ],
      rarities: [],
      selectedRarities: [],
      raritiesLoading: false,
      sets: [],
      selectedSets: [],
      setsLoading: false,
      artists: [],
      selectedArtists: [],
      artistsLoading: false,
      frames: [],
      selectedFrames: [],
      framesLoading: false,
      restrictionsOpen: false,
      cardTypesOpen: false,
    }
  }

  async getCommanders(variant: string, silverBorder: boolean) {
    this.setState({
      commanders: [],
      selectedCommander: undefined,
      commandersLoading: true,
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Commanders?variant=${variant}&allowSilver=${silverBorder}`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        commanders: data,
        commandersLoading: false,
      })
    }
  }

  async getPartners(cmdrId: number) {
    this.setState({
      partners: [],
      selectedPartner: undefined,
      partnersLoading: true,
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Partners?cmdrId=${cmdrId}&variant=${this.state.selectedFormat.name}&allowSilver=${this.state.silverBorder}`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        partners: data,
        partnersLoading: false,
      })
    }
  }

  async getSignatureSpells(obId: number) {
    this.setState({
      signatureSpells: [],
      selectedSpell: undefined,
      spellsLoading: true,
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/SignatureSpells?obId=${obId}&allowSilver=${this.state.silverBorder}`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        signatureSpells: data,
        spellsLoading: false,
      })
    }
  }

  async getSets(variant: string, silverBorder: boolean) {
    this.setState({
      setsLoading: true,
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Sets?variant=${variant}&allowSilver=${silverBorder}`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        sets: data,
        setsLoading: false,
      })
    }
  }

  async getRarities() {
    this.setState({
      raritiesLoading: true,
    })

    const response = await fetch(`${process.env.GATSBY_API_URL}/MtG/Rarities`)

    if (response.ok) {
      const data = await response.json()
      this.setState({
        rarities: data,
        raritiesLoading: false,
      })
    }
  }

  async getFrames() {
    this.setState({
      framesLoading: true,
    })

    const response = await fetch(`${process.env.GATSBY_API_URL}/MtG/Frames`)

    if (response.ok) {
      const data = await response.json()
      this.setState({
        frames: data,
        framesLoading: false,
      })
    }
  }

  async getArtists() {
    this.setState({
      artistsLoading: true,
    })

    const response = await fetch(`${process.env.GATSBY_API_URL}/MtG/Artists`)

    if (response.ok) {
      const data = await response.json()
      this.setState({
        artists: data,
        artistsLoading: false,
      })
    }
  }

  async componentDidMount() {
    this.getRarities()
    this.getFrames()
    this.selectFormat()
    this.getArtists()
  }

  selectFormat(newValue?: Format) {
    const format = newValue || this.formats[0]

    const factor = format.deckSize / this.state.selectedFormat.deckSize
    let newCountParams = this.state.countParams
    for (let i = 0; i < this.state.countParams.length; i++) {
      const param = this.state.countParams[i];
      if (param.count) {
        newCountParams = update(newCountParams, {
          [i]: { $merge: { count: Math.floor(param.count * factor) } },
        })
      }
    }

    this.setState({
      selectedFormat: format,
      selectedCommander: undefined,
      selectedPartner: undefined,
      partners: [],
      signatureSpells: [],
      selectedSpell: undefined,
      silverBorder: this.state.silverBorder && format.allowSilver,
      countParams: newCountParams,
    })

    if (format.group === 'Commander' || format.group === 'Oathbreaker') {
      this.getCommanders(
        format.name,
        this.state.silverBorder && format.allowSilver
      )
    } else {
      this.setState({
        commanders: [],
      })
    }

    this.getSets(format.name, this.state.silverBorder && format.allowSilver)
  }

  toggleSilver(newValue: boolean) {
    this.setState({
      silverBorder: newValue,
    })

    this.getSets(this.state.selectedFormat.name, newValue)
    if (
      this.state.selectedFormat.group === 'Commander' ||
      this.state.selectedFormat.group === 'Oathbreaker'
    ) {
      this.getCommanders(this.state.selectedFormat.name, newValue)
    }
  }

  selectCommander(newValue?: Card) {
    if (newValue) {
      this.setState({
        selectedCommander: newValue,
        selectedColors: newValue.colorIdentity,
      })

      if (this.state.selectedFormat.group === 'Commander') {
        this.getPartners(newValue.id)
      } else if (this.state.selectedFormat.group === 'Oathbreaker') {
        this.getSignatureSpells(newValue.id)
      }
    } else {
      this.setState({
        selectedCommander: undefined,
        selectedPartner: undefined,
        selectedColors: ['W', 'U', 'B', 'R', 'G'],
        partners: [],
        signatureSpells: [],
      })
    }
  }

  selectPartner(newValue?: Card) {
    if (newValue) {
      const colors = [
        ...new Set([
          ...(this.state.selectedCommander?.colorIdentity || []),
          ...newValue.colorIdentity,
        ]),
      ]

      this.setState({
        selectedPartner: newValue,
        selectedColors: colors,
      })
    } else {
      this.setState({
        selectedPartner: undefined,
        selectedColors: this.state.selectedCommander?.colorIdentity || [
          'W',
          'U',
          'B',
          'R',
          'G',
        ],
      })
    }
  }

  async generateDeck() {
    alert('TODO')
  }

  render() {
    return (
      <div className={styles.mtgContainerOuter}>
        <div className={`${styles.leftCol} gutter`}>
          <h2 className="beleren">Format</h2>
          <RandoRow label="Format" help="The format to generate a deck for.">
            <div className="widget-wrapper">
              <DropdownList
                placeholder="Select a Format"
                filter="contains"
                data={this.formats}
                textField="name"
                groupBy="group"
                value={this.state.selectedFormat}
                onChange={this.selectFormat}
              ></DropdownList>
              {this.state.selectedFormat.allowSilver && (
                <div style={{ margin: '5px 0' }}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={(e) => this.toggleSilver(e.target.checked)}
                    ></input>{' '}
                    Allow silver-bordered cards
                  </label>
                </div>
              )}
            </div>
          </RandoRow>
          <RandoRow
            label="Color Identity"
            help="The color identity of cards allowed in the deck. Based on your Commander or Oathbreaker in those formats."
          >
            <div className="widget-wrapper">
              <ColorSelect
                selectedColors={this.state.selectedColors}
                onChange={(params) => {
                  if (!this.state.selectedCommander) {
                    this.setState({ selectedColors: params })
                  }
                }}
              />
            </div>
          </RandoRow>
          {(this.state.selectedFormat.group === 'Commander' ||
            this.state.selectedFormat.group === 'Oathbreaker') && (
            <RandoRow
              label={this.state.selectedFormat.group}
              help="Your deck's leader. Determines color identity. Leave blank ('Surprise me') to have a card of the selected colors picked for you."
            >
              <div className="widget-wrapper">
                <DropdownList
                  placeholder="Surprise Me"
                  filter="contains"
                  data={this.state.commanders}
                  textField="name"
                  value={this.state.selectedCommander}
                  busy={
                    this.state.commandersLoading || this.state.partnersLoading
                  }
                  onChange={this.selectCommander}
                ></DropdownList>
                <button
                  className={styles.btnClearOverlay}
                  onClick={() => this.selectCommander()}
                >
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </button>
                <div>
                  <button
                    className={styles.btnPrimary}
                    onClick={() =>
                      this.selectCommander(
                        this.state.commanders[
                          Math.floor(
                            Math.random() * this.state.commanders.length
                          )
                        ]
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faDice}></FontAwesomeIcon> Random{' '}
                    {this.state.selectedFormat.group}
                  </button>
                </div>
              </div>
            </RandoRow>
          )}
          {this.state.partners.length > 0 && (
            <RandoRow label="Partner" help="Your second commander.">
              <div className="widget-wrapper">
                <DropdownList
                  placeholder="Surprise Me"
                  filter="contains"
                  data={this.state.partners}
                  textField="name"
                  value={this.state.selectedPartner}
                  busy={this.state.partnersLoading}
                  onChange={this.selectPartner}
                ></DropdownList>
                <button
                  className={styles.btnClearOverlay}
                  onClick={() => this.selectPartner()}
                >
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </button>
                <div>
                  <button
                    className={styles.btnPrimary}
                    onClick={() => {
                      this.selectPartner(
                        this.state.partners[
                          Math.floor(Math.random() * this.state.partners.length)
                        ]
                      )
                    }}
                  >
                    <FontAwesomeIcon icon={faDice}></FontAwesomeIcon> Random
                    Partner
                  </button>
                </div>
              </div>
            </RandoRow>
          )}
          {this.state.selectedFormat.group === 'Oathbreaker' && (
            <RandoRow
              label="Signature Spell"
              help="Your Oathbreaker's signature spell. You can cast the spell as long as your Oathbreaker is on the battlefield."
            >
              <div className="widget-wrapper">
                <DropdownList
                  placeholder="Surprise Me"
                  filter="contains"
                  data={this.state.signatureSpells}
                  textField="name"
                  value={this.state.selectedSpell}
                  busy={this.state.spellsLoading}
                  onChange={(newValue: Card) =>
                    this.setState({ selectedSpell: newValue })
                  }
                ></DropdownList>
                <button
                  className={styles.btnClearOverlay}
                  onClick={() =>
                    this.setState({
                      selectedSpell: undefined,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </button>
                <div>
                  <button
                    className={styles.btnPrimary}
                    onClick={() =>
                      this.setState({
                        selectedSpell: this.state.signatureSpells[
                          Math.floor(
                            Math.random() * this.state.signatureSpells.length
                          )
                        ],
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faDice}></FontAwesomeIcon> Random
                    Signature Spell
                  </button>
                </div>
              </div>
            </RandoRow>
          )}
          <div className="button-row align-right">
            <button className={styles.btnPrimary} onClick={this.generateDeck}>
              <FontAwesomeIcon icon={faRandom}></FontAwesomeIcon> Generate Deck
            </button>
          </div>
          <Collapsible
            trigger={
              <div className={styles.collapsibleHeader}>
                <h2 className="beleren">Restrictions</h2>
                <FontAwesomeIcon
                  icon={this.state.restrictionsOpen ? faMinus : faPlus}
                  size="2x"
                ></FontAwesomeIcon>
              </div>
            }
            onOpen={() => this.setState({ restrictionsOpen: true })}
            onClose={() => this.setState({ restrictionsOpen: false })}
            easing="ease-in-out"
            overflowWhenOpen="visible"
          >
            <MtGSliderList
              max={this.state.selectedFormat.deckSize}
              params={this.state.restrictionParams}
              nonexclusive={true}
              onChange={(params) => this.setState({ countParams: params })}
              format={this.state.selectedFormat.group}
            />
            <RandoRow
              iconClass="ss ss-pmtg1 ss-2x"
              help="The sets that cards should be drawn from."
              label="Sets"
            >
              <div className="widget-wrapper">
                <Multiselect
                  placeholder="Any Set"
                  filter="contains"
                  data={this.state.sets}
                  textField={(s) => s.name}
                  value={this.state.selectedSets}
                  busy={this.state.setsLoading}
                  onChange={(newValue: MtGSet[]) =>
                    this.setState({ selectedSets: newValue })
                  }
                  itemComponent={({ item }) => (
                    <div>
                      <i
                        className={
                          'ss ss-2x ss-' + item.keyruneCode.toLowerCase()
                        }
                      ></i>{' '}
                      {item.name}
                    </div>
                  )}
                  tagComponent={({ item }) => (
                    <div>
                      <i
                        className={
                          'ss ss-2x ss-' + item.keyruneCode.toLowerCase()
                        }
                      ></i>{' '}
                      {item.code}
                    </div>
                  )}
                ></Multiselect>
              </div>
            </RandoRow>
            <RandoRow
              iconClass={
                'ss ss-2x ss-' +
                  this.state.sets[0]?.keyruneCode.toLowerCase() || 'htr'
              }
              help="The rarities of cards to use."
              label="Rarities"
            >
              <div className="widget-wrapper">
                <Multiselect
                  placeholder="Any Rarity"
                  filter="contains"
                  data={this.state.rarities}
                  textField={(r) => r.name}
                  busy={this.state.raritiesLoading}
                  onChange={(newValue: Lookup[]) =>
                    this.setState({ selectedRarities: newValue })
                  }
                  itemComponent={({ item }) => (
                    <div>
                      <i
                        className={
                          'ss ss-2x ss-' +
                          (this.state.sets[0]?.keyruneCode.toLowerCase() ||
                            'htr') +
                          ' ss-grad ss-' +
                          item.name.toLowerCase()
                        }
                      ></i>{' '}
                      {item.name}
                    </div>
                  )}
                  tagComponent={({ item }) => (
                    <div>
                      <i
                        className={
                          'ss ss-2x ss-' +
                          (this.state.sets[0]?.keyruneCode.toLowerCase() ||
                            'htr') +
                          ' ss-grad ss-' +
                          item.name.toLowerCase()
                        }
                      ></i>{' '}
                      {item.name}
                    </div>
                  )}
                ></Multiselect>
              </div>
            </RandoRow>
            <RandoRow iconClass="ss ss-pbook ss-2x" label="Artists">
              <div className="widget-wrapper">
                <Multiselect
                  placeholder="Any Artist"
                  filter="contains"
                  data={this.state.artists}
                  textField={(r) => r.name}
                  busy={this.state.artistsLoading}
                  onChange={(newValue: Lookup[]) =>
                    this.setState({ selectedArtists: newValue })
                  }
                ></Multiselect>
              </div>
            </RandoRow>
            <RandoRow iconClass="ss ss-bcore ss-2x" label="Frames">
              <div className="widget-wrapper">
                <Multiselect
                  placeholder="Any Frame Style"
                  filter="contains"
                  data={this.state.frames}
                  textField={(r) => r.name}
                  busy={this.state.framesLoading}
                  onChange={(newValue: Lookup[]) =>
                    this.setState({ selectedFrames: newValue })
                  }
                ></Multiselect>
              </div>
            </RandoRow>
          </Collapsible>
          <Collapsible
            trigger={
              <div className={styles.collapsibleHeader}>
                <h2 className="beleren">Card Types</h2>
                <FontAwesomeIcon
                  icon={this.state.cardTypesOpen ? faMinus : faPlus}
                  size="2x"
                ></FontAwesomeIcon>
              </div>
            }
            onOpen={() => this.setState({ cardTypesOpen: true })}
            onClose={() => this.setState({ cardTypesOpen: false })}
            easing="ease-in-out"
            overflowWhenOpen="visible"
          >
            <MtGSliderList
              max={this.state.selectedFormat.deckSize}
              params={this.state.countParams}
              onChange={(params) => this.setState({ countParams: params })}
              format={this.state.selectedFormat.group}
            />
            {this.state.selectedFormat.group === 'Commander' && (
              <MtGSliderList
                max={
                  this.state.selectedFormat.deckSize -
                  (this.state.countParams.find((p) => p.name === 'creatures')
                    ?.count || 0)
                }
                params={this.state.creatureTypeParams}
                nonexclusive={true}
                onChange={(params) => this.setState({ countParams: params })}
                format={this.state.selectedFormat.group}
              />
            )}
            <MtGSliderList
              max={
                this.state.selectedFormat.deckSize -
                (this.state.countParams.find((p) => p.name === 'basicLands')
                  ?.count || 0)
              }
              params={this.state.nonbasicParams}
              nonexclusive={true}
              onChange={(params) => this.setState({ nonbasicParams: params })}
              format={this.state.selectedFormat.group}
            />
          </Collapsible>
          <div className="button-row align-right">
            <button className={styles.btnPrimary}>
              <i className="ss ss-ugl"></i> Copy Link to these Settings
            </button>
            <button className={styles.btnPrimary} onClick={this.generateDeck}>
              <FontAwesomeIcon icon={faRandom}></FontAwesomeIcon> Generate Deck
            </button>
          </div>
        </div>
        <div className={`${styles.rightCol} gutter`}>
          {this.state.selectedFormat.group === 'Commander' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3 className="beleren">Commander</h3>
                <CardPreview
                  selectedCard={this.state.selectedCommander}
                ></CardPreview>
              </div>
              {this.state.selectedPartner && (
                <div>
                  <h3 className="beleren">Partner</h3>
                  <CardPreview
                    selectedCard={this.state.selectedPartner}
                  ></CardPreview>
                </div>
              )}
            </div>
          ) : this.state.selectedFormat.group === 'Oathbreaker' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3 className="beleren">Oathbreaker</h3>
                <CardPreview
                  selectedCard={this.state.selectedCommander}
                ></CardPreview>
              </div>
              <div>
                <h3 className="beleren">Signature Spell</h3>
                <CardPreview
                  selectedCard={this.state.selectedSpell}
                ></CardPreview>
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
