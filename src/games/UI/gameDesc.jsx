import {Heart, MessageSquareCode} from 'lucide-react'

const images = import.meta.glob("../../assets/*.png", { eager: true, import: "default" })

export default function GameDesc({gameName, gameType, description}){

  function getImage(game){
    const filename = `../../assets/${game.replaceAll(" ", "-")}.png`
    return images[filename] 
  }
  
  return (
    <div className="flex justify-center m-15 p-15 gap-10">

      <img src={getImage(gameName)} className="size-100 rounded-xl border border-white/20"></img>

      <div className="flex flex-col text-white">
        
        <p className="text-7xl border-l-5 border-green-400  px-2">{gameName}</p>
        <p className="text-2xl px-4 text-white/40">{gameType}</p>
        <p className="text-2xl max-w-5xl mt-8 p-4 text-white/60 border border-white/20 rounded-xl">{description}</p>

        <div className="flex gap-10 text-white text-2xl py-4 mt-auto">
          
          <button 
          className=" flex items-center gap-2 border border-red-500 bg-red-500/20 px-4 py-2 rounded-md cursor-pointer">
            <Heart />
            Wishlist
          </button>

          <button 
          className=" flex items-center gap-2 border border-yellow-500 bg-yellow-500/20 px-4 py-2 rounded-md cursor-pointer">
            <MessageSquareCode />
            Review
          </button>

        
        </div>

      </div>

    </div>
  )
}