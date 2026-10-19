import DB from '../utils/database.js'

let discoverWishlistReady

function ensureDiscoverWishlistTable(){
  if(!discoverWishlistReady){
    discoverWishlistReady = DB.query(`
      CREATE TABLE IF NOT EXISTS discover_wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        UNIQUE(user_id, game_id)
      )
    `)
  }
  return discoverWishlistReady
}

export async function getWishlistByUserId(userId){
  const [result] = await DB.query('SELECT game_id FROM wishlist WHERE user_id = ?', [userId])
  await ensureDiscoverWishlistTable()
  const [discoverResult] = await DB.query('SELECT game_id FROM discover_wishlist WHERE user_id = ?', [userId])
  return [...result, ...discoverResult].map(row => row.game_id)
}

export async function isGameWishlisted(userId, gameId){
  const [result] = await DB.query('SELECT id FROM wishlist WHERE user_id = ? AND game_id = ?', [userId, gameId])
  return result.length > 0
}

export async function addToWishlist(userId, gameId){
  await DB.query('INSERT INTO wishlist (user_id, game_id) VALUES (?, ?)', [userId, gameId])
}

export async function removeFromWishlist(userId, gameId){
  await DB.query('DELETE FROM wishlist WHERE user_id = ? AND game_id = ?', [userId, gameId])
}

export async function isDiscoverGameWishlisted(userId, gameId){
  await ensureDiscoverWishlistTable()
  const [result] = await DB.query('SELECT id FROM discover_wishlist WHERE user_id = ? AND game_id = ?', [userId, gameId])
  return result.length > 0
}

export async function addDiscoverGameToWishlist(userId, gameId){
  await ensureDiscoverWishlistTable()
  await DB.query('INSERT OR IGNORE INTO discover_wishlist (user_id, game_id) VALUES (?, ?)', [userId, gameId])
}

export async function removeDiscoverGameFromWishlist(userId, gameId){
  await ensureDiscoverWishlistTable()
  await DB.query('DELETE FROM discover_wishlist WHERE user_id = ? AND game_id = ?', [userId, gameId])
}