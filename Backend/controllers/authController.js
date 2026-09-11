import bcrypt from 'bcrypt'

import {createUser, findUserByEmail, findUserById, updatePassword} from '../models/users.js'
import { createVerificationCode, findVerificationByEmail, deleteVerification } from '../models/emailVerification.js'

import { sendVerificationCode} from '../utils/email.js'
import {generateToken} from '../utils/jwt.js'

export async function requestVerificationCode(req, res){
  const { email } = req.body

  if(!email){
    return res.status(400).json({ msg : "Email is required."})
  }

  try{
    const existingUser = await findUserByEmail(email)
    if(existingUser){
      return res.status(409).json({ msg : "An account with this email already exists."})
    }

    const code = await createVerificationCode(email)

    try{
      await sendVerificationCode(email, code)
    }
    catch(emailError){
      console.error("Failed to send verification email : ", emailError)
      return res.status(500).json({ msg : "Failed to send verification email." })
    }

    res.status(200).json({ msg : "Verification code sent." })
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to request verification."})
  }
}


export async function checkVerificationCode(req, res){
  const { email, code } = req.body

  if(!email || !code){
    return res.status(400).json({ msg : "Email and code are required."})
  }

  try{
    const record = await findVerificationByEmail(email)

    if(!record){
      return res.status(400).json({ msg : "No verification pending for this email."})
    }

    if(new Date(record.expires_at) < new Date()){
      return res.status(400).json({ msg : "Code has expired, request new one."})
    }

    if ( record.code !== code){
      return res.status(400).json({msg : "Incorrect code."})
    }

    res.status(200).json({ msg : "code verified."})

  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed verify code."})
  }

}


function setTokenCookie(res, token){
  res.cookie('token', token, {
    httpOnly : true,
    sameSite: 'lax',
    maxAge : 7*24*60*60*1000 
  })
}

// Controller for user registration
export async function register(req, res){
  const {email, code, password} = req.body

  if(!email || !code || !password) {
    return res.status(400).json({ msg : "Eamil, code and Password are required."})
  }

  try{
    
    const record =  await findVerificationByEmail(email)
    if(!record) {
      return res.status(409).json({msg : "No Verification pending for this email."})
    }

    if(new Date(record.expires_at) < new Date()){
      return res.status(400).json({ msg : "Verification Code expired. Please start over."})
    }

    if( record.code !== code){
      return res.status(400).json({ msg : "incorrect code"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await createUser(email, hashedPassword, true)

    await deleteVerification(record.id)

    const authToken = generateToken(result.insertId)
    setTokenCookie(res, authToken)

    res.status(201).json({ msg : "Email registered successfully.", user : { id : result.inserId, email : email}})
  }
  catch(error){
    console.log(error)
    res.status(500).json({ msg : "Registration failed"})
  }
  
}

export async function login(req, res){

  const {email, password} = req.body

  if(!email || !password){
    return res.status(400).json({msg : "Email or Password are required."})
  }

  try{
    const user = await findUserByEmail(email)

    if(!user) {
      return res.status(400).json({msg : "User not found"})
    }

    const passwordCheck = await bcrypt.compare(password, user.password)
    if(!passwordCheck){
      return res.status(401).json({msg : "Invalid Email or Password"})
    }

    const token = generateToken(user.id)
    setTokenCookie(res, token)
    
    res.status(200).json({msg : "You have loggedin to your account", user : { id : user.id, email : user.email }})
  }
  catch(error){
    console.error(error)
    res.status(500).json({msg : "Login failed."})
  }
}

export async function logout(req, res){
  res.clearCookie('token', {
    httpOnly : true,
    sameSite : 'lax'
  })

  res.status(200).json({ msg : "Logged out successfully."})
} 

export async function setPassword(req, res){
  const { password, confirmPassword } = req.body

  if(!password || !confirmPassword){
    return res.status(400).json({ msg : "Password and confirmation are required." })
  }

  if(password.length < 8){
    return res.status(400).json({ msg : "Password must be at least 8 characters long." })
  }

  if(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)){
    return res.status(400).json({ msg : "Password must include uppercase, lowercase, number, and special character." })
  }

  if(password !== confirmPassword){
    return res.status(400).json({ msg : "Passwords do not match." })
  }

  try{
    const user = await findUserById(req.userId)
    if(!user){
      return res.status(404).json({ msg : "User not found." })
    }

    if(!user.google_id){
      return res.status(403).json({ msg : "Password setup is only available for Google accounts." })
    }

    if(user.password){
      return res.status(409).json({ msg : "A password is already set for this account." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await updatePassword(req.userId, hashedPassword)

    res.status(200).json({ msg : "Password set successfully." })
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to set password." })
  }
}

export async function verifyToken(req, res){

  const user = await findUserById(req.userId)

  if(!user) return res.status(404).json({ msg : "User Not Found!"})

  res.status(200).json({ user }) 

}

