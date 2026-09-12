import {useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

import {Gamepad2, Mail, ShieldCheck, Lock, Check} from 'lucide-react'

import {useNotification} from '../contexts/notificationContext.jsx'
import { apiUrl } from '../utils/api.js'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function ForgotPassword(){
  const navigate = useNavigate()
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

  const passwordRules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ]
  const passwordValid = passwordRules.every(rule => rule.valid)
  const passwordsMatch = password.length > 0 && password === cnfPassword
  const passwordsMismatch = cnfPassword.length > 0 && password !== cnfPassword

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
      const res = await fetch(apiUrl("/api/auth/request-reset-code"), {
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
      notify("Reset code sent — check your inbox.")
    }
    catch (error) {
      setVerify("notVerified")
      notify("Unable to send reset code.")
    }
  }

  async function handleCheckCode() {
    if (fullCode.length !== 6) {
      notify("Enter the 6-digit reset code.")
      return
    }

    setCheckingCode(true)
    try {
      const res = await fetch(apiUrl("/api/auth/check-code"), {
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

    if (!passwordValid) {
      notify("Password does not meet all requirements.")
      return
    }

    setStatus("Resetting")
    try {
      const res = await fetch(apiUrl('/api/auth/reset-password'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code: fullCode, password })
      })
      const data = await res.json()

      if (res.ok) {
        notify(data.msg)
        navigate("/login")
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
        Reset your password
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
            <p className="text-green-500">{verify === "sent" ? "Check your SPAM INBOX for the code." : ""}</p>
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
                  className="text-sm text-green-500/80 hover:text-green-500 underline cursor-pointer transition-colors"
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
                New-Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-lg text-white placeholder-white/30 focus:outline-none focus:border-green-400/50 transition-colors"
                placeholder="At least 8 characters"
                value={password}
                disabled={!isVerified}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={password.length > 0 && !passwordValid}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {passwordRules.map((rule) => (
                  <span key={rule.label} className={rule.valid ? "text-green-400" : "text-white/45"}>
                    {rule.valid ? "✓" : "○"} {rule.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-white font-semibold text-lg">
                <Lock className={`size-5 ${passwordsMatch ? "text-green-400" : "text-red-500"}`} />
                Confirm New-Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Type it again"
                value={cnfPassword}
                disabled={!isVerified}
                onChange={(e) => setCnfPassword(e.target.value)}
                aria-invalid={passwordsMismatch}
                  className={`w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-lg text-white placeholder-white/30 focus:outline-none transition-colors ${
                  passwordsMismatch
                    ? "border-red-400/70 focus:border-red-400"
                    : passwordsMatch
                      ? "border-green-400/70 focus:border-green-400"
                      : "border-white/10 focus:border-green-400/50"
                }`}
                required
              />
              {passwordsMismatch && (
                <span className="text-sm text-red-400">Passwords do not match.</span>
              )}
              {passwordsMatch && (
                <span className="text-sm text-green-400">Passwords match.</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "Resetting" || !isVerified || !passwordValid || !passwordsMatch}
            className="w-full bg-green-400 hover:bg-green-300 disabled:bg-white/20 disabled:hover:bg-white/20 transition-colors text-xl text-black disabled:text-white font-bold rounded-lg py-3.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70">
            {status === "Resetting" ? "Resetting password..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>  
  )
}

export default ForgotPassword