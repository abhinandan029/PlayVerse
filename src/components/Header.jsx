import {useNavigate, useLocation} from 'react-router-dom'
import{ useState, useRef, useEffect} from 'react'
import {SquareUserRound} from 'lucide-react'

import {useAuth} from '../AuthPages/authContext.jsx'
import {ProfileMenu} from './profile.jsx'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const {user, loading, logout} = useAuth()

  const [profile, setProfile] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(e){
      if(profileRef.current && !profileRef.current.contains(e.target)){
        setProfile(false)
      }
    }

    if(profile){
      document.addEventListener('click', handleOutsideClick)
    }

    return () => document.removeEventListener('click', handleOutsideClick)
  }, [profile])

  return (
    <div 
    className="flex gap-2 py-5 px-5 justify-between items-center bg-black border border-b-white/40 fixed top-0 left-0 right-0">
      
      <span 
      className="text-5xl md:text-5xl ml-5 font-bold text-green-400 cursor-pointer"
      onClick={() => navigate("/home")}>
        Play<span className="text-red-500">Verse</span>
      </span>
      
      <div className="flex gap-10 text-white text-[18px] mr-5">
        
        <button 
        className={`px-4 rounded-md cursor-pointer ${location.pathname === "/home" || location.pathname === "/" ? "border border-red-500/60 bg-red-500/10" : ""}`}
        onClick={() => navigate("/home")}>
          Home
        </button>

        { user && 
          <button 
          className={`px-4 hover:bg-black/40 rounded-md cursor-pointer  ${location.pathname === "/wishlist" ? "border border-red-500/60 bg-red-500/10" : ""}`}>
            Wishlist
          </button> 
        }

        <button 
        className={`px-4 hover:bg-black/40 rounded-md cursor-pointer ${location.pathname === "/about-us" ? "border border-red-500/60 bg-red-500/20" : ""}`}>
          About Us
        </button>

        {
          user && !loading ? 
          
          <div ref={profileRef}>
            <button className="flex items-center text-green-400 cursor-pointer" 
            onClick={() => setProfile(prev => !prev)}>
              <SquareUserRound className="size-10" />
            </button>
            {profile && <ProfileMenu closeMenu={() => setProfile(false)} />}
          </div> : 

          <button 
          className="px-4 py-1 rounded-md cursor-pointer border border-green-400/60 text-white bg-green-400/20"
          onClick={() => navigate("/login")}>
            Login
          </button>

        }
        


      </div>

    </div>
  );
}

export default Header