import express from 'express'

import {register, login} from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.use("/api/auth/register", register)
authRouter.use("/api/auth/login", login)

export default authRouter
