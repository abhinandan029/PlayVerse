import DB from '../utils/database.js'

export async function fetchGames(){
  const [result] = await DB.query('SELECT * FROM games')
  return result
}