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
  
  interface CmcRange {
    min: number
    max: number
  }