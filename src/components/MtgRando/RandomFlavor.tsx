import { useEffect, useState } from 'react'

import { getRandomFlavorText } from '../../service/MtgApiService'

const RandomFlavor: React.FC = () => {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  

  useEffect(() => {
    const getText = async () => {
      const data = await getRandomFlavorText()

      setName(data?.name ?? '')
      setText(data?.flavorText ?? '')
    }

    const interval = setInterval(getText, 60000)
    getText()

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <em title={name} className="mPlantin">
      {text}
    </em>
  )
}

export default RandomFlavor
