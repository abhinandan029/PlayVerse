import 'dotenv/config'

import express from 'express'
import cors from 'cors'

import passport from 'passport'
import cookieParser from 'cookie-parser'

import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'
import gamesRouter from './routes/gamesRouter.js'
import wishlistRouter from './routes/wishlistRouter.js'
import scoreRouter from './routes/scoreRouter.js'
import activityRouter from './routes/activityRouter.js'

const app = express()

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true,
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/games", gamesRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api/score", scoreRouter)
app.use('/api/activity', activityRouter)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`)
})