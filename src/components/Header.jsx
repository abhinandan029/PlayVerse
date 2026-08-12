import {useNavigate, useLocation} from 'react-router-dom'

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div 
    className="flex gap-2 py-5 px-5 justify-between items-center bg-black border border-y-white/40 sticky top-0 left-0 right-0"
    style={TILE_BG}>
      
      <span className="text-5xl md:text-5xl ml-5 font-bold text-green-400">Play<span className="text-red-500">Verse</span></span>
      
      <div className="flex gap-10 text-white text-[18px] mr-5">
        
        <button 
        className={`px-4 rounded-md cursor-pointer ${location.pathname === "/home" ? "border border-red-500/60" : ""}`}
        onClick={() => navigate("/home")}>
          Home
        </button>

        <button 
        className={`px-4 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out ${location.pathname === "/wishlist" ? "border border-red-500/60" : ""}`}>
          Wishlist
        </button>

        <button 
        className={`px-4 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-300 ease-in-out ${location.pathname === "/wishlist" ? "border border-red-500/60" : ""}`}>
          About Us
        </button>

        <button 
        className="px-4 py-1 rounded-md cursor-pointer transition-all duration-300 ease-in-out border border-green-400/60 text-green-400"
        onClick={() => navigate("/login")}>
          Login
        </button>


      </div>

    </div>
  );
}

export default Header