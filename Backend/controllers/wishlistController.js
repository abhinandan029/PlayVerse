import {getWishlistByUserId, isGameWishlisted, addToWishlist, removeFromWishlist} from '../models/wishlist.js'

export async function getMyWishlist(req, res){
  try{
    const gameIds = await getWishlistByUserId(req.userId)
    res.status(200).json({ gameIds })
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to fetch wishlist."})
  }
}

export async function toggleWishlist(req, res){
  const {gameId} = req.body

  if(!gameId){
    return res.status(400).json({ msg : "game ID is required"})
  }

  try{
    const exists = await isGameWishlisted(req.userId, gameId)
    
    if(exists){
      await removeFromWishlist(req.userId, gameId)
      return res.status(200).json({ wishlisted : false})
    }
    else{
      await addToWishlist(req.userId, gameId)
      return res.status(200).json({ wishlisted : true})
    }
  }
  catch(error){
    console.error(error)
    res.status(500).json({ msg : "Failed to update wishlist."})
  }
}