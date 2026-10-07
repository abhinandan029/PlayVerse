import {getIgdbToken} from "./igdbAuth.js"

const IGDB_BASE_URL = "https://api.igdb.com/v4"
const WEB_BROWSER_PLATFORM_ID = 82

const WEBSITE_CATEGORY_MAP = {
  1 : 'official',
  13 : 'steam',
  15 : 'itch',
}

async function igdbQuery(endpoint, apicalypseQuery){
  const token = await getIgdbToken() 

  const res = await fetch(`${IGDB_BASE_URL}/${endpoint}`, {
      method : 'POST',
      headers : {
        'Client-ID' : process.env.IGDB_CLIENT_ID,
        'Authorization' : `Bearer ${token}`,
        'Content-Type' : 'text/plain',  
      },
      body : apicalypseQuery,
    }
  )

  if(!res.ok){
    throw new Error(`Failed to fetch data from IGDB : ${res.status} - ${res.text()}`)
  }

  return res.json()
}

function buildPlatformClause(webOnly){
  return webOnly ? `platform = (${WEB_BROWSER_PLATFORM_ID}) &` : ''
}

export async function searchGames(query, limit = 20, webOnly = false){
  const apicalypse = `
    search "${query}";
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name;
    where ${buildPlatformClause(webOnly)} cover != null;
    limit ${limit};
  `
  return igdbQuery('games', apicalypse)
}

export async function getGameById(igdbId){
  const apicalypse = `
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name, screenshots.url, websites.url, websites.category;
    where id = ${igdbId}
  `
  const results =  await igdbQuery('games', apicalypse)
  return results[0] || null
}

export async function getTrendingGames(limit = 20, webOnly = false){
  const apicalypse = `
    fields name, summary, cover.url, genres.name, first_release_date, rating, platforms.name;
    where ${buildPlatformClause(webOnly)} rating != null & cover 1= null;
    sort rating desc;
    limit ${limit};
  `
  return igdbQuery('games', apicalypse)
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
    playLink : pickPlayLink(raw.websites),
    rawJson : raw 
  }
}



