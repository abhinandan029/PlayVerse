import { useState, useEffect } from 'react'
import { Activity, Trophy, Sparkles, Heart, Users, Star } from 'lucide-react'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const FEED_META = {
  new_game_played: { icon: Sparkles, label: (r) => `Played a new game`, color: "text-green-400" },
  high_score:       { icon: Trophy,   label: (r) => `Set a new high score`, color: "text-yellow-400" },
  new_friend:       { icon: Users,    label: (r) => `Became friends with someone`, color: "text-blue-400" },
  review:           { icon: Star,     label: (r) => `Left a review`, color: "text-red-400" },
  wishlist_add:      { icon: Heart,    label: (r) => `Added a game to their wishlist`, color: "text-red-500" },
}

function timeAgo(dateStr) {
  const date = new Date(dateStr)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function ActivityPage() {
  const [activityData, setActivityData] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [activityRes, feedRes] = await Promise.all([
          fetch('/api/activity/mine', { credentials: 'include' }),
          fetch('/api/activity/feed', { credentials: 'include' })
        ])

        if (activityRes.ok) {
          const data = await activityRes.json()
          setActivityData(data.activity)
        }
        if (feedRes.ok) {
          const data = await feedRes.json()
          setFeed(data.feed)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // same 53-week grid logic as ProfilePage
  const activityByDate = new Map(activityData.map(a => [a.activity_date, a.count]))
  const today = new Date()
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
  const totalActivities = activityData.reduce((sum, a) => sum + a.count, 0)

  const game = {1 : "floating block", 2 : "pac-man", 3 : "snake game"}

  return (
    <div className="flex flex-col gap-8 mx-auto p-6 md:p-10 text-white" style={TILE_BG}>

      <div className="flex m-auto items-center gap-3">
        <Activity className="text-green-400 size-8" />
        <h1 className="text-4xl font-bold">Your Activity</h1>
      </div>

      {/* Heatmap */}
      <div className="w-full max-w-6xl m-auto border border-white/20 rounded-xl bg-black p-4 sm:p-6">
        {loading ? (
          <p className="text-white/50 text-center py-10">Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex flex-col gap-1 min-w-max">
                <div className="flex gap-1 ml-8 relative h-4">
                  {monthLabels.map((m, i) => (
                    <span key={i} className="absolute text-xs text-white/40" style={{ left: `${m.weekIndex * 16}px` }}>
                      {m.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1">
                  <div className="flex flex-col gap-1 mr-2">
                    {dayLabels.map((label, i) => (
                      <span key={i} className="text-xs text-white/40 h-3.5 leading-3.5">{label}</span>
                    ))}
                  </div>

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

            <p className="text-white/30 text-sm mt-3">{totalActivities} activities in the last year</p>
          </>
        )}
      </div>

      {/* Recent activity feed */}
      <div className="w-full max-w-4xl m-auto border border-white/20 rounded-xl bg-black p-4 sm:p-6">
        <h2 className="text-2xl font-bold mb-5">Recent Activity</h2>

        {loading ? (
          <p className="text-white/50 text-center py-10">Loading...</p>
        ) : feed.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14">
            <Activity className="size-12 text-white/30" />
            <p className="text-white/50">No activity yet. Play a game to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-white/10">
            {feed.map((item, i) => {
              const meta = FEED_META[item.activity_type]
              if (!meta) return null
              const Icon = meta.icon

              return (
                <div key={i} className="flex items-start gap-3 sm:gap-4 py-3">
                  <Icon className={`size-5 shrink-0 ${meta.color}`} />
                  <p className="flex-1">{meta.label(item)}</p>
                  <span className="text-sm text-white/30 shrink-0">{timeAgo(item.created_at)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}