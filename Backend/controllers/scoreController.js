import {insertScore, hasPlayedGame, getUserBestScore, getTopScores, getUserOverallBest} from '../models/scores.js'
import {logActivity, bumpDailyActivity} from '../models/activity.js'

export async function submitScore(req, res){
  const {gameId, score} = req.body

  if( !gameId || score === undefined || score === null) {
    return res.status(400).json({ msg : "gameId and score are required."})
  }

  if( typeof score != 'number' || score < 0 ){
    return res.status(400).json({ msg : "invalid score"})
  }

  try {
    const alreadyPlayed = await hasPlayedGame(req.userId, gameId)
    const previousBest = await getUserBestScore(req.userId, gameId)

    await insertScore(req.userId, gameId, score)

    await bumpDailyActivity(req.userId)
    
    if( !alreadyPlayed ){
      await logActivity(req.userId, 'new_game_Played', gameId)
    }

    if( previousBest === null || score > previousBest) {
      await logActivity(req.userId, 'high_score', gameId)
    }

    res.status(201).json({
      msg : 'Score Submitted',
      isNewHighScore : previousBest === null || score > previousBest,
      isFirstPlay : !alreadyPlayed
    })
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to submit the score"})
  }
}

export async function getLeaderBoard(req, res){
  const {gameId} = req.params

  if( !gameId ){
    return res.status(400).json({ msg : "Game ID is required."})
  } 

  try {
    const scores = await getTopScores(gameId, 5)
    res.status(200).json({ scores })
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to fecth leader board"})
  }
}