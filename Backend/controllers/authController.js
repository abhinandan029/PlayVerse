import bcrypt from 'bcrypt'

import {createUser, findUserByEmail} from '../models/users.js'


// Controller for user registration
export async function register(req, res){
  const {email, password} = req.body

  if(!email || !password) {
    return res.status(400).json({ msg : "Email or Password are required."})
  }

  try{
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser(email, hashedPassword)

    res.status(201).json({ msg : "Email registered successfully."})
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
    if(!password){
      return res.status(401).json({msg : "Invalid Email or Password"})
    }
    
    res.status(201).json({msg : "You have loggedin to your account"})
  }
  catch(error){
    console.error(error)
    res.status(500).json({msg : "Login failed."})
  }
}