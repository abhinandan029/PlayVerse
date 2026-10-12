import {useNavigate, useLocation} from 'react-router-dom'
import{ useState, useRef, useEffect} from 'react'

import { House, Heart, Users, Compass } from 'lucide-react'

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

  const isActive = (path) => location.pathname === path || (path === "/home" && location.pathname === "/")
  const navigationItems = [
    { path: "/home", label: "Home", icon: House },
    { path: "/discover", label: "Discover", icon: Compass },
    ...(user ? [{ path: "/wishlist", label: "Wishlist", icon: Heart }] : []),
    ...(user ? [{ path: "/friends", label: "Friends", icon: Users }] : []),
  ]

  return (
    <div className="sticky top-0 z-888">
      <div className="min-h-18 sm:min-h-20 flex gap-2 py-3 px-4 sm:px-5 justify-between items-center bg-black border border-b-white/40">
      
        <span 
        className="text-3xl sm:text-5xl ml-1 sm:ml-5 font-bold text-green-400 cursor-pointer"
        onClick={() => navigate("/home")}>
          Play<span className="text-red-500">Verse</span>
        </span>
        
        <div className="fixed bottom-3 left-10 right-10 z-888 flex items-center justify-around gap-1 p-2 bg-black/50 border border-white/40 rounded-xl backdrop-blur-sm  text-white text-sm sm:static sm:flex-row sm:gap-10 sm:p-0 sm:border-0 sm:mr-5 sm:text-[18px]">
          
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <button
              className={`group flex h-12 min-w-14 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-left transition-colors duration-200 sm:min-w-0 sm:px-5 ${isActive(path) ? "border border-red-500/60 bg-red-500/10 text-white" : "border border-transparent text-white/60 hover:bg-white/10 hover:text-white"}`}
              key={path}
              onClick={() => navigate(path)}
              aria-label={label}
              title={label}
            >
              <Icon className="size-6 sm:transition-transform sm:duration-200 sm:group-hover:scale-110" />
              <span
                className={`hidden overflow-hidden whitespace-nowrap text-lg font-semibold leading-none sm:block ${isActive(path) ? "pv-nav-label-in max-w-32 opacity-100" : "pv-nav-label-out max-w-0 opacity-0"}`}
              >
                {label}
              </span>
            </button>
          ))}

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

    </div>
  );
}

export default Header