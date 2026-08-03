import GameBoard from "../UI/GameBoard.jsx"


const GAME_NAME = "Snake Game"
const GRID_WIDTH = 45
const GRID_HEIGHT = 34
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

function PacMan(){
  return (
    <div className="flex">
      <GameBoard >
        <div 
          className="grid grid-cols-45 gap-0.5 p-1 py-2 bg-white/10 rounded-md"
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}>
          {
            Array.from({ length : GRID_SIZE}).map((cell, index) => {
              let color = "bg-black/20"

              return <div className={`h-5 w-5 rounded-md ${color}`} key={index}></div>
            })
          }
        </div>
      </GameBoard>
    </div>
  )
} 

export default PacMan