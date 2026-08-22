import {ArrowRightLeft, User, Users, Gamepad2, Heart, Activity, Settings, LogOut} from 'lucide-react'
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import {useAuth} from '../contexts/authContext.jsx'
import {useDialog} from '../contexts/dialogContext.jsx'
import {useWishlist} from "../contexts/wishlistContext.jsx"

const images = import.meta.glob("../assets/*.png", { eager: true, import: "default" })

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function getImage(game) {
  const filename = `../assets/${game.replaceAll(" ", "-")}.png`
  return images[filename]
}

export function ProfileMenu({ closeMenu }){
  const {user, logout} = useAuth()
  const {openDialog} = useDialog()

  const navigate = useNavigate()

  return (
    <div className="flex flex-col fixed top-18 right-10 bg-black border border-white/60 rounded-xl z-100" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-4 p-5 items-center">
        
        <div className="flex px-3 py-1 rounded-md border items-center justify-center">{user.email[0]}</div>
        
        <div className="flex flex-col">
          <p className="">testName</p>
          <p className="text-sm text-white/50">{user.email}</p>
        </div>

        <button className="ml-10 cursor-pointer"><ArrowRightLeft  className="text-green-400 size-5"/></button>
      
      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1"> 

        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() =>{navigate("/profile"); closeMenu()}}>
          <User className="size-6 text-green-400 fill-green-400"/>
          Profile
        </button>

        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/friends"); closeMenu()}}>
          <Users className="size-6 text-green-400 fill-green-400"/>
          Friends
        </button>

        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/games"); closeMenu()}}>
          <Gamepad2 className="size-6 text-green-400"/>
          Games
        </button>
      
        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/wishlist"); closeMenu()}}>
          <Heart className="size-6 text-green-400 fill-green-400"/>
          Wishlist
        </button>

      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1">
        
        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/activity"); closeMenu()}}>
          <Activity className="size-6 text-green-400"/>
          Activity
        </button>

        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/settings"); closeMenu()}}>
          <Settings className="size-6 text-green-400"/>
          Settings
        </button>
      
      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1">
        
        <button 
        className="flex w-full gap-2 items-center hover:bg-red-500/20 rounded-md px-2 cursor-pointer"
        onClick={() => { openDialog("Confirm", "Do you want to Logout?", logout); closeMenu() }}>
          <LogOut className="text-red-500 size-6"/>
          Logout
        </button>
      
      </div>

    </div>
  )
}

export function ProfilePage(){

  const {user, logout} = useAuth()
  const [allGames, setAllGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(true)
  const { wishlistId, toggleWishlist, loading: wishlistLoading } = useWishlist()

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch('/api/games/fetch-games', {
          method: 'GET',
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          setAllGames(data.games)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingGames(false)
      }
    }

    fetchGames()

  }, [])

  const loading = wishlistLoading || loadingGames
  const wishlistedGames = allGames.filter(game => wishlistId.has(game.id))

  return (
    <div className="flex gap-10 justify-center p-10 text-white" style={TILE_BG}> 
      
      <div className="flex flex-col basis-1/4">

        <img src={getImage("Snake Game")} className="rounded-[50%] h-auto w-full border " height="260px" width="260px"/>

        <div className="flex flex-col flex-1 justify-center p-4">
          <p className="text-4xl font-bold">Abhinandan Manakapure</p>
          <p className="text-2xl text-white/70">Abhinanda2903</p>
          <p className="py-5 text-xl text-wrap">hello guys my name is abhiandan this my web page </p>
          <p className="text-xl">{user.email}</p>
          <p className="text-xl">location</p>
        </div>

      </div>
      
      <div className="p-5">

        <div className="flex items-center gap-4 px-10 py-4 border-y border-white/30 bg-black">
          <Heart className="text-red-500 size-10 fill-red-500" />
          <h1 className="text-3xl">Your Wishlist</h1>
        </div>
      
        {loading ? (
          <p className="text-center mt-20 text-white/50 text-xl">Loading your wishlist...</p>
          ) : wishlistedGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <Gamepad2 className="size-16 text-white/30" />
              <p className="text-white/50 text-xl">Your wishlist is empty.</p>
              <button
              className="px-4 py-2 rounded-md border border-green-400/60 bg-green-400/20 cursor-pointer"
              onClick={() => navigate('/home')}>
                Browse Games
              </button>
          </div>
          ) : (
          <div className="grid grid-cols-1 m-5">
            {wishlistedGames.map((game) => (
              <div key={game.id} className="flex group m-4 border border-white/30 rounded-xl bg-black">
                <div className="relative">
                  <img src={getImage(game.name)} height="300px" width="300px" className="rounded-l-xl group-hover:opacity-40" alt={game.name} />
                  <button
                  className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100"
                  onClick={() => toggleWishlist(game.id)}>
                    <Heart className="size-10 text-red-500 fill-red-500" />
                  </button>
                </div>
          
                <div className="flex flex-col w-full justify-start p-4 border border-white/30">
              
                  <p className="text-2xl">{game.name}</p>
                  <p className="text-xl text-white/30 self-start">classic</p>

                  <button
                  className="px-2 text-xl bg-white/10 rounded-md border border-white/40 cursor-pointer m-2 mt-auto"
                  onClick={() => navigate(`/${game.name.toLowerCase().replaceAll(" ", "-")}`)}>
                    Play
                  </button>
               
                </div>
              </div>
            ))}
          </div>
        )}
    

        <div>
          activity
        </div>

      </div>
    
    </div>
  )
}