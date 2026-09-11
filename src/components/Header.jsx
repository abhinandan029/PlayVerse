import {useNavigate, useLocation} from 'react-router-dom'
import{ useState, useRef, useEffect} from 'react'
import {Menu, X} from 'lucide-react'

import {useAuth} from '../contexts/authContext.jsx'
import {ProfileMenu} from './profile.jsx'

const avatars = import.meta.glob("../assets/avatars/*.svg", { eager: true, import: "default" })

function getAvatar(avatarName) {
  const filename = `../assets/avatars/${avatarName}.svg`
  return avatars[filename]
}

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
  const [menuOpen, setMenuOpen] = useState(false)
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
    <div className="flex gap-2 py-4 px-4 sm:px-5 justify-between items-center bg-black border border-b-white/40 sticky top-0 left-0 right-0 z-888">
      
      <span 
      className="text-3xl sm:text-5xl ml-1 sm:ml-5 font-bold text-green-400 cursor-pointer"
      onClick={() => navigate("/home")}>
        Play<span className="text-red-500">Verse</span>
      </span>
      
      <button
        className="sm:hidden text-white p-2 cursor-pointer"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen(prev => !prev)}>
        {menuOpen ? <X /> : <Menu />}
      </button>

      <div className={`${menuOpen ? "flex" : "hidden"} absolute top-full left-0 right-0 flex-col gap-2 p-4 bg-black border-b border-white/40 text-white text-[18px] sm:static sm:flex sm:flex-row sm:items-center sm:gap-10 sm:p-0 sm:border-0 mr-0 sm:mr-5`}>
        
        <button 
        className={`px-4 py-2 text-left rounded-md hover:bg-black/40 cursor-pointer ${location.pathname === "/home" || location.pathname === "/" ? "border border-red-500/60 bg-red-500/10" : ""}`}
        onClick={() => navigate("/home")}>
          Home
        </button>

        { user && 
          <button 
          className={`px-4 py-2 text-left hover:bg-black/40 rounded-md cursor-pointer  ${location.pathname === "/wishlist" ? "border border-red-500/60 bg-red-500/10" : ""}`}
          onClick={() => navigate("/wishlist")}>
            Wishlist
          </button> 
        }

        <button 
        className={`px-4 py-2 text-left hover:bg-black/40 rounded-md cursor-pointer ${location.pathname === "/about" ? "border border-red-500/60 bg-red-500/10" : ""}`}
        onClick={() => navigate("/about")}>
          About
        </button>

        {
          user && !loading ? 
          
          <div ref={profileRef}>
            <button className="flex items-center cursor-pointer px-4 py-2" 
            onClick={() => setProfile(prev => !prev)}>
              <img
              src={getAvatar(user.avatar || 'cat')}
              className="size-10 rounded-full border border-green-400"
              alt="avatar"
              />
            </button>
            {profile && <ProfileMenu closeMenu={() => setProfile(false)} />}
          </div> : 

          <button 
          className="px-4 py-2 text-left rounded-md cursor-pointer border border-green-400/60 text-white bg-green-400/20"
          onClick={() => navigate("/login")}>
            Login
          </button>

        }
        


      </div>

    </div>
  );
}

export default Header