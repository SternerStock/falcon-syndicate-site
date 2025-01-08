import { FaEnvelope } from "react-icons/fa6"
import { FaDiscord } from "react-icons/fa6"
import { FaLinkedin } from "react-icons/fa6"
// import { FaMastodon } from "react-icons/fa6"
import { SiCodeberg } from "react-icons/si"

const Footer: React.FC = () => (
    <footer className="site-footer">
        <div className="site-footer__text">
            This is a dumb site by <a href="mailto:sternerstock@falconsyndicate.net">Corey Laird</a>.
        </div>
        <div className="site-footer__icons">
            <a href="mailto:sternerstock@falconsyndicate.net"><FaEnvelope /></a>
            <a target="_blank" href="https://discord.gg/m2X59jn"><FaDiscord /></a>
            <a target="_blank" href="https://codeberg.org/SternerStock"><SiCodeberg /></a>
            {/* <a target="_blank" href="https://hachyderm.io/@SternerStock"><FaMastodon /></a> */}
            <a target="_blank" href="https://www.linkedin.com/in/corey-laird-923b6066/"><FaLinkedin /></a>
        </div>
    </footer>
)

export default Footer