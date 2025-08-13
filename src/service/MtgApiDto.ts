export interface NumberRange {
  min: number
  max: number
}

export interface MtGSet {
  id: number
  name: string
  code: string
  keyruneCode: string
}

export interface Lookup {
  id: number
  name: string
}

export interface Card {
  id: number
  name: string
  manaCost: string
  typeLine: string
  oracleText: string
  power: number
  toughness: number
  loyalty: number
  color: string[]
  colorIdentity: string[]
  multiverseId: number[]
  scryfallId: string[]
  scryfallIllustrationId: string[]
  flavorText: string
}

export interface RandomFlavorResponse {
  flavorText: string
  name: string
}

export interface GenerateDeckRequest {
  deckType: string
  format: string
  deckSize: number
  silverBorder: boolean
  commanderId?: number
  partnerId?: number
  signatureSpellId?: number
  colorIdentity: string[]
  edhRecRange?: NumberRange
  edhRecSaltRange?: NumberRange
  manaValueRange: NumberRange
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

export interface GenerateDeckResponse {
  seed: number
  basicLands: number
  nonbasicLands: number
  creatures: number
  artifacts: number
  equipment: number
  vehicles: number
  enchantments: number
  auras: number
  planeswalkers: number
  spells: number
  manaProducing: number
  legendary: number
  issues: string
  cards: string
}

export function parseNumberRange(range: string) {
  const parts = range.split(',')

  if (parts.length === 2) {
    const parsedMin = parseInt(parts[0])
    const parsedMax = parseInt(parts[1])

    if (
      !isNaN(parsedMin) &&
      !isNaN(parsedMax) &&
      parsedMin >= 0 &&
      parsedMax >= parsedMin
    ) {
      return {
        min: parsedMin,
        max: parsedMax,
      } as NumberRange
    }
  }
}