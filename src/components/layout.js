import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import Header from './Header';
import Footer from './Footer';
import 'normalize.css';
import '../sass/site.scss';

require('../otherjs/fontawesome-all');

const TemplateWrapper = ({ children }) => (
  <div className="flex-container flex-container--fullpage">
    <Helmet
      title="Falcon Syndicate"
      meta={[
        { name: 'description', content: 'A gaming group that really likes Captain Falcon.' },
        { name: 'keywords', content: 'gaming, captain falcon, mtg, magic the gathering, magic, gathering, edh, commander, bravery, randomizer, ska' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'The Falcon Syndicate' },
        { name: 'twitter:creator', content: '@SternerStock' },
        { name: 'twitter:description', content: 'You better be playing Falcon!' },
        { name: 'twitter:image', content: '/falconPunch.png' },
        { name: 'msapplication-TileColor', content: '#1F2249'},
        { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png'},
        { name: 'theme-color', content: '#1F2249'}
      ]}
      link={[
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/apple-icon-57x57.png'},
        { rel: 'apple-touch-icon', sizes: '60x60', href: '/apple-icon-60x60.png'},
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/apple-icon-72x72.png'},
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-icon-76x76.png'},
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/apple-icon-114x114.png'},
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-icon-120x120.png'},
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-icon-144x144.png'},
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-icon-152x152.png'},
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png'},
        { rel: 'icon', type:'image/png', sizes: '192x192', href: '/android-icon-192x192.png'},
        { rel: 'icon', type:'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
        { rel: 'icon', type:'image/png', sizes: '96x96', href: '/favicon-96x96.png'},
        { rel: 'icon', type:'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
        { rel: 'icon', href: '/favicon.ico?v=2'},
        { rel: 'manifest', href: '/manifest.json'}
      ]}
    />
    <Header />
    {children}
    <Footer />
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
