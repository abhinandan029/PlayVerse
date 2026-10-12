import {useNavigate} from "react-router-dom"
import {useState, useEffect} from 'react'

import {useAuth} from '../contexts/authContext.jsx'
import {useWishlist} from '../contexts/wishlistContext.jsx'

import {Zap, Code2, Gamepad2, Heart} from 'lucide-react'
import { apiUrl } from '../utils/api.js'

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
        const res = await fetch(apiUrl('/api/games/fetch-games'), {
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
    <div className="pv-page flex flex-col" style={TILE_BG}>

      <div className="pv-card relative m-4 overflow-hidden p-5 text-white sm:m-8 sm:p-10 lg:m-15 lg:p-16" style={TILE_BG}>
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/40 bg-green-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
              <span className="size-2 animate-pulse rounded-full bg-green-400" />
              Play in your browser
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              What is{" "}
              <span className="text-green-400">Play<span className="text-red-500">Verse</span></span>?
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/65 sm:mt-8 sm:text-xl">
              PlayVerse is a digital playground where games are built in a grid system.
              No installation, no login, and no ads between games. Just hit play and enjoy.
            </p>

            <button
              className="pv-button pv-button-accent mt-7 text-base font-bold sm:mt-9"
              onClick={() => document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Games
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {feature.map((f) => {
              const Icon = f.icon
              return (
                <div className="pv-card border-white/20 bg-black/60 px-5 py-5" key={f.title}>
                  <Icon className="size-6 text-green-400" />
                  <p className="mt-4 text-xl font-bold sm:text-2xl">{f.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/50 sm:text-base">{f.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="pv-section-heading mx-4 sm:mx-8 lg:mx-15">
        <Gamepad2 className="pv-section-heading-icon size-11 sm:size-14" />
        <div>
          <h1 id="games" className="pv-section-heading-title text-white">Games</h1>
          <p className="pv-section-heading-copy">Pick a classic and start playing.</p>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 text-white m-3 sm:m-5">
        
        {
        games && 
        games.map((game, index) =>
        {
          return(
            <div key={index} className="pv-card pv-card-hover group m-2 mt-6 min-w-0 overflow-hidden sm:m-4 sm:mt-10">
              <div className="relative">
                <img
                  src={getImage(game.name)}
                  className="rounded-t-xl group-hover:opacity-30"
                  alt={game.name}
                  fetchPriority={index === 0 ? "high" : "low"}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
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
                className="pv-button m-2 px-3 text-base"
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