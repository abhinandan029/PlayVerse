import {fetchGames} from '../models/games.js'

export async function loadGames(req, res){

  try {
    const games = await fetchGames()

    if(games.length === 0) {
      return res.status(404).json({ msg : "No games Found"})
    }

    res.status(200).json({ games })
  }
  catch(error){
    console.error(error)
    res.status(500).json({ mdg : 'failed to load games.'})
  }
}