import {ArrowRightLeft, User, Users, Gamepad2, Heart, Activity, Settings, LogOut, MapPin, Trophy} from 'lucide-react'
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuth} from '../contexts/authContext.jsx'
import {useDialog} from '../contexts/dialogContext.jsx'
import {useWishlist} from "../contexts/wishlistContext.jsx"

const images = import.meta.glob("../assets/*.png", { eager: true, import: "default" })
const avatars = import.meta.glob("../assets/avatars/*.svg", { eager: true, import: "default" })

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function getImage(game) {
  const filename = `../assets/${game.replaceAll(" ", "-")}.png`
  return images[filename]
}

function getAvatar(avatarName) {
  const filename = `../assets/avatars/${avatarName}.svg`
  return avatars[filename]
}

// ---------------- ProfileMenu (unchanged behavior, minor polish) ----------------

export function ProfileMenu({ closeMenu }){
  const {user, logout} = useAuth()
  const {openDialog} = useDialog()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="flex flex-col fixed top-18 right-10 bg-black border border-white/60 rounded-xl z-100" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-4 p-5 items-center">
        <img
          src={getAvatar(user.avatar || 'fox')}
          className="size-10 rounded-full border border-green-400/40"
          alt="avatar"
        />
        <div className="flex flex-col">
          <p className="font-semibold">{user.username || user.email.split('@')[0]}</p>
          <p className="text-sm text-white/50">{user.email}</p>
        </div>
        <button className="ml-10 cursor-pointer"><ArrowRightLeft className="text-green-400 size-5"/></button>
      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1">
        <button className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
          onClick={() =>{navigate("/profile"); closeMenu()}}>
          <User className="size-6 text-green-400"/>Profile
        </button>
        <button className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
          onClick={() => {navigate("/friends"); closeMenu()}}>
          <Users className="size-6 text-green-400"/>Friends
        </button>
        <button className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
          onClick={() => {navigate("/wishlist"); closeMenu()}}>
          <Heart className="size-6 text-green-400"/>Wishlist
        </button>
      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1">
        <button className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
          onClick={() => {navigate("/activity"); closeMenu()}}>
          <Activity className="size-6 text-green-400"/>Activity
        </button>
        <button className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
          onClick={() => {navigate("/settings"); closeMenu()}}>
          <Settings className="size-6 text-green-400"/>Settings
        </button>
      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1">
        <button className="flex w-full gap-2 items-center hover:bg-red-500/20 rounded-md px-2 cursor-pointer"
          onClick={() => { openDialog("Confirm", "Do you want to Logout?", logout); closeMenu() }}>
          <LogOut className="text-red-500 size-6"/>Logout
        </button>
      </div>
    </div>
  )
}

// ---------------- ProfilePage (redesigned) ----------------

