import {useContext, createContext, useEffect, useState} from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function checkAuth(){

    try{
      const res = await fetch("/api/auth/verify", {
        method : "GET",
        credentials : "include"
      })

      if(res.ok){
        const data = await res.json()
        setUser(data.user)
      }
      else {
        setUser(null)
      }
      
    }
    catch(error){
      console.error(error)
      setUser(null)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => { checkAuth() }, [])

  async function logout(){
    
    try{
       await fetch('/api/auth/logout', {
        method : "POST",
        credentials : "include"
      })
    }
   catch(error){
    console.error(error)
   }
   finally{
    setUser(null)
   }

  }

  return (
    <AuthContext.Provider  value={{ user, setUser, loading, logout, refetch : checkAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}