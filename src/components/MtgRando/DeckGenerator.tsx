import { useCallback, useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FaArrowLeft, FaCopy, FaDice, FaShuffle, FaX } from 'react-icons/fa6'
import { toast, ToastContainer } from 'react-toastify'
import DropdownList from 'react-widgets/DropdownList'
import Multiselect from 'react-widgets/Multiselect'

import 'keyrune'

import {
  Card,
  GenerateDeckRequest,
  Lookup,
  MtGSet,
  NumberRange,
  parseNumberRange,
} from '../../service/MtgApiDto'
import * as MtgApi from '../../service/MtgApiService'
import CollapsibleSection from '../CollapsibleSection'

import CardPreview from './CardPreview'
import ColorSelect from './ColorSelect'
import {
  type CountParam,
  defaultCardTypeCounts,
  defaultNonbasicCounts,
  defaultRestrictions,
  findParamRecursive,
} from './CountParam'
import { defaultFormats as formats, type Format } from './Formats'
import RandoRow from './RandoRow'
import ShuffleLoader from './ShuffleLoader'
import SliderGroup from './SliderGroup'

import 'react-widgets/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import styles from './DeckGenerator.module.scss'

const defaultParams = [
  ...defaultCardTypeCounts,
  ...defaultNonbasicCounts,
  ...defaultRestrictions,
]

