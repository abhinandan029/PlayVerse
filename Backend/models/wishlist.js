import DB from '../utils/database.js'

export async function getWishlistByUserId(userId){
  const [result] = await DB.query('SELECT game_id FROM wishlist WHERE user_id = ?', [userId])
  return result.map(row => row.game_id)
}

export async function isGameWishlisted(userId, gameId){
  const [result] = await DB.query('SELECT id FROM wishlist WHERE user_id = ? AND game_id = ?', [userId, gameId])
  return result.length > 0
}

export async function addToWishlist(userId, gameId){
  await DB.query('INSERT INTO wishlist(user_id, game_id) VALUES(?, ?)', [userId, gameId])
}

export async function removeFromWishlist(userId, gameId){
  await DB.query('DELETE FROM wishlist WHERE user_id = ? AND game_id = ?', [userId, gameId])
}