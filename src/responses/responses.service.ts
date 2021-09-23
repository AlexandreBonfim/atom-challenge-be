import { Question } from '../questions/questions.types'
import {
  UserResponse,
  UserPerformance,
  MonthPerformance,
  QuarterPerformance
} from './responses.types'


const verifyResponse = (question: Question, userAnswer: string): boolean => {
  //TODO: backend verification
  if (!userAnswer) {
    throw new Error('Answer cannot be empty')
  }

  const answer = question.answerOptions.find(answer => answer.answerText === userAnswer)

  if (!answer) {
    throw new Error('User answer does not match any answer for that question')
  }

  return answer.isCorrect
}

const getMonthKey = (value: Date): string => {
  // Add 1, as "getMonth()" starts from 0
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const year = value.getFullYear()

  return `${month}-${year}`
}

const getQuarter = (monthly: MonthPerformance[], quarter: number, year?: number): QuarterPerformance => {
  if (quarter > 4 || quarter <= 0) throw new Error('wrong quarter input')
  if (year && year.toString().length !== 4 ) throw new Error('Not a proper year')

  let monthlyResult: MonthPerformance[] = []
  let performance: number = 0

  const yearInput = year || new Date().getFullYear()

  monthly.forEach((item) => {

    // Breakdown date keys
    const month = Number(item.date.split('-')[0])
    const itemYear = Number(item.date.split('-')[1])

    // filter by quarter based on year
    if (Math.ceil(month / 3) === quarter && itemYear === yearInput) {
      performance += item.performanceRating
      monthlyResult.push(item)
    }
  })

  return {
    performanceRating: +(performance / 3).toFixed(2), // avg the 3 months(quarter)
    monthlyBreakdown: monthlyResult
  }
}

const calculatePerformance = (responses: UserResponse[], quarter?: number, year?: number ): UserPerformance => {
  //TODO: calculate avg performance
  let difficultySum: number = 0
  let performanceSum: number = 0

  let monthlyResult: MonthPerformance[] = []

  responses.forEach(response => {
    const date = new Date(response.dateUnix * 1000)
    const { question: { difficulty, answerOptions}} = response

    const key = getMonthKey(date)

    const isCorrect = answerOptions.find(answer => answer.answerText === response.userAnswer).isCorrect

    const monthExist = monthlyResult.find(x => x.date === key)

    // Populate obj
    if(monthExist) {
      if(isCorrect) {
        monthExist.performanceRating += (1 * difficulty)
        monthExist.difficulty += difficulty
      } else {
        monthExist.performanceRating -= (5 - difficulty)
        monthExist.difficulty += difficulty
      }
    } else {
      let initialPerformanceRating: number = 0

      if(isCorrect) {
        initialPerformanceRating += (1 * difficulty)
      } else {
        initialPerformanceRating -= (5 - difficulty)
      }
      monthlyResult.push({
        date: key,
        performanceRating: initialPerformanceRating,
        difficulty: difficulty
      })
    }

    // Get sum of difficulty of questions
    difficultySum += difficulty
  })

  // Monthly avg breakdown
  monthlyResult.forEach((item) => {
    performanceSum += item.performanceRating
    item.performanceRating = +((item.performanceRating/item.difficulty) * 100).toFixed(2)

    // In case of negative always will be 0
    if (item.performanceRating < 0) item.performanceRating = 0

    // Never cross the avg of 100
    if (item.performanceRating > 100) item.performanceRating = 100

    //remove property
    delete item.difficulty
  })

  return {
    performanceRating: +((performanceSum/difficultySum) * 100).toFixed(2),
    monthlyBreakdown: monthlyResult,
    quarter: getQuarter(monthlyResult, quarter, year)
  }
}

export { verifyResponse, calculatePerformance }

export const exportedForTesting = { getMonthKey, getQuarter }
