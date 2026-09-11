import {useNavigate} from 'react-router-dom'
import {forwardRef, useState, useEffect} from 'react'

import {Play, Pause, RotateCcw, LogOut} from 'lucide-react'

import DialogBox from "./DialogBox.jsx"
import {useDialog} from '../../contexts/dialogContext.jsx'

const GameBoard = forwardRef(function GameBoard({score,setPlaying, playing, gameOver, gameWon, restart, focus, mobileControls, children}, ref){

  const {openDialog} = useDialog()
  
  const navigate = useNavigate()

  const [type, setType] = useState("")

  useEffect(() => {
    if (gameWon) setType("won")
    else if (gameOver) setType("lost")
    else setType(null)
  }, [gameOver, gameWon])

  

  return (
    <div ref={ref} className="relative w-full max-w-6xl m-auto scroll-mt-10 my-16 sm:my-25 px-3 sm:px-0">
      <div className="flex flex-wrap items-center justify-between gap-2">

        <p className="text-red-500 text-3xl sm:text-5xl px-2 sm:px-4 py-2">Play Ground</p>
        <p className="text-white text-2xl sm:text-4xl px-2 sm:px-4 py-2">Score : <span className="text-green-400">{score}</span></p>

      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="w-full">{children}</div>
      </div>

      {mobileControls && (
        <div className="md:hidden flex justify-center mt-4 touch-none">
          {mobileControls}
        </div>
      )}
      
      {type && (
        <DialogBox
          type={type}
          score={score}
          onRestart={() => { restart(); setType(null) }}
          onExit={() => navigate("/home")}
        />
      )}

      <div className="flex">

        {
          playing === true && gameOver === false ? 
          
          <button 
          className="text-white border m-2 p-2 rounded-md bg-yellow-400/40 cursor-pointer" 
          onClick={() => setPlaying(false)}>
            <Pause className="text-white"/>
          </button> :
          
          <button 
          className="text-white border m-2 p-2 rounded-md bg-green-400/40 cursor-pointer" 
          onClick={() => {
              setPlaying(true) 
              focus()
            }}>
            <Play className="text-white"/>
          </button>
        }

        
      
        <button 
        className="text-white border m-2 p-2 rounded-md bg-red-400/40 cursor-pointer"
        onClick={() => {setPlaying(false); openDialog("confirm", "Do you want to restart the game?", restart)}} >
          <RotateCcw className="text-white"/>
        </button>
        
        <button 
        className="text-white border ml-auto m-2 p-2 rounded-md bg-red-500/40 cursor-pointer"
        onClick={() => openDialog("confirm", "do want to exit the game?", () => navigate("/home"))}>
          <LogOut className="text-white"/>
        </button>

      </div>
    </div>
  ) 
})
export default GameBoard