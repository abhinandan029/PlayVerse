const ACCOUNT_ID = process.env.CF_ACCOUNT_ID
const DATABASE_ID = process.env.CF_D1_DATABASE_ID
const API_TOKEN = process.env.CF_API_TOKEN

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`

async function query(sql, params = []) {
  const res = await fetch(D1_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  })

  const data = await res.json()

  if (!data.success) {
    const message = data.errors?.[0]?.message || 'D1 query failed'
    throw new Error(message)
  }

  const result = data.result[0]

  // mimic mysql2's [rows] array-destructure pattern, so most model code
  // barely changes: const [rows] = await DB.query(...)
  return [result.results, result.meta]
}

const DB = { query }

export default DB