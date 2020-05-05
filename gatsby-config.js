module.exports = {
  siteMetadata: {
    title: 'Falcon Syndicate',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-scss-typescript',
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        dir: './src/pages/img',
        viewBox: false
      }
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
            families: [
              'Press Start 2P'
            ]
        }
      }
    }
  ],
};
