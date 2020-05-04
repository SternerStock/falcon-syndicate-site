import React, { Component } from 'react'
import Layout from "../components/layout"
import MtGRando from '../components/MtG/MtGRando'

class EdhRandoPage extends Component {
  render() {
    return (
      <Layout>
        <div className="page-interior">
          <MtGRando></MtGRando>
        </div>
      </Layout>
    )
  }
}

export default EdhRandoPage
