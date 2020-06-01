import React, { Component } from 'react'
import CardPreview from '../CardPreview'
import MtGSliderList from '../MtGSliderList'
import ColorSelect from '../ColorSelect'
import RandoRow from '../RandoRow'
import ShuffleLoader from '../ShuffleLoader'
import DropdownList from 'react-widgets/lib/DropdownList'
import Multiselect from 'react-widgets/lib/Multiselect'
import Collapsible from 'react-collapsible'
import update from 'immutability-helper'
import { ToastContainer, toast } from 'react-toastify'

import '../../../styles-global/react-widgets-theme.scss'
import styles from './styles.module.scss'
import 'react-toastify/dist/ReactToastify.css'
import 'keyrune'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faMinus,
  faTimes,
  faRandom,
  faDice,
  faCopy,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

interface SharedProps extends Record<string, string> {
  deckType: string
  format: string
  silverBorder: string
  edhRecRange: string
  cmcRange: string
  setIds: string
  rarityIds: string
  artistIds: string
  frameIds: string
  basicLands: string
  nonbasicLands: string
  creatures: string
  sharesType: string
  artifacts: string
  equipment: string
  vehicles: string
  enchantments: string
  auras: string
  planeswalkers: string
  spells: string
  manaProducing: string
  legendary: string
}

interface RandoRequest {
  deckType: string
  format: string
  deckSize: number
  silverBorder: boolean
  commanderId?: number
  partnerId?: number
  signatureSpellId?: number
  colorIdentity: string[]
  edhRecRange?: NumberRange
  cmcRange: NumberRange
  setIds: number[]
  rarityIds: number[]
  artistIds: number[]
  frameIds: number[]
  basicLands: number
  nonbasicLands: number
  creatures: number
  sharesType?: number
  artifacts: number
  equipment: number
  vehicles: number
  enchantments: number
  auras: number
  planeswalkers: number
  spells: number
  manaProducing: number
  legendary: number
}

interface Format {
  deckType: string
  name: string
  deckSize: number
  allowSilver: boolean
}

interface MtGRandoState {
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
  generating: boolean
  generated: boolean
  generatedDeck: string
}

class MtGRando extends React.Component<{}, MtGRandoState> {
  formats: Format[]
  defaultRestrictions: CountParam[]
  defaultCounts: CountParam[]
  nonbasicCounts: CountParam[]

