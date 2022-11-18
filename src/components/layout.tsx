import React from 'react'
import PropTypes from 'prop-types'

import Header from './Header'
import Footer from './Footer'
import 'normalize.css'
import '@fontsource/press-start-2p'
import '../styles-global/site.scss'

export function Head() {
  return (
    <>
      <title>Falcon Syndicate</title>
      <meta
        name="description"
        content="A gaming group that really likes Captain Falcon."
      />
      <meta name="keywords" content="gaming, captain falcon" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="The Falcon Syndicate" />
      <meta name="twitter:creator" content="@SternerStock" />
      <meta
        name="twitter:description"
        content="You better be playing Falcon!"
      />
      <meta name="twitter:image" content="/falconPunch.png" />
      <meta name="msapplication-TileColor" content="#1F2249" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#1F2249" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="icon" href="/favicon.ico?v=2" />
      <link rel="manifest" sizes="" href="/manifest.json" />
    </>
  )
}

const TemplateWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-container flex-container--fullpage">
    <Header />
    {children}
    <Footer />
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.element,
}

export default TemplateWrapper
