import { useEffect, useState } from "react"

import {TrendingUp} from "lucide-react"

function Discover(){

  const [trendingGames, setTrendingGames] = useState([])

  useEffect(() => {
      async function getTrendingGames(){

      const res = await fetch("/api/discover/trending", {
        method : 'GET',
        credentials : 'include',
      })

      if(!res.ok) {
        console.log(res.status)
        return 
      }

      const trendingGames = await res.json()
      setTrendingGames(trendingGames.games)
    }

    getTrendingGames()
  }, [])

  async function getTrendingGames(){

    const res = await fetch("/api/discover/trending", {
      method : 'GET',
      credentials : 'include',
    })

    if(!res.ok) {
      console.log(res.status)
      return 
    }

    const trendingGames = await res.json()
    return trendingGames
  }



  return (
    <div className=" border-white text-white p-4">

      <p className="flex items-center gap-2 text-5xl mb-10 border-b border-white pb-4"><TrendingUp className="size-12 text-red-500" />Trending Games</p>
      
      <div className="grid grid-cols-5 gap-5">

        {
          trendingGames.map((games) => {
            return (
              <div className="flex flex-col bg-black border border-white/40 p-4 items-center rounded-xl hover:scale-105 ease-in-out duration-300">
                <img src={games.coverUrl} className="rounded-md border border-white" />
                <p className="text-xl py-2">{games.name}</p>
                <p className="text-md">rating : {games.rating}</p>
              </div>
              
            )
          })
        }

      </div>

    </div>
  )
}

export default Discover