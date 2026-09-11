import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

import {Gamepad2} from 'lucide-react'

import {useAuth} from '../contexts/authContext.jsx'
import {useNotification} from '../contexts/notificationContext.jsx'
import { apiUrl } from '../utils/api.js'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

export default function Login() {

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [status, setStatus] = useState('idle')
  const [msg, setMsg] = useState("") 

  const navigate = useNavigate()

  const {refetch} = useAuth()
  const {notify} = useNotification()

  async function handleSubmit(e){

    e.preventDefault()
    setMsg("")

    setStatus("loggingIn")

    try{
      const res = await fetch(apiUrl('/api/auth/login'), {
        method : "POST", 
        headers : {"Content-Type" : "application/json"},
        credentials : "include",                           
        body : JSON.stringify({email, password})
      })

      const data = await res.json()

      if(res.ok){
        setStatus("loggedin")
        setMsg(data.msg)
        notify(data.msg)
        await refetch()
        navigate("/home")
      }  
      else{
        setMsg(data.msg)
        notify(data.msg)
        throw new Error(data.msg || `Server responded with ${res.status}`)
      }
    }
    catch(error){
      setStatus("Error")
      setMsg(error.message)
      notify(error.message)
    }

  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4" style={TILE_BG}>

      <button className="fixed top-5 left-5 p-1 rounded-md border border-red-500 cursor-pointer"
      onClick={() => navigate("/home")}>
        <Gamepad2 className="text-red-500/70 size-10"/>
      </button>
      
      <Gamepad2 className="text-red-500 size-30 mb-5"/>

      {/* Heading */}
      <h1 className="text-white text-4xl font-bold mb-8 text-center">
        Sign in to your account
      </h1>

      {/* Card */}
      <div className="w-full max-w-xl bg-black border border-white/40 rounded-2xl p-5 sm:p-8">
        
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-2 text-xl">
              Email address
            </label>
            <input 
              type="email"
              autoComplete="new-email"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-xl text-white placeholder-white/30 focus:outline-none"
              placeholder="exmaple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white font-semibold mb-2 text-xl">
              Password
            </label>
            <input 
              type="password"
              autoComplete="new-password"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-xl text-white placeholder-white/30 focus:outline-none"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/*Forgot password */}
          <div className="flex items-center justify-end text-xl">
            <a href="#" className="text-red-500 hover:text-green-400">
              Forgot password?
            </a>
          </div>

          {/* Sign in button */}
          <button 
            type="submit"
            value={status === "loggingIn" ? "Logging In" : "Login"}
            disabled={status === "loggingIn"}
            className="w-full bg-white/20 hover:bg-white/30 transition-colors text-2xl text-white font-semibold rounded-lg py-3 mt-2 cursor-pointer"
          >
            Login
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/50" />
          <span className="text-white/50 text-md font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-white/50" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button
          type="button" 
          className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 rounded-lg py-2.5 text-white font-semibold text-xl cursor-pointer"
          onClick={() => window.location.href = apiUrl('/api/auth/google')}>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.92l-3.88-3.01c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.1C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.31 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.6H1.3A11.95 11.95 0 000 12c0 1.93.46 3.76 1.3 5.4l4.01-3.1z"/>
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.6l4.01 3.1c.94-2.82 3.58-4.93 6.69-4.93z"/>
            </svg>
            Google
          </button>

        </div>

      </div>

      {/* Footer link */}
      <p className="text-white/50 text-xl mt-6">
        Not a member?{' '}
        <a href="/register" className="text-green-400 font-semibold">
          Register
        </a>
      </p>

    </div>
  )
}