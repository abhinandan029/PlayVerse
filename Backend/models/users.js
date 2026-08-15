import DB from '../utils/database.js'

export async function createUser(email, password){
  const [result] = await DB.query('INSERT INTO users(email, password) VALUES(? ,?)', [email, password])
  return result
}

export async function findUserByEmail(email){
  const [result] = await DB.query('SELECT email, password FROM users WHERE email = ?', [email])
  return result[0]
}