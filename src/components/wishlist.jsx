import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Gamepad2 } from 'lucide-react'

import { useWishlist } from '../contexts/wishlistContext.jsx'
import { apiUrl } from '../utils/api.js'

const images = import.meta.glob("../assets/*.png", { eager: true, import: "default" })

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function getImage(game) {
  const filename = `../assets/${game.replaceAll(" ", "-")}.png`
  return images[filename]
}

function Wishlist() {
  const navigate = useNavigate()
  const { wishlistId, toggleWishlist, loading: wishlistLoading } = useWishlist()

  const [allGames, setAllGames] = useState([])
  const [discoverGames, setDiscoverGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(true)

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(apiUrl('/api/games/fetch-games'), {
          method: 'GET',
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          setAllGames(data.games)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingGames(false)
      }
    }
    fetchGames()

    async function fetchDiscoverGames() {
      try {
        const res = await fetch(apiUrl('/api/wishlist/discover-games'), { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setDiscoverGames(data.games)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchDiscoverGames()
  }, [])

  const loading = wishlistLoading || loadingGames
  const wishlistedGames = allGames.filter(game => wishlistId.has(game.id))

  return (
    <div className="pv-page flex flex-col" style={TILE_BG}>

      <div className="pv-section-heading mx-4 sm:mx-8 lg:mx-15">
        <Heart className="pv-section-heading-icon size-11 fill-red-500 sm:size-14" />
        <div>
          <h1 className="pv-section-heading-title">Your Wishlist</h1>
          <p className="pv-section-heading-copy">Keep track of the games you want to play.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-20 text-white/50 text-xl">Loading your wishlist...</p>
      ) : wishlistedGames.length === 0 && discoverGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center m-20 gap-4">
          <Gamepad2 className="size-16 text-white/30" />
          <p className="text-white/50 text-xl">Your wishlist is empty.</p>
          <button
            className="pv-button pv-button-accent"
            onClick={() => navigate('/home')}>
            Browse Games
          </button>
        </div>
      ) : (
        <>
        {discoverGames.length > 0 && (
          <section className="mx-4 mt-8 sm:mx-8 lg:mx-15">
            <div className="pv-section-heading mb-4">
              <Gamepad2 className="pv-section-heading-icon size-9" />
              <div>
                <h2 className="text-2xl font-bold text-white">Discover Wishlist</h2>
                <p className="text-sm text-white/50">Games saved from Discover.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {discoverGames.map((game) => (
                <article className="pv-card pv-card-hover group relative overflow-hidden" key={game.igdbId}>
                  <button className="absolute z-10 m-3 rounded-full bg-black/70 p-2 text-red-500" onClick={() => toggleWishlist(game.igdbId, "igdb")} type="button" aria-label={`Remove ${game.name} from wishlist`}>
                    <Heart className="size-5 fill-current" />
                  </button>
                  <img className="aspect-[4/3] w-full bg-[#090909] object-contain p-2" src={game.coverUrl} alt={`${game.name} cover`} />
                  <div className="border-t border-white/15 p-4">
                    <h3 className="line-clamp-2 text-lg font-bold text-white">{game.name}</h3>
                    <button className="pv-button mt-4 w-full text-sm" onClick={() => navigate(`/discover/${game.igdbId}`)} type="button">View details</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {wishlistedGames.length > 0 && (
          <section className="mx-4 mt-10 sm:mx-8 lg:mx-15">
          <div className="pv-section-heading mb-4">
            <Heart className="pv-section-heading-icon size-9 fill-red-500" />
            <div><h2 className="text-2xl font-bold text-white">Classic Games</h2></div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 mx-3 sm:mx-10 lg:mx-20 my-5">
          {wishlistedGames.map((game) => (
            <div key={game.id} className="pv-card pv-card-hover group m-2 mt-6 min-w-0 overflow-hidden sm:m-4 sm:mt-10">
              <div className="relative">
                <img src={getImage(game.name)} className="rounded-t-xl group-hover:opacity-40" alt={game.name} />
                <button
                  className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100"
                  onClick={() => toggleWishlist(game.id)}>
                  <Heart className="size-10 text-red-500 fill-red-500" />
                </button>
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-t border-white/30">
                <div className="flex flex-col items-left">
                  <p className="text-2xl">{game.name}</p>
                  <p className="text-xl text-white/30">classic</p>
                </div>

                <button
                  className="pv-button m-2 px-3 text-base"
                  onClick={() => navigate(`/${game.name.toLowerCase().replaceAll(" ", "-")}`)}>
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
          </section>
        )}
        </>
      )}

    </div>
  )
}

export default Wishlist