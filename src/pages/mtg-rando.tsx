import React, { Component } from 'react'
import Layout from '../components/layout'
import RandomAppName from '../components/MtG/RandomAppName'
import RandomFlavor from '../components/MtG/RandomFlavor'
import MtGRando from '../components/MtG/MtGRando'

import '@saeris/typeface-beleren-bold'

class EdhRandoPage extends Component {
  render() {
    return (
      <Layout>
        <div className="page-interior">
          <h1 className="app-header">
            MtG Randomizer<br />
            <RandomAppName></RandomAppName>
          </h1>
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
