import { useState, useEffect, useRef, useCallback } from "react"

import GameDesc from '../UI/gameDesc.jsx'
import HowToPlay from '../UI/howToPlay.jsx'

import GameBoard from "../UI/GameBoard.jsx"
import ScoreBoard from "../UI/scoreBoard.jsx"
import Buttons from "../UI/buttons.jsx"
// import LeaderBoard from "../UI/leaderBoard.jsx"

const GAME_NAME = "Snake Game"
const GAME_TYPE = "classic"
const DESC = "It's the same game that's been stealing lunch breaks since the '90s — rebuilt here with buttery controls and a scoreboard that remembers your best runs. Just Guide your snake to eat the yellow balls and grow it and dont forget not to run into yourself🐍."

const HTP = [
  "Once you click play button the snake starts moving.",
  "To control the direction of motion of snake use arrow keys. ⬅️⬆️⬇️➡️",
  "Score is calculated on the number of yellow balls eaten.",
  "On hitting the wall the snake comes from the other side, So there is no game over.",
  "Game is over when snake's head touches itself."
]



const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};


const GRID_WIDTH = 45
const GRID_HEIGHT = 34
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
const INITIAL_HEAD = [Math.floor(Math.random() * GRID_SIZE)]
const INITIAL_FOOD = randomEmptyCell(INITIAL_HEAD)

function randomEmptyCell(occupied){
  let cell;
  do{
    cell = Math.floor(Math.random() * GRID_SIZE);
  }while( occupied.includes(cell));
  return cell
}

function SnakeGame(){

  const [snake, setSnake] = useState(INITIAL_HEAD)
  const [food, setFood]= useState(INITIAL_FOOD)
  const directionRef = useRef(1)
  const [gameOver, setGameOver] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)

  useEffect( () => {
    const handleKeyDown = (e) =>{
      e.preventDefault()
      switch(e.key) {
        case "ArrowRight":
          if(directionRef.current !== -1) directionRef.current = 1
          break;

        case "ArrowLeft" :
          if(directionRef.current !== 1) directionRef.current = -1
          break;
          
        case "ArrowDown" :
          if(directionRef.current !== -GRID_WIDTH) directionRef.current = GRID_WIDTH
          break;

        case "ArrowUp" : 
          if(directionRef.current !== GRID_WIDTH) directionRef.current = -GRID_WIDTH
          break;
        default :
          break; 
      }

    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])


  useEffect(() => {
    if(!playing || gameOver) return ;

    const id = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0]
        const dir = directionRef.current;

        const col = head % GRID_WIDTH;
        let newHead;

        if(dir === 1 && col === GRID_WIDTH - 1) {
          newHead = head - (GRID_WIDTH - 1)
        }
        else if(dir === -1 && col === 0){
          newHead = head + (GRID_WIDTH - 1)
        }
        else {
          newHead = head + dir 
          if(newHead < 0) newHead += GRID_SIZE 
          if(newHead >= GRID_SIZE ) newHead  -= GRID_SIZE
        }

        if(prevSnake.includes(newHead)){
          setGameOver(true);
          setPlaying(false);
          return prevSnake;
        }
        
        const newSnake = [newHead, ...prevSnake]

        if(newHead === food ){
          setFood(randomEmptyCell(newSnake));
          setScore((prev) => prev + 1/2);
        }
        else {
          newSnake.pop();
        }

        return newSnake
      });
    }, 150) 

    return () => clearInterval(id)
  }, [playing, gameOver, food]);


  function restartGame(){
    if(gameOver) {
      setSnake(INITIAL_HEAD)
      setFood(INITIAL_FOOD)
      setGameOver(false)
      setScore(0)
    }
  }


  return ( 
    <div className="flex flex-col" style={TILE_BG}>

      <GameDesc gameName={GAME_NAME} gameType={GAME_TYPE} description={DESC}/>
      <HowToPlay htp={HTP}/>
        
        <GameBoard  score={score} >
          <div 
            className="grid grid-cols-45 gap-0.5 p-1 py-2 bg-black border border-white/40 rounded-md"
            style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 0fr)` }}>
            {
              Array.from({ length : GRID_SIZE}).map((cell, index) => {
                let color = "bg-black h-6 w-6 "
                if( index === snake[0]) color = "bg-green-300 border h-6 w-6 "
                else if(snake.includes(index)) color = "bg-green-700 h-6 w-6";
                else if(index === food) color = "bg-yellow-200 rounded-xl h-4 w-4";

                return <div className={`rounded-md ${color}`} key={index}></div>
              })
            }
          </div>
        </GameBoard>

      

      
      
    </div>
    
  )

}

export default SnakeGame