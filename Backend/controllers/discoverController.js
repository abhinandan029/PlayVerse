import { searchGames, getGameById, getTrendingGames, normalizeGame} from '../utils/igdb.js'
import { getCachedGames, isCacheStale, upsertCachedGame, mapCachedRowToGame} from '../models/idgbGames.js'

export async function search(req, res){
  const {q, webOnly} = req.query
  if(!q) return res.status(400).json({ msg : "search query is required"})

  try{
    const results = await searchGames(q, 20, webOnly === 'true')
    const normalized = results.map(normalizeGame)

    normalized.forEach(game => upsertCachedGame(game).catch(console.error))

    res.status(200).json({ games : normalized})
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to search games!!"})
  }
}

export async function trending(req, res){
  const { webOnly } = req.query

  try{
    const results = await getTrendingGames(20, webOnly === 'true')
    const normalized = results.map(normalizeGame)

    normalized.forEach(game => upsertCachedGame(game).catch(console.error))

    res.status(200).json({ games : normalized})
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to fetch trending games!!"})
  }
}

export async function getGame(req, res){
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
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to fetch game!!"})
  }
}