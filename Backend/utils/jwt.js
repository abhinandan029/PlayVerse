import jwt from 'jsonwebtoken'

export function generateToken(userId){

  return jwt.sign(

    { id : userId },
    process.env.JWT_SECRET,
    { expiresIn : '7d' } 
  
  )

}

export async function authenticate(req, res, next){

  const token = req.cookies?.token 
  
  if(!token) return res.status(401).json({msg : "Not Authenticated."})

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded.id)
    
    req.userId = decoded.id
    next()
  }
  catch(error){
    res.status(401).json({ msg : "Invalid or expired session."})
  }

}