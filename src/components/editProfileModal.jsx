import {useState, useRef, useEffect} from 'react'
import {Check, Loader2, X} from 'lucide-react'

import {useAuth} from "../contexts/authContext.jsx"

const AVATAR_LIST = ['fox', 'robot', 'cat', 'alien', 'ghost', 'ninja', 'astronaut', 'dragon', 'wizard', 'pixel-guy']
const avatars = import.meta.glob("../assets/avatars/*.svg", { eager: true, import: "default" })

function getAvatar(name) {
  return avatars[`../assets/avatars/${name}.svg`]
}

export function EditProfileModal({ onClose, forceUsername = false }){

  const { user, setUser } = useAuth()

  const [username, setUsername] = useState(user.username || '')
  const [bio, setBio] = useState(user.bio || '')
  const [avatar, setAvatar] = useState(user.avatar || 'cat')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState(null) // null = unknown/untouched, true/false = checked
  const debounceRef = useRef(null)

  useEffect(() => {
    if(username === (user.username || '' )){
      setAvailable(null)
      return
    }

    if(username.length < 3){
      setAvailable(null)
      return
    }

    if(!/^[a-zA-Z0-9_]+$/.test(username)){
      setAvailable(false)
      return
    }

    clearTimeout(debounceRef.current)
    setChecking(true)

    debounceRef.current = setTimeout(async () => {
      try{
        const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(username)}`,  { credentials : 'include' })

        if(!res.ok) {
          console.error('username Check Failed', res.status)
          setAvailable(null)
          return  
        }
        const data = await res.json()
        console.log(data.available)
        setAvailable(data.available)
      }
      catch(error){
        console.error(error)
      }
      finally{
        setChecking(false)
      }

    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [username])

  const usernameValid = 
  username.length >= 3 && 
  username.length <= 20 && 
  /^[a-zA-Z0-9_]+$/.test(username) && 
  (available === true || available === null && username === (user.username || ''))


  async function handleSave() {
    setError('')

    if (!usernameValid) {
      setError("Please choose a valid, available username")
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, bio, avatar})
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.msg || "Failed to update profile")
        return
      }

      setUser(prev => ({ ...prev, username, bio, avatar}))
      onClose()
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    } finally {
      setSaving(false)
    }
    
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-999"
      onClick={forceUsername ? undefined : onClose}>

      <div
        className="flex flex-col gap-4 bg-black border border-white/30 rounded-xl p-5 sm:p-8 w-[calc(100%-2rem)] max-w-xl text-white"
        onClick={(e) => e.stopPropagation()}>

        {forceUsername && (
          <p className="text-green-400 text-sm -mb-2">Welcome! Pick a username to finish setting up your account.</p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm text-white/50">Avatar</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {AVATAR_LIST.map((name) => (
              <button
                key={name}
                onClick={() => setAvatar(name)}
                className={`relative cursor-pointer transition-colors m-1 rounded-full`}>
                <img src={getAvatar(name)} className="size-full rounded-full" alt={name} />
                {avatar === name && (
                  <span className="absolute top-2 -right-1 bg-green-400 rounded-full p-0.5">
                    <Check className="size-5 text-black" />
                  </span>
                )}
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/50">Username</label>
          
          <div className="relative">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
              className={`w-full bg-white/5 border rounded-md px-3 py-2 pr-9 focus:outline-none ${available === false ? "border-red-500/60" : available === true ? "border-green-400/60" : "border-white/20"}`}
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              {checking && <Loader2  className="size-4 animate-spin text-white/40" />}
              {!checking && available === true && <Check className="size-4 text-green-400"/>}
              {!checking && available === false && <X className="size-4 text-red-500"/>}
            </span>
          </div>

          {available === false && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username) && (
            <span className="text-xs text-red-500">Username already taken</span>
          )}

          {available === false && !/^[a-zA-Z0-9_]+$/.test(username) && username.length > 0 && (
            <span className="text-xs text-red-500">Letters, numbers, and underscores only</span>
          )}

        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/50">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            rows={3}
            className="bg-white/5 border border-white/20 rounded-md px-3 py-2 resize-none focus:outline-none focus:border-green-400/60"
          />
          <span className="text-xs text-white/30 self-end">{bio.length}/160</span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3 mt-2">
          {!forceUsername && 
            <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-md border border-white/30 cursor-pointer">
              Cancel
            </button>
          }
          
          <button
            onClick={handleSave}
            disabled={saving || !usernameValid}
            className="flex-1 px-4 py-2 rounded-md border border-green-400/60 bg-green-400/20 cursor-pointer disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  )
}