import React, { Component } from 'react'
import Layout from "../components/layout"
import EdhRando from '../components/MtG/EdhRando'

class EdhRandoPage extends Component {
  render() {
    return (
      <Layout>
        <div className="page-interior">
          <EdhRando></EdhRando>
        </div>
      </Layout>
    )
  }
}

export default EdhRandoPage
