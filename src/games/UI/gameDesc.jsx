import {Heart, MessageSquareCode} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useWishlist } from '../../contexts/wishlistContext.jsx'
import { useAuth } from '../../contexts/authContext.jsx'

const images = import.meta.glob("../../assets/*.png", { eager: true, import: "default" })

export default function GameDesc({gameName, gameType, description, focus, id}){

  const navigate = useNavigate()
  const { user } = useAuth()

  function getImage(game){
    const filename = `../../assets/${game.replaceAll(" ", "-")}.png`
    return images[filename] 
  }

  const { wishlistId, toggleWishlist, loading: wishlistLoading } = useWishlist()
   
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center m-4 sm:m-10 lg:m-15 p-4 sm:p-8 lg:p-15 gap-6 lg:gap-10">

      <img src={getImage(gameName)} className="w-full max-w-sm lg:size-100 object-cover rounded-xl border border-white/20"></img>

      <div className="flex flex-col text-white">
        
        <p className="text-4xl sm:text-6xl lg:text-7xl border-l-5 border-green-400 px-2">{gameName}</p>
        <p className="text-xl sm:text-2xl px-4 text-white/40">{gameType}</p>
        <p className="text-lg sm:text-2xl max-w-5xl mt-5 sm:mt-8 p-4 text-white/60 border border-white/20 rounded-xl">{description}</p>

        <div className="flex flex-wrap gap-3 sm:gap-10 text-white text-lg sm:text-2xl py-4 mt-auto">
          
          <button 
          className="flex items-center gap-2 border border-red-500 bg-red-500/20 px-3 sm:px-4 py-2 rounded-md cursor-pointer"
          onClick={() => user ? toggleWishlist(id) : navigate('/login')}>
            <Heart className={wishlistId.has(id) ? "fill-red-500 text-red-500" : "text-white"}/>
            {wishlistId.has(id) ? "Wishlisted" : "Wishlist"}
          </button>

          {/* <button 
          className=" flex items-center gap-2 border border-yellow-500 bg-yellow-500/20 px-4 py-2 rounded-md cursor-pointer">
            <MessageSquareCode />
            Review
          </button> */}

          <button
          className="border border-green-400 bg-green-400/20 px-4 py-2 ml-auto rounded-md cursor-pointer"
          onClick={() => focus()}>
            Play
          </button>

        
        </div>

      </div>

    </div>
  )
}