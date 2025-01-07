export interface Format {
  deckType: 'Commander' | 'Oathbreaker' | 'Normal MtG'
  name: string
  deckSize: number
  allowSilver: boolean
  rulesUrl: string
}

export const defaultFormats: Format[] = [
  {
    deckType: 'Commander',
    name: 'Commander',
    deckSize: 99,
    allowSilver: true,
    rulesUrl: 'https://mtgcommander.net/index.php/rules/',
  },
  {
    deckType: 'Commander',
    name: 'Brawl',
    deckSize: 59,
    allowSilver: false,
    rulesUrl: 'https://magic.wizards.com/en/game-info/gameplay/formats/brawl',
  },
  {
    deckType: 'Commander',
    name: 'Pauper Commander',
    deckSize: 99,
    allowSilver: true,
    rulesUrl: 'https://pdhhomebase.com/rules/',
  },
  {
    deckType: 'Commander',
    name: 'PreDH',
    deckSize: 99,
    allowSilver: true,
    rulesUrl:
      'https://articles.starcitygames.com/magic-the-gathering/commander-sub-format-predh-is-the-new-magic-rage/',
  },
  {
    deckType: 'Commander',
    name: 'Tiny Leaders',
    deckSize: 49,
    allowSilver: true,
    rulesUrl:
      'https://tinyleaders.blogspot.com/p/tiny-leaders-magic-gathering-format.html',
  },
  {
    deckType: 'Oathbreaker',
    name: 'Oathbreaker',
    deckSize: 58,
    allowSilver: true,
    rulesUrl: 'https://oathbreakermtg.org/quick-rules/',
  },
  {
    deckType: 'Normal MtG',
    name: 'Standard',
    deckSize: 60,
    allowSilver: false,
    rulesUrl:
      'https://magic.wizards.com/en/content/standard-formats-magic-gathering',
  },
  {
    deckType: 'Normal MtG',
    name: 'Modern',
    deckSize: 60,
    allowSilver: false,
    rulesUrl: 'https://magic.wizards.com/en/game-info/gameplay/formats/modern',
  },
  {
    deckType: 'Normal MtG',
    name: 'Premodern',
    deckSize: 60,
    allowSilver: false,
    rulesUrl: 'https://premodernmagic.com/rules#rules',
  },
  {
    deckType: 'Normal MtG',
    name: 'Pauper',
    deckSize: 60,
    allowSilver: false,
    rulesUrl: 'https://mtg.fandom.com/wiki/Pauper',
  },
  {
    deckType: 'Normal MtG',
    name: 'Pioneer',
    deckSize: 60,
    allowSilver: false,
    rulesUrl: 'https://magic.wizards.com/en/game-info/gameplay/formats/pioneer',
  },
  {
    deckType: 'Normal MtG',
    name: 'Legacy',
    deckSize: 60,
    allowSilver: false,
    rulesUrl: 'http://magic.wizards.com/en/game-info/gameplay/formats/legacy',
  },
  {
    deckType: 'Normal MtG',
    name: 'Vintage',
    deckSize: 60,
    allowSilver: true,
    rulesUrl: 'http://magic.wizards.com/en/game-info/gameplay/formats/vintage',
  },
  {
    deckType: 'Normal MtG',
    name: 'Penny Dreadful',
    deckSize: 60,
    allowSilver: true,
    rulesUrl: 'https://pennydreadfulmagic.com/',
  },
]
