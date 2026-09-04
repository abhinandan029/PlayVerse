import express from 'express'
import { getMyActivity, getMyActivityFeed } from '../controllers/activityController.js'
import { authenticate } from '../utils/jwt.js'

const activityRouter = express.Router()

activityRouter.get('/mine', authenticate, getMyActivity)
activityRouter.get('/feed', authenticate, getMyActivityFeed)

export default activityRouter