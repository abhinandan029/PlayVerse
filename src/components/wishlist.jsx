import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Gamepad2 } from 'lucide-react'

import { useWishlist } from '../contexts/wishlistContext.jsx'

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
  const [loadingGames, setLoadingGames] = useState(true)

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch('/api/games/fetch-games', {
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
  }, [])

  const loading = wishlistLoading || loadingGames
  const wishlistedGames = allGames.filter(game => wishlistId.has(game.id))

  return (
    <div className="flex flex-col text-white" style={TILE_BG}>

      <div className="flex items-center gap-4 px-10 py-4 border-y border-white/30 bg-black">
        <Heart className="text-red-500 size-10 fill-red-500" />
        <h1 className="text-5xl">Your Wishlist</h1>
      </div>

      {loading ? (
        <p className="text-center mt-20 text-white/50 text-xl">Loading your wishlist...</p>
      ) : wishlistedGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
          <Gamepad2 className="size-16 text-white/30" />
          <p className="text-white/50 text-xl">Your wishlist is empty.</p>
          <button
            className="px-4 py-2 rounded-md border border-green-400/60 bg-green-400/20 cursor-pointer"
            onClick={() => navigate('/home')}>
            Browse Games
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2 m-5">
          {wishlistedGames.map((game) => (
            <div key={game.id} className="group m-4 mt-10 border border-white/30 rounded-xl bg-black">
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
                  className="px-2 text-xl bg-white/10 rounded-md border border-white/40 cursor-pointer m-2"
                  onClick={() => navigate(`/${game.name.toLowerCase().replaceAll(" ", "-")}`)}>
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Wishlist