import React, { Component } from 'react'
import CardPreview from '../CardPreview'
import MtGSliderList from '../MtGSliderList'
import RandoRow from '../RandoRow'
import DropdownList from 'react-widgets/lib/DropdownList'
import Multiselect from 'react-widgets/lib/Multiselect'

import 'react-widgets/lib/scss/react-widgets.scss'
import styles from './styles.module.scss'
import 'mana-font'
import 'keyrune'
import ColorSelect from '../ColorSelect'

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
  maxCards: number
  countParams: CountParam[]
  miscParams: CountParam[]
  edhrecParams: CountParam[]
  edhOnlyParams: CountParam[]
  rarities: Lookup[]
  selectedRarities: Lookup[]
  raritiesLoading: boolean
  sets: MtGSet[]
  selectedSets: MtGSet[]
  setsLoading: boolean
  // watermarks: Lookup[]
  // selectedWatermarks: Lookup[]
  // watermarksLoading: boolean
  artists: Lookup[]
  selectedArtists: Lookup[]
  artistsLoading: boolean
  frames: Lookup[]
  selectedFrames: Lookup[]
  framesLoading: boolean
  // layouts: Lookup[]
  // selectedLayouts: Lookup[]
  // layoutsLoading: boolean
}

class MtGRando extends React.Component<{}, MtGRandoState> {
  formats: Format[]

  constructor(props: {}) {
    super(props)
    this.selectCommander = this.selectCommander.bind(this)
    this.selectPartner = this.selectPartner.bind(this)
    this.selectFormat = this.selectFormat.bind(this)
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
      maxCards: 99,
      edhrecParams: [
        {
          name: 'edhrecrank',
          iconClass: 'ss ss-cmd',
          label: 'EDHREC Rank Percentile',
          help:
            'The "goodness" range of the cards to pick. This value is relative to the pool of possible cards.',
          enabled: true,
          isRange: true,
          range: [1, 100],
          min: 1,
          max: 100,
        },
      ],
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
      ],
      edhOnlyParams: [
        {
          name: 'sharesTypes',
          iconClass: 'ms ms-infinity',
          label: 'Shares a Creature Type with Commander(s)',
          help:
            'The MINIMUM number of cards to include that share at least one creature type with your commander. If this bar is maxed, the generator will attempt to make all applicable cards share at least one creature type.',
          enabled: true,
          count: 0,
        },
      ],
      rarities: [],
      selectedRarities: [],
      raritiesLoading: false,
      sets: [],
      selectedSets: [],
      setsLoading: false,
      // watermarks: [],
      // selectedWatermarks: [],
      // watermarksLoading: false,
      artists: [],
      selectedArtists: [],
      artistsLoading: false,
      frames: [],
      selectedFrames: [],
      framesLoading: false,
      // layouts: [],
      // selectedLayouts: [],
      // layoutsLoading: false,
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

  // async getWatermarks() {
  //   this.setState({
  //     watermarksLoading: true,
  //   })

  //   const response = await fetch(`${process.env.GATSBY_API_URL}/MtG/Watermarks`)

  //   if (response.ok) {
  //     const data = await response.json()
  //     this.setState({
  //       watermarks: data,
  //       watermarksLoading: false,
  //     })
  //   }
  // }

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

  // async getLayouts() {
  //   this.setState({
  //     layoutsLoading: true,
  //   })

  //   const response = await fetch(`${process.env.GATSBY_API_URL}/MtG/Layouts`)

  //   if (response.ok) {
  //     const data = await response.json()
  //     this.setState({
  //       layouts: data,
  //       layoutsLoading: false,
  //     })
  //   }
  // }

  async componentDidMount() {
    //this.getWatermarks()
    this.getRarities()
    //this.getLayouts()
    this.getFrames()
    this.selectFormat()
    this.getArtists()
  }

