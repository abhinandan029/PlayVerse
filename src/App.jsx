import { Routes, Route} from 'react-router-dom'

import ScrollToTop from './components/ScrollToTop.jsx'
import Header from "./components/Header.jsx"
import Body from "./components/Body.jsx"
import Footer from "./components/Footer.jsx"

import Login from './AuthPages/login.jsx'
import Register from './AuthPages/register.jsx'

import SnakeGame from "./games/snakeGame/snakeGame.jsx"
import FloatingBlock from "./games/floatingBlock/floatingBlock.jsx"
import PacMan from "./games/pacMan/pacMan.jsx"

function App() {

  return (
    <>
      <ScrollToTop />
      <Header />
      
      <Routes>
        
        <Route path="/" element={<Body />} />
        <Route path="/home" element={<Body />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route path="/snake-game" element={<SnakeGame />} />
        <Route path="/floating-block" element={<FloatingBlock />} />
        <Route path="/pac-man" element={<PacMan />} />

      </Routes>
      
      <Footer />

    </>
  );
  
}

export default App
