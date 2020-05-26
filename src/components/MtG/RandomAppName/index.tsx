import React, { Component } from 'react'

class RandomAppName extends Component<{}, {text: string}> {
  constructor(props: {}) {
    super(props)
    this.state = {
      text: ''
    }
  }

  async componentDidMount() {
    const response = await fetch(
      process.env.GATSBY_API_URL + '/MtG/RandomAppName'
    )
    if (response.ok) {
      const data = await response.text()
      this.setState({
        text: data
      })
    }
  }

  render() {
    return (
      <em className="app-header__subtitle">
        A.K.A. "{this.state.text}"
      </em>
    )
  }
}

export default RandomAppName
