import DB from '../utils/database.js'

export async function insertScore(userId, gameId, score){
  await DB.query('INSERT INTO scores( user_id, game_id, score) VALUES (?, ?, ?)', [userId, gameId, score])
}

export async function getUserBestScore(userId, gameId){
  const [result] = await DB.query('SELECT MAX(score) as best FROM scores WHERE user_id = ? AND game_id = ?', [userId, gameId])
  return result[0]?.best ?? null
}

export async function hasPlayedGame(userId, gameId){
  const [result] = await DB.query('SELECT id FROM scores WHERE user_id = ? AND game_id = ? LIMIT 1', [userId, gameId])
  return result.length > 0 
}

export async function getTopScores(gameId, limit = 5){
  const [result] = await DB.query(
    `SELECT s.score, s.created_at, u.username, u.avatar
    FROM scores s JOIN users u ON u.id = s.user_id
    WHERE s.game_id = ?
    ORDER BY s.score DESC
    LIMIT ?`, 
    [gameId, limit]
  )
  return result 
}

export async function getUserOverallBest(userId){
  const [result] = await DB.query(
    'SELECT MAX(score) as best FROM scores WHERE user_id = ?', [userId]
  )
  return result[0]?.best ?? null
}
