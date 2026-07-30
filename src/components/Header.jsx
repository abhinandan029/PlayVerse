import {useNavigate} from 'react-router-dom'

function Header() {
  const navigate = useNavigate();

  return (
    <div 
    className="flex gap-2 border-none rounded-xl py-2 px-4 justify-between items-center bg-white/20 m-2 backdrop-blur-xs sticky top-2 left-0 right-0">
      
      <span className="text-[30px] font-mono font-bold text-white">PlayVerse</span>
      
      <div className="flex gap-2 text-white text-[18px]">
        
        <button 
        className="px-2 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out"
        onClick={() => navigate("/home")}>Home</button>
        <button className="px-2 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out">Wishlist</button>
        <button className="px-2 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out">About Us</button>
        <button className="px-2 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out">Notifications</button>
        <button className="px-2 hover:bg-black/80 rounded-md cursor-pointer transition-all duration-300 ease-in-out bg-black py-1">Login/Register</button>

      </div>

    </div>
  );
}

export default Header