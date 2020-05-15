import React, { Component } from 'react'

interface FlavorTextState {
  text: string
  name: string
}

class RandomFlavor extends Component<{}, FlavorTextState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      text: '',
      name: '',
    }
  }

  async componentDidMount() {
    const response = await fetch(
      process.env.GATSBY_API_URL + '/MtG/RandomFlavor'
    )
    if (response.ok) {
      const data = await response.json()
      this.setState({
        text: data.flavorText,
        name: data.name,
      })
    }
  }

  render() {
    return (
      <div title={this.state.name} className="gutter" style={{margin: "10px 0"}}>
        <em>{this.state.text}</em>
      </div>
    )
  }
}

export default RandomFlavor