const DeckGenerator: React.FC = () => {
  // Choice data loaded from API
  const [commanders, setCommanders] = useState<Card[]>([])
  const [partners, setPartners] = useState<Card[]>([])
  const [signatureSpells, setSignatureSpells] = useState<Card[]>([])
  const [sets, setSets] = useState<MtGSet[]>([])
  const [rarities, setRarities] = useState<Lookup[]>([])
  const [artists, setArtists] = useState<Lookup[]>([])
  const [frames, setFrames] = useState<Lookup[]>([])

  // Request parameters
  const [format, setFormat] = useState<Format>()
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [commanderId, setCommanderId] = useState<number>()
  const [partnerId, setPartnerId] = useState<number>()
  const [signatureSpellId, setSignatureSpellId] = useState<number>()
  const [silverBorder, setSilverBorder] = useState(false)
  const [restrictions, setRestrictions] = useState<CountParam[]>([])
  const [cardTypeCounts, setCardTypeCounts] = useState<CountParam[]>([])
  const [nonbasicCounts, setNonbasicCounts] = useState<CountParam[]>([])
  const [setIds, setSetIds] = useState<number[]>([])
  const [rarityIds, setRarityIds] = useState<number[]>([])
  const [artistIds, setArtistIds] = useState<number[]>([])
  const [frameIds, setFrameIds] = useState<number[]>([])

  // Loading status
  const [commandersLoading, setCommandersLoading] = useState(false)
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [miscLoading, setMiscLoading] = useState(false)

  const [generating, setGenerating] = useState(false)
  const [deck, setDeck] = useState<string>()
  const [issues, setIssues] = useState<string>()

  useEffect(() => {
    if (!format) return
    let isMounted = true

    setCommandersLoading(true)

    let cmdrsTask: Promise<Card[]>
    if (format.deckType === 'Commander' || format.deckType === 'Oathbreaker') {
      cmdrsTask = MtgApi.getCommanders(format.name, silverBorder)
    } else {
      cmdrsTask = Promise.resolve([])
    }

    setSilverBorder(silverBorder && format.allowSilver)

    Promise.all([cmdrsTask, MtgApi.getSets(format.name, silverBorder)]).then(
      ([newCommanders, newSets]) => {
        if (!isMounted) return
        setCommanders(newCommanders)
        setCommanderId((prev) => {
          if (newCommanders.findIndex(c => c.id === prev) === -1) {
            return undefined
          }
  
          return prev
        })
        setSets(newSets)
        setCommandersLoading(false)
      }
    )

    return () => {
      isMounted = false
    }
  }, [format, silverBorder])

  useEffect(() => {
    if (!format) return
    let isMounted = true

    setPartnersLoading(true)

    let spellsTask: Promise<Card[]>
    if (format.deckType === 'Oathbreaker' && commanderId) {
      spellsTask = MtgApi.getSignatureSpells(commanderId, silverBorder)
    } else {
      spellsTask = Promise.resolve([])
    }

    let partnersTask: Promise<Card[]>
    if (format.deckType === 'Commander' && commanderId) {
      partnersTask = MtgApi.getPartners(commanderId, format.name, silverBorder)
    } else {
      partnersTask = Promise.resolve([])
    }

    Promise.all([spellsTask, partnersTask]).then(([newSpells, newPartners]) => {
      if (!isMounted) return
      
      setSignatureSpells(newSpells)
      setPartners(newPartners)
      setPartnerId((prev) => {
        if (newPartners.findIndex(p => p.id === prev) === -1) {
          return undefined
        }

        return prev
      })
      setPartnersLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [commanderId, format, silverBorder])

  useEffect(() => {
    if (commanders && commanderId) {
      const commander = commanders.find((c) => c.id === commanderId)!
      if (partners && partnerId) {
        const partner = partners.find((p) => p.id === partnerId)
        if (partner) {
          setSelectedColors([
            ...new Set([...commander.colorIdentity, ...partner.colorIdentity]),
          ])
        }
      } else {
        setSelectedColors(commander.colorIdentity)
      }
    } else {
      setSelectedColors(['W', 'U', 'B', 'R', 'G'])
    }
  }, [commanderId, partnerId, commanders, partners])

  useEffect(() => {
    let isMounted = true;
    setMiscLoading(true)
    const raritiesTask = MtgApi.getRarities()
    const artistsTask = MtgApi.getArtists()
    const framesTask = MtgApi.getFrames()

    const urlParams = new URLSearchParams(window.location.search)

    const initialFormat =
      formats.find(
        (f) =>
          f.name === urlParams.get('format') &&
          f.deckType === urlParams.get('deckType')
      ) || formats[0]

    setFormat(initialFormat)

    const initialSilver = urlParams.get('silverBorder') === 'true'
    setSilverBorder(initialSilver)

    const mapCallback = (param: CountParam): CountParam => {
      const qryCount = urlParams.get(param.name)

      const returnObj: Partial<CountParam> = {
        children: param.children?.map(mapCallback),
      }

      if (qryCount && qryCount.indexOf(',') > -1) {
        const range = parseNumberRange(qryCount)
        if (range) {
          returnObj.range = [range.min, range.max]
        }
      } else if (qryCount) {
        const count = parseInt(qryCount)
        if (count) {
          returnObj.count = count
        }
      }

      return { ...param, ...returnObj }
    }

    const countParams = defaultCardTypeCounts.map(mapCallback)
    const nonbasicParams = defaultNonbasicCounts.map(mapCallback)
    const restrictions = defaultRestrictions.map(mapCallback)

    setRestrictions(restrictions)
    setCardTypeCounts(countParams)
    setNonbasicCounts(nonbasicParams)

    setSetIds(
      urlParams
        .get('setIds')
        ?.split(',')
        ?.map((id) => parseInt(id)) || []
    )
    setRarityIds(
      urlParams
        .get('rarityIds')
        ?.split(',')
        ?.map((id) => parseInt(id)) || []
    )
    setArtistIds(
      urlParams
        .get('artistIds')
        ?.split(',')
        ?.map((id) => parseInt(id)) || []
    )
    setFrameIds(
      urlParams
        .get('frameIds')
        ?.split(',')
        ?.map((id) => parseInt(id)) || []
    )

    Promise.all([raritiesTask, artistsTask, framesTask]).then(
      ([initRarities, initArtists, initFrames]) => {
        if (!isMounted) return

        setRarities(initRarities)
        setArtists(initArtists)
        setFrames(initFrames)
        setMiscLoading(false)
      }
    )

    return () => {
      isMounted = false
    }
  }, [])

  const maxCards = useMemo(
    () => (format?.deckSize ?? 99) - (partnerId ? 1 : 0),
    [format, partnerId]
  )

  const allParams = useMemo(
    () => [...cardTypeCounts, ...nonbasicCounts, ...restrictions],
    [cardTypeCounts, nonbasicCounts, restrictions]
  )

  const getRangeOrCount = useCallback(
    (name: string) => {
      const param = findParamRecursive(allParams, name)
      if (!param) {
        return -1
      }

      if (param.isRange) {
        if (!param.range) {
          return { min: param.min, max: param.max } as NumberRange
        }

        return { min: param.range[0], max: param.range[1] } as NumberRange
      }

      if (!param.enabled) {
        return -1
      }

      return param.count ?? -1
    },
    [allParams]
  )

  const copySettings = useMemo(() => {
    const urlParams = new URLSearchParams()

    if (format) {
      urlParams.set('deckType', format?.deckType || '')
      urlParams.set('format', format?.name || '')

      if (silverBorder) {
        urlParams.set('silverBorder', 'true')
      }
    }

    const edhrecrank = getRangeOrCount('edhrecrank') as NumberRange
    const defaultEdhrecrank = findParamRecursive(defaultParams, 'edhrecrank')
    if (
      edhrecrank.min !== defaultEdhrecrank?.min ||
      edhrecrank.max !== defaultEdhrecrank?.max
    ) {
      urlParams.set('edhrecrank', [edhrecrank.min, edhrecrank.max].toString())
    }

    const edhrecsaltrank = getRangeOrCount('edhrecsaltrank') as NumberRange
    const defaultEdhrecsaltrank = findParamRecursive(
      defaultParams,
      'edhrecsaltrank'
    )
    if (
      edhrecsaltrank.min !== defaultEdhrecsaltrank?.min ||
      edhrecsaltrank.max !== defaultEdhrecsaltrank?.max
    ) {
      urlParams.set(
        'edhrecsaltrank',
        [edhrecsaltrank.min, edhrecsaltrank.max].toString()
      )
    }

    const manaValue = getRangeOrCount('manaValue') as NumberRange
    const defaultManaValue = findParamRecursive(defaultParams, 'manaValue')
    if (
      manaValue.min !== defaultManaValue?.min ||
      manaValue.max !== defaultManaValue?.max
    ) {
      urlParams.set('manaValue', [manaValue.min, manaValue.max].toString())
    }

    if (setIds.length > 0) {
      urlParams.set('setIds', setIds.toString())
    }

    if (rarityIds.length > 0) {
      urlParams.set('rarityIds', rarityIds.toString())
    }

    if (artistIds.length > 0) {
      urlParams.set('artistIds', artistIds.toString())
    }

    if (frameIds.length > 0) {
      urlParams.set('frameIds', frameIds.toString())
    }

    urlParams.set('basicLands', getRangeOrCount('basicLands').toString())
    urlParams.set('nonbasicLands', getRangeOrCount('nonbasicLands').toString())
    urlParams.set('creatures', getRangeOrCount('creatures').toString())
    urlParams.set('sharesTypes', getRangeOrCount('sharesTypes').toString())
    urlParams.set('artifacts', getRangeOrCount('artifacts').toString())
    urlParams.set('equipment', getRangeOrCount('equipment').toString())
    urlParams.set('vehicles', getRangeOrCount('vehicles').toString())
    urlParams.set('enchantments', getRangeOrCount('enchantments').toString())
    urlParams.set('auras', getRangeOrCount('auras').toString())
    urlParams.set('planeswalkers', getRangeOrCount('planeswalkers').toString())
    urlParams.set('spells', getRangeOrCount('spells').toString())
    urlParams.set('manaProducing', getRangeOrCount('manaProducing').toString())
    urlParams.set('legendary', getRangeOrCount('legendary').toString())

    return `${window.location.origin}${window.location.pathname}?${urlParams}`
  }, [
    format,
    silverBorder,
    setIds,
    rarityIds,
    artistIds,
    frameIds,
    getRangeOrCount,
  ])

  const generateDeck = async () => {
    if (!format) return
    setGenerating(true)

    let cmdr = commanders.find((c) => c.id === commanderId)
    let partner = partners.find((c) => c.id === partnerId)
    let signatureSpell = signatureSpells.find((c) => c.id === signatureSpellId)
    let colorIdentity = [...selectedColors]

    if (
      !cmdr &&
      (format.deckType === 'Commander' || format.deckType === 'Oathbreaker')
    ) {
      const cmdrs = commanders.filter(
        (c) =>
          c.colorIdentity.sort().join('') === selectedColors.sort().join('')
      )

      cmdr = cmdrs[Math.floor(Math.random() * cmdrs.length)]
      colorIdentity = cmdr.colorIdentity
    }

    if (format.deckType === 'Commander' && !partnerId) {
      let newPartners = await MtgApi.getPartners(
        cmdr!.id,
        format.name,
        silverBorder
      )
      setPartners([...newPartners])
      newPartners = newPartners.filter((p) =>
        p.colorIdentity.some((c) => selectedColors.includes(c))
      )
      if (newPartners.length > 0) {
        partner = newPartners[Math.floor(Math.random() * newPartners.length)]
        colorIdentity = [
          ...new Set([...colorIdentity, ...partner.colorIdentity]),
        ]
      }
    }

    if (format.deckType === 'Oathbreaker' && !signatureSpellId) {
      const newSpells = await MtgApi.getSignatureSpells(cmdr!.id, silverBorder)
      setSignatureSpells(newSpells)
      if (newSpells.length > 0) {
        signatureSpell = newSpells[Math.floor(Math.random() * newSpells.length)]
      }
    }

    setCommanderId(cmdr?.id)
    setPartnerId(partner?.id)
    setSignatureSpellId(signatureSpell?.id)
    setSelectedColors(colorIdentity)

    const request: GenerateDeckRequest = {
      deckType: format.deckType,
      format: format.name,
      deckSize: maxCards,
      silverBorder: format.allowSilver && silverBorder,
      commanderId: cmdr?.id,
      partnerId: partner?.id,
      signatureSpellId: signatureSpell?.id,
      colorIdentity: colorIdentity,
      edhRecRange: getRangeOrCount('edhrecrank') as NumberRange,
      edhRecSaltRange: getRangeOrCount('edhrecsaltrank') as NumberRange,
      manaValueRange: getRangeOrCount('manaValue') as NumberRange,
      setIds: setIds,
      rarityIds: rarityIds,
      artistIds: artistIds,
      frameIds: frameIds,
      basicLands: getRangeOrCount('basicLands') as number,
      nonbasicLands: getRangeOrCount('nonbasicLands') as number,
      creatures: getRangeOrCount('creatures') as number,
      sharesType: getRangeOrCount('sharesTypes') as number,
      artifacts: getRangeOrCount('artifacts') as number,
      equipment: getRangeOrCount('equipment') as number,
      vehicles: getRangeOrCount('vehicles') as number,
      enchantments: getRangeOrCount('enchantments') as number,
      auras: getRangeOrCount('auras') as number,
      planeswalkers: getRangeOrCount('planeswalkers') as number,
      spells: getRangeOrCount('spells') as number,
      manaProducing: getRangeOrCount('manaProducing') as number,
      legendary: getRangeOrCount('legendary') as number,
    }

    const response = await MtgApi.generateDeck(request)
    setDeck(response?.cards)
    setIssues(response?.issues)
    setGenerating(false)
  }

  return (
    <div
      className={`${styles.mtgContainerOuter} ${generating || deck ? styles.generating : ''}`}
    >
      <div className={styles.leftCol}>
        <RandoRow label="Format">
          <div className="widget-wrapper">
            <DropdownList
              placeholder="Select a Format"
              filter="contains"
              data={formats}
              textField="name"
              groupBy="deckType"
              value={format}
              onChange={(newValue: Format) => {
                setFormat(newValue)
                setCommanderId(undefined)
                setPartnerId(undefined)
                setSignatureSpellId(undefined)
              }}
            />
            <div className={styles.formatExtra__row}>
              {format?.allowSilver && (
                <div className={styles.formatExtra}>
                  <label>
                    <input
                      type="checkbox"
                      checked={silverBorder}
                      onChange={(e) => setSilverBorder(e.target.checked)}
                    />{' '}
                    Allow silver-bordered cards
                  </label>
                </div>
              )}
              <em className={styles.formatExtra}>
                <a href={format?.rulesUrl} target="_blank" rel="noreferrer">
                  View Rules for Format
                </a>
              </em>
            </div>
          </div>
        </RandoRow>
        <RandoRow
          label="Color Identity"
          help="The color identity of cards allowed in the deck. Based on your Commander or Oathbreaker in those formats."
        >
          <div className="widget-wrapper">
            <ColorSelect
              selectedColors={selectedColors}
              onChange={(newColors) => {
                if (!commanderId) {
                  setSelectedColors(newColors)
                }
              }}
            />
          </div>
        </RandoRow>
        {(format?.deckType === 'Commander' ||
          format?.deckType === 'Oathbreaker') && (
          <RandoRow
            label={format?.deckType}
            help="Your deck's leader. Determines color identity. Leave blank ('Surprise me') to have a card of the selected colors picked for you."
          >
            <div className="widget-wrapper">
              <DropdownList
                placeholder="Surprise Me"
                filter="contains"
                data={commanders}
                textField="name"
                dataKey="id"
                value={commanderId}
                busy={commandersLoading}
                onChange={(newCmdr: Card) => setCommanderId(newCmdr.id)}
              />
              <button
                className={styles.btnClearOverlay}
                disabled={!commanderId}
                onClick={() => setCommanderId(undefined)}
              >
                <FaX />
              </button>
              <div className={styles.commanderExtra__row}>
                <button
                  className={styles.btnPrimary}
                  disabled={commandersLoading}
                  onClick={() =>
                    setCommanderId(
                      commanders[Math.floor(Math.random() * commanders.length)]
                        .id
                    )
                  }
                >
                  <FaDice /> Random {format?.deckType}
                </button>
              </div>
            </div>
          </RandoRow>
        )}
        {partners.length > 0 && (
          <RandoRow label="Partner" help="Your second commander.">
            <div className="widget-wrapper">
              <DropdownList
                placeholder="Surprise Me"
                filter="contains"
                data={partners}
                textField="name"
                dataKey="id"
                value={partnerId}
                busy={partnersLoading}
                onChange={(newPartner) => setPartnerId(newPartner.id)}
              />
              <button
                className={styles.btnClearOverlay}
                disabled={!partnerId}
                onClick={() => setPartnerId(undefined)}
              >
                <FaX />
              </button>
              <div>
                <button
                  className={styles.btnPrimary}
                  disabled={partnersLoading}
                  onClick={() => {
                    setPartnerId(
                      partners[Math.floor(Math.random() * partners.length)].id
                    )
                  }}
                >
                  <FaDice /> Random Partner
                </button>
              </div>
            </div>
          </RandoRow>
        )}
        {format?.deckType === 'Oathbreaker' && (
          <RandoRow
            label="Signature Spell"
            help="Your Oathbreaker's signature spell. You can cast the spell as long as your Oathbreaker is on the battlefield."
          >
            <div className="widget-wrapper">
              <DropdownList
                placeholder="Surprise Me"
                filter="contains"
                data={signatureSpells}
                textField="name"
                dataKey="id"
                value={signatureSpellId}
                busy={partnersLoading}
                onChange={(newSpell: Card) => setSignatureSpellId(newSpell.id)}
              />
              <button
                className={styles.btnClearOverlay}
                disabled={!signatureSpellId}
                onClick={() => setSignatureSpellId(undefined)}
              >
                <FaX />
              </button>
              <div>
                <button
                  className={styles.btnPrimary}
                  disabled={partnersLoading}
                  onClick={() =>
                    setSignatureSpellId(
                      signatureSpells[
                        Math.floor(Math.random() * signatureSpells.length)
                      ].id
                    )
                  }
                >
                  <FaDice /> Random Signature Spell
                </button>
              </div>
            </div>
          </RandoRow>
        )}
        <div className="button-row align-right">
          <button className={styles.btnPrimary} onClick={generateDeck}>
            <FaShuffle /> Generate Deck
          </button>
        </div>
        <CollapsibleSection title="Restrictions">
          {format ?
            <SliderGroup
              max={maxCards}
              params={restrictions}
              nonexclusive={true}
              onChange={(params) => setRestrictions(params)}
              format={format.deckType}
            />
          : <></>}
          <RandoRow iconClass="ss ss-pmtg1 ss-2x" label="Sets">
            <div className="widget-wrapper">
              <Multiselect
                placeholder="Any Set"
                filter="contains"
                data={sets}
                textField="name"
                dataKey="id"
                value={setIds}
                busy={commandersLoading}
                onChange={(newValue) => setSetIds(newValue.map((s) => s.id))}
                renderListItem={({ item }) => (
                  <div>
                    <i
                      className={`ss ss-2x ss-${item.keyruneCode?.toLowerCase()}`}
                    />{' '}
                    {item.name}
                  </div>
                )}
                renderTagValue={({ item }) => (
                  <div>
                    <i
                      className={`ss ss-2x ss-${item.keyruneCode?.toLowerCase()}`}
                    />{' '}
                    {item.code}
                  </div>
                )}
              />
            </div>
          </RandoRow>
          <RandoRow iconClass={'ss ss-2x ss-htr'} label="Rarities">
            <div className="widget-wrapper">
              <Multiselect
                placeholder="Any Rarity"
                filter="contains"
                data={rarities}
                textField="name"
                dataKey="id"
                value={rarityIds}
                busy={miscLoading}
                onChange={(newValue) => setRarityIds(newValue.map((l) => l.id))}
                renderListItem={({ item }) => (
                  <div>
                    <i
                      className={`ss ss-2x ss-htr ss-grad ss-${item.name?.toLowerCase()}`}
                    />{' '}
                    {item.name}
                  </div>
                )}
                renderTagValue={({ item }) => (
                  <div>
                    <i
                      className={`ss ss-2x ss-htr ss-grad ss-${item.name?.toLowerCase()}`}
                    />{' '}
                    {item.name}
                  </div>
                )}
              />
            </div>
          </RandoRow>
          <RandoRow iconClass="ss ss-pbook ss-2x" label="Artists">
            <div className="widget-wrapper">
              <Multiselect
                placeholder="Any Artist"
                filter="contains"
                data={artists}
                textField="name"
                dataKey="id"
                value={artistIds}
                busy={miscLoading}
                onChange={(newValue) => setArtistIds(newValue.map((l) => l.id))}
              />
            </div>
          </RandoRow>
          <RandoRow iconClass="ss ss-bcore ss-2x" label="Frames">
            <div className="widget-wrapper">
              <Multiselect
                placeholder="Any Frame Style"
                filter="contains"
                data={frames}
                textField="name"
                dataKey="id"
                value={frameIds}
                busy={miscLoading}
                onChange={(newValue) => setFrameIds(newValue.map((l) => l.id))}
              />
            </div>
          </RandoRow>
        </CollapsibleSection>
        <CollapsibleSection title="Card Types">
          {format ?
            <>
              <SliderGroup
                max={maxCards}
                params={cardTypeCounts}
                onChange={(params) => setCardTypeCounts(params)}
                format={format.deckType}
              />
              <SliderGroup
                max={
                  maxCards -
                  Math.max(getRangeOrCount('basicLands') as number, 0)
                }
                params={nonbasicCounts}
                nonexclusive={true}
                onChange={(params) => setNonbasicCounts(params)}
                format={format.deckType}
              />
            </>
          : <></>}
        </CollapsibleSection>
        <div className="button-row align-right">
          <CopyToClipboard
            text={copySettings}
            onCopy={() => toast.info('Copied Settings!')}
          >
            <button className={styles.btnPrimary}>
              <i className="ss ss-ugl" /> Copy Shareable Settings Link
            </button>
          </CopyToClipboard>
          <button className={styles.btnPrimary} onClick={generateDeck}>
            <FaDice /> Generate Deck
          </button>
        </div>
      </div>
      <div className={styles.rightCol}>
        <div className={styles.cmdrPreview}>
          {(
            format?.deckType === 'Commander' ||
            format?.deckType === 'Oathbreaker'
          ) ?
            <div>
              <h3 className="beleren">{format!.deckType}</h3>
              <CardPreview
                selectedCard={commanders.find((c) => c.id === commanderId)}
              />
            </div>
          : <></>}
          <div
            className={`${styles.resultsContainer} ${deck ? styles.generated : ''}`}
          >
            <div className={styles.loader}>
              <ShuffleLoader />
            </div>
            <div className={styles.results}>
              <h3>Result</h3>
              <div>
                <button
                  className={styles.btnPrimary}
                  onClick={() => {
                    setDeck(undefined)
                    setIssues(undefined)
                    setGenerating(false)
                  }}
                  disabled={!deck}
                >
                  <FaArrowLeft /> Back
                </button>
                <CopyToClipboard
                  text={deck ?? ''}
                  onCopy={() => toast.info('Copied Deck!')}
                >
                  <button className={styles.btnPrimary} disabled={!deck}>
                    <FaCopy /> Copy to Clipboard
                  </button>
                </CopyToClipboard>
                <CopyToClipboard
                  text={copySettings}
                  onCopy={() => toast.info('Copied Settings!')}
                >
                  <button className={styles.btnPrimary}>
                    <i className="ss ss-ugl" /> Copy Shareable Settings Link
                  </button>
                </CopyToClipboard>
              </div>
              {issues ?
                <div className={styles.issues}>Note: {issues}</div>
              : <></>}
              <CopyToClipboard
                text={deck ?? ''}
                onCopy={() => toast.info('Copied Deck!')}
              >
                <textarea
                  className={styles.resultBox}
                  value={deck}
                  readOnly={true}
                />
              </CopyToClipboard>
            </div>
          </div>
          {partnerId && partners.length > 0 ?
            <div>
              <h3 className="beleren">Partner</h3>
              <CardPreview
                selectedCard={partners.find((p) => p.id === partnerId)}
              />
            </div>
          : <></>}
          {format?.deckType === 'Oathbreaker' ?
            <div>
              <h3 className="beleren">Signature Spell</h3>
              <CardPreview
                selectedCard={signatureSpells.find(
                  (s) => s.id === signatureSpellId
                )}
              />
            </div>
          : <></>}
        </div>
      </div>
      <ToastContainer
        draggable={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        theme="dark"
      />
    </div>
  )
}

export default DeckGenerator
