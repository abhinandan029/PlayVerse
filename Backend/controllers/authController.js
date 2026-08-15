import bcrypt from 'bcrypt'

import {createUser} from '../models/users.js'


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