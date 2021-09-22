import { Question } from '../questions/questions.types'

export type UserResponse = {
  question: Question
  userAnswer: string
  dateUnix: number
}

export type UserPerformance = {
  performanceRating: number,
  monthlyBreakdown: Array<MonthPerformance>,
  quarter: QuarterPerformance
}

export type MonthPerformance = {
  date: string
  performanceRating: number
  difficulty?: number
}

export type QuarterPerformance = {
  performanceRating: number
  monthlyBreakdown: Array<MonthPerformance>
}
