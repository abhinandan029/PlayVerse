import { useState, useEffect } from 'react'
import { Trophy, Medal } from 'lucide-react'

import { useAuth } from '../../contexts/authContext.jsx'

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
        const res = await fetch(`/api/score/leader-board/${gameId}`, {
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
    <div className="flex flex-col p-5 text-white items-center">
      <h1 className="flex gap-2 items-center text-6xl">
        <Trophy className="text-red-500 size-15" />
        Leaderboard
      </h1>

      <div className="border border-white/50 divide-y divide-white/40 my-5 rounded-xl overflow-hidden min-w-2xl">
        {loading ? (
          <p className="px-10 py-6 text-xl text-white/50 bg-black text-center">Loading...</p>
        ) : scores.length === 0 ? (
          <p className="px-10 py-6 text-xl text-white/50 bg-black text-center">
            No scores yet. Be the first to play!
          </p>
        ) : (
          scores.map((s, i) => (
            <div key={i} className="flex items-center justify-between px-10 py-2 text-2xl bg-black">
              <div className="flex items-center gap-3">
                {i === 0 && <Medal className="text-yellow-400 size-8" />}
                {i === 1 && <Medal className="text-white/60 size-8" />}
                {i === 2 && <Medal className="text-orange-700 size-8" />}
                {i > 2 && <span className="text-white/50 size-8 text-center">{i + 1}</span>}

                {s.avatar && (
                  <img src={getAvatar(s.avatar)} className="size-15 rounded-full" alt={s.username} />
                )}
                <p>{s.username || "Anonymous"}</p>
              </div>
              <p className="text-green-400">{s.score}</p>
            </div>
          ))
        )}
      </div>

      { !user && <p className="text-red-500 ">Login to enter the leader board</p> }
    </div>
  )
}