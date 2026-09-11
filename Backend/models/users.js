import DB from '../utils/database.js'

export async function createUser(email, password, isVerified){
  const [rows, meta] = await DB.query('INSERT INTO users (email, password, is_verified) VALUES (?, ?, ?)', [email, password, isVerified ? 1 : 0])
  return { insertId: meta.last_row_id }
}

export async function findUserByEmail(email){
  const [result] = await DB.query('SELECT * FROM users WHERE email = ?', [email])
  return result[0]
}

export async function findUserById(id){
  const [result] = await DB.query('SELECT * FROM users WHERE id = ?', [id])
  return result[0]
}

export async function updateProfile(userId, {username, usernameNormalized, bio, avatar}){
  await DB.query('UPDATE users SET username = ?, username_normalized = ?, bio = ?, avatar = ? WHERE id = ?',
    [username, usernameNormalized, bio, avatar, userId]
  )
}

export async function findUserByUsernameNormalized(usernameNormalized){
  const [result] = await DB.query('SELECT id FROM users WHERE username_normalized = ?', [usernameNormalized])
  return result[0]
}

export async function findUserByGoogleId(googleId){
  const [result] = await DB.query('SELECT * FROM users WHERE google_id = ?', [googleId])
  return result[0]
}

export async function linkGoogleAccount(userId, googleId){
  await DB.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, userId])
}

export async function createOAuthUser(email, googleId = null){
  const [rows, meta] = await DB.query(
    `INSERT INTO users (email, password, google_id, is_verified)
    VALUES (?, NULL, ?, 1)`,
    [email, googleId]
  )
  return { insertId: meta.last_row_id }
}

export async function updatePassword(userId, password){
  await DB.query('UPDATE users SET password = ? WHERE id = ?', [password, userId])
}