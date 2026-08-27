import DB from '../utils/database.js'

export async function logActivity(userId, activityType, referenceId = null) {
  await DB.query('INSERT INTO activity_log (user_id, activity_type, reference_id) VALUES (?, ?, ?)', [userId, activityType, referenceId])
}

export async function bumpDailyActivity(userId){
  await DB.query(
    `INSERT INTO daily_activity (user_id, activity_date, count) 
    VALUES (?, CURDATE(), 1)
    ON DUPLICATE KEY UPDATE count = count + 1`, 
    [userId]
  )
}

export async function getUserActivity(userId, days = 365){
  const [result] = await DB.query(
    `SELECT activity_date, count FROM daily_activity
    WHERE user_id = ? AND activity_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    ORDER BY activity_date`,
    [userId, days]
  )

  return result.map((row) => ({
    activity_date : row.activity_date.toISOString().slice(0, 10),
    count : row.count
  }))
}

export async function getRecentActivityFeed(userId, limit = 20){
  const [result] = await DB.query(
    `SELECT activity_type, reference_id, created_at FROM activity_log
    WHERE user_id = ? 
    ORDER BY created_at DESC
    LIMIT ?`,
    [userId, limit]
  )

  return result
}