  constructor(props: {}) {
    super(props)
    this.getSettingsLink = this.getSettingsLink.bind(this)
    this.loadSettingsFromQueryString = this.loadSettingsFromQueryString.bind(
      this
    )
    this.selectCommander = this.selectCommander.bind(this)
    this.selectPartner = this.selectPartner.bind(this)
    this.selectFormat = this.selectFormat.bind(this)
    this.generateDeck = this.generateDeck.bind(this)
    this.reset = this.reset.bind(this)
    this.copySettingsToClipboard = this.copySettingsToClipboard.bind(this)
    this.copyDeckToClipboard = this.copyDeckToClipboard.bind(this)
    this.formats = [
      {
        deckType: 'Commander',
        name: 'Commander',
        deckSize: 99,
        allowSilver: true,
      },
      {
        deckType: 'Commander',
        name: 'Brawl',
        deckSize: 59,
        allowSilver: false,
      },
      {
        deckType: 'Commander',
        name: 'Pauper',
        deckSize: 99,
        allowSilver: true,
      },
      {
        deckType: 'Commander',
        name: 'Tiny Leaders',
        deckSize: 49,
        allowSilver: true,
      },
      {
        deckType: 'Oathbreaker',
        name: 'Oathbreaker',
        deckSize: 58,
        allowSilver: true,
      },
      {
        deckType: 'Normal MtG',
        name: 'Standard',
        deckSize: 60,
        allowSilver: false,
      },
      {
        deckType: 'Normal MtG',
        name: 'Modern',
        deckSize: 60,
        allowSilver: false,
      },
      {
        deckType: 'Normal MtG',
        name: 'Pioneer',
        deckSize: 60,
        allowSilver: false,
      },
      {
        deckType: 'Normal MtG',
        name: 'Legacy',
        deckSize: 60,
        allowSilver: false,
      },
      {
        deckType: 'Normal MtG',
        name: 'Vintage',
        deckSize: 60,
        allowSilver: true,
      },
      {
        deckType: 'Normal MtG',
        name: 'Pauper',
        deckSize: 60,
        allowSilver: true,
      },
      {
        deckType: 'Normal MtG',
        name: 'Penny Dreadful',
        deckSize: 60,
        allowSilver: true,
      },
    ]
    this.defaultRestrictions = [
      {
        name: 'edhrecrank',
        iconClass: 'ss ss-cmd ss-2x',
        label: 'EDHREC Rank Percentile',
        help:
          'The "goodness" range of the cards to pick. This value is relative to the pool of possible cards. Note that silver-bordered cards are not ranked, so changing this value may exclude them.',
        isRange: true,
        range: [0, 100],
        min: 0,
        max: 100,
        showForFormats: ['Commander', 'Oathbreaker'],
      },
      {
        name: 'cmc',
        iconClass: 'ms ms-x ms-2x',
        label: 'Converted Mana Cost Range',
        help:
          'The range of values within which all converted mana costs must lie.',
        isRange: true,
        range: [0, 16],
        min: 0,
        max: 16,
      },
    ]
    this.defaultCounts = [
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
        children: [
          {
            name: 'sharesTypes',
            iconClass: 'ms ms-creature ms-2x',
            label: 'Shares a Creature Type with Commander(s)',
            help:
              'The MINIMUM number of cards to include that share at least one creature type with your commander. If this bar is maxed, the generator will attempt to make all applicable cards share at least one creature type.',
            enabled: true,
            count: 0,
            showForFormats: ['Commander'],
          },
        ],
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
    ]
    this.nonbasicCounts = [
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
    ]
    this.state = {
      selectedFormat: this.formats[0],
      commanders: [],
      commandersLoading: false,
      partners: [],
      partnersLoading: false,
      signatureSpells: [],
      spellsLoading: false,
      selectedColors: ['W', 'U', 'B', 'R', 'G'],
      silverBorder: false,
      restrictionParams: this.defaultRestrictions,
      countParams: this.defaultCounts,
      nonbasicParams: this.nonbasicCounts,
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
      generating: false,
      generated: false,
      generatedDeck: '',
    }
  }

  getSettingsLink() {
    const params: SharedProps = {
      deckType: this.state.selectedFormat.deckType,
      format: this.state.selectedFormat.name,
      silverBorder: (
        this.state.selectedFormat.allowSilver && this.state.silverBorder
      ).toString(),
      edhRecRange: (
        this.state.restrictionParams.find(
          (param) => param.name === 'edhrecrank'
        )?.range || [0, 100]
      ).toString(),
      cmcRange: (
        this.state.restrictionParams.find((param) => param.name === 'cmc')
          ?.range || [0, 16]
      ).toString(),
      setIds: this.state.selectedSets.map((o) => o.id).toString(),
      rarityIds: this.state.selectedRarities.map((o) => o.id).toString(),
      artistIds: this.state.selectedArtists.map((o) => o.id).toString(),
      frameIds: this.state.selectedFrames.map((o) => o.id).toString(),
      basicLands: this.getCountOrDisabled('basicLands').toString(),
      nonbasicLands: this.getCountOrDisabled('nonbasicLands').toString(),
      creatures: this.getCountOrDisabled('creatures').toString(),
      sharesType: this.getCountOrDisabled('sharesTypes').toString(),
      artifacts: this.getCountOrDisabled('artifacts').toString(),
      equipment: this.getCountOrDisabled('equipment').toString(),
      vehicles: this.getCountOrDisabled('vehicles').toString(),
      enchantments: this.getCountOrDisabled('enchantments').toString(),
      auras: this.getCountOrDisabled('auras').toString(),
      planeswalkers: this.getCountOrDisabled('planeswalkers').toString(),
      spells: this.getCountOrDisabled('spells').toString(),
      manaProducing: this.getCountOrDisabled('manaProducing').toString(),
      legendary: this.getCountOrDisabled('legendary').toString(),
    }

    return `${window.location.origin}${window.location.pathname.replace(
      /\/$/,
      ''
    )}?${new URLSearchParams(params)}`
  }

