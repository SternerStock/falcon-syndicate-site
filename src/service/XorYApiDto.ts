export interface Session {
    seenOptions: number[]
    correct: number;
    attempts: number;
}

export interface QuestionRequest {
    categories: string[]
    seenOptions?: number[]
}

export interface Question {
    id: number
    name: string
}

export interface AnswerCheckRequest {
    optionId: number
    answer: string
}

export interface Answer {
    correct: boolean
    url?: string
}