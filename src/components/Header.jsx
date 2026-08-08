import {useNavigate, useLocation} from 'react-router-dom'

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div 
    className="flex gap-2 border-none rounded-xl py-2 px-4 justify-between items-center bg-white/20 m-2 backdrop-blur-xs sticky top-2 left-0 right-0">
      
      <span className="text-[30px] font-mono font-bold text-white">PlayVerse</span>
      
      <div className="flex gap-2 text-white text-[18px]">
        
        <button 
        className={`px-2 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out ${location.pathname === "/home" ? "bg-black/40" : ""}`}
        onClick={() => navigate("/home")}>
          Home
        </button>

        <button 
        className={`px-2 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out ${location.pathname === "/wishlist" ? "bg-black/40" : ""}`}>
          Wishlist
        </button>

        <button 
        className={`px-2 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out ${location.pathname === "/wishlist" ? "bg-black/40" : ""}`}>
          About Us
        </button>

        <button 
        className="px-3 hover:bg-black/80 rounded-md cursor-pointer transition-all duration-300 ease-in-out bg-black py-1"
        onClick={() => navigate("/login")}>
          Login
        </button>


      </div>

    </div>
  );
}

export default Header