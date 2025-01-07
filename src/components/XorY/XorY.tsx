import { useCallback, useEffect, useMemo, useState } from 'react'
import { FaX } from 'react-icons/fa6'
import { Modal } from 'react-responsive-modal'

import '@fontsource/gochi-hand'

import { Answer, Question, Session } from '../../service/XorYApiDto'
import * as service from '../../service/XorYApiService'

import OptionContainer from './OptionContainer'

import 'react-responsive-modal/styles.css'
import styles from './XorY.module.scss'

export interface XorYProps {
  category1: string
  category2: string
}

const XorY: React.FC<XorYProps> = ({ category1, category2 }) => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session>(() => {
    const storedSession = localStorage.getItem(
      `${category1}-${category2}-session`
    )

    return storedSession ?
        (JSON.parse(storedSession) as Session)
      : {
          seenOptions: [],
          correct: 0,
          attempts: 0,
        }
  })
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: 0,
    name: '',
  })
  const [selectedOption, setSelectedOption] = useState('')
  const [answerResponse, setAnswerResponse] = useState<Answer>()
  const [correctAnswer, setCorrectAnswer] = useState<string>('')

  const nextQuestion = useCallback(
    async (seenOptions?: number[]) => {
      setLoading(true)
      let question = await service.GetQuestion({
        categories: [category1, category2],
        seenOptions,
      })

      if (!question) {
        setSession((prev) => ({
          ...prev,
          seenOptions: [],
        }))

        question = await service.GetQuestion({
          categories: [category1, category2],
        })
      }

      setSelectedOption('')
      setCurrentQuestion(
        question ?? {
          id: 0,
          name: '',
        }
      )
      setLoading(false)
    },
    [category1, category2]
  )

  const checkAnswer = useCallback(
    async (choice: string) => {
      setLoading(true)
      setSelectedOption(choice)
      const response = await service.CheckAnswer({
        optionId: currentQuestion.id,
        answer: choice,
      })

      setCorrectAnswer(
        response.correct ?
          choice === category1 ?
            category1
          : category2
        : choice === category1 ? category2
        : category1
      )
      setAnswerResponse(response)
      setSession((prev) => ({
        ...prev,
        seenOptions: [...prev.seenOptions, currentQuestion.id],
        correct: response.correct ? prev.correct + 1 : prev.correct,
        attempts: prev.attempts + 1,
      }))
      setLoading(false)
    },
    [category1, category2, currentQuestion.id]
  )

  useEffect(() => {
    nextQuestion()
  }, [nextQuestion])

  useEffect(() => {
    localStorage.setItem(
      `${category1}-${category2}-session`,
      JSON.stringify(session)
    )
  }, [category1, category2, session])

  useEffect(() => {
    const storedSession = localStorage.getItem(
      `${category1}-${category2}-session`
    )
    setSession(
      storedSession ?
        (JSON.parse(storedSession) as Session)
      : { seenOptions: [], correct: 0, attempts: 0 }
    )
  }, [category1, category2])

  const score = useMemo(
    () =>
      `${((session.attempts > 0 ? session.correct / session.attempts : 1) * 100).toFixed(0)}%`,
    [session.attempts, session.correct]
  )

  return (
    <>
      <div className={`${styles.centerOverlay} ${styles.scoreboard}`}>
        <div>
          <span>Answered</span> <strong>{session.attempts}</strong>
        </div>
        <div>
          <span>Correct</span> <strong>{session.correct}</strong>
        </div>
        <div>
          <span>Score</span> <strong>{score}</strong>
        </div>
        <button
          className={`${styles.cancelBtn}`}
          title="Reset Stats"
          onClick={() =>
            setSession({
              seenOptions: [],
              correct: 0,
              attempts: 0,
            })
          }
        >
          <FaX />
        </button>
      </div>

      <div className={`${styles.centerOverlay} ${styles.question}`}>
        <div>{currentQuestion.name || '???'}</div>
      </div>

      <div className={styles.wrapper}>
        <OptionContainer
          category={category1}
          selected={selectedOption === category1}
          correct={
            correctAnswer === '' ? undefined : correctAnswer === category1
          }
          onClick={loading ? undefined : () => checkAnswer(category1)}
        />
        <OptionContainer
          category={category2}
          selected={selectedOption === category2}
          correct={
            correctAnswer === '' ? undefined : correctAnswer === category2
          }
          onClick={loading ? undefined : () => checkAnswer(category2)}
        />
      </div>

      <Modal
        open={!!selectedOption}
        onClose={() => {
          setSelectedOption('')
          setCorrectAnswer('')
        }}
        animationDuration={300}
        onAnimationEnd={
          selectedOption ? undefined : () => nextQuestion(session.seenOptions)
        }
        classNames={{
          modal: `${styles.modal} ${answerResponse?.correct ? styles.correct : styles.incorrect} ${loading ? styles.loading : ''}`,
        }}
        closeOnOverlayClick={!loading}
        showCloseIcon={false}
        center
      >
        <h2>{answerResponse?.correct ? 'Correct!' : 'Incorrect!'}</h2>
        <div>
          {answerResponse?.url ?
            <a href={answerResponse.url} target="_blank">
              {currentQuestion.name}
            </a>
          : currentQuestion.name}{' '}
          is a <strong>{correctAnswer}</strong>
        </div>
      </Modal>
    </>
  )
}

export default XorY
