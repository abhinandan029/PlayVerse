import{ useState, useEffect, useRef } from 'react'

import GameDesc from '../UI/gameDesc.jsx'
import GameBoard from "../UI/GameBoard.jsx"
import HowToPlay from '../UI/howToPlay.jsx'
import LeaderBoard from "../UI/leaderBoard.jsx"

const GAME_NAME = "Pac Man"
const GAME_TYPE = "Action Maze Chase"
const DESC = "Pac-Man is an action maze chase game, the player controls the circular green character called Pack-Man through an enclosed maze. The objective of the game is to eat all of the dots placed in the maze while avoiding four white ghosts. When Pac-Man eats all of the dots you win, If Pac-Man is caught by a ghost you lose. Inspired by Pac-Man 1980"

const HTP = [
  "Once you click play button the Pac-Man starts moving.",
  "To control the direction of motion of Pac-Man use arrow keys. ⬅️⬆️⬇️➡️",
  "Score is calculated on the number of yellow dots eaten.",
  "You should avoid colliding with the white ghosts, if you do then game is over",
  "If you eat all the yellow dots then you win the game"
]

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

const GRID_WIDTH = 45
const GRID_HEIGHT = 35
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

const DIRS = {ArrowRight : 1, ArrowLeft : -1, ArrowUp: -GRID_WIDTH , ArrowDown : GRID_WIDTH}

