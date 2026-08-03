import {Routes, Route} from 'react-router-dom'

import Header from "./components/Header.jsx"
import Body from "./components/Body.jsx"
import Footer from "./components/Footer.jsx"

import SnakeGame from "./games/snakeGame/snakeGame.jsx"
import FloatingBlock from "./games/floatingBlock/floatingBlock.jsx"
import PacMan from "./games/pacMan/pacMan.jsx"

function App() {

  return (
    <>
      <Header />
      
      <Routes>
        
        <Route path="/home" element={<Body />}/>
        <Route path="/snake-game" element={<SnakeGame />} />
        <Route path="/floating-block" element={<FloatingBlock />} />
        <Route path="/pac-man" element={<PacMan />} />

      </Routes>

    </>
  );
  
}

export default App
