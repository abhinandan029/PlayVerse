import {getWishlistByUserId, isGameWishlisted, addToWishlist, removeFromWishlist, isDiscoverGameWishlisted, addDiscoverGameToWishlist, removeDiscoverGameFromWishlist} from '../models/wishlist.js'
import { getCachedGamesByIds } from '../models/igdbGames.js'

export async function getMyWishlist(req, res){
  try{
    const gameIds = await getWishlistByUserId(req.userId)
    res.status(200).json({ gameIds })
  } catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to fetch wishlist."})
  }
}

export async function getMyDiscoverWishlist(req, res){
  try {
    const gameIds = await getWishlistByUserId(req.userId)
    const games = await getCachedGamesByIds(gameIds)
    res.status(200).json({ games })
  } catch(error) {
    console.error(error)
    res.status(500).json({ msg : "Failed to fetch discovered wishlist." })
  }
}

export async function toggleWishlist(req, res){
  const {gameId, source = 'classic'} = req.body

  if(!gameId){
    return res.status(400).json({ msg : "game ID is required"})
  }

  try{
    const discoverGame = source === 'igdb'
    const exists = discoverGame
      ? await isDiscoverGameWishlisted(req.userId, gameId)
      : await isGameWishlisted(req.userId, gameId)
    
    if(exists){
      if(discoverGame) await removeDiscoverGameFromWishlist(req.userId, gameId)
      else await removeFromWishlist(req.userId, gameId)
      return res.status(200).json({ wishlisted : false})
    }
    else{
      if(discoverGame) await addDiscoverGameToWishlist(req.userId, gameId)
      else await addToWishlist(req.userId, gameId)
      return res.status(200).json({ wishlisted : true})
    }
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to update wishlist."})
  }
}