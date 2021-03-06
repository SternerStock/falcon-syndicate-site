import React, { Component } from 'react'
import { Link } from 'gatsby'

interface HeaderState {
  expanded: boolean
}

class Header extends Component<{}, HeaderState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  onMenuClick() {
    this.setState({ expanded: !this.state.expanded })
  }

  closeMenu() {
    this.setState({ expanded: false })
  }

  render() {
    return (
      <nav
        className={
          'top-nav' + (this.state.expanded ? ' top-nav--expanded' : '')
        }
      >
        <Link
          to="/"
          className="top-nav__link top-nav__link--home"
          activeClassName="top-nav__link--active"
          onClick={() => this.closeMenu()}
        >
          Falcon Syndicate
        </Link>
        <span className="top-nav__menu">
          <button
            className={
              'top_nav__menu c-hamburger c-hamburger--htx' +
              (this.state.expanded ? ' is-active' : '')
            }
            onClick={() => this.onMenuClick()}
          >
            <span>toggle menu</span>
          </button>
        </span>
        {/* <Link to="/ska/" className="top-nav__link top-nav__link--sub" activeClassName="top-nav__link--active" onClick={() => this.closeMenu()}>Ska Band or Kids' Show?</Link> */}
        <Link
          to="/minecraft/"
          className="top-nav__link top-nav__link--sub"
          activeClassName="top-nav__link--active"
          onClick={() => this.closeMenu()}
        >
          Minecraft Map
        </Link>
        <Link
          to="/mtg-rando/"
          className="top-nav__link top-nav__link--sub"
          activeClassName="top-nav__link--active"
          onClick={() => this.closeMenu()}
        >
          MtG Randomizer
        </Link>
        {/* <Link to="/about/" className="top-nav__link top-nav__link--sub" activeClassName="top-nav__link--active" onClick={() => this.closeMenu()}>About</Link> */}
      </nav>
    )
  }
}

export default Header
