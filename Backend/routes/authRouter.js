import express from 'express'

import {register, login, logout, verifyToken, verifyEmail} from '../controllers/authController.js'
import { authenticate } from '../utils/jwt.js'

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)

authRouter.get("/verify", authenticate, verifyToken )

authRouter.post("/verify-email", verifyEmail)

export default authRouter
