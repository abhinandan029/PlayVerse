import { Gamepad2, Code2, Users, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const principles = [
  {
    icon: Gamepad2,
    title: "Zero friction",
    body: "No installs, no accounts required to play, no ads between rounds. Open a tab, hit play."
  },
  {
    icon: Code2,
    title: "Built in the open",
    body: "Every game is plain code you can read, fork, and break in your own way. Nothing here is a black box."
  },
  {
    icon: Users,
    title: "Made by whoever shows up",
    body: "Contributions are welcome from anyone — a new game, a bug fix, a better leaderboard. The roster grows with the people who build it."
  },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col text-white" style={TILE_BG}>

      {/* Hero — framed like an arcade cabinet's instruction plaque */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 border border-green-400/40 rounded-full px-4 py-1 mb-6">
          <span className="size-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400 tracking-widest uppercase">Insert Coin</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          What is <span className="text-green-400">Play</span><span className="text-red-500">Verse</span>?
        </h1>

        <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
          A small collection of grid-based games, rebuilt for the browser.
          Snake, Pac-Man, and a Flappy Bird cousin called Floating Block —
          the kind of games you'd find on a cabinet at a corner arcade,
          minus the quarters.
        </p>
      </div>

      {/* Instruction-card panel — the signature element */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-16">
        <div className="border-2 border-white/20 rounded-2xl bg-black overflow-hidden">

          <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-white/20 bg-white/5">
            <Sparkles className="text-red-500 size-5" />
            <span className="font-mono text-sm text-white/50 tracking-wide">HOW TO PLAY — INSTRUCTIONS</span>
          </div>

          <div className="grid md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20">
            {principles.map((p, i) => (
              <div key={i} className="flex flex-col gap-3 p-6">
                <p.icon className="text-green-400 size-6" />
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="text-white/50 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* The roster — quick nod to what's actually playable right now */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-sm text-white/40 tracking-widest">CURRENTLY IN ROTATION</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {["Snake Game", "Pac Man", "Floating Block"].map((game) => (
            <div key={game} className="border border-white/20 rounded-lg px-4 py-3 text-center hover:border-green-400/50 transition-colors">
              <p className="font-semibold">{game}</p>
              <p className="text-xs text-white/30 mt-1">classic</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-24 text-center">
        <p className="text-white/50 mb-6">
          Want to add a game, fix something, or just poke around the code?
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 rounded-md border border-green-400/60 bg-green-400/20 hover:bg-green-400/30 transition-colors cursor-pointer">
            Start Playing
          </button>
            <a
            href="https://github.com/yourname/playverse"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-md border border-white/30 hover:border-white/60 transition-colors">
            View on GitHub
          </a>
        </div>
      </div>

    </div>
  )
}