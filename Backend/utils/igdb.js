import {getIgdbToken} from "./igdbAuth.js"

const IGDB_BASE_URL = "https://api.igdb.com/v4"
const WEB_BROWSER_PLATFORM_ID = 82
const STEAM_PLATFORM_ID = 6
const PLAYING_POPULARITY_TYPE = 2
const POPULARITY_CANDIDATE_LIMIT = 100
const TRENDING_GAMES_LIMIT = 500
const DISCOVER_GAMES_LIMIT = 100
const IGDB_REQUEST_ATTEMPTS = 2
const IGDB_REQUEST_TIMEOUT_MS = 12000

const WEBSITE_CATEGORY_MAP = {
  1 : 'official',
  13 : 'steam',
  15 : 'itch',
}

const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

async function igdbQuery(endpoint, apicalypseQuery){
  const token = await getIgdbToken() 

  for(let attempt = 1; attempt <= IGDB_REQUEST_ATTEMPTS; attempt++){
    try{
      const res = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
      method : 'POST',
      headers : {
        'Client-ID' : process.env.IGDB_CLIENT_ID,
        'Authorization' : `Bearer ${token}`,
        'Connection' : 'close',
        'Content-Type' : 'text/plain',  
      },
      body : apicalypseQuery,
      signal : AbortSignal.timeout(IGDB_REQUEST_TIMEOUT_MS),
      })

      if(!res.ok){
        const errorText = await res.text()
        throw new Error(`Failed to fetch data from IGDB : ${res.status} - ${errorText}`)
      }

      return res.json()
    }
    catch(error){
      if(attempt === IGDB_REQUEST_ATTEMPTS) throw error

      console.warn(`IGDB ${endpoint} request failed (attempt ${attempt}/${IGDB_REQUEST_ATTEMPTS}), retrying...`, error)
      await wait(attempt * 1000)
    }
  }
}

function buildPlatformClause(webOnly){
  return webOnly ? `platforms = (${WEB_BROWSER_PLATFORM_ID}) &` : ''
}

export async function searchGames(query, limit = 20, webOnly = false){
  const apicalypse = `
    search "${query}";
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name;
    where ${buildPlatformClause(webOnly)} cover != null & platforms = (${STEAM_PLATFORM_ID});
    limit ${limit};
  `
  return igdbQuery('games', apicalypse)
}

export async function getGameById(igdbId){
  const apicalypse = `
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name, screenshots.url, websites.url, websites.category;
    where id = ${igdbId};
  `
  const results =  await igdbQuery('games', apicalypse)
  return results[0] || null
}

export async function getMostPlayedGames(limit = 20, webOnly = false){
  const popularityQuery = `
    fields game_id, value, popularity_type;
    where popularity_type = ${PLAYING_POPULARITY_TYPE};
    sort value desc;
    limit ${POPULARITY_CANDIDATE_LIMIT};
  `
  const popularityResults = await igdbQuery('popularity_primitives', popularityQuery)
  const gameIds = popularityResults.map(game => game.game_id).filter(Boolean)

  if(gameIds.length === 0) return []

  const gamesQuery = `
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name;
    where id = (${gameIds.join(',')}) & ${buildPlatformClause(webOnly)} cover != null & platforms = (${STEAM_PLATFORM_ID});
    limit ${gameIds.length};
  `
  const games = await igdbQuery('games', gamesQuery)
  const gamesById = new Map(games.map(game => [game.id, game]))

  return gameIds
    .map(gameId => gamesById.get(gameId))
    .filter(Boolean)
    .slice(0, limit)
}

export async function getTrendingGames(limit = TRENDING_GAMES_LIMIT, webOnly = false){
  const apicalypse = `
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name;
    where ${buildPlatformClause(webOnly)} rating != null & cover != null & platforms = (${STEAM_PLATFORM_ID});
    sort rating desc;
    limit ${Math.min(limit, TRENDING_GAMES_LIMIT)};
  `
  return igdbQuery('games', apicalypse)
}

function getDiscoverGamesQuery(sort, limit, webOnly = false){
  return `
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name;
    where ${buildPlatformClause(webOnly)} cover != null & platforms = (${STEAM_PLATFORM_ID});
    sort ${sort};
    limit ${Math.min(limit, DISCOVER_GAMES_LIMIT)};
  `
}

export async function getAllGames(limit = DISCOVER_GAMES_LIMIT, webOnly = false){
  return igdbQuery('games', getDiscoverGamesQuery('name asc', limit, webOnly))
}

export async function getNewReleases(limit = DISCOVER_GAMES_LIMIT, webOnly = false){
  return igdbQuery('games', getDiscoverGamesQuery('first_release_date desc', limit, webOnly))
}

export async function getTopRatedGames(limit = DISCOVER_GAMES_LIMIT, webOnly = false){
  return igdbQuery('games', `
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name;
    where ${buildPlatformClause(webOnly)} cover != null & rating != null & platforms = (${STEAM_PLATFORM_ID});
    sort rating desc;
    limit ${Math.min(limit, DISCOVER_GAMES_LIMIT)};
  `)
}

function pickPlayLink(websites){
  if(!websites || websites.length === 0) return null

  const priority = ['itch', 'official', 'steam']

  for (const category of priority){
    const match = websites.find(w => WEBSITE_CATEGORY_MAP[w.category] === category)
    if(match) return {url : match.url, source : category}
  }

  return null
}

export function normalizeGame(raw){
  return {
    igdbId : raw.id,
    name : raw.name,
    summary : raw.summary || null,
    coverUrl : raw.cover?.url ? `https:${raw.cover.url.replace('t_thumb', 't_cover_big')}` : null,
    genres : raw.genres?.map(g => g.name) || [],
    platforms : raw.platforms?.map(p => p.name) || [],
    releaseDate : raw.first_release_date ? new Date(raw.first_release_date * 1000).toISOString().slice(0, 10) : null,
    rating : raw.rating || null,
    screenshots : raw.screenshots?.map((screenshot) => `https:${screenshot.url.replace('t_thumb', 't_screenshot_med')}`) || [],
    playLink : pickPlayLink(raw.websites),
    rawJson : raw 
  }
}
