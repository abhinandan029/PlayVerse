import{ useState, useEffect, useRef } from 'react'

import GameBoard from "../UI/GameBoard.jsx"

const GAME_NAME = "Snake Game"
const GRID_WIDTH = 45
const GRID_HEIGHT = 35
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

const DIRS = {ArrowRight : 1, ArrowLeft : -1, ArrowUp: -GRID_WIDTH , ArrowDown : GRID_WIDTH}

function PacMan(){

  const mazeCols = Math.floor((GRID_WIDTH - 1)/ 2)
  const mazeRows = Math.floor((GRID_HEIGHT - 1)/2)

  const [walls] = useState(() => buildMaze())

  const toRenderedIndex = (row, col) => {return (row*2 +1) * GRID_WIDTH + (col*2 + 1)}

  const playerStart = toRenderedIndex(0, 0)
  const ghostStart = toRenderedIndex(mazeRows - 1, mazeCols - 1)

  const [player, setPlayer] = useState(playerStart)
  const [ghost, setGhost] = useState(ghostStart)

  const [playing, setPlaying] = useState(true)
  const [gameOver, setGameOver] = useState(false)

  const playerRef = useRef(playerStart)
  const ghostRef = useRef(ghostStart)

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

    function toRenderedGrid(row, col){
      const renderedRow = row*2 + 1
      const renderedCol = col*2 + 1
      return renderedRow*GRID_WIDTH + renderedCol
    }

    const startRow = 0 
    const startCol = 0

    const stack = [{row: startRow, col: startCol}]

    visited.add(logicalKey(startRow, startCol))
    walls.delete(toRenderedGrid(startRow, startCol))

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

      walls.delete(toRenderedGrid(next.row, next.col))
      visited.add(logicalKey(next.row, next.col))
      stack.push(next)
    }

    return walls
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
      } 
      setPlayer(playerRef.current)

      const step = ghostChaseAlgo(ghostRef.current, playerRef.current, walls)
      if(step !== null) ghostRef.current = step
      setGhost(ghostRef.current)

      if(playerRef.current === ghostRef.current){
        setGameOver(true)
        setPlaying(false)
      }

    }, 200)

    return () => clearInterval(id)

  }, [playing, gameOver, walls])

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

  return (
    <div className="flex">
      <GameBoard >
        <div 
          className="grid grid-cols-45 gap-0.5 p-1 py-2 bg-white/10 rounded-md"
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}>
          {
            Array.from({ length : GRID_SIZE}).map((cell, index) => {
              let color = "bg-yellow-200 rounded-xl h-2 w-2 self-center justify-self-center"

              if(walls.has(index)) color = "bg-red-700 h-5 w-5"
              else if(index === player) color = "bg-green-500 h-5 w-5 rounded-xl"
              else if(index === ghost) color = "bg-orange-500 h-5 w-5 rounded-t-xl rounded-b-none"

              return <div className={`rounded-md ${color}`} key={index}></div>
            })
          }
        </div>
      </GameBoard>
    </div>
  )
} 

export default PacMan