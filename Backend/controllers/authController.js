import bcrypt from 'bcrypt'

import {createUser, findUserByEmail, findUserById} from '../models/users.js'
import {generateToken} from '../utils/jwt.js'

function setTokenCookie(res, token){
  res.cookie('token', token, {
    httpOnly : true,
    sameSite: 'lax',
    maxAge : 7*24*60*60*1000 
  })
}

// Controller for user registration
export async function register(req, res){
  const {email, password} = req.body

  if(!email || !password) {
    return res.status(400).json({ msg : "Email or Password are required."})
  }

  try{
    
    const existing =  await findUserByEmail(email)
    if(existing) {
      return res.status(409).json({msg : "email already registered."})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await createUser(email, hashedPassword)

    const token = generateToken(result.insertId)
    setTokenCookie(res, token)

    res.status(201).json({ msg : "Email registered successfully.", user : { id : result.inserId, email : email }})
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

export async function verifyToken(req, res){

  const user = await findUserById(req.userId)

  if(!user) return res.status(404).json({ msg : "User Not Found!"})

  res.status(200).json({ user : {id : user.id, email : user.email}}) 

}

