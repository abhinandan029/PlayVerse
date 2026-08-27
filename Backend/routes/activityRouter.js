import express from 'express'
import { getMyActivity } from '../controllers/activityController.js'
import { authenticate } from '../utils/jwt.js'

const activityRouter = express.Router()

activityRouter.get('/mine', authenticate, getMyActivity)

export default activityRouter