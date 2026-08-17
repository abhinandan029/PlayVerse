import { useLocation, Routes, Route} from 'react-router-dom'

import ScrollToTop from './components/ScrollToTop.jsx'
import Header from "./components/Header.jsx"
import Body from "./components/Body.jsx"
import Footer from "./components/Footer.jsx"
import ProtectedRoute from "./components/protectedRoutes.jsx"
import {ProfilePage} from "./components/profile.jsx"

import Login from './AuthPages/login.jsx'
import Register from './AuthPages/register.jsx'
import {AuthProvider} from './contexts/authContext.jsx'

import SnakeGame from "./games/snakeGame/snakeGame.jsx"
import FloatingBlock from "./games/floatingBlock/floatingBlock.jsx"
import PacMan from "./games/pacMan/pacMan.jsx"

function App() {

  const location = useLocation()

  return (
    <AuthProvider>
      { location.pathname === "/login" || location.pathname === "/register" ?
        <> 
          <Routes >
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </> :
        <>
          <ScrollToTop />

          <div 
            className="fixed top-0 left-0 w-full h-1 bg-red-500 origin-left z-50"
            style={{ 
              animation: 'grow-progress auto linear',
              animationTimeline: 'scroll(root block)' 
              } }
          />

          <Header />
      
          <Routes>
        
            <Route path="/" element={<Body />} />
            <Route path="/home" element={<Body />}/>

            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/snake-game" element={<SnakeGame />} />
            <Route path="/floating-block" element={<FloatingBlock />} />
            <Route path="/pac-man" element={<PacMan />} />

          </Routes>
      
          <Footer />
      
        </>
      }

    </AuthProvider>
  );
  
}

export default App
