import passport from 'passport'
import { Strategy as GoogleStratergy} from 'passport-google-oauth20'
import {findUserByGoogleId, findUserByEmail, linkGoogleAccount, createOAuthUser} from '../models/users.js'

passport.use(new GoogleStratergy( {
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:3000/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if(!email) return done(new Error("NO Email returned from google."))
        
        let user = await findUserByGoogleId(profile.id)
        if(user) return done(null, user)

        const existingByEmail = await findUserByEmail(email)
        if(existingByEmail){
          await linkGoogleAccount(existingByEmail.id, profile.id)
          return done(null, {...existingByEmail, google_id : profile.id})
        }

        const result = await createOAuthUser(email, profile.id)
        return done(null, { id : result.insertId, email, google_id : profile.id})
      }
      catch(error){
        return done(error)
      }
    }
  )
)

export default passport