import {createContext, useContext, useCallback, useMemo, useState, useEffect} from 'react'

import {useAuth} from './authContext.jsx'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }){

  const {user} = useAuth()
  const [wishlistId, setWishlistId] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const fetchWishlist = useCallback(async () => {
    if(!user) {
      setWishlistId(new Set())
      setLoading(false)
      return
    }

    try{
      const res = await fetch("/api/wishlist/fetch", {
        method : "GET",
        credentials : "include"
      })

      if(res.ok){
        const data = await res.json()
        setWishlistId(new Set(data.gameIds ))
      }
    }
    catch(error){
      console.error(error)

    }
    finally{
      setLoading(false)
    }   

  }, [user])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  async function toggleWishlist(gameId){
    if(!user) return false

    const wasWishlisted = wishlistId.has(gameId)

    setWishlistId((prev) => {
      const next = new Set(prev)
      wasWishlisted ? next.delete(gameId) : next.add(gameId)
      return next 
    })

    try {
      const res = await fetch("/api/wishlist/toggle", {
        method : "POST",
        credentials : "include",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({ gameId })
      })

      if(!res.ok){
        setWishlistId((prev) => {
          const next = new Set(prev)
          wasWishlisted ? next.add(gameId) : next.delete(gameId)
          return next 
        })
        return false
      }

      return true 
    }
    catch(error){
      console.error(error)
      setWishlistId((prev) => {
        const next = new Set(prev)
        wasWishlisted ? next.add(gameId) : next.delete(gameId)
        return next 
      })
      return false
    }
  }

  return (
    <WishlistContext.Provider value = {{ wishlistId, loading, toggleWishlist, refetch : fetchWishlist}}>
      {children}
    </WishlistContext.Provider>
  )
}


export function useWishlist(){
  return useContext(WishlistContext)
}