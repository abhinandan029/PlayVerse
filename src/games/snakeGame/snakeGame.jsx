import { useState, useEffect, useRef, useCallback } from "react"

import GameBoard from "../UI/GameBoard.jsx"
import ScoreBoard from "../UI/scoreBoard.jsx"
import Buttons from "../UI/buttons.jsx"
// import LeaderBoard from "../UI/leaderBoard.jsx"

const GAME_NAME = "Snake Game"
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
    <div className="flex flex-col">

      <div>
        <h1>{GAME_NAME}</h1>
        <p></p>
      </div>
      
      
      <div className="flex m-5">
        
        <GameBoard >
          <div 
            className="grid grid-cols-45 gap-0.5 p-1 py-2 bg-black rounded-md"
            style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 0fr)` }}>
            {
              Array.from({ length : GRID_SIZE}).map((cell, index) => {
                let color = "bg-black"
                if( index === snake[0]) color = "bg-green-300 border"
                else if(snake.includes(index)) color = "bg-green-700";
                else if(index === food) color = "bg-orange-500 rounded-xl";

                return <div className={`h-6 w-6 rounded-md ${color}`} key={index}></div>
              })
            }
          </div>
        </GameBoard>

        <div className="flex flex-col basis-1/3 m-2 items-center rounded-md">
          
          <ScoreBoard score={score} name={GAME_NAME} />
          <Buttons setPlaying={setPlaying} playing={playing} gameOver={gameOver} restart={restartGame} />

        </div>

      </div>
      

      
      
    </div>
    
  )

}

export default SnakeGame