  async loadSettingsFromQueryString() {
    const urlParams = new URLSearchParams(window.location.search)

    const params: SharedProps = {
      deckType: urlParams.get('deckType') || this.formats[0].deckType,
      format: urlParams.get('format') || this.formats[0].name,
      silverBorder: urlParams.get('silverBorder') || 'false',
      edhRecRange: urlParams.get('edhRecRange') || '0,100',
      cmcRange: urlParams.get('cmcRange') || '0,16',
      setIds: urlParams.get('setIds') || '',
      rarityIds: urlParams.get('rarityIds') || '',
      artistIds: urlParams.get('artistIds') || '',
      frameIds: urlParams.get('frameIds') || '',
      basicLands:
        urlParams.get('basicLands') ||
        this.findRecursive(
          this.defaultCounts,
          'basicLands'
        )?.count?.toString() ||
        '0',
      nonbasicLands:
        urlParams.get('nonbasicLands') ||
        this.findRecursive(
          this.defaultCounts,
          'nonbasicLands'
        )?.count?.toString() ||
        '0',
      creatures:
        urlParams.get('creatures') ||
        this.findRecursive(
          this.defaultCounts,
          'creatures'
        )?.count?.toString() ||
        '0',
      sharesType:
        urlParams.get('sharesType') ||
        this.findRecursive(
          this.defaultCounts,
          'sharesType'
        )?.count?.toString() ||
        '0',
      artifacts:
        urlParams.get('artifacts') ||
        this.findRecursive(
          this.defaultCounts,
          'artifacts'
        )?.count?.toString() ||
        '0',
      equipment:
        urlParams.get('equipment') ||
        this.findRecursive(
          this.defaultCounts,
          'equipment'
        )?.count?.toString() ||
        '0',
      vehicles:
        urlParams.get('vehicles') ||
        this.findRecursive(this.defaultCounts, 'vehicles')?.count?.toString() ||
        '0',
      enchantments:
        urlParams.get('enchantments') ||
        this.findRecursive(
          this.defaultCounts,
          'enchantments'
        )?.count?.toString() ||
        '0',
      auras:
        urlParams.get('auras') ||
        this.findRecursive(this.defaultCounts, 'auras')?.count?.toString() ||
        '0',
      planeswalkers:
        urlParams.get('planeswalkers') ||
        this.findRecursive(
          this.defaultCounts,
          'planeswalkers'
        )?.count?.toString() ||
        '0',
      spells:
        urlParams.get('spells') ||
        this.findRecursive(this.defaultCounts, 'spells')?.count?.toString() ||
        '0',
      manaProducing:
        urlParams.get('manaProducing') ||
        this.findRecursive(
          this.defaultCounts,
          'manaProducing'
        )?.count?.toString() ||
        '0',
      legendary:
        urlParams.get('legendary') ||
        this.findRecursive(
          this.defaultCounts,
          'legendary'
        )?.count?.toString() ||
        '0',
    }

    const format = this.formats.find(
      (f) => f.deckType === params.deckType && f.name === params.format
    )

    await this.selectFormat(format)

    if (!format) {
      return
    }

    const selectedSets = params.setIds.split(',') || []
    const selectedRarities = params.rarityIds.split(',') || []
    const selectedArtists = params.artistIds.split(',') || []
    const selectedFrames = params.frameIds.split(',') || []

    const newRarities = this.state.rarities.filter(
      (r) => selectedRarities.indexOf(r.id.toString()) > -1
    )
    const newArtists = 
    this.state.artists.filter(
      (a) => selectedArtists.indexOf(a.id.toString()) > -1
    )
    const newFrames = 
    this.state.frames.filter(
      (f) => selectedFrames.indexOf(f.id.toString()) > -1
    )
    console.log(newRarities)
    console.log(newArtists)
    console.log(newFrames)

    let newCountParams = this.state.countParams

    newCountParams = this.setCountRecursive(
      newCountParams,
      'basicLands',
      parseInt(params.basicLands, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'nonbasicLands',
      parseInt(params.nonbasicLands, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'creatures',
      parseInt(params.creatures, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'sharesTypes',
      parseInt(params.sharesType, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'artifacts',
      parseInt(params.artifacts, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'equipment',
      parseInt(params.equipment, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'vehicles',
      parseInt(params.vehicles, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'enchantments',
      parseInt(params.enchantments, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'auras',
      parseInt(params.auras, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'planeswalkers',
      parseInt(params.planeswalkers, 10)
    )

    newCountParams = this.setCountRecursive(
      newCountParams,
      'spells',
      parseInt(params.spells, 10)
    )

    let newNonbasicParams = this.nonbasicCounts

    newNonbasicParams = this.setCountRecursive(
      newNonbasicParams,
      'manaProducing',
      parseInt(params.manaProducing, 10)
    )

    newNonbasicParams = this.setCountRecursive(
      newNonbasicParams,
      'legendary',
      parseInt(params.legendary, 10)
    )

    this.setState({
      silverBorder: params.silverBorder === 'true',
      restrictionParams: update(this.state.restrictionParams, {
        [this.state.restrictionParams.findIndex(
          (p) => p.name == 'edhrecrank'
        )]: {
          $merge: {
            range: params.edhRecRange.split(',').map((o) => parseInt(o, 10)),
          },
        },
        [this.state.restrictionParams.findIndex((p) => p.name == 'cmc')]: {
          $merge: {
            range: params.cmcRange.split(',').map((o) => parseInt(o, 10)),
          },
        },
      }),
      selectedSets: this.state.sets.filter(
        (s) => selectedSets.indexOf(s.id.toString()) > -1
      ),
      selectedRarities: newRarities,
      selectedArtists: newArtists,
      selectedFrames: newFrames,
      countParams: newCountParams,
      nonbasicParams: newNonbasicParams,
    })
  }

  setCountRecursive(
    collection: CountParam[],
    name: string,
    count: number
  ): CountParam[] {
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].name === name) {
        collection = update(collection, { [i]: { $merge: { count: count } } })
      }

      const children = collection[i]?.children
      if (children) {
        collection = update(collection, { [i]: { $merge: { children: this.setCountRecursive(children, name, count) } } })
      }
    }

    return collection
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

      return data
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

      return data
    }
  }

  async getSets(variant: string, silverBorder: boolean) {
    this.setState({
      setsLoading: true,
      selectedSets: [],
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
      this.getSettingsLink()
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
    await Promise.all([this.getRarities(), this.getFrames(), this.getArtists()])

    this.loadSettingsFromQueryString()
  }

  async selectFormat(newValue?: Format) {
    const format = newValue || this.formats[0]

    const factor = format.deckSize / this.state.selectedFormat.deckSize
    let newCountParams = this.state.countParams
    for (let i = 0; i < this.state.countParams.length; i++) {
      const param = this.state.countParams[i]
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

    if (format.deckType === 'Commander' || format.deckType === 'Oathbreaker') {
      this.getCommanders(
        format.name,
        this.state.silverBorder && format.allowSilver
      )
    } else {
      this.setState({
        commanders: [],
      })
    }

    await this.getSets(
      format.name,
      this.state.silverBorder && format.allowSilver
    )
  }

  toggleSilver(newValue: boolean) {
    this.setState({
      silverBorder: newValue,
    })

    this.getSets(this.state.selectedFormat.name, newValue)
    if (
      this.state.selectedFormat.deckType === 'Commander' ||
      this.state.selectedFormat.deckType === 'Oathbreaker'
    ) {
      this.getCommanders(this.state.selectedFormat.name, newValue)
    }
  }

  getMaxCards() {
    return (
      this.state.selectedFormat.deckSize - (this.state.selectedPartner ? 1 : 0)
    )
  }

  async selectCommander(newValue?: Card) {
    if (newValue) {
      this.setState({
        selectedCommander: newValue,
        selectedColors: newValue.colorIdentity,
      })

      if (this.state.selectedFormat.deckType === 'Commander') {
        return await this.getPartners(newValue.id)
      } else if (this.state.selectedFormat.deckType === 'Oathbreaker') {
        return await this.getSignatureSpells(newValue.id)
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
    let colors
    if (newValue) {
      colors = [
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
      colors = this.state.selectedCommander?.colorIdentity || [
        'W',
        'U',
        'B',
        'R',
        'G',
      ]

      this.setState({
        selectedPartner: undefined,
        selectedColors: colors,
      })
    }

    return colors
  }

  findRecursive(
    collection: CountParam[],
    name: string
  ): CountParam | undefined {
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].name === name) {
        return collection[i]
      }

      const children = collection[i]?.children
      if (children) {
        const result = this.findRecursive(children, name)
        if (result) {
          return result
        }
      }
    }

    return
  }

  getCountOrDisabled(name: string) {
    const allParams = [
      ...this.state.countParams,
      ...this.state.restrictionParams,
      ...this.state.nonbasicParams,
    ]

    const param = this.findRecursive(allParams, name)
    if (!param || !param.enabled || param.count === undefined) {
      return -1
    } else {
      return param.count
    }
  }

  async generateDeck() {
    this.setState({
      generating: true,
    })

    let cmdr = this.state.selectedCommander
    let partner = this.state.selectedPartner
    let signatureSpell = this.state.selectedSpell
    let colorIdentity = this.state.selectedColors

    let dependentColl =
      this.state.selectedFormat.deckType === 'Commander'
        ? this.state.partners
        : this.state.signatureSpells
    if (
      !cmdr &&
      (this.state.selectedFormat.deckType === 'Commander' ||
        this.state.selectedFormat.deckType === 'Oathbreaker')
    ) {
      cmdr = this.state.commanders[
        Math.floor(Math.random() * this.state.commanders.length)
      ]

      dependentColl = await this.selectCommander(cmdr)
      colorIdentity = cmdr.colorIdentity
    }

    if (
      !partner &&
      this.state.selectedFormat.deckType === 'Commander' &&
      dependentColl.length > 0
    ) {
      partner = dependentColl[Math.floor(Math.random() * dependentColl.length)]

      colorIdentity = this.selectPartner(partner)
    }

    if (
      !signatureSpell &&
      this.state.selectedFormat.deckType === 'Oathbreaker'
    ) {
      signatureSpell =
        dependentColl[Math.floor(Math.random() * dependentColl.length)]

      this.setState({
        selectedSpell: signatureSpell,
      })
    }

    const edhrecRange = this.state.restrictionParams.find(
      (param) => param.name === 'edhrecrank'
    )?.range || [0, 100]
    const cmcRange = this.state.restrictionParams.find(
      (param) => param.name === 'cmc'
    )?.range || [0, 16]

    const body: RandoRequest = {
      deckType: this.state.selectedFormat.deckType,
      format: this.state.selectedFormat.name,
      deckSize: this.getMaxCards(),
      silverBorder:
        this.state.selectedFormat.allowSilver && this.state.silverBorder,
      commanderId: cmdr?.id,
      partnerId: partner?.id,
      signatureSpellId: signatureSpell?.id,
      colorIdentity: colorIdentity,
      edhRecRange: {
        min: edhrecRange[0],
        max: edhrecRange[1],
      },
      cmcRange: {
        min: cmcRange[0],
        max: cmcRange[1],
      },
      setIds: this.state.selectedSets.map((o) => o.id),
      rarityIds: this.state.selectedRarities.map((o) => o.id),
      artistIds: this.state.selectedArtists.map((o) => o.id),
      frameIds: this.state.selectedArtists.map((o) => o.id),
      basicLands: this.getCountOrDisabled('basicLands'),
      nonbasicLands: this.getCountOrDisabled('nonbasicLands'),
      creatures: this.getCountOrDisabled('creatures'),
      sharesType: this.getCountOrDisabled('sharesTypes'),
      artifacts: this.getCountOrDisabled('artifacts'),
      equipment: this.getCountOrDisabled('equipment'),
      vehicles: this.getCountOrDisabled('vehicles'),
      enchantments: this.getCountOrDisabled('enchantments'),
      auras: this.getCountOrDisabled('auras'),
      planeswalkers: this.getCountOrDisabled('planeswalkers'),
      spells: this.getCountOrDisabled('spells'),
      manaProducing: this.getCountOrDisabled('manaProducing'),
      legendary: this.getCountOrDisabled('legendary'),
    }

    const response = await fetch(
      `${process.env.GATSBY_API_URL}/MtG/GenerateDeck`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (response.ok) {
      const results = await response.json()

      this.setState({
        generatedDeck: results.cards,
      })
    }

    this.setState({
      generating: false,
      generated: true,
    })
  }

  reset() {
    this.setState({
      generating: false,
      generated: false,
    })
  }

  copySettingsToClipboard() {
    const textarea = document.getElementById(
      'settings-text'
    ) as HTMLTextAreaElement

    textarea.value = this.getSettingsLink()
    textarea.select()
    document.execCommand('copy')

    toast.info('Copied Settings!')
  }

  copyDeckToClipboard() {
    const textarea = document.getElementById('deck-text') as HTMLTextAreaElement
    textarea.select()
    document.execCommand('copy')

    toast.info('Copied Deck!')
  }

  render() {
    return (
      <div
        className={
          styles.mtgContainerOuter +
          (this.state.generating || this.state.generated
            ? ' ' + styles.generating
            : '')
        }
      >
        <div className={styles.leftCol}>
          <RandoRow label="Format" help="The format to generate a deck for.">
            <div className="widget-wrapper">
              <DropdownList
                placeholder="Select a Format"
                filter="contains"
                data={this.formats}
                textField="name"
                groupBy="deckType"
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
          {(this.state.selectedFormat.deckType === 'Commander' ||
            this.state.selectedFormat.deckType === 'Oathbreaker') && (
            <RandoRow
              label={this.state.selectedFormat.deckType}
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
                    {this.state.selectedFormat.deckType}
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
          {this.state.selectedFormat.deckType === 'Oathbreaker' && (
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
              max={this.getMaxCards()}
              params={this.state.restrictionParams}
              nonexclusive={true}
              onChange={(params) =>
                this.setState({ restrictionParams: params })
              }
              format={this.state.selectedFormat.deckType}
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
                  value={this.state.selectedRarities}
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
                  value={this.state.selectedArtists}
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
                  value={this.state.selectedFrames}
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
              max={this.getMaxCards()}
              params={this.state.countParams}
              onChange={(params) => this.setState({ countParams: params })}
              format={this.state.selectedFormat.deckType}
            />
            <MtGSliderList
              max={
                this.getMaxCards() -
                (this.state.countParams.find((p) => p.name === 'basicLands')
                  ?.count || 0)
              }
              params={this.state.nonbasicParams}
              nonexclusive={true}
              onChange={(params) => this.setState({ nonbasicParams: params })}
              format={this.state.selectedFormat.deckType}
            />
          </Collapsible>
          <div className="button-row align-right">
            <button
              className={styles.btnPrimary}
              onClick={this.copySettingsToClipboard}
            >
              <i className="ss ss-ugl"></i> Copy Shareable Settings Link
            </button>
            <textarea
              id="settings-text"
              style={{ position: 'absolute', left: -9999 }}
            ></textarea>
            <button className={styles.btnPrimary} onClick={this.generateDeck}>
              <FontAwesomeIcon icon={faRandom}></FontAwesomeIcon> Generate Deck
            </button>
          </div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.cmdrPreview}>
            {(this.state.selectedFormat.deckType === 'Commander' ||
              this.state.selectedFormat.deckType === 'Oathbreaker') && (
              <div>
                <h3 className="beleren">
                  {this.state.selectedFormat.deckType}
                </h3>
                <CardPreview
                  selectedCard={this.state.selectedCommander}
                ></CardPreview>
              </div>
            )}
            <div
              className={`${styles.resultsContainer} ${
                this.state.generated ? styles.generated : ''
              }`}
            >
              <div className={styles.loader}>
                <ShuffleLoader></ShuffleLoader>
              </div>
              <div className={styles.results}>
                <h3>Result</h3>
                <div>
                  <button
                    className={styles.btnPrimary}
                    onClick={this.reset}
                    disabled={!this.state.generated}
                  >
                    <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon> Back
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={this.copyDeckToClipboard}
                  >
                    <FontAwesomeIcon icon={faCopy}></FontAwesomeIcon> Copy to
                    Clipboard
                  </button>
                  <button
                    className={styles.btnPrimary}
                    onClick={this.copySettingsToClipboard}
                  >
                    <i className="ss ss-ugl"></i> Copy Shareable Settings Link
                  </button>
                </div>
                <textarea
                  id="deck-text"
                  className={styles.resultBox}
                  value={this.state.generatedDeck}
                  readOnly={true}
                  onFocus={this.copyDeckToClipboard}
                ></textarea>
              </div>
            </div>
            {this.state.selectedPartner && (
              <div>
                <h3 className="beleren">Partner</h3>
                <CardPreview
                  selectedCard={this.state.selectedPartner}
                ></CardPreview>
              </div>
            )}
            {this.state.selectedFormat.deckType === 'Oathbreaker' && (
              <div>
                <h3 className="beleren">Signature Spell</h3>
                <CardPreview
                  selectedCard={this.state.selectedSpell}
                ></CardPreview>
              </div>
            )}
          </div>
        </div>
        <ToastContainer
          draggable={false}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        ></ToastContainer>
      </div>
    )
  }
}

export default MtGRando