export function ProfilePage(){
  const {user} = useAuth()
  const [allGames, setAllGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(true)
  const [activityData, setActivityData] = useState([])
  const { wishlistId, toggleWishlist, loading: wishlistLoading } = useWishlist()

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch('/api/games/fetch-games', { method: 'GET', credentials: 'include' })
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

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch('/api/activity/mine', { method: 'GET', credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setActivityData(data.activity) // [{ activity_date, count }, ...]
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchActivity()
  }, [])

  if (!user) return null

  const loading = wishlistLoading || loadingGames
  const wishlistedGames = allGames.filter(game => wishlistId.has(game.id))

  
  // build a full year (53 weeks) of activity, GitHub-style, aligned to Sunday-start weeks
  const activityByDate = new Map(activityData.map(a => [a.activity_date, a.count]))
  const today = new Date()

  // find the most recent Saturday (end of current week) and go back 52 weeks + current
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()))

  const weeks = []
  for (let w = 52; w >= 0; w--) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(endOfWeek)
      date.setDate(endOfWeek.getDate() - (w * 7 + (6 - d)))
      const key = date.toISOString().slice(0, 10)
      week.push({ date: key, count: activityByDate.get(key) || 0, isFuture: date > today })
    }
    weeks.push(week)
  }

  // month labels — mark the week index where each new month starts
  const monthLabels = []
  let lastMonth = null
  weeks.forEach((week, wi) => {
    const firstDay = new Date(week[0].date)
    const month = firstDay.getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ weekIndex: wi, label: firstDay.toLocaleString('default', { month: 'short' }) })
      lastMonth = month
    }
  })

  function intensity(count, isFuture) {
    if (isFuture) return "bg-transparent"
    if (count === 0) return "bg-white/10"
    if (count === 1) return "bg-green-900"
    if (count <= 3) return "bg-green-700"
    if (count <= 6) return "bg-green-500"
    return "bg-green-400"
  }

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""]


  return (
    <div className="flex flex-col gap-8 items-center mx-auto p-6 md:p-10 text-white" style={TILE_BG}>

      {/* Identity card */}
      <div className="flex flex-col min-w-6xl md:flex-row gap-8 border border-white/20 rounded-xl bg-black p-8">

        <img
          src={getAvatar(user.avatar || 'fox')}
          className="size-32 md:size-40 rounded-full border-2 border-green-400/50 shrink-0"
          alt="avatar"
        />

        <div className="flex flex-col justify-center gap-2 flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">
            {user.username || user.email.split('@')[0]}
          </h1>
          <p className="text-white/40 text-lg">{user.email}</p>

          {user.bio && <p className="text-white/70 text-lg mt-2 max-w-xl">{user.bio}</p>}

          <div className="flex items-center gap-6 mt-4 text-white/50">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />{user.location}
              </span>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 md:flex-col md:justify-center shrink-0">
          <div className="flex flex-col items-center border border-white/20 rounded-lg px-6 py-3 min-w-24">
            <span className="text-2xl font-bold text-green-400">{wishlistedGames.length}</span>
            <span className="text-xs text-white/40 uppercase tracking-wide">Wishlisted</span>
          </div>
          <div className="flex flex-col items-center border border-white/20 rounded-lg px-6 py-3 min-w-24">
            <Trophy className="size-5 text-red-500 mb-1" />
            <span className="text-xs text-white/40 uppercase tracking-wide">Top Score</span>
          </div>
        </div>

      </div>

      {/* Activity graph — real data, full year GitHub-style */}
      <div className="min-w-6xl border border-white/20 rounded-xl bg-black p-6">
        <div className="flex items-center gap-3 mb-5">
          <Activity className="text-green-400 size-6" />
          <h2 className="text-2xl font-bold">Activity</h2>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-1 min-w-max">

            {/* month labels row */}
            <div className="flex gap-1 ml-8 relative h-4">
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-xs text-white/40"
                  style={{ left: `${m.weekIndex * 18}px` }}>
                  {m.label}
                </span>
              ))}
            </div>

            <div className="flex gap-1">
              {/* day-of-week labels column */}
              <div className="flex flex-col gap-1 mr-2">
                {dayLabels.map((label, i) => (
                  <span key={i} className="text-xs text-white/40 h-3.5 leading-3.5">{label}</span>
                ))}
              </div>

              {/* the actual grid */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={day.isFuture ? "" : `${day.date}: ${day.count} activities`}
                      className={`size-4 rounded-sm ${intensity(day.count, day.isFuture)}`}
                    />
                  ))}
                </div>
              ))}
            </div>

          </div>
        </div>

        <p className="text-white/30 text-sm mt-3">
          {activityData.reduce((sum, a) => sum + a.count, 0)} activities in the last year
        </p>
      </div>

      {/* Wishlist */}
      <div className="max-w-6xl border border-white/20 rounded-xl bg-black p-6">
        <div className="flex items-center gap-3 mb-5">
          <Heart className="text-red-500 size-6 fill-red-500" />
          <h2 className="text-2xl font-bold">Wishlist</h2>
        </div>

        {loading ? (
          <p className="text-white/50 text-lg py-10 text-center">Loading...</p>
        ) : wishlistedGames.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-14">
            <Gamepad2 className="size-14 text-white/30" />
            <p className="text-white/50">Nothing here yet. Add a few games you're eyeing.</p>
            <button
              className="px-4 py-2 rounded-md border border-green-400/60 bg-green-400/20 cursor-pointer"
              onClick={() => navigate('/home')}>
              Browse Games
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistedGames.map((game) => (
              <div key={game.id} className="group relative border border-white/20 rounded-xl bg-black overflow-hidden">
                <img src={getImage(game.name)} className="w-full aspect-video object-cover group-hover:opacity-40 transition-opacity" alt={game.name} />

                <button
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => toggleWishlist(game.id)}>
                  <Heart className="size-8 text-red-500 fill-red-500" />
                </button>

                <div className="flex items-center justify-between px-4 py-3 border-t border-white/20">
                  <div>
                    <p className="text-lg font-semibold">{game.name}</p>
                    <p className="text-sm text-white/30">classic</p>
                  </div>
                  <button
                    className="px-3 py-1 text-sm bg-white/10 rounded-md border border-white/40 cursor-pointer"
                    onClick={() => navigate(`/${game.name.toLowerCase().replaceAll(" ", "-")}`)}>
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}