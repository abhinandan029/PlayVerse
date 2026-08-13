import {useNavigate} from 'react-router-dom'
import {Play, Pause, RotateCcw, LogOut} from 'lucide-react'

function GameBoard({score,setPlaying, playing, gameOver, restart, children}){

  const navigate = useNavigate()

  return (
    <div className=" m-auto my-25">
      <div className="flex justify-between">

        <p className="text-red-500 text-5xl px-4 py-2">Play Ground</p>
        <p className="text-white text-4xl px-4 py-2">Score : <span className="text-green-400">{score}</span></p>

      </div>
      
      {children}

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
          onClick={() => setPlaying(true)}>
            <Play className="text-white"/>
          </button>
        }

        
      
        <button 
        className="text-white border m-2 p-2 rounded-md bg-red-400/40 cursor-pointer"
        onClick={() => restart()} 
        popOverTarget="confirm">
          <RotateCcw className="text-white"/>
        </button>
        
        <button 
        className="text-white border ml-auto m-2 p-2 rounded-md bg-red-500/40 cursor-pointer"
        onClick={() => navigate("/home")}>
          <LogOut className="text-white"/>
        </button>

      </div>
    </div>
  ) 
}

export default GameBoard