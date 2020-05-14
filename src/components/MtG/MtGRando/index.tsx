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
  randomIdentity: boolean
  selectedColors: string[]
  silverBorder: boolean
  maxCards: number
  countParams: CountParam[]
  miscParams: CountParam[]
  rarities: Lookup[]  
  selectedRarities: Lookup[]
  raritiesLoading: boolean
  sets: MtGSet[]
  selectedSets: MtGSet[]
  setsLoading: boolean
  watermarks: Lookup[]
  selectedWatermarks: Lookup[]
  watermarksLoading: boolean
  artists: Lookup[]
  selectedArtists: Lookup[]
  artistsLoading: boolean
  frames: Lookup[]
  selectedFrames: Lookup[]
  framesLoading: boolean
  layouts: Lookup[]
  selectedLayouts: Lookup[]
  layoutsLoading: boolean
}

class MtGRando extends React.Component<{}, MtGRandoState> {
  formats: Format[]

  constructor(props: {}) {
    super(props)
    this.toggleColor = this.toggleColor.bind(this)
    this.selectCommander = this.selectCommander.bind(this)
    this.selectFormat = this.selectFormat.bind(this)
    this.formats = [
      {
        group: "Commander",
        name: "Commander",
        deckSize: 99,
      },
      {
        group: "Commander",
        name: "Brawl",
        deckSize: 59,
      },
      {
        group: "Commander",
        name: "Pauper",
        deckSize: 99,
      },
      {
        group: "Commander",
        name: "Tiny Leaders",
        deckSize: 49,
      },
      {
        group: "Oathbreaker",
        name: "Oathbreaker",
        deckSize: 58,
      },
      {
        group: "Normal MtG",
        name: "Standard",
        deckSize: 60,
      },
      {
        group: "Normal MtG",
        name: "Modern",
        deckSize: 60,
      },
      {
        group: "Normal MtG",
        name: "Pioneer",
        deckSize: 60,
      },
      {
        group: "Normal MtG",
        name: "Legacy",
        deckSize: 60,
      },
      {
        group: "Normal MtG",
        name: "Vintage",
        deckSize: 60,
      },
      {
        group: "Normal MtG",
        name: "Pauper",
        deckSize: 60,
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
      rarities: [],
      selectedRarities: [],
      raritiesLoading: false,
      sets: [],
      selectedSets: [],
      setsLoading: false,
      watermarks: [],
      selectedWatermarks: [],
      watermarksLoading: false,
      artists: [],
      selectedArtists: [],
      artistsLoading: false,
      frames: [],
      selectedFrames: [],
      framesLoading: false,
      layouts: [],
      selectedLayouts: [],
      layoutsLoading: false,
    }
  }

  async getCommanders(variant: string) {
    this.setState({
      commanders: [],
      commandersLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Commanders?variant=${variant}`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        commanders: data,
        commandersLoading: false
      })
    }
  }

  async getPartners(cmdrId: number) {
    this.setState({
      partners: [],
      partnersLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Partners?cmdrId=${cmdrId}&variant=${this.state.selectedFormat.name}`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        partners: data,
        partnersLoading: false
      })
    }
  }

