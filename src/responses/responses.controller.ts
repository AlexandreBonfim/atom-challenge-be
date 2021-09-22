import express, { Router, Request, Response, NextFunction } from 'express'
import { getOne } from '../questions/questions.service'
import { Question } from '../questions/questions.types'
import { verifyResponse } from './responses.service'

const routes: Router = express.Router()

// Middleware
const verifyQuestion = (req: Request, res: Response, next: NextFunction) => {
  const { questionId, userAnswer } = req.body

  if (!questionId) return res.status(400).json({message :'Missing question id'})
  if (!userAnswer) return res.status(400).json({message :'Missing user answer'})

  const question: Question = getOne(questionId)

  const answerExists = question.answerOptions.some((answer) => answer.answerText === userAnswer)

  if (!answerExists) return res.status(400).json({message :'Answer is not in question'})

  res.locals.question = question // as I could not change type using locals
  res.locals.answer = userAnswer

  return next();
}

routes.post('/verify', verifyQuestion,(req: Request, res: Response, next: NextFunction) => {
  const { locals: { question, answer }} = res;
  const result = verifyResponse(question, answer)

  res.json({ isCorrect: result })
})

export default routes
