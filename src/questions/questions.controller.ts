import express, { Router, Request, Response, NextFunction } from 'express'
import { getOne, getMany, getRandom } from './questions.service'

const routes: Router = express.Router()

routes.get('/question', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.query.id as string)
    res.json(getOne(id))
  } catch (e) {
    next(e)
  }
})

routes.get('/random', (req: Request, res: Response, next: NextFunction) => {
  res.json(getRandom())
})

routes.get('/all', (req: Request, res: Response, next: NextFunction) => {
  res.json(getMany())
})

export default routes
