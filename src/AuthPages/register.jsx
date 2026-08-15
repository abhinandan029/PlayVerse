import {useState} from 'react'
import {useNavigate} from 'react-router-dom'


import {Gamepad2} from 'lucide-react'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

export default function Register() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cnfPassword, setCnfPassword] = useState("")
  const [status, setStatus] = useState("idle")
  const [msg, setMsg] = useState("")

  const navigate = useNavigate()

  async function handleSubmit(e){

    e.preventDefault()
    setMsg("")

    if(password !== cnfPassword){
      setStatus("Error")
      setMsg("Password doesn't match!!")
      return 
    }

    setStatus("Registering")

    try{
      const res = await fetch('/api/auth/register', {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        credentials : "include",
        body : JSON.stringify({email, password})
      })

      const data = await res.json()

      if(!res.ok){
        throw new Error(data.error || `Server Responded with ${res.status}`)
      }

      setStatus("Registerd")
      navigate("/home")

    }
    catch(error){
      setStatus("Error")
      setMsg(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4" style={TILE_BG}>

      <Gamepad2 className="text-red-500 size-30 mb-5"/>

      {/* Heading */}
      <h1 className="text-white text-4xl font-bold mb-8 text-center">
        Create your account
      </h1>

      {/* Card */}
      <div className="w-full max-w-xl bg-black border border-white/40 rounded-2xl p-8">
        
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-2 text-xl">
              Email address
            </label>
            <input 
              type="text"
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

          <div>
            <label className="block text-white font-semibold mb-2 text-xl">
              Confirm Password
            </label>
            <input 
              type="password"
              autoComplete="new-password"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-xl text-white placeholder-white/30 focus:outline-none"
              placeholder="*********"
              value={cnfPassword}
              onChange={(e) => setCnfPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-md">
            <label className="flex items-center gap-2 text-white cursor-pointer select-none">
              <input 
                type="checkbox"
                className="w-4 h-4 rounded bg-white/20 accent-green-400 cursor-pointer"
                required
              />
              Accept the TERMS & CONDITIONS.
            </label>
          </div>

          {/* Sign in button */}
          <button 
            type="submit"
            value={ status === "Registering" ? "Registering" : "Register"}
            disabled={status === "Registering"}
            className="w-full bg-white/20 hover:bg-white/30 transition-colors text-2xl text-white font-semibold rounded-lg py-3 mt-2 cursor-pointer"
          >
            Register
          </button>

        </form>

        <p className="text-red-500 text-md self-center justify-self-center mt-2">{msg}</p>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/50" />
          <span className="text-white/50 text-md font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-white/50" />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-lg py-2.5 text-white font-semibold text-xl">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.92l-3.88-3.01c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.1C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.31 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.6H1.3A11.95 11.95 0 000 12c0 1.93.46 3.76 1.3 5.4l4.01-3.1z"/>
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.6l4.01 3.1c.94-2.82 3.58-4.93 6.69-4.93z"/>
            </svg>
            Google
          </button>


          <button className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-lg py-2.5 text-white font-semibold text-xl">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

      </div>

      {/* Footer link */}
      <p className="text-white/50 text-xl mt-6">
        Already a member?{' '}
        <a href="/login" className="text-green-400 font-semibold">
          Login
        </a>
      </p>

    </div>
  )
}