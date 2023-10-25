import React from 'react'
import Layout from '../components/layout'

const MinecraftEmbed = () => (
  <Layout>
    <div className="page-interior page-interior--stretch">
      <iframe
        className="full-embed full-embed--stretch"
        src="/dynmap"
      ></iframe>
    </div>
  </Layout>
)

export default MinecraftEmbed
