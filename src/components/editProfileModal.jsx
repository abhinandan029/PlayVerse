import {useState} from 'react'
import {Check} from 'lucide-react'

import {useAuth} from "../contexts/authContext.jsx"

const AVATAR_LIST = ['fox', 'robot', 'cat', 'alien', 'ghost', 'ninja', 'astronaut', 'dragon', 'wizard', 'pixel-guy']
const avatars = import.meta.glob("../assets/avatars/*.svg", { eager: true, import: "default" })

function getAvatar(name) {
  return avatars[`../assets/avatars/${name}.svg`]
}

export function EditProfileModal({ onClose }){

  const { user, setUser } = useAuth()

  const [username, setUsername] = useState(user.username || '')
  const [bio, setBio] = useState(user.bio || '')
  const [avatar, setAvatar] = useState(user.avatar || 'cat')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setError('')
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
      onClick={onClose}>

      <div
        className="flex flex-col gap-4 bg-black border border-white/30 rounded-xl p-8 w-full max-w-xl text-white"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm text-white/50">Avatar</label>
          <div className="grid grid-cols-5 gap-3">
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
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            className="bg-white/5 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:border-green-400/60"
          />
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
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-md border border-white/30 cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-md border border-green-400/60 bg-green-400/20 cursor-pointer disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  )
}