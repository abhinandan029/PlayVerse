import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {CalendarDays, ChevronLeft, ChevronRight, Flame, Gamepad2, RotateCcw, Search, SlidersHorizontal, Sparkles, Star, Tags, X} from "lucide-react"

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.16) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
}
const TRENDING_PAGE_SIZE = 25
const PRIMARY_FILTERS = ["mostPlayed", "trending"]
const GAME_FILTERS = {
  mostPlayed: {
    label: "Most Played",
    description: "The games people are playing most on Steam right now.",
    icon: Gamepad2,
  },
  trending: {
    label: "Trending",
    description: "Highly rated Steam games worth checking out.",
    icon: Flame,
  },
  newReleases: {
    label: "New Releases",
    description: "Recently released Steam games to explore.",
    icon: Sparkles,
  },
  topRated: {
    label: "Top Rated",
    description: "The highest-rated Steam games in the collection.",
    icon: Star,
  },
}

function Discover(){

  const navigate = useNavigate()
  const [mostPlayedGames, setMostPlayedGames] = useState([])
  const [trendingGames, setTrendingGames] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [topRatedGames, setTopRatedGames] = useState([])
  const [exploreGames, setExploreGames] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(true)
  const [filterErrors, setFilterErrors] = useState({})
  const [trendingPage, setTrendingPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState("mostPlayed")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [genreFilter, setGenreFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  useEffect(() => {
      async function getMostPlayedGames(){

      const res = await fetch("/api/discover/most-played", {
        method : 'GET',
        credentials : 'include',
      })

      if(!res.ok) {
        console.log(res.status)
        setIsLoading(false)
        return 
      }

      const mostPlayedGames = await res.json()
      setMostPlayedGames(mostPlayedGames.games)
      setIsLoading(false)
    }

    getMostPlayedGames().catch((error) => {
      console.error(error)
      setIsLoading(false)
    })

  }, [])

  async function loadFilter(filter){
    const filterEndpoints = {
      trending: ["trending", setTrendingGames],
      newReleases: ["new-releases", setNewReleases],
      topRated: ["top-rated", setTopRatedGames],
    }
    const filterRequest = filterEndpoints[filter]
    if(!filterRequest) return

    const [endpoint, setGames] = filterRequest
    setIsDiscoverLoading(true)
    setFilterErrors((errors) => ({ ...errors, [filter]: "" }))

    try {
      const res = await fetch(`/api/discover/${endpoint}`, { credentials : 'include' })
      if(!res.ok) throw new Error(`Unable to fetch ${endpoint} games`)
      const data = await res.json()
      setGames(Array.isArray(data.games) ? data.games : [])
    } catch(error) {
      console.error(`Failed to load ${endpoint} games`, error)
      setGames([])
      setFilterErrors((errors) => ({
        ...errors,
        [filter]: "Could not load games right now. Please try again.",
      }))
    } finally {
      setIsDiscoverLoading(false)
    }
  }

  async function handleSearch(event){
    event.preventDefault()
    const query = searchQuery.trim()
    if(!query) return

    setIsSearching(true)
    setSearchError("")

    try{
      const res = await fetch(`/api/discover/search?q=${encodeURIComponent(query)}`, {
        credentials : 'include',
      })

      if(!res.ok) throw new Error("Unable to search games")

      const data = await res.json()
      setExploreGames(data.games)
    }
    catch(error){
      console.error(error)
      setSearchError("Could not load games. Please try again.")
      setExploreGames([])
    }
    finally{
      setIsSearching(false)
    }
  }

  function clearSearch(){
    setSearchQuery("")
    setExploreGames([])
    setSearchError("")
    setIsSearching(false)
  }

  const gamesByFilter = {
    mostPlayed: mostPlayedGames,
    trending: trendingGames,
    newReleases,
    topRated: topRatedGames,
  }
  const activeGames = gamesByFilter[activeFilter] || []
  const activeLoading = activeFilter === "mostPlayed" ? isLoading : isDiscoverLoading
  const availableGenres = [...new Set(activeGames.flatMap((game) => game.genres || []))].sort()
  const filteredGames = [...activeGames]
    .filter((game) => genreFilter === "all" || game.genres?.includes(genreFilter))
    .filter((game) => ratingFilter === "all" || (game.rating || 0) >= Number(ratingFilter))
  const pageCount = Math.ceil(filteredGames.length / TRENDING_PAGE_SIZE)
  const visibleGames = filteredGames.slice(
    (trendingPage - 1) * TRENDING_PAGE_SIZE,
    trendingPage * TRENDING_PAGE_SIZE
  )
  const activeFilterDetails = GAME_FILTERS[activeFilter]
  const ActiveIcon = activeFilterDetails.icon

  function selectFilter(filter){
    setActiveFilter(filter)
    resetFilters()
    setTrendingPage(1)
    if(filter !== "mostPlayed") {
      const games = gamesByFilter[filter] || []
      if(games.length === 0) loadFilter(filter)
    }
  }

  function resetFilters(){
    setGenreFilter("all")
    setRatingFilter("all")
    setTrendingPage(1)
  }

  function openGameDetails(gameId){
    navigate(`/discover/${gameId}`)
  }

  const activeFilterCount = [genreFilter !== "all", ratingFilter !== "all"]
    .filter(Boolean).length



  return (
    <div className="pv-page relative overflow-hidden border-white p-4" style={TILE_BG}>
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

      <section className="relative z-10 mx-auto mb-16 w-full max-w-380">
        <div className="pv-section-heading">
          <Search className="pv-section-heading-icon size-11 sm:size-14" />
          <div>
            <h1 className="pv-section-heading-title">Explore Games</h1>
            <p className="pv-section-heading-copy">Search for more Steam games to discover.</p>
          </div>
        </div>

        <form className="mt-6 flex w-full max-w-3xl gap-2" onSubmit={handleSearch}>
          <div className="relative flex-1">
            <input
              className="pv-input h-12 w-full px-4 pr-12 text-base"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search games..."
              aria-label="Search Steam games"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                type="button"
                onClick={clearSearch}
                aria-label="Clear game search"
                title="Clear search"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
          <button className="pv-button pv-button-accent h-12 gap-2 px-4 font-bold" type="submit" disabled={isSearching}>
            <Search className="size-4" />
            <span className="hidden sm:inline">{isSearching ? "Searching..." : "Search"}</span>
          </button>
        </form>

        {searchError && <p className="mt-4 text-center text-sm text-red-400">{searchError}</p>}

        {isSearching ? (
          <p className="py-10 text-center text-white/50">Searching Steam games...</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exploreGames.map((game) => (
              <article
                className="pv-card pv-card-hover group cursor-pointer overflow-hidden"
                key={game.igdbId}
                onClick={() => openGameDetails(game.igdbId)}
                onKeyDown={(event) => {
                  if(event.key === "Enter" || event.key === " ") openGameDetails(game.igdbId)
                }}
                role="link"
                tabIndex={0}
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#090909]">
                  <img
                    className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
                    src={game.coverUrl}
                    alt={`${game.name} cover`}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/90 to-transparent" />
                </div>
                <div className="flex min-h-56 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 text-lg font-bold leading-tight text-white">{game.name}</h2>
                    {game.rating && (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-300">
                        <Star className="size-3.5 fill-current" />
                        {(game.rating / 10).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/65">
                    {game.summary || "No summary is available for this game yet."}
                  </p>
                  <div className="mt-auto pt-4">
                    {game.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {game.genres.slice(0, 3).map((genre) => (
                        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/70" key={genre}>
                          {genre}
                        </span>
                      ))}
                    </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isSearching && searchQuery && exploreGames.length === 0 && !searchError && (
          <p className="py-10 text-center text-white/50">No Steam games found for “{searchQuery}”.</p>
        )}
      </section>

      <section className="relative z-10 mx-auto w-full max-w-380">
        <div className="pv-section-heading mb-6">
          <ActiveIcon className="pv-section-heading-icon size-11 sm:size-14" />
          <div className="min-w-0 flex-1">
            <h1 className="pv-section-heading-title">{activeFilterDetails.label} Games</h1>
            <p className="pv-section-heading-copy">{activeFilterDetails.description}</p>
          </div>
          <button
            className={`pv-button shrink-0 gap-2 px-3 ${showFilters ? "border-red-400/70 bg-red-500/15" : ""}`}
            onClick={() => setShowFilters((isVisible) => !isVisible)}
            type="button"
            aria-expanded={showFilters}
            aria-label="Toggle game filters"
          >
            <SlidersHorizontal className="size-5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-red-400 text-[11px] font-bold text-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="mb-4 flex w-full max-w-xl rounded-xl border border-white/15 bg-black/60 p-1">
          {PRIMARY_FILTERS.map((filter) => {
            const details = GAME_FILTERS[filter]
            return (
            <button
              className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${activeFilter === filter ? "bg-red-500/15 text-white ring-1 ring-red-500/50" : "text-white/50 hover:bg-white/10 hover:text-white"}`}
              key={filter}
              onClick={() => selectFilter(filter)}
              type="button"
            >
              {details.label}
            </button>
            )
          })}
        </div>

        {showFilters && (
          <div className="mb-8 max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/70 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-base font-bold text-white">Refine your discovery</p>
                <p className="mt-1 text-sm text-white/45">Choose a genre or rating without changing the card layout.</p>
              </div>
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white" onClick={resetFilters} type="button">
                <RotateCcw className="size-3.5" />
                Clear filters
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/55">
                  <Gamepad2 className="size-4 text-red-300" />
                  More lists
                </div>
                <div className="flex flex-wrap gap-2">
                  {["newReleases", "topRated"].map((filter) => (
                    <button
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-base font-semibold transition ${activeFilter === filter ? "border-red-400/70 bg-red-500/15 text-white" : "border-white/10 bg-black/30 text-white/60 hover:border-white/25 hover:bg-white/10 hover:text-white"}`}
                      key={filter}
                      onClick={() => selectFilter(filter)}
                      type="button"
                    >
                      {filter === "newReleases" ? <Sparkles className="size-4 text-green-300" /> : <Star className="size-4 text-amber-300" />}
                      {GAME_FILTERS[filter].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/55">
                  <Tags className="size-4 text-green-300" />
                  Genre
                </div>
                <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">
                  <button
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${genreFilter === "all" ? "border-green-300/70 bg-green-400/15 text-green-100" : "border-white/10 bg-black/30 text-white/55 hover:bg-white/10 hover:text-white"}`}
                    onClick={() => { setGenreFilter("all"); setTrendingPage(1) }}
                    type="button"
                  >
                    All genres
                  </button>
                  {availableGenres.map((genre) => (
                    <button
                      className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${genreFilter === genre ? "border-green-300/70 bg-green-400/15 text-green-100" : "border-white/10 bg-black/30 text-white/55 hover:bg-white/10 hover:text-white"}`}
                      key={genre}
                      onClick={() => { setGenreFilter(genre); setTrendingPage(1) }}
                      type="button"
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/3 p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/55">
                  <Star className="size-4 text-amber-300" />
                  Minimum rating
                </div>
                <div className="flex flex-wrap gap-2">
                  {[["all", "Any rating"], ["70", "7.0+"], ["80", "8.0+"], ["90", "9.0+"]].map(([value, label]) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${ratingFilter === value ? "border-amber-300/70 bg-amber-300/15 text-amber-100" : "border-white/10 bg-black/30 text-white/55 hover:bg-white/10 hover:text-white"}`}
                      key={value}
                      onClick={() => { setRatingFilter(value); setTrendingPage(1) }}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {filterErrors[activeFilter] && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <span>{filterErrors[activeFilter]}</span>
            <button
              className="font-semibold text-white underline underline-offset-4"
              onClick={() => loadFilter(activeFilter)}
              type="button"
            >
              Retry
            </button>
          </div>
        )}

        {activeLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 25 }).map((_, index) => (
            <div
              className="animate-pulse overflow-hidden rounded-2xl border border-white/15 bg-white/8"
              key={index}
            >
              <div className="aspect-4/3 w-full bg-white/15" />
              <div className="flex flex-col gap-4 p-5">
                <div className="h-6 w-2/3 rounded bg-white/15" />
                <div className="h-4 w-full rounded bg-white/15" />
                <div className="h-4 w-3/4 rounded bg-white/15" />
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {visibleGames.map((game, index) => {
              const rank = (trendingPage - 1) * TRENDING_PAGE_SIZE + index + 1
              const rankStyle = rank === 1
                ? "border-amber-300/80 bg-amber-300/20 text-amber-200 shadow-[0_0_16px_rgba(252,211,77,0.3)]"
                : rank === 2
                  ? "border-slate-300/70 bg-slate-300/20 text-slate-100 shadow-[0_0_14px_rgba(203,213,225,0.25)]"
                  : rank === 3
                    ? "border-orange-400/70 bg-orange-400/20 text-orange-200 shadow-[0_0_14px_rgba(251,146,60,0.25)]"
                    : "border-white/20 bg-black/75 text-white"

              return (
              <article
                className="pv-card pv-card-hover group cursor-pointer overflow-hidden"
                key={game.igdbId}
                onClick={() => openGameDetails(game.igdbId)}
                onKeyDown={(event) => {
                  if(event.key === "Enter" || event.key === " ") openGameDetails(game.igdbId)
                }}
                role="link"
                tabIndex={0}
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-[#090909]">
                  <img
                    src={game.coverUrl}
                    alt={`${game.name} cover`}
                    className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/95 via-black/30 to-transparent" />
                  <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs font-bold backdrop-blur-sm ${rankStyle}`}>
                    #{rank}
                  </span>
                </div>
                <div className="flex min-h-60 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 text-lg font-bold leading-tight text-white">{game.name}</h2>
                    {game.rating && (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-300">
                        <Star className="size-3.5 fill-current" />
                        {(game.rating / 10).toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/65">
                    {game.summary || "No summary is available for this game yet."}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-white/55">
                    {game.releaseDate && <><CalendarDays className="size-3.5" />{game.releaseDate}</>}
                  </div>
                  {game.genres?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {game.genres.slice(0, 3).map((genre) => (
                        <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/70" key={genre}>
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
              )
            })}
          </div>
        )}

        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              className="pv-button px-3"
              onClick={() => setTrendingPage((page) => Math.max(1, page - 1))}
              disabled={trendingPage === 1}
              aria-label="Previous games page"
            >
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-sm text-white/65">Page {trendingPage} of {pageCount}</span>
            <button
              className="pv-button px-3"
              onClick={() => setTrendingPage((page) => Math.min(pageCount, page + 1))}
              disabled={trendingPage === pageCount}
              aria-label="Next games page"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </section>

    </div>
  )
}

export default Discover