interface MtGSet {
  id: number
  name: string
  code: string
  keyruneCode: string
}

interface Lookup {
  id: number
  name: string
}

interface Card {
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
    multiverseId: number
    flavorText: string
    artist: string
    watermark: string
    set: string
  }

  interface CountParam {
    name: string
    iconClass: string
    label: string
    count?: number
    range?: number[]
    isRange?: boolean
    min?: number
    max?: number
    help: string
    enabled: boolean
    children?: CountParam[]
  }