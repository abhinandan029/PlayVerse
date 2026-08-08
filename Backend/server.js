import 'dotenv/config'
import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'

const app = express()

const PORT = 3000
app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`)
})