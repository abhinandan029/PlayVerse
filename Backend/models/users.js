import DB from '../utils/database.js'

export async function createUser(email, password){
  const [result] = await DB.query('INSERT INTO users(email, password) VALUES(? ,?)', [email, password])
  return result
}