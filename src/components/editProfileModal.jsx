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
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

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

  const passwordRules = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'One number', valid: /[0-9]/.test(password) },
    { label: 'One special character', valid: /[^A-Za-z0-9]/.test(password) },
  ]
  const passwordValid = passwordRules.every(rule => rule.valid)
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword


  async function handleSave() {
    setError('')

    if (!usernameValid) {
      setError("Please choose a valid, available username")
      return
    }

    if (forceUsername && canSetPassword) {
      setError("Set your password before finishing setup.")
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

  async function handleSetPassword() {
    setPasswordError('')

    if(!passwordValid){
      setPasswordError('Password does not meet all requirements.')
      return
    }

    if(password !== confirmPassword){
      setPasswordError('Passwords do not match.')
      return
    }

    setPasswordSaving(true)

    try{
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, confirmPassword })
      })

      const data = await res.json()

      if(!res.ok){
        setPasswordError(data.msg || 'Failed to set password')
        return
      }

      setUser(prev => ({ ...prev, password: true }))
      setPassword('')
      setConfirmPassword('')
    }
    catch(err){
      console.error(err)
      setPasswordError('Something went wrong. Try again.')
    }
    finally{
      setPasswordSaving(false)
    }
  }

  const canSetPassword = user.google_id && !user.password

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-3 sm:p-4 z-999"
      onClick={forceUsername ? undefined : onClose}>

      <div
        className="flex max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col gap-4 overflow-y-auto overscroll-contain bg-black border border-white/30 rounded-xl p-4 sm:p-8 text-white"
        onClick={(e) => e.stopPropagation()}>

        {forceUsername && (
          <p className="text-green-400 text-sm -mb-2">Welcome! Pick a username to finish setting up your account.</p>
        )}

        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm text-white/50">Avatar</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
            {AVATAR_LIST.map((name) => (
              <button
                key={name}
                onClick={() => setAvatar(name)}
                className="relative flex min-w-0 flex-col items-center gap-1 rounded-full p-1 text-[10px] text-white/70 cursor-pointer transition-colors">
                <img src={getAvatar(name)} className="aspect-square w-full max-w-16 rounded-full" alt={name} />
                {avatar === name && (
                  <span className="absolute top-0 right-0 bg-green-400 rounded-full p-0.5">
                    <Check className="size-4 text-black" />
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

        {canSetPassword && (
          <div className="flex flex-col gap-3 border-t border-white/20 pt-4">
            <div>
              <p className="text-sm text-white/50">Set a password</p>
              <p className="text-xs text-white/30 wrap-break-word">Use your email and this password to sign in without Google.</p>
            </div>

            <input
              type="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
              className="w-full bg-white/5 border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:border-green-400/60"
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError('') }}
              className={`w-full bg-white/5 border rounded-md px-3 py-2 focus:outline-none focus:border-green-400/60 ${passwordsMismatch ? 'border-red-500/70' : 'border-white/20'}`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {passwordRules.map((rule) => (
                <span key={rule.label} className={rule.valid ? 'text-green-400' : 'text-white/40'}>
                  {rule.valid ? '✓' : '•'} {rule.label}
                </span>
              ))}
            </div>

            {passwordsMismatch && <p className="text-red-500 text-sm">Passwords do not match.</p>}

            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

            <button
              type="button"
              onClick={handleSetPassword}
              disabled={passwordSaving || !passwordValid || passwordsMismatch}
              className="w-full px-4 py-2 rounded-md border border-green-400/60 bg-green-400/20 cursor-pointer disabled:opacity-50">
              {passwordSaving ? 'Setting password...' : 'Set password'}
            </button>
          </div>
        )}

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