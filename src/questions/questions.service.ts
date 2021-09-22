import { Question } from './questions.types'
import { getQuestions } from './questions.store'

// destructuring  responses
const cleanResponses = (questions: Question[]): Question[] => {
  const res = questions.map(({ answerOptions = [], ...item }) => ({
    ...item,
    answerOptions: answerOptions.map(({ isCorrect, ...answer }) => answer)
  }));

  return res;
}

const getOne = (id: number): Question => {
  const question: Question = getQuestions().find((qus) => qus.id === id)

  if (!question) {
    throw new Error('Question not found')
  }

  return question
}

const getRandom = (): Question => {
  const random = getQuestions()[Math.floor(Math.random() * getQuestions().length)]
  return cleanResponses([random])[0]
}

const getMany = (): Question[] => {
  const questions = getQuestions()
  return cleanResponses(questions)
}

export { getOne, getRandom, getMany }
