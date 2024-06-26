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
      process.env.GATSBY_API_URL + '/MtG/RandomFlavor',
      {
        headers: {
          'falcon-nocache': '1',
        },
      }
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
      <em title={this.state.name} className="mPlantin">
        {this.state.text}
      </em>
    )
  }
}

export default RandomFlavor
