import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'

class SkaGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correct: 0,
      attempted: 0,
      name: '',
      chosen: ''
    }

    this.getNext();
  }

  getNext() {
    fetch("http://localhost:61650/api/Ska").then(response => response.text()).then(text => {
      this.setState({
        name: text
      });
    });
  }

  makeGuess(guess) {
    this.setState({
      chosen: guess
    });

    fetch("http://localhost:61650/api/Ska/CheckAnswer/" + encodeURIComponent(this.state.name)).then(response => response.json()).then(result => {
      setTimeout(() => {
        this.setState({
          attempted: this.state.attempted + 1
        });
  
        if (this.state.chosen == result.Type) {
          this.setState({
            correct: this.state.correct + 1
          });
        }

        this.setState({
          chosen: ''
        });

        this.getNext();
      }, 1000);
    });
  }

  render() {
    return (
      <div className="ska-game">
        
        <div className="ska-game__score">
          Score: {this.state.correct} / {this.state.attempted}
        </div>
        
        {/* <div className="ska-game__score">
          Debug:
          Chosen: {this.state.chosen}
        </div> */}

        <div className="ska-game__interface">
          <div className="ska-game__name">
            The Name:
            <h1>{this.state.name}</h1>
          </div>

          <div className="ska-game__text">Is it a...</div>
          <div className="ska-game__btn-row">
            <div className="ska-game__btn-container">
              <button className="ska-game__btn ska-game__btn--ska"
               onClick={() => this.makeGuess('ska')}
               disabled={this.state.chosen ? 'disabled' : ''}>
                Ska Band
              </button>
            </div>
            <div className="flex-container__block ska-game__text">
              or
            </div>
            <div className="ska-game__btn-container">
              <button className="ska-game__btn ska-game__btn--kid"
               onClick={() => this.makeGuess('kid')}
               disabled={this.state.chosen ? 'disabled' : ''}>
                Kids' Show
              </button>
            </div>
          </div>
        </div>
        
        <div className="half-bg-container">
          <div className={"half-bg-container__half half-bg-container__half--ska" + (this.state.chosen === 'ska' ? ' half-bg-container__half--active' : '')} />
          <div className={"half-bg-container__half" + (this.state.chosen ? '' : ' half-bg-container__half--active')} />
          <div className={"half-bg-container__half half-bg-container__half--kid" + (this.state.chosen === 'kid' ? ' half-bg-container__half--active' : '')} />
        </div>
      </div>
    )
  }
}

export default SkaGame
