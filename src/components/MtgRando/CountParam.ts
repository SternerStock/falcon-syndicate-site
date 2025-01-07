export interface CountParam {
  name: string
  iconClass: string
  label: string
  count?: number
  range?: number[]
  isRange?: boolean
  min?: number
  max?: number
  help?: string
  enabled?: boolean
  showForFormats?: string[]
  children?: CountParam[]
}

export const defaultRestrictions: CountParam[] = [
  {
    name: 'edhrecrank',
    iconClass: 'ss ss-cmd ss-2x',
    label: 'EDHREC Rank Percentile',
    help: 'The "goodness" range of the cards to pick. This value is relative to the pool of possible cards. Note that silver-bordered cards are not ranked, so changing this value may exclude them.',
    isRange: true,
    range: [0, 100],
    min: 0,
    max: 100,
    showForFormats: ['Commander', 'Oathbreaker'],
  },
  {
    name: 'edhrecsaltrank',
    iconClass: 'ss ss-tsp ss-2x',
    label: 'EDHREC Saltiness Percentile',
    help: 'The "saltiness" range of the cards to pick. This value is crowdsourced by EDHREC and indicates how much other players dislike seeing the card. Higher values are more disliked.',
    isRange: true,
    range: [0, 100],
    min: 0,
    max: 100,
    showForFormats: ['Commander', 'Oathbreaker'],
  },
  {
    name: 'manaValue',
    iconClass: 'ms ms-x ms-2x',
    label: 'Mana Value Range',
    isRange: true,
    range: [0, 16],
    min: 0,
    max: 16,
  },
]

export const defaultCardTypeCounts: CountParam[] = [
  {
    name: 'basicLands',
    iconClass: 'ms ms-land ms-2x',
    label: 'Basic Lands',
    help: 'The EXACT number of basic lands to include in the generated deck.',
    enabled: true,
    count: 24,
  },
  {
    name: 'nonbasicLands',
    iconClass: 'ms ms-land ms-2x',
    label: 'Nonbasic Lands',
    help: 'The MINIMUM number of nonbasic lands to include in the generated deck.',
    enabled: true,
    count: 15,
  },
  {
    name: 'creatures',
    iconClass: 'ms ms-creature ms-2x',
    label: 'Creatures',
    help: 'The MINIMUM number of creatures to include in the generated deck.',
    enabled: true,
    count: 20,
    children: [
      {
        name: 'sharesTypes',
        iconClass: 'ms ms-creature ms-2x',
        label: 'Shares a Creature Type with Commander(s)',
        help: 'The MINIMUM number of cards to include that share at least one creature type with your commander. If this bar is maxed, the generator will attempt to make all applicable cards share at least one creature type.',
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
    help: 'The MINIMUM number of artifacts to include in the generated deck.',
    enabled: true,
    count: 5,
    children: [
      {
        name: 'equipment',
        iconClass: 'ms ms-artifact ms-2x',
        label: 'Equipment',
        help: 'The MINIMUM number of artifacts that will be equipment. If this bar is maxed, all artifacts will be equipment.',
        enabled: true,
        count: 0,
      },
      {
        name: 'vehicles',
        iconClass: 'ms ms-artifact ms-2x',
        label: 'Vehicles',
        help: 'The MINIMUM number of artifacts that will be vehicles. If this bar is maxed, all artifacts will be vehicles, or at least as many as possible.',
        enabled: true,
        count: 0,
      },
    ],
  },
  {
    name: 'enchantments',
    iconClass: 'ms ms-enchantment ms-2x',
    label: 'Enchantments',
    help: 'The MINIMUM number of enchantments to include in the generated deck.',
    enabled: true,
    count: 5,
    children: [
      {
        name: 'auras',
        iconClass: 'ms ms-enchantment ms-2x',
        label: 'Auras',
        help: 'The MINIMUM number of enchantments that will be auras (or creatures with bestow). If this bar is maxed, all enchantments will be auras.',
        enabled: true,
        count: 0,
      },
    ],
  },
  {
    name: 'planeswalkers',
    iconClass: 'ms ms-planeswalker ms-2x',
    label: 'Planeswalkers',
    help: 'The MINIMUM number of planeswalkers to include in the generated deck.',
    enabled: true,
    count: 1,
  },
  {
    name: 'spells',
    iconClass: 'ms ms-instant ms-2x',
    label: 'Instants and Sorceries',
    help: 'The MINIMUM number of non-permanent cards to include in the generated deck.',
    enabled: true,
    count: 10,
  },
]

export const defaultNonbasicCounts: CountParam[] = [
  {
    name: 'manaProducing',
    iconClass: 'ms ms-c ms-2x',
    label: 'Produces Mana',
    help: 'The MINIMUM number of permanents (other than basic lands) to include that have a mana ability. If this bar is maxed, the generator will attempt to make all permanents have mana abilities.',
    enabled: true,
    count: 10,
  },
  {
    name: 'legendary',
    iconClass: 'ss ss-s99 ss-2x',
    label: 'Legendary',
    help: 'The MINIMUM number of permanents (other than basic lands) to include that are legendary. If this bar is maxed, the generator will attempt to make all permanents legendary.',
    enabled: true,
    count: 0,
  },
]

export function findParamRecursive(
  collection: CountParam[],
  name: string
): CountParam | undefined {
  for (const param of collection) {
    if (param.name === name) {
      return param
    }

    if (param.children) {
      const child = findParamRecursive(param.children, name)
      if (child) {
        return child
      }
    }
  }
}