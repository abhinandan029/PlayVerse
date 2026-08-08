import { createContext, useContext, useState, useEffect} from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://api/localhost:5173/me', {credentials : 'include'})
    .then(res => res.ok ? res.json() : null)
    .then(setUser)
    .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.provider value={{ user, setUser, loading}} >
      { children }
    </AuthContext.provider>
  )
}

export const useAuth = () => useContext(AuthContext)