function PacMan(){

  const gameRef = useRef(null)

  const mazeCols = Math.floor((GRID_WIDTH - 1)/ 2)
  const mazeRows = Math.floor((GRID_HEIGHT - 1)/2)

  const toRenderedIndex = (row, col) => {return (row*2 +1) * GRID_WIDTH + (col*2 + 1)}

  const [walls] = useState(() => braidMaze(buildMaze(), 0.3))

  const playerStart = 788
  const ghostsStart = [
    toRenderedIndex(0, 0),
    toRenderedIndex(mazeRows - 1, mazeCols - 1), 
    toRenderedIndex(0, mazeCols- 1),
    toRenderedIndex(mazeRows - 1, 0)
  ]
  
  const [ghosts, setGhosts] = useState(ghostsStart)
  const ghostsRef = useRef(ghostsStart)
  const ghostSpeedRef = useRef(0)

  const [player, setPlayer] = useState(playerStart)
  const playerRef = useRef(playerStart)

  const [pellets, setPellets] = useState(() =>
    buildPellets(walls, [playerStart, ...ghostsStart])
  )

  const [score, setScore] = useState(0)

  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const queuedDirRef = useRef(1)
  const currentDirRef = useRef(1)

  function buildMaze(){
    const walls = new Set()

    for (let i = 0 ; i < GRID_SIZE ; i++){
      walls.add(i)
    }

    const visited = new Set()

    function logicalKey(row, col){
      return row*mazeCols + col
    }

    const startRow = 0 
    const startCol = 0

    const stack = [{row: startRow, col: startCol}]

    visited.add(logicalKey(startRow, startCol))
    walls.delete(toRenderedIndex(startRow, startCol))

    while(stack.length > 0){
      const {row, col} = stack[stack.length - 1]
      
      const neighbors = [
        {row : row - 1, col : col},
        {row : row + 1, col : col},
        {row : row, col : col - 1},
        {row : row, col : col +1}
      ].filter(({row : r, col : c}) => {
        return r >= 0 && r < mazeRows && c >= 0 && c < mazeCols && !visited.has(logicalKey(r, c))
      })

      if(neighbors.length === 0) {
        stack.pop()
        continue
      }

      const next = neighbors[Math.floor(Math.random() * neighbors.length)]

      const wallRow = (row + next.row) + 1
      const wallCol = (col + next.col) + 1
      const wallIndex = wallRow * GRID_WIDTH + wallCol
      walls.delete(wallIndex)


      walls.delete(toRenderedIndex(next.row, next.col))   
      visited.add(logicalKey(next.row, next.col))          
      stack.push(next)  

    }

    return walls
  }

  function braidMaze(walls, braidChance = 0.3){
    for(let row = 0; row < mazeRows; row++){
      for(let col = 0; col < mazeCols; col++){

        const rightWallRow = row * 2 + 1
        const rightWallCol = col * 2 + 2
        const rightWallIndex = rightWallRow * GRID_WIDTH + rightWallCol

        const downWallRow = row * 2 + 2
        const downWallCol = col * 2 + 1
        const downWallIndex = downWallRow * GRID_WIDTH + downWallCol

        if(col < mazeCols - 1 && walls.has(rightWallIndex) && Math.random() < braidChance){
          walls.delete(rightWallIndex)
        }

        if(row < mazeRows - 1 && walls.has(downWallIndex) && Math.random() < braidChance){
          walls.delete(downWallIndex)
        }

      }
    }

    return walls
  }


  function buildPellets(walls, excludeCells){
    const pellets = new Set()
    for(let i = 0 ; i < GRID_SIZE ; i++){
      if(!walls.has(i) && !excludeCells.includes(i)) pellets.add(i)
    }

    return pellets
  }

  function canMove(pos, dir, walls){
    const next = pos + dir
    if( next < 0 || next >= GRID_SIZE ) return false

    const col = pos % GRID_WIDTH
    if(dir === 1 && col === GRID_WIDTH - 1) return false
    if(dir === -1 && col === 0) return false

    return !walls.has(next)
  }

  function ghostChaseAlgo(start, target, walls){
    if(start === target) return null
    
    const visited = new Set([start])
    const queue = [start]
    const cameFrom = new Map()

    let qi = 0

    while (qi < queue.length){
      const current = queue[qi++]
      if(current === target) break

      const col = current % GRID_WIDTH
      const deltas = [GRID_WIDTH, -GRID_WIDTH]

      if(col > 0) deltas.push(-1)
      if(col < GRID_WIDTH - 1) deltas.push(1)

      for(const d of deltas){
        const next = current + d
        if (next < 0 || next >= GRID_SIZE) continue
        if (walls.has(next)) continue
        if (visited.has(next)) continue
        visited.add(next)
        cameFrom.set(next, current)
        queue.push(next)
      }
    }

    if( !cameFrom.has(target)) return null

    let step = target
    while(cameFrom.get(step) !== start){
      step = cameFrom.get(step)
    }

    return step

  }

  useEffect(() => {
    if(!playing || gameOver) return

    const id = setInterval(() => {
      
      let dir = queuedDirRef.current
      if(!canMove(playerRef.current, dir, walls)) dir = currentDirRef.current
      if(canMove(playerRef.current, dir, walls)){
        currentDirRef.current = dir
        playerRef.current = playerRef.current + dir

        if(pellets.has(playerRef.current)){
          setPellets((prev) => {
            const next = new Set(prev)
            next.delete(playerRef.current)
            if(next.size === 0){
              setGameWon(true)
              setPlaying(false)
            }
            return next
          })

          setScore((s) => s + 1)
        }
      } 
      setPlayer(playerRef.current)

      const occupiedTick = new Set() 

      ghostSpeedRef.current++

      if(ghostSpeedRef.current % 2 === 0){
        
        const ghostsPosition = ghostsRef.current.map((gPos) => {
          const step = ghostChaseAlgo(gPos, playerRef.current, walls)
          const proposed = step !== null ? step : gPos

          if(occupiedTick.has(proposed)){
            occupiedTick.add(gPos)
            return gPos
          }

          occupiedTick.add(proposed)
          return proposed

        })
        ghostsRef.current = ghostsPosition
        setGhosts(ghostsPosition)

        if(ghostsPosition.some((g) => g === playerRef.current)){
          setGameOver(true)
          setPlaying(false)
        }
      }
      

    }, 200)

    return () => clearInterval(id)

  }, [playing, gameOver, gameWon, walls, pellets])

  useEffect(() => {
    const handleKey = (e) => {
      if( DIRS[e.key] !== undefined){
        e.preventDefault()

        if(!gameOver && !playing) setPlaying(true)
        queuedDirRef.current = DIRS[e.key]
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [playing, gameOver])

  function restartGame(){
    playerRef.current = playerStart
    ghostsRef.current = ghostsStart
    queuedDirRef.cureent = 1
    currentDirRef.current = 1

    setPlaying(false)
    setPlayer(playerStart)
    setGhosts(ghostsStart)
    setPellets(buildPellets(walls, [playerStart, ...ghostsStart]))
    setScore(0)
    setGameOver(false)
    setGameWon(false)
  }

  function focus(){
    gameRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" })
  }

  return (
    <div className="flex flex-col" style={TILE_BG}>
      
      <GameDesc gameName={GAME_NAME} gameType={GAME_TYPE} description={DESC} focus={focus}/>
      <HowToPlay htp={HTP}/>

      <GameBoard score={score} setPlaying={setPlaying} playing={playing} gameOver={gameOver} restart={restartGame} ref={gameRef} focus={focus}>
        <div 
          className="grid grid-cols-45 gap-1 p-1 py-2 bg-black rounded-md border border-white/40"
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}>
          {
            Array.from({ length : GRID_SIZE}).map((cell, index) => {
              let color = "bg-black"

              const ghostIndex = ghosts.indexOf(index)

              if(walls.has(index)) color = "bg-red-900 h-5 w-5"
              else if(ghostIndex !== -1) color = `bg-white h-5 w-5 rounded-t-xl rounded-b-none`
              else if(index === player) color = `bg-green-500 h-5 w-5 rounded-xl`
              else if(pellets.has(index)) color = "bg-yellow-400 rounded-xl h-2 w-2 self-center justify-self-center"

              return <div className={`rounded-md ${color}`} key={index}></div>
            })
          }
        </div>
      </GameBoard>

      <LeaderBoard />

    </div>
  )
} 

export default PacMan