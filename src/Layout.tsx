import { Outlet } from "react-router-dom"

import '@fontsource/press-start-2p'

import Footer from "./Footer"
import Header from "./Header"

import './style/site.scss'


export const Layout: React.FC = () => {
  return (
    <div className="flex-container flex-container--fullpage">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}