import { Card, GenerateDeckRequest, GenerateDeckResponse, Lookup, MtGSet, RandomFlavorResponse } from './MtgApiDto'

export const getRandomAppName = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/MtG/RandomAppName`,
    {
      headers: {
        'falcon-nocache': '1',
      },
    }
  )

  if (response.ok) {
    const data = await response.text()
    return data
  }
}

export const getRandomFlavorText = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/MtG/RandomFlavor`,
    {
      headers: {
        'falcon-nocache': '1',
      },
    }
  )

  if (response.ok) {
    const data: RandomFlavorResponse = await response.json()
    return data
  }
}

export const getCommanders = async (
  variant: string,
  silverBorder?: boolean
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/MtG/Commanders?variant=${variant}&allowSilver=${silverBorder === true}`
  )

  if (response.ok) {
    const data: Card[] = await response.json()
    return data
  }

  return []
}

export const getPartners = async (
  commanderId: number,
  variant: string,
  silverBorder?: boolean
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/MtG/Partners?cmdrId=${commanderId}&variant=${variant}&allowSilver=${silverBorder === true}`
  )

  if (response.ok) {
    const data: Card[] = await response.json()
    return data
  }

  return []
}

export const getSignatureSpells = async (
  oathbreakerId: number,
  silverBorder?: boolean
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/MtG/SignatureSpells?obId=${oathbreakerId}&allowSilver=${silverBorder === true}`
  )

  if (response.ok) {
    const data: Card[] = await response.json()
    return data
  }

  return []
}

export const getSets = async (variant: string, silverBorder?: boolean) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/MtG/Sets?variant=${variant}&allowSilver=${silverBorder === true}`
  )

  if (response.ok) {
    const data: MtGSet[] = await response.json()
    return data
  }

  return []
}

export const getRarities = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/MtG/Rarities`)

  if (response.ok) {
    const data: Lookup[] = await response.json()
    return data
  }

  return []
}

export const getFrames = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/MtG/Frames`)

  if (response.ok) {
    const data: Lookup[] = await response.json()
    return data
  }

  return []
}

export const getArtists = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/MtG/Artists`)

  if (response.ok) {
    const data: Lookup[] = await response.json()
    return data
  }

  return []
}

export const generateDeck = async (generateRequest: GenerateDeckRequest) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/MtG/GenerateDeck`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateRequest),
      }
    )

    if (response.ok) {
      const data: GenerateDeckResponse = await response.json()
      return data
    }
}
