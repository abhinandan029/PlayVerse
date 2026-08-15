import express from 'express'

import {register} from '../controllers/authController.js'

const authRouter = express.Router()

authRouter.use("/api/auth/register", register)

export default authRouter
