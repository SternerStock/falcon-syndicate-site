import { useEffect, useMemo, useState } from 'react'
import reactStringReplace from 'react-string-replace'

import 'mana-font'
import '@saeris/typeface-beleren-bold'

import mtgCardBackUrl from '../../assets/MtG/mtgcardback.jpg'
import { Card } from '../../service/MtgApiDto'
import CrossfadeImage from '../CrossfadeImage'

import styles from './CardPreview.module.scss'

interface CardPreviewProps {
  selectedCard?: Card
}

const replaceManaSymbols = (
  text?: string | React.ReactNode[]
): React.ReactNode[] =>
  reactStringReplace(
    text,
    /\{([^}]+)\}/g,
    (segment: string, index: number, offset: number) => {
      let className
      if (segment === 'T') {
        className = 'ms-tap'
      } else if (segment.match(/(^[WUBRGCXYZPSE∞]$)|(^\d+$)/)) {
        className = 'ms-' + segment.toLowerCase()
      } else if (segment.match(/(^H[WUBRG]$)/)) {
        className = 'ms-half ms-' + segment[1].toLowerCase()
      } else if (segment === '½') {
        className = 'ms-1-2'
      } else if (segment.indexOf('/') === 1) {
        className = 'ms-' + segment.replace('/', '').toLowerCase()
      }

      if (className) {
        return (
          <i
            key={`mana-${index + offset}`}
            className={`ms ms-cost ${className}`}
          />
        )
      } else {
        return segment
      }
    }
  )

const replaceReminderText = (
  text?: string | React.ReactNode[]
): React.ReactNode[] => {
  return reactStringReplace(
    text,
    /(\([^)]+\))/g,
    (segment: string, index: number, offset: number) => {
      const replaced = replaceLoyalty(replaceManaSymbols([segment]))
      return <em key={`reminder-${index + offset}`}>{replaced}</em>
    }
  )
}

const replaceLoyalty = (
  text?: string | React.ReactNode[]
): React.ReactNode[] => {
  return reactStringReplace(
    text,
    /\[([^\]]+)\]/g,
    (segment: string, index: number, offset: number) => {
      let className
      if (segment.startsWith('+') || segment === '0') {
        className = 'ms-loyalty-up'
      } else if (segment.startsWith('−')) {
        className = 'ms-loyalty-down'
      } else {
        return segment
      }

      className += ' ms-loyalty-' + segment.replace(/[+−]/, '').toLowerCase()
      return (
        <i key={`loyalty-${index + offset}`} className={`ms ${className}`} />
      )
    }
  )
}

const CardPreview: React.FC<CardPreviewProps> = ({ selectedCard }) => {
  const [mvId, setMvId] = useState(0)
  const [scryfallId, setScryfallId] = useState(0)

  useEffect(() => {
    setMvId(0)
    setScryfallId(0)
  }, [selectedCard])

  const imgSrc = useMemo(() => {
    if (selectedCard) {
      if (scryfallId < selectedCard.scryfallId.length) {
        return `https://cards.scryfall.io/normal/front/${selectedCard.scryfallId[scryfallId][0]}/${selectedCard.scryfallId[scryfallId][1]}/${selectedCard.scryfallId[scryfallId]}.jpg`
      } else if (mvId < selectedCard.multiverseId.length) {
        return `https://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=${selectedCard.multiverseId[mvId]}`
      }
    }

    return mtgCardBackUrl
  }, [selectedCard, mvId, scryfallId])

  return (
    <div className={styles.cardPreviewContainer}>
      <div className={styles.cardImg}>
        <CrossfadeImage
          src={imgSrc}
          alt={selectedCard?.name}
          onError={() => {
            if (selectedCard?.scryfallId?.length ?? 0 > scryfallId) {
              setScryfallId((prev) => prev + 1)
            } else {
              setMvId((prev) => prev + 1)
            }
          }
        }
        />
      </div>
      {selectedCard && (
        <div className={styles.oracle}>
          <div className={styles.nameRow}>
            <div>{selectedCard.name}</div>
            <div>{replaceManaSymbols([selectedCard.manaCost])}</div>
          </div>
          <div className={styles.typeline}>{selectedCard.typeLine}</div>
          {selectedCard.oracleText && (
            <div>
              {replaceLoyalty(
                replaceManaSymbols(replaceReminderText(selectedCard.oracleText))
              )}
            </div>
          )}
          {selectedCard.flavorText && (
            <div className={styles.flavorText}>{selectedCard.flavorText}</div>
          )}
          {(selectedCard.power || selectedCard.loyalty) && (
            <div className={styles.power}>
              <span>
                {selectedCard.loyalty ?
                  selectedCard.loyalty
                : selectedCard.power ?
                  `${selectedCard.power}/${selectedCard.toughness}`
                : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CardPreview