  selectFormat(newValue?: Format) {
    const format = newValue || this.formats[0]

    this.setState({
      selectedFormat: format,
      selectedCommander: undefined,
      selectedPartner: undefined,
      selectedSpell: undefined,
      silverBorder: this.state.silverBorder && format.allowSilver,
    })

    if (format.group === 'Commander' || format.group === 'Oathbreaker') {
      this.getCommanders(format.name, this.state.silverBorder && format.allowSilver)
    } else {
      this.setState({
        commanders: [],
        partners: [],
        signatureSpells: [],
      })
    }

    this.getSets(format.name, this.state.silverBorder && format.allowSilver);
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

  selectCommander(newValue: Card) {
    this.setState({
      selectedCommander: newValue,
      selectedColors: newValue.colorIdentity,
    })

    if (this.state.selectedFormat.group === 'Commander') {
      this.getPartners(newValue.id)
    } else if (this.state.selectedFormat.group === 'Oathbreaker') {
      this.getSignatureSpells(newValue.id)
    }
  }

  selectPartner(newValue: Card) {
    const set = [
      ...new Set([
        ...(this.state.selectedCommander?.colorIdentity || []),
        ...newValue.colorIdentity,
      ]),
    ]

    this.setState({
      selectedPartner: newValue,
      selectedColors: set,
    })
  }

  render() {
    return (
      <div className={styles.mtgContainerOuter}>
        <div className={`${styles.leftCol} gutter`}>
          <RandoRow label="Format" help="The format to generate a deck for.">
            <div className="full-width">
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
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => this.toggleSilver(e.target.checked)}
                  ></input>
                  Allow silver-bordered cards
                </label>
              )}
            </div>
          </RandoRow>
          <RandoRow
            label="Color Identity"
            help="The color identity of cards allowed in the deck. Based on your Commander or Oathbreaker in those formats."
          >
            <div className="full-width">
              <ColorSelect
                selectedColors={this.state.selectedColors}
                onChange={(params) => this.setState({ selectedColors: params })}
              />
            </div>
          </RandoRow>
          {(this.state.selectedFormat.group === 'Commander' ||
            this.state.selectedFormat.group === 'Oathbreaker') && (
            <RandoRow
              label={this.state.selectedFormat.group}
              help="Your deck's leader. Determines color identity. Leave blank ('Surprise me') to have a card of the selected colors picked for you."
            >
              <div className="full-width">
                <div className="flex-container">
                  <button
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
                    Random {this.state.selectedFormat.group}
                  </button>
                  <button
                    onClick={() =>
                      this.setState({
                        selectedCommander: undefined,
                      })
                    }
                  >
                    Clear
                  </button>
                </div>
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
              </div>
            </RandoRow>
          )}
          {this.state.partners.length > 0 && (
            <RandoRow label="Partner" help="Your second commander.">
              <div className="full-width">
                <button
                  onClick={() => {
                    this.selectPartner(
                      this.state.partners[
                        Math.floor(Math.random() * this.state.partners.length)
                      ]
                    )
                  }}
                >
                  Random Partner
                </button>
                <button
                  onClick={() =>
                    this.setState({
                      selectedPartner: undefined,
                    })
                  }
                >
                  Clear
                </button>
                <DropdownList
                  placeholder="Surprise Me"
                  filter="contains"
                  data={this.state.partners}
                  textField="name"
                  value={this.state.selectedPartner}
                  busy={this.state.partnersLoading}
                  onChange={this.selectPartner}
                ></DropdownList>
              </div>
            </RandoRow>
          )}
          {this.state.selectedFormat.group === 'Oathbreaker' && (
            <RandoRow
              label="Signature Spell"
              help="Your Oathbreaker's signature spell. You can cast the spell as long as your Oathbreaker is on the battlefield."
            >
              <div className="full-width">
                <button
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
                  Random Signature Spell
                </button>
                <button
                  onClick={() =>
                    this.setState({
                      selectedSpell: undefined,
                    })
                  }
                >
                  Clear
                </button>
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
              </div>
            </RandoRow>
          )}
          {(this.state.selectedFormat.group === 'Commander' ||
            this.state.selectedFormat.group === 'Oathbreaker') && (
            <MtGSliderList
              max={this.state.maxCards}
              params={this.state.edhrecParams}
              nonexclusive={true}
              onChange={(params) => this.setState({ countParams: params })}
            />
          )}
          <MtGSliderList
            max={this.state.maxCards}
            params={this.state.countParams}
            onChange={(params) => this.setState({ countParams: params })}
          />
          {this.state.selectedFormat.group === 'Commander' && (
            <MtGSliderList
              max={this.state.maxCards}
              params={this.state.edhOnlyParams}
              nonexclusive={true}
              onChange={(params) => this.setState({ countParams: params })}
            />
          )}
          <MtGSliderList
            max={this.state.maxCards}
            params={this.state.miscParams}
            nonexclusive={true}
            onChange={(params) => this.setState({ miscParams: params })}
          />
          <RandoRow
            iconClass="ss ss-pmtg1"
            help="The sets that cards should be drawn from."
            label="Sets"
          >
            <div className="full-width">
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
              ></Multiselect>
            </div>
          </RandoRow>
          <RandoRow
            iconClass="ss ss-htr"
            help="The rarities of cards to use."
            label="Rarities"
          >
            <div className="full-width">
              <Multiselect
                placeholder="Any Rarity"
                filter="contains"
                data={this.state.rarities}
                textField={(r) => r.name}
                busy={this.state.raritiesLoading}
                onChange={(newValue: Lookup[]) =>
                  this.setState({ selectedRarities: newValue })
                }
              ></Multiselect>
            </div>
          </RandoRow>
          {/* <RandoRow iconClass="ss ss-izzet" help="" label="Watermarks">
            <div className="full-width">
              <Multiselect
                placeholder="Any/No Watermark"
                filter="contains"
                data={this.state.watermarks}
                textField={(r) => r.name}
                busy={this.state.watermarksLoading}
                onChange={(newValue: Lookup[]) =>
                  this.setState({ selectedWatermarks: newValue })
                }
              ></Multiselect>
            </div>
          </RandoRow> */}
          <RandoRow iconClass="ss ss-pbook" help="" label="Artists">
            <div className="full-width">
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
          <RandoRow iconClass="ss ss-bcore" help="" label="Frames">
            <div className="full-width">
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
          {/* <RandoRow iconClass="ss ss-bcore" help="" label="Layouts">
            <div className="full-width">
              <Multiselect
                placeholder="Any Layout"
                filter="contains"
                data={this.state.layouts}
                textField={(r) => r.name}
                busy={this.state.layoutsLoading}
                onChange={(newValue: Lookup[]) =>
                  this.setState({ selectedLayouts: newValue })
                }
              ></Multiselect>
            </div>
          </RandoRow> */}
          <RandoRow iconClass="ss ss-ugl" help="" label="Share Link">
            <input type="text" readOnly />
          </RandoRow>
        </div>
        <div className={`${styles.rightCol} gutter`}>
          <div>
            {`Cards: ${this.state.countParams.reduce(
              (total, param) => total + (param.count || 0),
              0
            )} / ${this.state.maxCards}`}
          </div>
          {this.state.selectedFormat.group === 'Commander' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3>Commander</h3>
                <CardPreview
                  selectedCard={this.state.selectedCommander}
                ></CardPreview>
              </div>
              {this.state.selectedPartner && (
                <div>
                  <h3>Partner</h3>
                  <CardPreview
                    selectedCard={this.state.selectedPartner}
                  ></CardPreview>
                </div>
              )}
            </div>
          ) : this.state.selectedFormat.group === 'Oathbreaker' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3>Oathbreaker</h3>
                <CardPreview
                  selectedCard={this.state.selectedCommander}
                ></CardPreview>
              </div>
              <div>
                <h3>Signature Spell</h3>
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
