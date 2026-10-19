import { searchGames, getGameById, getMostPlayedGames, getTrendingGames, getAllGames, getNewReleases, getTopRatedGames, normalizeGame} from '../utils/igdb.js'
import { getCachedGames, getCachedGameList, isCacheStale, upsertCachedGame, mapCachedRowToGame} from '../models/igdbGames.js'

async function sendCachedFallback(res, orderBy = 'cached_at DESC'){
  const games = await getCachedGameList(100, orderBy)
  if(games.length === 0) return false
  res.status(200).json({ games, cached: true })
  return true
}

export async function search(req, res) {
  const {q, webOnly} = req.query
  if(!q) return res.status(400).json({ msg : "search query is required"})

  try {
    const results = await searchGames(q, 20, webOnly === 'true')
    const normalized = results.map(normalizeGame)

    normalized.forEach(game => upsertCachedGame(game).catch(console.error))

    res.status(200).json({ games : normalized})
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg : "Failed to search games!!"})
  }
}

export async function mostPlayed(req, res) {
  const { webOnly } = req.query

  try {
    const results = await getMostPlayedGames(25, webOnly === 'true')
    const normalized = results.map(normalizeGame)

    normalized.forEach(game => upsertCachedGame(game).catch(console.error))

    res.status(200).json({ games : normalized })
  } catch (error) {
    console.error(error)
    try {
      if(!await sendCachedFallback(res, 'cached_at DESC')) {
        res.status(503).json({ msg : "Game service is temporarily unavailable" })
      }
    } catch (fallbackError) {
      console.error(fallbackError)
      res.status(500).json({ msg : "Failed to fetch most played games!!"})
    }
  }
}

export async function trending(req, res) {
  const { webOnly } = req.query

  try {
    const results = await getTrendingGames(500, webOnly === 'true')
    const normalized = results.map(normalizeGame)

    normalized.forEach(game => upsertCachedGame(game).catch(console.error))

    res.status(200).json({ games : normalized })
  } catch (error) {
    console.error(error)
    try {
      if(!await sendCachedFallback(res, 'rating DESC')) {
        res.status(503).json({ msg : "Game service is temporarily unavailable" })
      }
    } catch (fallbackError) {
      console.error(fallbackError)
      res.status(500).json({ msg : "Failed to fetch trending games!!"})
    }
  }

}

async function sendDiscoverGames(res, fetchGames, errorMessage, webOnly) {
  try {
    const results = await fetchGames(100, webOnly)
    const normalized = results.map(normalizeGame)

    normalized.forEach(game => upsertCachedGame(game).catch(console.error))

    res.status(200).json({ games: normalized })
  } catch (error) {
    console.error(error)
    try {
      if(!await sendCachedFallback(res, 'cached_at DESC')) {
        res.status(503).json({ msg : "Game service is temporarily unavailable" })
      }
    } catch (fallbackError) {
      console.error(fallbackError)
      res.status(500).json({ msg: errorMessage })
    }
  }
}

export function allGames(req, res) {
  return sendDiscoverGames(res, getAllGames, "Failed to fetch all games!!", req.query.webOnly === 'true')
}

export function newReleases(req, res) {
  return sendDiscoverGames(res, getNewReleases, "Failed to fetch new releases!!", req.query.webOnly === 'true')
}

export function topRated(req, res) {
  return sendDiscoverGames(res, getTopRatedGames, "Failed to fetch top rated games!!", req.query.webOnly === 'true')
}

export async function getGame(req, res) {
  const { igdbId } = req.params

  try {
    const cached = await getCachedGames(igdbId)

    if(cached && !isCacheStale(cached.cached_at)) {
      return res.status(200).json({ game : mapCachedRowToGame(cached)})
    }

    const fresh = await getGameById(igdbId)
    if(!fresh) return res.status(400).json({ msg : "Game Not Found!!" })

    const normalized =  normalizeGame(fresh)
    await upsertCachedGame(normalized)

    res.status(200).json({ game : normalized })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg : "Failed to fetch game!!"})
  }
}