import { Trophy, Skull, RotateCcw, LogOut } from 'lucide-react'

export default function DialogBox({ type, score, onRestart, onExit }) {
  const won = type === "won"

  return (
    <div 
    className="absolute top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-black/80 z-500 rounded-md">
      
      <div className={`flex w-full flex-col items-center gap-4 px-5 sm:px-10 py-6 sm:py-8 rounded-xl border-2 bg-black
        ${won ? "border-green-400/60" : "border-red-500/60"}`}>

        {won ? (
          <Trophy className="text-green-400 size-14" />
        ) : (
          <Skull className="text-red-500 size-14" />
        )}

        <h2 className={`text-3xl font-bold ${won ? "text-green-400" : "text-red-500"}`}>
          {won ? "You Win!" : "Game Over"}
        </h2>

        <p className="text-white text-xl">
          Score: <span className="font-bold">{score}</span>
        </p>

        <div className="flex w-full flex-col sm:flex-row sm:justify-center gap-3 mt-2 text-white">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-green-400/60 bg-green-400/20 hover:bg-green-400/30 transition-colors cursor-pointer">
            <RotateCcw className="size-4" />
            Play Again
          </button>
          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-white/30 hover:border-white/60 transition-colors cursor-pointer">
            <LogOut className="size-4" />
            Exit
          </button>
        </div>

      </div>
    </div>
  )
}