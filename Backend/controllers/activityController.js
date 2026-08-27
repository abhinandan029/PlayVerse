import { getUserActivity } from '../models/activity.js'

export async function getMyActivity(req, res){
  try{
    const activity = await getUserActivity(req.userId, 365)
    res.status(200).json({ activity })
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to fetch activity"})
  }
}