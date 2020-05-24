import React, { Component } from 'react'
import Layout from '../components/layout'
import RandomFlavor from '../components/MtG/RandomFlavor'
import MtGRando from '../components/MtG/MtGRando'

import '@saeris/typeface-beleren-bold'

class EdhRandoPage extends Component {
  render() {
    return (
      <Layout>
        <div className="page-interior">
          <h1 className="beleren">MtG Randomizer</h1>
          <em className="beleren">Formerly EDH Ultimate Bravery</em>
          <div>
            <br />
            <RandomFlavor></RandomFlavor>
          </div>
          <MtGRando></MtGRando>
        </div>
      </Layout>
    )
  }
}

export default EdhRandoPage
