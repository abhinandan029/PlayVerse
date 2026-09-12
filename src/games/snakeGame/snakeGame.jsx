import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react"

import GameDesc from '../UI/gameDesc.jsx'
import HowToPlay from '../UI/howToPlay.jsx'
import GameBoard from "../UI/GameBoard.jsx"
import LeaderBoard from "../UI/leaderBoard.jsx"

import {useAuth} from '../../contexts/authContext.jsx'
import {submitScore} from '../utils/score.jsx'

const GAME_NAME = "Snake Game"
const GAME_TYPE = "classic"
const GAME_ID = 1
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


const GRID_WIDTH = 50
const GRID_HEIGHT = 35
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

  const { user } = useAuth()

  const [snake, setSnake] = useState(INITIAL_HEAD)
  const [food, setFood]= useState(INITIAL_FOOD)
  const directionRef = useRef(1)
  const [gameOver, setGameOver] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState(0)

  const gameRef = useRef(null)

  function changeDirection(direction, shouldStart = false) {
    if(directionRef.current === -direction) return
    directionRef.current = direction
    if(shouldStart) setPlaying(true)
  }

  useEffect(() => {
      if(!gameOver) return 
      if(!user) return
  
      submitScore(GAME_ID, score)
    }, [gameOver])

  useEffect( () => {
    const handleKeyDown = (e) =>{
      e.preventDefault()
      switch(e.key) {
        case "ArrowRight":
          changeDirection(1)
          break;

        case "ArrowLeft" :
          changeDirection(-1)
          break;
          
        case "ArrowDown" :
          changeDirection(GRID_WIDTH)
          break;

        case "ArrowUp" : 
          changeDirection(-GRID_WIDTH)
          break;
        default :
          break; 
      }

    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) 


  useEffect(() => {
    if(!playing || gameOver) return

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
          setScore((prev) => prev + 1);
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
    setPlaying(false)
    setSnake(INITIAL_HEAD)
    setFood(INITIAL_FOOD)
    setGameOver(false)
    setScore(0)
  }

  function focus(){
    gameRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" })
  }


  return ( 
    <div className="flex flex-col" style={TILE_BG}>

      <GameDesc gameName={GAME_NAME} gameType={GAME_TYPE} description={DESC} focus={focus} id={GAME_ID}/>
      <HowToPlay htp={HTP}/>
        
      <GameBoard  score={score} setPlaying={setPlaying} playing={playing} gameOver={gameOver} restart={restartGame}  ref={gameRef} focus={focus}
        mobileControls={
          <div className="grid grid-cols-3 gap-2">
            <span />
            <button aria-label="Move up" className="mobile-game-button" onClick={() => changeDirection(-GRID_WIDTH, true)}><ArrowUp /></button>
            <span />
            <button aria-label="Move left" className="mobile-game-button" onClick={() => changeDirection(-1, true)}><ArrowLeft /></button>
            <button aria-label="Move down" className="mobile-game-button" onClick={() => changeDirection(GRID_WIDTH, true)}><ArrowDown /></button>
            <button aria-label="Move right" className="mobile-game-button" onClick={() => changeDirection(1, true)}><ArrowRight /></button>
          </div>
        }>
        <div
          className="game-grid grid gap-0.5 p-1 py-2 bg-black border border-white/40 rounded-md"
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}>
          {
            Array.from({ length : GRID_SIZE}).map((cell, index) => {
              let color = "bg-black"
              if( index === snake[0]) color = "bg-green-300 border"
              else if(snake.includes(index)) color = "bg-green-700";
              else if(index === food) color = "bg-yellow-200 rounded-xl scale-75";

              return <div className={`game-cell rounded-md ${color}`} key={index}></div>
            })
          }
        </div>
      </GameBoard>

      <LeaderBoard gameId={GAME_ID} />

    </div>
    
  )

}

export default SnakeGame