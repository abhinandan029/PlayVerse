import express from 'express'
import passport from '../config/passport.js'

import {register, login, logout, setPassword, verifyToken, requestVerificationCode, requestResetCode, resetPassword, checkVerificationCode} from '../controllers/authController.js'
import { authenticate, generateToken } from '../utils/jwt.js'

const authRouter = express.Router()

function setTokenCookies(res, token){
  res.cookie('token', token, {
    httpOnly : true,
    sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge : 7*24*60*60*1000
  })
}

authRouter.get('/google', (req, res, next) => {
  res.setHeader('X-PlayVerse-OAuth', 'scope-enabled')
  passport.authenticate('google', {
    scope: 'profile email',
    session: false,
  })(req, res, next)
})

authRouter.get('/google/callback',
  passport.authenticate('google', {session : false, failureRedirect : `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`}),
  (req, res) => {
    const token = generateToken(req.user.id)
    setTokenCookies(res, token)
    const destination = req.user.isNewOAuthUser ? "/profile?setup=1" : "/home"
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}${destination}`)
  }
)

authRouter.post("/request-verification", requestVerificationCode)
authRouter.post("/complete-registration", register)

authRouter.post("/request-reset-code", requestResetCode)
authRouter.post("/reset-password", resetPassword)


authRouter.post("/check-code", checkVerificationCode)

authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.put("/password", authenticate, setPassword)

authRouter.get("/verify", authenticate, verifyToken)

export default authRouter
