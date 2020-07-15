import React, { Component } from 'react'
import Layout from '../components/layout'
import { Helmet } from 'react-helmet'
import RandomAppName from '../components/MtG/RandomAppName'
import RandomFlavor from '../components/MtG/RandomFlavor'
import MtGRando from '../components/MtG/MtGRando'
import Collapsible from 'react-collapsible'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faBan } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as MtgJsonLogo } from '../img/logo-mtgjson-light-blue.svg'

interface RandoPageState {
  newsOpen: boolean
  howToOpen: boolean
}

import '@saeris/typeface-beleren-bold'

class EdhRandoPage extends Component<{}, RandoPageState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      newsOpen: false,
      howToOpen: false,
    }
  }

  render() {
    return (
      <Layout>
        <div className="page-interior">
          <Helmet
            title="MtG Randomizer | Falcon Syndicate"
            meta={[
              {
                name: 'description',
                content:
                  'Generate randomized Magic decks for EDH, Oathbreaker, or most other formats!',
              },
              {
                name: 'keywords',
                content:
                  'mtg, magic the gathering, magic, gathering, edh, commander, oathbreaker, bravery, randomizer',
              },
              { name: 'twitter:card', content: 'summary' },
              { name: 'twitter:title', content: 'MtG Randomizer' },
              {
                name: 'twitter:description',
                content:
                  'Generate randomized Magic decks for EDH, Oathbreaker, or most other formats!',
              },
              { name: 'twitter:image', content: '/mtgrandologo.png' },
            ]}
          ></Helmet>
          <h1 className="app-header">
            MtG Randomizer
            <br />
            <RandomAppName></RandomAppName>
          </h1>
          <Collapsible
            trigger={
              <div className="collapsible-header">
                <h2>What is this?</h2>
                <FontAwesomeIcon
                  icon={this.state.howToOpen ? faMinus : faPlus}
                  size="2x"
                ></FontAwesomeIcon>
              </div>
            }
            onOpen={() => this.setState({ howToOpen: true })}
            onClose={() => this.setState({ howToOpen: false })}
            easing="ease-in-out"
          >
            <div className="collapsible-body">
              <div>
                <p>
                  This tool generates a random deck within specified parameters
                  and outputs it as a copy/pasteable list of cards, with your
                  Commander, Oathbreaker, or whatever command zone cards apply
                  in the sideboard.
                </p>
                <ul>
                  <li>
                    Select a format, color identity, and other format-specific
                    options, then click on "Generate Deck"!
                    <ul>
                      <li>
                        From the Commander rules: <br /> A card’s{' '}
                        <em>colour identity</em> is its color plus the colour of
                        any mana symbols in the card’s rules text.
                      </li>
                    </ul>
                  </li>
                  <li>
                    To customize the parameters, expand the sections below and
                    play with the bars! Remove a card type form the pool by clicking the <FontAwesomeIcon icon={faBan}></FontAwesomeIcon> symbol to the right.
                    <ul>
                      <li>
                        EDHREC Rank Percentile in particular will greatly affect
                        how good the cards you get are.
                      </li>
                      <li>
                        Under Card Types, the selected (left) value represents
                        the minimum number of that card type you want to have in
                        the deck. The right number is the maximum possible,
                        though the math gets fuzzier with cards like Artifact
                        Creatures and Adventures.
                      </li>
                      <li>
                        You will always get the exact number of Basic Lands
                        chosen, split among colors.
                      </li>
                    </ul>
                  </li>
                  <li>
                    You can click the "Copy Shareable Settings Link" button at
                    the bottom of the page, or after generation, to get a link
                    to share with others so you can generate decks with the same
                    rules.
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
                    <a href="https://www.tabletopsimulator.com/" target="_blank">
                      Tabletop Simulator
                    </a>
                  </li>
                  <li>
                    <a href="http://xmage.de/" target="_blank">
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
                      href="https://github.com/SternerStock/falcon-syndicate-site"
                      target="_blank"
                    >
                      Website Source Code
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/SternerStock/falcon-backend"
                      target="_blank"
                    >
                      Generator/Database Source Code
                    </a>
                  </li>
                </ul>
                <h3>Resources Used</h3>
                <ul>
                  <li>Card Data: <a href="https://mtgjson.com"><MtgJsonLogo width="32" height="auto"></MtgJsonLogo> MTGJSON</a></li>
                  <li>Mana Symbols: <a href="https://mana.andrewgioia.com/">Mana font by Andrew Gioia</a></li>
                  <li>Set Symbols: <a href="https://keyrune.andrewgioia.com/">Keyrune font by Andrew Gioia</a></li>
                </ul>
                <h3>Contact</h3>
                You can <a href="mailto:me@coreylaird.com">Email me</a> or <a href="https://discord.gg/m2X59jn">Join the Discord</a>:<br/>
                <iframe src="https://discordapp.com/widget?id=719594048565936238&theme=dark" width="350" height="300" allowTransparency={true} frameBorder={0}></iframe>
                <p>
                  <em className="copyright">
                    The MtG Randomizer is unofficial Fan Content permitted under
                    the Fan Content Policy. Not approved/endorsed by Wizards.
                    Portions of the materials used are property of Wizards of
                    the Coast. ©Wizards of the Coast LLC.
                  </em>
                </p>
              </div>
            </div>
          </Collapsible>
          <br />
          <br />
          <MtGRando></MtGRando>
          <div className="align-center">
            <RandomFlavor></RandomFlavor>
          </div>
        </div>
      </Layout>
    )
  }
}

export default EdhRandoPage
