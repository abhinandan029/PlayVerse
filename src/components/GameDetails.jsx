import { useEffect, useState } from "react"
import { ArrowLeft, CalendarDays, Gamepad2, Heart, Star } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

import { useAuth } from "../contexts/authContext.jsx"
import { useWishlist } from "../contexts/wishlistContext.jsx"
import { apiUrl } from "../utils/api.js"

const TILE_BG = {
  backgroundImage: "radial-gradient(circle, hsla(0, 100%, 100%, 0.16) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
}

function GameDetails(){
  const { igdbId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { wishlistId, toggleWishlist } = useWishlist()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function fetchGame(){
      try {
        const response = await fetch(apiUrl(`/api/discover/${igdbId}`), { credentials: "include" })
        if(!response.ok) throw new Error("Unable to load game details")
        const data = await response.json()
        if(!cancelled) setGame(data.game)
      } catch(fetchError) {
        console.error(fetchError)
        if(!cancelled) setError("Could not load this game right now.")
      } finally {
        if(!cancelled) setLoading(false)
      }
    }

    fetchGame()
    return () => { cancelled = true }
  }, [igdbId])

  if(loading) {
    return <div className="pv-page flex items-center justify-center text-lg text-white/55">Loading game details...</div>
  }

  if(error || !game) {
    return (
      <div className="pv-page flex flex-col items-center justify-center gap-5 p-6 text-center">
        <Gamepad2 className="size-16 text-white/25" />
        <p className="text-lg text-white/60">{error || "Game not found."}</p>
        <button className="pv-button" onClick={() => navigate("/discover")} type="button">
          <ArrowLeft className="mr-2 size-4" />
          Back to Discover
        </button>
      </div>
    )
  }

  const wishlisted = wishlistId.has(game.igdbId)
  const handleWishlist = () => {
    if(!user) {
      navigate("/login")
      return
    }
    toggleWishlist(game.igdbId, "igdb")
  }

  return (
    <main className="pv-page relative overflow-hidden p-4 sm:p-8" style={TILE_BG}>
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-[96rem]">
        <button className="pv-button mb-8 gap-2" onClick={() => navigate(-1)} type="button">
          <ArrowLeft className="size-4" />
          Back
        </button>

        <section className="pv-card grid gap-8 overflow-hidden p-5 sm:p-8 lg:grid-cols-[minmax(18rem,28rem)_1fr]">
          <div className="flex items-start justify-center">
            <img
              className="aspect-[4/3] w-full rounded-2xl border border-white/15 bg-[#090909] object-contain p-3"
              src={game.coverUrl}
              alt={`${game.name} cover`}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-red-300">
                  <Gamepad2 className="size-4" />
                  Steam game
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">{game.name}</h1>
              </div>
              {game.rating && (
                <span className="flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-2 font-bold text-amber-200">
                  <Star className="size-5 fill-current" />
                  {(game.rating / 10).toFixed(1)}
                </span>
              )}
            </div>

            <p className="mt-6 max-w-4xl text-base leading-8 text-white/70 sm:text-lg">
              {game.summary || "No summary is available for this game yet."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/65">
              {game.releaseDate && (
                <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <CalendarDays className="size-4" />
                  {game.releaseDate}
                </span>
              )}
              {game.platforms?.slice(0, 4).map((platform) => (
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2" key={platform}>{platform}</span>
              ))}
            </div>

            {game.genres?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span className="rounded-full border border-green-300/25 bg-green-400/10 px-3 py-1.5 text-sm text-green-100" key={genre}>{genre}</span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button className={`pv-button gap-2 ${wishlisted ? "border-red-400/70 bg-red-500/20" : "pv-button-accent"}`} onClick={handleWishlist} type="button">
                <Heart className={`size-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {wishlisted ? "Wishlisted" : "Add to wishlist"}
              </button>
              {game.playLink?.url && (
                <a className="pv-button pv-button-accent" href={game.playLink.url} rel="noreferrer" target="_blank">
                  Open on Steam
                </a>
              )}
            </div>
          </div>
        </section>

        {game.screenshots?.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-2xl font-bold text-white">Screenshots</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {game.screenshots.slice(0, 6).map((screenshot) => (
                <img className="aspect-video w-full rounded-xl border border-white/10 object-cover" key={screenshot} src={screenshot} alt={`${game.name} screenshot`} loading="lazy" />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default GameDetails
