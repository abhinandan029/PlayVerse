import {updateProfile} from '../models/users.js'

const VALID_AVATARS = ['fox', 'robot', 'cat', 'alien', 'ghost', 'ninja', 'astronaut', 'dragon', 'wizard', 'pixel-guy']

function normalizedUsername(username){
  return username.trim().toLowerCase()
}

export async function editProfile(req, res){

  const {username, bio, avatar} = req.body

  if( !username || username.length < 3 || username.length > 20){
    return res.status(400).json({ msg : "usename must be 3 - 20 characters long."})
  }

  if(!/^[a-zA-Z0-9_]+$/.test(username)){
    return res.status(400).json({ msg : "usename can only contain letters, numbers and underscore"})
  }

  if(bio && bio.length > 150){
    return res.status(400).json({ msg : "Bio must be 150 characters or less."})
  }

  if(avatar && !VALID_AVATARS.includes(avatar)){
    return res.status(400).json({ msg : "Invalid avatar selection."})
  }

  const usernameNormalized = normalizedUsername(username)

  try {
    await updateProfile(req.userId, { username, usernameNormalized, bio: bio || null, avatar : avatar || 'cat' })
    res.status(200).json({ msg : "Profile updated.", username, bio, avatar})
  }
  catch(error){
    if(error.code === "ER_DUP_ENTRY"){
      return res.status(409).json({ msg : "Username already taken."})
    }
    console.error(error)
    res.status(500).json({ msg : "Failed to updated profile." })
  }
}