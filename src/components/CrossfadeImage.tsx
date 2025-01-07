// Adapted from react-crossfade-img at https://github.com/takapro/react-crossfade-img
import { ReactEventHandler, useMemo, useState } from 'react'

type ObjectFit = React.CSSProperties['objectFit']

type CrossfadeImgProps = {
  src: string
  alt?: string
  width?: string
  height?: string
  objectFit?: ObjectFit
  duration?: string
  onError?: ReactEventHandler<HTMLImageElement>
}

const imgStyle: React.CSSProperties = {
  position: 'absolute',
  width: `100%`,
  height: `100%`,
}

const CrossfadeImg: React.FC<CrossfadeImgProps> = ({
  src = '',
  alt = '',
  width = '100%',
  height = '100%',
  objectFit = 'fill',
  duration = '1s',
  onError,
}: CrossfadeImgProps) => {
  const spanStyle: React.CSSProperties = useMemo(
    () => ({
      display: 'inline-block',
      position: 'relative',
      width,
      height,
    }),
    [width, height]
  )

  const imgStyles = useMemo(
    () => [
      { ...imgStyle, objectFit, opacity: 0, transition: `opacity ${duration}` },
      { ...imgStyle, objectFit, opacity: 1, transition: `opacity ${duration}` },
      { ...imgStyle, objectFit, opacity: 0 },
    ],
    [objectFit, duration]
  )

  const [key, setKey] = useState(0)
  const [srcs, setSrcs] = useState(['', ''])
  const nextSrc = src !== srcs[1] ? src : ''

  const onLoadImg = () => {
    setKey((key + 1) % 3)
    setSrcs([srcs[1], nextSrc])
  }

  return (
    <span style={spanStyle}>
      {[...srcs, nextSrc].map(
        (src, index) =>
          src !== '' && (
            <img
              key={(key + index) % 3}
              src={src}
              alt={alt}
              style={imgStyles[index]}
              onLoad={index === 2 ? onLoadImg : undefined}
              onError={onError}
            />
          )
      )}
    </span>
  )
}

export default CrossfadeImg
