import { verifyResponse, calculatePerformance, exportedForTesting } from './responses.service'
import { performanceResponses, monthlyBreakdownResponses } from './responses.mock'

const { getQuarter, getMonthKey } = exportedForTesting

const mockQuestion = {
  id: 1,
  questionText: 'This is a test question',
  answerOptions: [
    {
      answerText: 'A',
      isCorrect: true
    },
    {
      answerText: 'B',
      isCorrect: false
    }
  ],
  difficulty: 1
}

const mockMonthlyResponse = [ //@ todo : move to response
  { date: '01-2021', performanceRating: 37.5 },
  { date: '02-2021', performanceRating: 100 },
  { date: '10-2021', performanceRating: 10 } // shouldn't show
]

const mockDate = new Date(2021, 11, 11);

describe('Responses Module', () => {
  describe('verifyResponse', () => {
    test('should return true when supplied with correct answer option', () => {
      expect(verifyResponse(mockQuestion, 'A')).toBe(true)
    })

    test('should return false when supplied with incorrect answer option', () => {
      expect(verifyResponse(mockQuestion, 'B')).toBe(false)
    })

    test('should throw an error when answer is not a valid option', () => {
      expect(() => verifyResponse(mockQuestion, 'C')).toThrowError()
    })

    test('should throw an error when answer is not present', () => {
      expect(() => verifyResponse(mockQuestion, '')).toThrowError()
    })
  })

  describe('getQuarter', () => {
    test('should throw an error when quarter is not between 1 and 4', () => {
      expect(() => getQuarter(mockMonthlyResponse, 5).performanceRating).toThrowError()
    })

    test('should throw an error when year is not equal 4 digits', () => {
      expect(() => getQuarter(mockMonthlyResponse, 1, 201).performanceRating).toThrowError()
    })

    test('should return Q4 average performance', () => {
      expect(getQuarter(mockMonthlyResponse, 1).performanceRating).toEqual(45.83)
    })

    test('should return Q4 monthly average performance', () => {
      expect(getQuarter(mockMonthlyResponse, 1).monthlyBreakdown).toEqual(
        [
          { date: '01-2021', performanceRating: 37.5 },
          { date: '02-2021', performanceRating: 100 }
        ]
      )
    })
  })

  describe('getMonthKey', () => {
    test('should return date formatted', () => {
      expect(getMonthKey(mockDate)).toEqual('12-2021')
    })
  })

  describe('calculatePerformance', () => {
    test('should return an average performance', () => {
      expect(calculatePerformance(performanceResponses, 4, 2020).performanceRating).toEqual(40.33)
    })

    test('should return monthly average performance', () => {
      expect(calculatePerformance(performanceResponses, 4, 2020).monthlyBreakdown).toEqual(expect.arrayContaining(monthlyBreakdownResponses))
    })

    test('should return Q4 average performance', () => {
      expect(calculatePerformance(performanceResponses, 4, 2020).quarter.performanceRating).toEqual(11.11)
    })

    test('should return Q4 monthly average performance', () => {
      expect(calculatePerformance(performanceResponses, 4, 2020).quarter.monthlyBreakdown).toEqual(
        [
          { date: '10-2020', performanceRating: 0 },
          { date: '12-2020', performanceRating: 0 },
          { date: '11-2020', performanceRating: 33.33 }
        ]
      )
    })
  })
})
