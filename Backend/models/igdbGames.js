import DB from '../utils/database.js'

const CACHE_TTL_DAYS = 7

export async function getCachedGames(igdbId){
  const [result] = await DB.query('SELECT * FROM igbd_games where igdb_id = ?', [igdbId])
  return result[0]
}

export function isCacheStale(cachedAt){
  const cachedDate = new Date(cachedAt)
  const ageInDays = (Date.now() - cachedDate.getTime()) / ( 1000 * 60 * 60 * 24)
  return ageInDays > CACHE_TTL_DAYS 
}

export async function upsertCachedGame(gameData){
  const { igdbId, name, summary, coverUrl, genres, platforms, releaseDate, rating, playLink, rawJson } = gameData

  const playLinkUrl = playLink?.url || null
  const playLinkSource = playLink?.source || null

  await DB.query(
    `INSERT INTO igdb_games(
      igdb_id, name, summary, cover_url, genres, platforms, release_date, rating, play_link_url, play_link_source, raw_json, cached_at
    )
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(igdb_id) DO UPDATE SET 
      name = excluded.name,
      summary = excluded.summary,
      cover_url = excluded.cover_url,
      genres = excluded.genres,
      platform = excluded.platforms,
      release_date = excluded.release_date,
      rating = excluded.rating,
      play_link_url = excluded.play_link_url,
      play_link_source = excluded.play_link_source,
      raw_json = excluded.raw_json,
      cached_at = excluded.cached_at`, 
    [
      igdbId, name, summary, coverUrl, JSON.stringify(genres), JSON.stringify(platforms), 
      releaseDate, rating, playLinkUrl, playLinkSource, JSON.stringify(rawJson)  
    ]
  )
}

export function mapCachedRowToGame(row){
  return {
    igdbId : row.igdb_id,
    name : row.name, 
    summary : row.summary,
    coverUrl : row.cover_url,
    genres : JSON.parse(row.genres || '[]'),
    platforms : JSON.parse(row.platforms || '[]'),
    releaseDate : row.release_date,
    rating : row.rating,
    playLink : row.play_link_url ? { url : row.play_link_url, source : row.play_link_source} : null
  }
}