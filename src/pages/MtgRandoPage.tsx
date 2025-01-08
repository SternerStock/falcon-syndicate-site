import { Helmet } from 'react-helmet-async'
import { FaBan } from 'react-icons/fa6'

import '@saeris/typeface-beleren-bold'

import appleIconUrl from '../assets/MtG/apple-touch-icon.png'
import favicon16Url from '../assets/MtG/favicon-16x16.png'
import favicon32Url from '../assets/MtG/favicon-32x32.png'
import MtgJsonLogo from '../assets/MtG/logo-mtgjson-light-blue.svg'
import mtgrandologoUrl from '../assets/MtG/mtgrandologo.png'
import manifestUrl from '../assets/MtG/site.webmanifest'
import CollapsibleSection from '../components/CollapsibleSection'
import DeckGenerator from '../components/MtgRando/DeckGenerator'
import RandomAppName from '../components/MtgRando/RandomAppName'
import RandomFlavor from '../components/MtgRando/RandomFlavor'

const MtgRandoPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>MtG Randomizer</title>
        <meta
          name="description"
          content="Generate randomized Magic decks for EDH, Oathbreaker, or most other formats!"
        />
        <meta
          name="keywords"
          content="mtg, magic the gathering, magic, gathering, edh, commander, oathbreaker, bravery, randomizer"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="MtG Randomizer" />
        <meta
          name="twitter:description"
          content="Generate randomized Magic decks for EDH, Oathbreaker, or most other formats!"
        />
        <meta name="twitter:image" content={mtgrandologoUrl} />
        <link rel="apple-touch-icon" sizes="180x180" href={appleIconUrl} />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32Url} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16Url} />
        <link rel="manifest" href={manifestUrl} />
      </Helmet>
      <div className="page-interior">
        <h1 className="app-header">
          MtG Randomizer
          <br />
          <RandomAppName />
        </h1>
        <CollapsibleSection title="What is this?">
          <p>
            This tool generates a random deck within specified parameters and
            outputs it as a copy/pasteable list of cards, with your Commander,
            Oathbreaker, or whatever command zone cards apply in the sideboard.
          </p>
          <ul>
            <li>
              Select a format, color identity, and other format-specific
              options, then click on "Generate Deck"!
              <ul>
                <li>
                  From the Commander rules: <br /> A card's{' '}
                  <em>colour identity</em> is its color plus the colour of any
                  mana symbols in the card's rules text.
                </li>
              </ul>
            </li>
            <li>
              To customize the parameters, expand the sections below and play
              with the bars! Remove a card type form the pool by clicking the{' '}
              <FaBan /> symbol to the right.
              <ul>
                <li>
                  EDHREC Rank Percentile in particular will greatly affect how
                  good the cards you get are.
                </li>
                <li>
                  Under Card Types, the selected (left) value represents the
                  minimum number of that card type you want to have in the deck.
                  The right number is the maximum possible, though the math gets
                  fuzzier with cards like Artifact Creatures and Adventures.
                </li>
                <li>
                  You will always get the exact number of Basic Lands chosen,
                  split among colors.
                </li>
              </ul>
            </li>
            <li>
              You can click the "Copy Shareable Settings Link" button at the
              bottom of the page, or after generation, to get a link to share
              with others so you can generate decks with the same rules.
            </li>
          </ul>
          <h3>Where to play</h3>
          <ul>
            <li>
              <a href="https://cockatrice.github.io/" target="_blank">
                Cockatrice
              </a>
            </li>
            <li>
              <a href="https://www.frogtown.me/" target="_blank">
                Tabletop Simulator (via Frogtown)
              </a>
            </li>
            <li>
              <a href="http://xmage.today/" target="_blank">
                XMage
              </a>
            </li>
          </ul>
          <h3>Other useful links</h3>
          <ul>
            <li>
              <a href="https://edhrec.com/" target="_blank">
                EDHREC
              </a>
              , for help building a real Commander or Oathbreaker deck.
            </li>
            <li>
              <a
                href="https://codeberg.org/SternerStock/falcon-syndicate-site"
                target="_blank"
              >
                Website Source Code
              </a>
            </li>
            <li>
              <a
                href="https://codeberg.org/SternerStock/falcon-backend"
                target="_blank"
              >
                Generator/Database Source Code
              </a>
            </li>
          </ul>
          <h3>Resources Used</h3>
          <ul>
            <li>
              Card Data:{' '}
              <a href="https://mtgjson.com">
                <MtgJsonLogo width="32" height="auto" /> MTGJSON
              </a>
            </li>
            <li>
              Mana Symbols:{' '}
              <a href="https://mana.andrewgioia.com/">
                Mana font by Andrew Gioia
              </a>
            </li>
            <li>
              Set Symbols:{' '}
              <a href="https://keyrune.andrewgioia.com/">
                Keyrune font by Andrew Gioia
              </a>
            </li>
          </ul>
          <h3>Contact</h3>
          You can <a href="mailto:sternerstock@falconsyndicate.net">Email me</a> or{' '}
          <a href="https://discord.gg/m2X59jn">Join the Discord</a>:<br />
          <iframe
            src="https://discordapp.com/widget?id=719594048565936238&theme=dark"
            width="350"
            height="300"
            frameBorder={0}
          />
          <p>
            <em className="copyright">
              The MtG Randomizer is unofficial Fan Content permitted under the
              Fan Content Policy. Not approved/endorsed by Wizards. Portions of
              the materials used are property of Wizards of the Coast. ©Wizards
              of the Coast LLC.
            </em>
          </p>
        </CollapsibleSection>
        <DeckGenerator />
        <div className="align-center" style={{ marginBottom: 20 }}>
          <RandomFlavor />
        </div>
      </div>
    </>
  )
}

export default MtgRandoPage
