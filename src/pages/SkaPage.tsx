import { Helmet } from 'react-helmet-async'

import XorY from '../components/XorY/XorY'

const SkaPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Ska Band or Kids' Show?</title>
        <meta
          name="description"
          content="Guess whether the name you're shown is a ska band or a kids' show."
        />
        <meta name="keywords" content="ska, kids' show" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Ska Band or Kids' Show?" />
        <meta
          name="twitter:description"
          content="It's harder than you think."
        />
      </Helmet>
      <div className="page-interior page-interior--stretch">
        <XorY category1="Ska Band" category2="Kids' Show" />
      </div>
    </>
  )
}

export default SkaPage
