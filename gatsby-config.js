module.exports = {
  siteMetadata: {
    title: 'Falcon Syndicate',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        dir: './src/pages/img',
        viewBox: false
      }
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Butterfly Kids',
          'Press Start 2P'
        ]
      }
    }
  ],
};
