import React from 'react'
import Layout from '../components/layout'
import { Link } from 'gatsby'
import TwitchHost from '../components/TwitchHost'

import { FaChevronDown } from 'react-icons/fa'

import { ReactComponent as SplashImg } from '../img/knee.svg'
import { ReactComponent as TwitchLogo } from '../img/twitchLogo.svg'
import minecraftLogoUrl from '../img/minecraftIcon.png'

const IndexPage = () => (
  <Layout>
    <div className="page-interior">
      <div className="splash">
        <h1 className="splash__title">You better be playing Falcon!</h1>
        <SplashImg className="splash__bg-img" />
        <a href="#body" className="splash__down">
          <FaChevronDown />
        </a>
      </div>
      <div id="body">
        <main className="flex-container flex-container--rows">
          <section className="content">
            <h2 className="content__header">What even is this?</h2>
            <p className="content__text">
              The Falcon Syndicate is a loosely affiliated gaming group, mostly
              in Texas.
              <br />
              <br />
              We really like Captain Falcon.
            </p>
            <h2 className="content__header">
              <TwitchLogo className="content__logo" />
            </h2>
            <TwitchHost
              channels={[
                'SternerStock',
                'Raph_Tx',
                'Pantzmcgee',
                'The_Jar',
                'Grue_Bu',
                'Grystor',
                'Legitamte',
              ]}
            />
            <h2 className="content__header">
              <Link to="/minecraft/">
                <img className="content__logo" src={minecraftLogoUrl} />
                Minecraft Server Maps
              </Link>
            </h2>
          </section>
          <aside className="sidebar">
            <iframe
              className="sidebar__embed"
              src="https://discord.com/widget?id=296424304948805632&theme=dark"
              height="500"
              frameBorder="0"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            ></iframe>
          </aside>
        </main>
      </div>
    </div>
  </Layout>
)

export default IndexPage
