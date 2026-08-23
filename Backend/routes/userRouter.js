import express from 'express'

import { authenticate } from '../utils/jwt.js'
import {editProfile} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.put("/profile", authenticate, editProfile)

export default userRouter