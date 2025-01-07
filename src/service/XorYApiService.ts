import {
  Answer,
  AnswerCheckRequest,
  Question,
  QuestionRequest,
} from './XorYApiDto'

export const GetQuestion = async (request: QuestionRequest) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/XorY/Question`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  )

  if (response.ok && response.status !== 204) {
    const data: Question = await response.json()
    return data
  }
}

export const CheckAnswer = async (request: AnswerCheckRequest) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/XorY/CheckAnswer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  )

  if (response.ok) {
    const data: Answer = await response.json()
    return data
  }

  throw new Error('Failed to check answer')
}
