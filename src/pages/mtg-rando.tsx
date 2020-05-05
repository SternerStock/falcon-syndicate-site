import React, { Component } from 'react'
import Layout from '../components/layout'
import RandomFlavor from '../components/MtG/RandomFlavor'
import MtGRando from '../components/MtG/MtGRando'

class EdhRandoPage extends Component {
  render() {
    return (
      <Layout>
        <div className="page-interior">
          <RandomFlavor></RandomFlavor>
          <MtGRando></MtGRando>
        </div>
      </Layout>
    )
  }
}

export default EdhRandoPage
