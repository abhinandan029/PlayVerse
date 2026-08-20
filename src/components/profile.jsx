import {ArrowRightLeft, User, Users, Gamepad2, Heart, Activity, Settings, LogOut} from 'lucide-react'
import {useNavigate} from 'react-router-dom'

import {useAuth} from '../contexts/authContext.jsx'
import {useDialog} from '../contexts/dialogContext.jsx'

import image from '../assets/Pac-Man.png'


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

  const games = ["game1", "game2", "game3", "game4", "game5"]

  return (
    <div className="flex gap-10 border justify-center p-10 border-white text-white"> 
      
      <div className="flex flex-col basis-1/4">

        <img src={image} className="rounded-[50%] h-auto w-full border " height="260px" width="260px"/>

        <div className="flex flex-col flex-1 justify-center p-4">
          <p className="text-4xl font-bold">Abhinandan Manakapure</p>
          <p className="text-2xl text-white/70">Abhinanda2903</p>
          <p className="py-5 text-xl text-wrap">hello guys my name is abhiandan this my web page </p>
          <p className="text-xl">{user.email}</p>
          <p className="text-xl">location</p>
        </div>

      </div>
      
      <div className="basis-1/4 border border-white">
      
        <div className="grid grid-cols-2 p-2 gap-2">
          {
            games.map((game, i) => {
              return (
                <div key={i} className="text-center border">{game}</div>
              )
            })
          }
        </div>

        <div>
          activity
        </div>

      </div>
    
    </div>
  )
}