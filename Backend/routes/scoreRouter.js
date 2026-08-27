import express from 'express'

import {submitScore, getLeaderBoard} from '../controllers/scoreController.js'
import { authenticate } from '../utils/jwt.js'

const scoreRouter = express.Router()

scoreRouter.post('/submit', authenticate, submitScore)
scoreRouter.get('/leader-board/:gameId', getLeaderBoard)

export default scoreRouter