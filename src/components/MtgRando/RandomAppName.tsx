import { useEffect, useState } from 'react'

import { getRandomAppName } from '../../service/MtgApiService'

const RandomAppName: React.FC = () => {
  const [name, setName] = useState('')

  useEffect(() => {
    const getText = async () => {
      const data = await getRandomAppName()
      setName(data ?? '')
    }

    const interval = setInterval(getText, 60000)
    getText()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <em className="app-header__subtitle">{name ? `aka ${name}` : ''}</em>
}

export default RandomAppName
