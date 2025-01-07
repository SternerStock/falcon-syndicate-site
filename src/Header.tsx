import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navlinkclass = ({ isActive, isPending }: { isActive: boolean, isPending: boolean }) =>
    `top-nav__link top-nav__link--home ${isActive
        ? "top-nav__link--active"
        : isPending
            ? "top-nav__link--pending"
            : ""}`;

const Header: React.FC = () => {
    const [expanded, setExpanded] = useState(false)

    return (
        <nav className={`top-nav ${expanded ? 'top-nav--expanded' : ''}`}>
            <NavLink
                to="/"
                className={navlinkclass}
                onClick={() => setExpanded(false)}
            >
                Falcon Syndicate
            </NavLink>
            <span className="top-nav__menu">
                <button
                    className={`top_nav__menu c-hamburger c-hamburger--htx ${expanded ? ' is-active' : ''}`}
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    <span>toggle menu</span>
                </button>
            </span>
            <NavLink
                to="/minecraft/"
                className={navlinkclass}
                onClick={() => setExpanded(false)}
            >
                Minecraft Map
            </NavLink>
            <NavLink to="/ska/" className={navlinkclass} onClick={() => setExpanded(false)}>Ska Band or Kids' Show?</NavLink>
            <NavLink
                to="/mtg-rando/"
                className={navlinkclass}
                onClick={() => setExpanded(false)}
            >
                MtG Randomizer
            </NavLink>
        </nav>
    )
}

export default Header