  async getSignatureSpells(obId: number) {
    this.setState({
      signatureSpells: [],
      spellsLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/SignatureSpells?obId=${obId}`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        signatureSpells: data,
        spellsLoading: false
      })
    }
  }

  async getSets() {
    this.setState({
      setsLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Sets`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        sets: data,
        setsLoading: false
      })
    }
  }

  async getWatermarks() {
    this.setState({
      watermarksLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Watermarks`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        watermarks: data,
        watermarksLoading: false
      })
    }
  }

  async getRarities() {
    this.setState({
      raritiesLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Rarities`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        rarities: data,
        raritiesLoading: false
      })
    }
  }

  async getFrames() {
    this.setState({
      framesLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Frames`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        frames: data,
        framesLoading: false
      })
    }
  }

  async getLayouts() {
    this.setState({
      layoutsLoading: true
    })

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/Layouts`
    )

    if (response.ok) {
      const data = await response.json()
      this.setState({
        layouts: data,
        layoutsLoading: false
      })
    }
  }

  async componentDidMount() {
    this.getSets()
    this.getWatermarks()
    this.getRarities()
    this.getLayouts()
    this.getFrames()
    this.selectFormat()
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
  
  selectFormat(newValue?: Format) {
    const format = newValue || this.formats[0]
    if (format.group === "Commander" || format.group === "Oathbreaker") {
      this.getCommanders(format.name)
    } else {
      this.setState({
        commanders: [],
        partners: [],
        signatureSpells: []
      })
    }
    
    this.setState({
      selectedFormat: format,
      selectedCommander: undefined,
      selectedPartner: undefined,
      selectedSpell: undefined,
    })
  }

  selectCommander(newValue: Card) {
    this.setState({selectedCommander: newValue})

    if (this.state.selectedFormat.group === "Commander") {
      this.getPartners(newValue.id)
    } else if (this.state.selectedFormat.group === "Oathbreaker") {
      this.getSignatureSpells(newValue.id)
    }
  }

  render() {
    return (
      <div className={styles.mtgContainerOuter}>
        <div className={`${styles.leftCol} gutter`}>
            <div>
              <label>Format</label>
              <DropdownList
                placeholder="Select a Format"
                filter="contains"
                data={this.formats}
                textField="name"
                groupBy="group"
                value={this.state.selectedFormat}
                onChange={this.selectFormat}></DropdownList>
            </div>
          {(this.state.selectedFormat.group === 'Commander' ||
            this.state.selectedFormat.group === 'Oathbreaker') && (
            <div>
              <label>{this.state.selectedFormat.group}</label>
              <DropdownList
                placeholder="Surprise Me"
                filter="contains"
                data={this.state.commanders}
                textField="name"
                value={this.state.selectedCommander}
                busy={this.state.commandersLoading || this.state.partnersLoading}
                onChange={this.selectCommander}></DropdownList>
            </div>
          )}
          {this.state.partners.length > 0 && (
            <div>
              <label>Partner</label>
              <DropdownList
                placeholder="Surprise Me"
                filter="contains"
                data={this.state.partners}
                textField="name"
                value={this.state.selectedPartner}
                busy={this.state.partnersLoading}
                onChange={(newValue: Card) => this.setState({selectedPartner: newValue})}></DropdownList>
            </div>
          )}
          {this.state.selectedFormat.group === 'Oathbreaker' && (
            <div>
              <label>Signature Spell</label>
              <DropdownList
                placeholder="Surprise Me"
                filter="contains"
                data={this.state.signatureSpells}
                textField="name"
                value={this.state.selectedSpell}
                busy={this.state.spellsLoading}
                onChange={(newValue: Card) => this.setState({selectedSpell: newValue})}></DropdownList>
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
          <RandoRow iconClass="ss ss-pmtg1" help="The sets that cards should be drawn from." label="Sets" >
              <Multiselect
                placeholder="Any Set"
                filter="contains"
                data={this.state.sets}
                textField={(s) => s.name}
                value={this.state.selectedSets}
                busy={this.state.setsLoading}
                onChange={(newValue: MtGSet[]) => this.setState({selectedSets: newValue})}></Multiselect>
          </RandoRow>
          <RandoRow iconClass="ss ss-htr" help="The rarities of cards to use." label="Rarities" >
              <Multiselect
                placeholder="Any Rarity"
                filter="contains"
                data={this.state.rarities}
                textField={(r) => r.name}
                busy={this.state.raritiesLoading}
                onChange={(newValue: Lookup[]) => this.setState({selectedRarities: newValue})}></Multiselect>
          </RandoRow>
          <RandoRow iconClass="ss ss-izzet" help="" label="Watermarks" >
              <Multiselect
                placeholder="Any/No Watermark"
                filter="contains"
                data={this.state.watermarks}
                textField={(r) => r.name}
                busy={this.state.watermarksLoading}
                onChange={(newValue: Lookup[]) => this.setState({selectedWatermarks: newValue})}></Multiselect>
          </RandoRow>
          <RandoRow iconClass="ss ss-pbook" help="" label="Artists" >
              <Multiselect
                placeholder="Any Artist"
                filter="contains"
                data={this.state.artists}
                textField={(r) => r.name}
                busy={this.state.artistsLoading}
                onChange={(newValue: Lookup[]) => this.setState({selectedArtists: newValue})}></Multiselect>
          </RandoRow>
          <RandoRow iconClass="ss ss-bcore" help="" label="Frames" >
              <Multiselect
                placeholder="Any Frame Style"
                filter="contains"
                data={this.state.frames}
                textField={(r) => r.name}
                busy={this.state.framesLoading}
                onChange={(newValue: Lookup[]) => this.setState({selectedFrames: newValue})}></Multiselect>
          </RandoRow>
          <RandoRow iconClass="ss ss-bcore" help="" label="Layouts" >
              <Multiselect
                placeholder="Any Layout"
                filter="contains"
                data={this.state.layouts}
                textField={(r) => r.name}
                busy={this.state.layoutsLoading}
                onChange={(newValue: Lookup[]) => this.setState({selectedLayouts: newValue})}></Multiselect>
          </RandoRow>
          <RandoRow iconClass="ss ss-ugl" help="" label="Share Link" >
              <input type="text" readOnly />
          </RandoRow>
        </div>
        <div className={`${styles.rightCol} gutter`}>
          {this.state.selectedFormat.group === 'Commander' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3>Commander</h3>
                <CardPreview selectedCard={this.state.selectedCommander}></CardPreview>
              </div>
              {this.state.selectedPartner && (
                <div>
                  <h3>Partner</h3>
                  <CardPreview selectedCard={this.state.selectedPartner}></CardPreview>
                </div>
              )}
            </div>
          ) : this.state.selectedFormat.group === 'Oathbreaker' ? (
            <div className={styles.cmdrPreview}>
              <div>
                <h3>Oathbreaker</h3>
                <CardPreview selectedCard={this.state.selectedCommander}></CardPreview>
              </div>
              <div>
                <h3>Signature Spell</h3>
                <CardPreview selectedCard={this.state.selectedSpell}></CardPreview>
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
