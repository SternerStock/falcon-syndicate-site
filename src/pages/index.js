import React from 'react'
import Layout from "../components/layout"
import { Link } from 'gatsby'
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor'
import TwitchHost from '../components/TwitchHost'

import {ReactComponent as SplashImg} from "../img/knee.svg"
import {ReactComponent as TwitchLogo} from "../img/twitchLogo.svg"
import minecraftLogoUrl from '../img/minecraftIcon.png'

configureAnchors({offset: -50})

const IndexPage = () => (
  <Layout>
    <div className="page-interior">
      <div className="splash">
        <h1 className="splash__title">You better be playing Falcon!</h1>
        <SplashImg className="splash__bg-img" />
        <a href="#body" className="splash__down"><i className="fas fa-chevron-down" /></a>
      </div>
      <ScrollableAnchor id="body">
        <main className="flex-container flex-container--rows">
          <section className="content">
            <h2 className="content__header">What even is this?</h2>
            <p className="content__text">
              The Falcon Syndicate is a loosely affiliated gaming group, mostly in Texas.<br />
              <br />
              We really like Captain Falcon.
            </p>
            <h2 className="content__header">
              <TwitchLogo className="content__logo" />
            </h2>
            <TwitchHost channels={['SternerStock', 'Pantzmcgee', 'Raph_Tx', 'Grue_Bu', 'Grystor', 'The_Jar', 'Legitamte']} />
            <h2 className="content__header">
              <Link to="/minecraft/"><img className="content__logo" src={minecraftLogoUrl} />
              Minecraft Server Maps
              </Link>
            </h2>
          </section>
          <aside className="sidebar">
            <iframe className="sidebar__embed" src="https://discordapp.com/widget?id=296424304948805632&theme=dark" height="500" allowTransparency="true" frameBorder="0"></iframe>
          </aside>
        </main>
      </ScrollableAnchor>
    </div>
  </Layout>
)

export default IndexPage
