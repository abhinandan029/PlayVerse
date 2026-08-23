import express from 'express'

import { authenticate } from '../utils/jwt.js'
import {editProfile, checkUsernameAvailable} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.put("/profile", authenticate, editProfile)
userRouter.get("/check-username", authenticate, checkUsernameAvailable)

export default userRouter