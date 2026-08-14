import {Trophy} from 'lucide-react'

export default function LeaderBoard() {

  const players = [
    {
      player : "player 1", score : "100" 
    },
    {
      player : "player 2", score : "100" 
    },
    {
      player : "player 3", score : "100" 
    },
    {
      player : "player 4", score : "100" 
    },
    {
      player : "player 5", score : "100" 
    },
  ]

  return (
    <div className="flex flex-col p-5 text-white items-center">
      <h1 className="flex gap-2 items-center text-6xl"><Trophy className="text-red-500 size-15"/>Leadboard</h1>
      
      <div className="border border-white/50 divide-y divide-white/40 my-5 rounded-xl overflow-hidden">
        {
        players.map((p, i) => {
          return (
            <div key={i} className="flex justify-between min-w-2xl px-10 py-2 text-2xl bg-black">
              <p>{p.player}</p>
              <p className="text-green-400">{p.score}</p>
            </div>
            )
          })
        }
      </div>
    </div>
  )
}