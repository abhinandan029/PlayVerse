import {useEffect, useState, useRef} from "react"

import GameDesc from '../UI/gameDesc.jsx'
import GameBoard from "../UI/GameBoard.jsx"
import HowToPlay from '../UI/howToPlay.jsx'
import LeaderBoard from "../UI/leaderBoard.jsx"

const GAME_NAME = "Floating Block"
const GAME_TYPE = "Arcade"
const DESC = "Floating Block is an arcade-style game inspired from Flappy Bird in which the player controls the block, which moves persistently to the right. They are tasked with navigating block through pillars with gaps that have equally sized gaps placed at random heights. Colliding with a pipe or the ground ends the gameplay. "

const HTP = [
  "Once you click play button the block starts falling downwards.",
  "Due to gravity factor the block starts falling to keep it floating press 'SPACE BAR' repeatedly to make the block float",
  "Score is calculated on the number of pillars crossed by the block.",
  "On hitting the wall and pillars the game will over",
]

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const GRID_WIDTH = 50
const GRID_HEIGHT = 35
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

function FloatingBlock(){

  const wall_height = 2

  // block's properties
  const block_col = 8                                                 // fixed position of the block
  const [row, setRow] = useState(Math.floor(GRID_HEIGHT / 2))       // placing at the center initially  
  const velocityRef = useRef(0)                                     // velocity is to accelerate the motion of block as ot goes down  
  const gravity = 1                                                 // represents downward motion
  const upwardMotion = -3                                          // upward motion when button is clicked
  const block = row * GRID_WIDTH + block_col

  // pipes's prperties
  const pipe_width = 2
  const gap_height = 8
  const minPipe = 5           //min heght of pipe at top and bottom
  const pipe_space = 15
  const pipe_speed = 1

  const initialPipes = [
    { col : GRID_WIDTH + 10, gapStart : 10},
    { col : GRID_WIDTH + 10 + pipe_space, gapStart : 15}
  ] 

  const [pipe, setPipe] = useState(initialPipes)
  const pipeRef = useRef(initialPipes)

  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const gameRef = useRef(null)

  
  useEffect(() => {
    if(!playing || gameOver) return 

    const id = setInterval(() => {
      let moved = pipeRef.current.map((p) => ({ ...p , col : p.col - pipe_speed}))

      moved.forEach((p) => {
        if(p.col + pipe_width === block_col){
          setScore((s) => s + 1 )
        }
      })

      moved = moved.filter((p) => p.col > -pipe_width)

      const rightmost = moved[moved.length - 1]
      if(!rightmost || rightmost.col <= GRID_WIDTH - pipe_space ){

        const minGapStart = wall_height + minPipe
        const maxGapStart = GRID_HEIGHT - wall_height - gap_height - minPipe
        moved.push({
          col : GRID_WIDTH ,
          gapStart : minGapStart + Math.floor(Math.random() * (maxGapStart - minGapStart + 1))
        })
      }

      pipeRef.current = moved
      setPipe(moved)

      velocityRef.current += gravity
      setRow((r) => { 

        const newRow = r + velocityRef.current

          //wall collision
        const hitWall = newRow < wall_height || newRow >= GRID_HEIGHT - wall_height
          
          //pipe collision
        const hitPipe = pipeRef.current.some((p) => {
          const inCol = block_col >=  p.col && block_col < p.col + pipe_width
          const inGap = newRow >= p.gapStart && newRow < p.gapStart + gap_height

          return inCol && !inGap
        })

        if(hitWall || hitPipe){
          setGameOver(true)
          setPlaying(false)
          return Math.max(wall_height, Math.min(GRID_HEIGHT - wall_height -1 , newRow))
        }
        
        return newRow
      })

    }, 100)

    return () => clearInterval(id)

  }, [playing, gameOver])


  useEffect(() => {
    const handleJump = (e) => {

      if(e.key === " "){
        e.preventDefault()
        if(e.key === " "){
          velocityRef.current = upwardMotion
        }
      }
      
    }

    window.addEventListener("keydown", handleJump)

    return () =>  window.removeEventListener("keydown", handleJump)
  }, [])


  function restartGame() {
    setRow(Math.floor(GRID_HEIGHT / 2))
    velocityRef.current = 0
    pipeRef.current = initialPipes
    setPipe(initialPipes)
    setScore(0)
    setGameOver(false)
    setPlaying(false)
  }

  function focus(){
    gameRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" })
  }

  return(
    <div className="flex flex-col" style={TILE_BG}>

      <GameDesc gameName={GAME_NAME} gameType={GAME_TYPE} description={DESC} focus={focus}/>
      <HowToPlay htp={HTP}/>

      <GameBoard score={score} setPlaying={setPlaying} playing={playing} gameOver={gameOver} restart={restartGame} ref={gameRef} focus={focus} >
        <div 
          className="grid grid-cols-45 gap-0.5 p-1 py-2 bg-black border border-white/40 rounded-md"
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}>
          {
            Array.from({ length : GRID_SIZE}).map((cell, index) => {
              let color = "bg-black"

              const cellRow = Math.floor(index / GRID_WIDTH)
              const cellCol = index % GRID_WIDTH

              const isPipe = pipe.some((p) => {
                return cellCol >= p.col && cellCol < p.col + pipe_width &&  (cellRow < p.gapStart || cellRow >= p.gapStart + gap_height)
              })

              const isWall = cellRow < wall_height || cellRow >= GRID_HEIGHT - wall_height

              if(block === index) color = "bg-green-500"
              else if(isWall) color = "bg-red-900"
              else if(isPipe) color = "bg-orange-500"

              return <div className={`h-5 w-5 rounded-md ${color}`} key={index}></div>
            })
          }
        </div>
        
      </GameBoard>

      <LeaderBoard />
      
      
    </div>
  )
}

export default FloatingBlock