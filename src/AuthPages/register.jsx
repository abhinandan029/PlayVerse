import {useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import {Gamepad2, Mail, ShieldCheck, Lock, Check} from 'lucide-react'

import {useAuth} from '../contexts/authContext.jsx'
import {useNotification} from '../contexts/notificationContext.jsx'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

export default function Register() {

  const navigate = useNavigate()
  const {refetch} = useAuth()
  const {notify} = useNotification()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [password, setPassword] = useState("")
  const [cnfPassword, setCnfPassword] = useState("")

  const [verify, setVerify] = useState("notVerified")
  const [checkingCode, setCheckingCode] = useState(false)
  const [status, setStatus] = useState("idle")

  const codeRefs = useRef([])

  const isVerified = verify === "verified"
  const codeSent = verify === "sent" || verify === "sending"
  const fullCode = code.join("")

  // step tracker: 1 = email, 2 = code, 3 = password
  const step = isVerified ? 3 : codeSent ? 2 : 1

  function handleCodeChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...code]
    next[index] = value
    setCode(next)

    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus()
    }
  }

  function handleCodeKeyDown(index, e) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus()
    }
  }

  function handleCodePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("")
    if (pasted.length === 0) return
    const next = [...code]
    pasted.forEach((digit, i) => { next[i] = digit })
    setCode(next)
    codeRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleSendCode(e) {
    e.preventDefault()
    if (email.trim() === "") {
      notify("Please enter your email.")
      return
    }

    setVerify("sending")
    try {
      const res = await fetch("/api/auth/request-verification", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (!res.ok) {
        setVerify("notVerified")
        notify(data.msg)
        return
      }

      setVerify("sent")
      notify("Code sent — check your inbox.")
    }
    catch (error) {
      setVerify("notVerified")
      notify("Unable to send verification code.")
    }
  }

  async function handleCheckCode() {
    if (fullCode.length !== 6) {
      notify("Enter the 6-digit code.")
      return
    }

    setCheckingCode(true)
    try {
      const res = await fetch("/api/auth/check-code", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode })
      })
      const data = await res.json()

      if (!res.ok) {
        notify(data.msg)
        return
      }

      setVerify("verified")
      notify("Email verified!")
    }
    catch (error) {
      notify("Unable to verify code.")
    }
    finally {
      setCheckingCode(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (verify !== "verified") {
      notify("Please verify your email first.")
      return
    }

    if (password !== cnfPassword) {
      notify("Passwords don't match!!")
      return
    }

    setStatus("Registering")
    try {
      const res = await fetch('/api/auth/complete-registration', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: fullCode, password })
      })
      const data = await res.json()

      if (res.ok) {
        notify(data.msg)
        await refetch()
        navigate("/profile", { state: { justRegistered: true } })
      } else {
        setStatus("Error")
        notify(data.msg)
      }
    }
    catch (error) {
      setStatus("Error")
      notify(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-16" style={TILE_BG}>

      <button className="fixed top-5 left-5 p-1 rounded-md border border-red-500 cursor-pointer"
        onClick={() => navigate("/home")}>
        <Gamepad2 className="text-red-500/70 size-10" />
      </button>

      <Gamepad2 className="text-red-500 size-20 mb-2" />

      <h1 className="text-white text-4xl font-bold mb-2 text-center">
        Create your account
      </h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: "Email", icon: Mail },
          { n: 2, label: "Verify", icon: ShieldCheck },
          { n: 3, label: "Password", icon: Lock },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`flex items-center justify-center size-9 rounded-full border-2 transition-colors
              ${step > s.n ? "bg-green-400 border-green-400" : step === s.n ? "border-green-400 text-green-400" : "border-white/20 text-white/30"}`}>
              {step > s.n ? <Check className="size-4 text-black" /> : <s.icon className="size-4" />}
            </div>
            {i < 2 && <div className={`w-8 h-0.5 ${step > s.n ? "bg-green-400" : "bg-white/20"}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xl bg-black border border-white/40 rounded-2xl p-5 sm:p-8">

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

          {/* Step 1 — Email */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-white font-semibold text-lg">
              <Mail className="size-5 text-green-400" />
              Email address
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                autoComplete="new-email"
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-lg text-white placeholder-white/30 focus:outline-none focus:border-green-400/50 disabled:opacity-50 transition-colors"
                placeholder="example@email.com"
                value={email}
                disabled={isVerified || codeSent}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="button"
                disabled={isVerified || codeSent}
                onClick={handleSendCode}
                className="shrink-0 text-white font-semibold px-5 rounded-lg cursor-pointer transition-colors disabled:cursor-not-allowed
                  bg-green-400/20 border border-green-400/60 hover:bg-green-400/30 disabled:opacity-50 disabled:hover:bg-green-400/20">
                {verify === "sending" ? "Sending…" : isVerified ? "✓ Verified" : verify === "sent" ? "✓ Sent" : "Send Code"}
              </button>
            </div>
          </div>

          {/* Step 2 — Code entry */}
          {codeSent && !isVerified && (
            <div className="flex flex-col gap-2 animate-in fade-in duration-300">
              <label className="flex items-center gap-2 text-white font-semibold text-lg">
                <ShieldCheck className="size-5 text-green-400" />
                Enter the 6-digit code
              </label>

              <div className="flex gap-1 sm:gap-2 justify-center py-2" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (codeRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="size-10 sm:size-12 text-center text-xl sm:text-2xl font-bold bg-white/10 border border-white/20 rounded-lg text-green-400 focus:outline-none focus:border-green-400/60 transition-colors"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-white/40 hover:text-white/60 underline cursor-pointer transition-colors"
                  onClick={handleSendCode}>
                  Resend code
                </button>

                <button
                  type="button"
                  disabled={checkingCode || fullCode.length !== 6}
                  onClick={handleCheckCode}
                  className="text-black font-semibold px-5 py-2 rounded-lg cursor-pointer bg-green-400 hover:bg-green-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {checkingCode ? "Checking…" : "Confirm Code"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Password */}
          <div className={`flex flex-col gap-4 transition-opacity ${isVerified ? "opacity-100" : "opacity-30"}`}>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-white font-semibold text-lg">
                <Lock className="size-5 text-green-400" />
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-lg text-white placeholder-white/30 focus:outline-none focus:border-green-400/50 transition-colors"
                placeholder="At least 8 characters"
                value={password}
                disabled={!isVerified}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white font-semibold text-lg pl-7">
                Confirm Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-lg text-white placeholder-white/30 focus:outline-none focus:border-green-400/50 transition-colors"
                placeholder="Type it again"
                value={cnfPassword}
                disabled={!isVerified}
                onChange={(e) => setCnfPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "Registering" || !isVerified}
            className="w-full bg-green-400 hover:bg-green-300 disabled:bg-white/20 disabled:hover:bg-white/20 transition-colors text-xl text-black disabled:text-white font-bold rounded-lg py-3.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
            {status === "Registering" ? "Creating account…" : "Create Account"}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/40 text-sm font-medium">Or continue with</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social buttons — placeholders, functionality to be added later */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-lg py-2.5 text-white font-semibold text-lg hover:bg-white/15 transition-colors cursor-pointer"
            onClick={() => window.location.href = '/api/auth/google'}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.92l-3.88-3.01c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.1C3.26 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.31 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.6H1.3A11.95 11.95 0 000 12c0 1.93.46 3.76 1.3 5.4l4.01-3.1z"/>
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.45-3.45C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.6l4.01 3.1c.94-2.82 3.58-4.93 6.69-4.93z"/>
            </svg>
            Google
          </button>

        </div>

      </div>

      <p className="text-white/50 text-lg mt-6">
        Already a member?{' '}
        <a href="/login" className="text-green-400 font-semibold hover:underline">
          Login
        </a>
      </p>
        

      
    </div>

    
  )
}