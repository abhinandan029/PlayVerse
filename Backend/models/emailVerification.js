import DB from '../utils/database.js'

function generateCode(){
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function createVerificationCode(email){
  const code = generateCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await DB.query(
    `INSERT INTO email_verifications ( email, code, expires_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE code = ?, expires_at = ?, created_at = CURRENT_TIMESTAMP`,
    [email, code, expiresAt, code, expiresAt]  
  )

  return code
} 

export async function findVerificationByEmail(email){
  const [result] = await DB.query('SELECT id, code, expires_at FROM email_verifications WHERE email = ?', [email])
  return result[0]
}

export async function deleteVerification(id){
  await DB.query('DELETE FROM email_verifications WHERE id = ?', [id])
}