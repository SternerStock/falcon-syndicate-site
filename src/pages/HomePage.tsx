import SplashImg from '../assets/knee.svg'

const HomePage: React.FC = () => {
  return (
    <div className="page-interior">
      <div className="splash">
        <h1 className="splash__title">You better be playing Falcon!</h1>
        <SplashImg className="splash__bg-img" />
      </div>
    </div>
  )
}

export default HomePage
