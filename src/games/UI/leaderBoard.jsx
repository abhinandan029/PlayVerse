import { useState, useEffect } from 'react'
import { Trophy, Medal } from 'lucide-react'

import { useAuth } from '../../contexts/authContext.jsx'
import { apiUrl } from '../../utils/api.js'

const avatars = import.meta.glob("../../assets/avatars/*.svg", { eager: true, import: "default" })

function getAvatar(name) {
  return avatars[`../../assets/avatars/${name}.svg`]
}

export default function LeaderBoard({ gameId }) {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    if (!gameId) return

    async function fetchLeaderboard() {
      try {
        const res = await fetch(apiUrl(`/api/score/leader-board/${gameId}`), {
          method: 'GET',
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          setScores(data.scores)
        } else {
          console.error('Failed to fetch leaderboard')
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [gameId])

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto p-4 sm:p-5 text-white items-center">
      <h1 className="flex gap-2 items-center text-4xl sm:text-6xl text-center">
        <Trophy className="text-red-500 size-10 sm:size-15" />
        Leaderboard
      </h1>

      <div className="w-full border border-white/50 divide-y divide-white/40 my-5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="px-4 sm:px-10 py-6 text-lg sm:text-xl text-white/50 bg-black text-center">Loading...</p>
        ) : scores.length === 0 ? (
          <p className="px-4 sm:px-10 py-6 text-lg sm:text-xl text-white/50 bg-black text-center">
            No scores yet. Be the first to play!
          </p>
        ) : (
          scores.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-4 sm:px-10 py-3 text-lg sm:text-2xl bg-black">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                {i === 0 && <Medal className="text-yellow-400 size-6 sm:size-8 shrink-0" />}
                {i === 1 && <Medal className="text-white/60 size-6 sm:size-8 shrink-0" />}
                {i === 2 && <Medal className="text-orange-700 size-6 sm:size-8 shrink-0" />}
                {i > 2 && <span className="text-white/50 w-6 sm:w-8 text-center shrink-0">{i + 1}</span>}

                {s.avatar && (
                  <img src={getAvatar(s.avatar)} className="size-10 sm:size-15 rounded-full shrink-0" alt={s.username} />
                )}
                <p className="truncate">{s.username || "Anonymous"}</p>
              </div>
              <p className="text-green-400 shrink-0">{s.score}</p>
            </div>
          ))
        )}
      </div>

      { !user && <p className="text-red-500 ">Login to enter the leader board</p> }
    </div>
  )
}