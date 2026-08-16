import {ArrowRightLeft, User, Users, Gamepad2, Heart, Activity, Settings, LogOut} from 'lucide-react'
import {useNavigate} from 'react-router-dom'

import {useAuth} from '../AuthPages/authContext.jsx'


export function ProfileMenu({ closeMenu }){
  const {user, logout} = useAuth()

  const navigate = useNavigate()

  return (
    <div className="flex flex-col fixed top-18 right-10 p-2 bg-black border border-white/60 rounded-xl z-100">
      <div className="flex gap-4 p-5 items-center">
        
        <div className="flex h-10 w-10 rounded-[50%] border items-center justify-center">T</div>
        
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
          <User className="size-6"/>
          Profile
        </button>

        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/friends"); closeMenu()}}>
          <Users className="size-6"/>
          Friends
        </button>

        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/games"); closeMenu()}}>
          <Gamepad2 className="size-6"/>
          Games
        </button>
      
        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/wishlist"); closeMenu()}}>
          <Heart className="size-6"/>
          Wishlist
        </button>

      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1">
        
        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/activity"); closeMenu()}}>
          <Activity className="size-6"/>
          Activity
        </button>

        <button 
        className="flex w-full gap-2 items-center hover:bg-white/15 rounded-md px-2 cursor-pointer"
        onClick={() => {navigate("/settings"); closeMenu()}}>
          <Settings className="size-6"/>
          Settings
        </button>
      
      </div>

      <div className="flex-1 h-px border-white/30 border" />

      <div className="flex flex-col p-2 items-start gap-1">
        
        <button 
        className="flex w-full gap-2 items-center hover:bg-red-500/20 rounded-md px-2 cursor-pointer"
        onClick={() => logout()}>
          <LogOut className="text-red-500 size-6"/>
          Logout
        </button>
      
      </div>

    </div>
  )
}

export function ProfilePage(){
  return (
    <div>
      
    </div>
  )
}