import {useNavigate} from "react-router-dom"
import {useState, useEffect} from 'react'

import {useAuth} from '../contexts/authContext.jsx'
import {useWishlist} from '../contexts/wishlistContext.jsx'

import {Zap, Code2, Gamepad2, Heart} from 'lucide-react'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const images = import.meta.glob("../assets/*.png", { eager: true, import: "default" })

function Body() {
  const navigate = useNavigate();

  const {user} = useAuth()
  const {wishlistId, toggleWishlist} = useWishlist()

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGames(){
      
      try{
        const res = await fetch('/api/games/fetch-games', {
          method : 'GET',
          credentials : 'include'
        })

        if(res.ok){
          const data = await res.json()
          setGames(data.games)
        }
        else{
          console.log('failed to fetch')
        }

      }
      catch(error){
        console.error(error)
      }
      finally{
        setLoading(false)
      }
    }
    
    fetchGames()
  }, [])

  async function handleWishlisttoggle(gameId){
    if(!user){
      navigate("/login")
      return
    }

    await toggleWishlist(gameId)
  } 
 

  function getImage(game){
    const filename = `../assets/${game.replaceAll(" ", "-")}.png`
    return images[filename] 
  }

  const feature = [
    {
      icon : Zap,
      title : "Zero Installation",
      body : "Every game runs straight in the browser tab you are already in."
    },
    {
      icon : Code2,
      title : "Open for contributions",
      body : "Intrested to build with us - then FORK it, send a PULL REQUEST - the code's public"
    }
  ]

  return (
    <div className="flex flex-col" style={TILE_BG}>

      <div className="relative text-white m-4 sm:m-8 lg:m-15 p-5 sm:p-10 lg:p-20 border border-white/40 rounded-xl flex bg-black" style={TILE_BG}>
        
        <a href="#games" className="absolute top-5 right-4 sm:top-10 sm:right-8 text-xl sm:text-3xl bg-black border border-green-400 px-2 rounded-md text-red-500 self-center">Games</a>

        <div className="flex flex-col" >
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl flex flex-wrap gap-x-3">What is <span className="text-green-400">Play<span className="text-red-500">Verse</span></span>?</h1>
          <p className="text-lg sm:text-2xl mt-8 sm:mt-10 leading-relaxed" >PlayVerse is a digital playground where games are built in grid system. For now it contains few number of games. No installation required, no login required to play, No ads between games. Just hit PLAY and ENJOY.</p>

          {
            feature.map((f,i) => {
              return (
                <div className="border rounded-xl border-white/30 bg-black mt-6 sm:mt-10 py-6 sm:py-8 px-5" key={i}>
                  <f.icon className="text-green-500" />
                  <p className="text-2xl sm:text-3xl mt-4 ">{f.title}</p>
                  <p className="text-base sm:text-xl text-white/40">{f.body}</p>
                </div>
              )
            })
          }

        </div>
       
      </div>

      <div className="flex items-center gap-4 px-5 sm:px-10 py-4">
        <Gamepad2 className="text-red-500 size-10 sm:size-15" />
        <h1 id="games" className="text-white text-4xl sm:text-5xl">Games</h1>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 text-white m-3 sm:m-5">
        
        {
        games && 
        games.map((game, index) =>
        {
          return(
            <div key={index} className="group m-2 sm:m-4 mt-6 sm:mt-10 border border-white/30 rounded-xl bg-black min-w-0">
              <div className="relative">
                <img src={getImage(game.name)} className="rounded-t-xl group-hover:opacity-30" alt={game.name} />
                <button
                  aria-label={`${wishlistId.has(game.id) ? "Remove" : "Add"} ${game.name} ${"from wishlist"}`}
                  title={wishlistId.has(game.id) ? "Remove from wishlist" : "Add to wishlist"}
                  className="absolute top-2 right-2 cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={() => handleWishlisttoggle(game.id)}>
                  <Heart className={`size-10 ${wishlistId.has(game.id) ? "text-red-500 fill-red-500" : "text-white fill-white"}`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/30">

                <div className="flex flex-col items-left">
                  <p className="text-xl sm:text-2xl">{game.name}</p>
                  <p className="text-base sm:text-xl text-white/30">classic</p>
                </div>
                
                <button 
                className="px-2 text-xl bg-white/10 rounded-md border border-white/40 cursor-pointer m-2 "
                onClick={() => navigate(`/${game.name.toLowerCase().replaceAll(" ", "-")}`)}>
                  Play
                </button>

              </div>

            </div>
          );
        })
      }
      </div>
    </div>
  );
}

export default Body