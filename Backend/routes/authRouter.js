import express from 'express'
import passport from '../config/passport.js'

import {register, login, logout, verifyToken, requestVerificationCode, checkVerificationCode} from '../controllers/authController.js'
import { authenticate, generateToken } from '../utils/jwt.js'

const authRouter = express.Router()

function setTokenCookies(res, token){
  res.cookie('token', token, {
    httpOnly : true,
    sameSite : 'lax',
    maxAge : 7*24*60*60*100
  })
}

authRouter.get('/google', passport.authenticate('google', {scope : ['profile', 'email'], session : false}))

authRouter.get('/google/callback',
  passport.authenticate('google', {session : false, failureRedirect : "http://localhost:5173/login?error=oauth_failed"}),
  (req, res) => {
    const token = generateToken(req.user.id)
    setTokenCookies(res, token)
    res.redirect("http://localhost:5173/home")
  }
)

authRouter.post("/request-verification", requestVerificationCode)
authRouter.post("/check-code", checkVerificationCode)
authRouter.post("/complete-registration", register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)

authRouter.get("/verify", authenticate, verifyToken)

export default authRouter
