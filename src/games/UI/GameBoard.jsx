import {Play, RotateCcw, LogOut} from 'lucide-react'

function GameBoard({score, children}){
  return (
    <div className=" m-auto my-20">
      <div className="flex justify-between">

        <p className="text-red-500 text-5xl px-4 py-2">Play Ground</p>
        <p className="text-white text-4xl px-4 py-2">Score : <span className="text-green-400">{score}</span></p>

      </div>
      
      {children}

      <div className="flex">
       <button className="text-white border m-2 p-2 rounded-md bg-green-400/40 cursor-pointer" ><Play className="text-white"/></button>
       <button className="text-white border m-2 p-2 rounded-md bg-red-400/40 cursor-pointer" ><RotateCcw className="text-white"/></button>
       <button className="text-white border ml-auto m-2 p-2 rounded-md bg-red-500/40 cursor-pointer" ><LogOut className="text-white"/></button>
      </div>
    </div>
  ) 
}

export default GameBoard