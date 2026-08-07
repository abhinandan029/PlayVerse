import {useNavigate} from "react-router-dom"

const images = import.meta.glob("../assets/*.png", { eager: true, import: "default" })

function Body() {
  const navigate = useNavigate();

  const games = ["Snake Game", "Floating Block", "Pac Man"]

  function getImage(game){
    const filename = `../assets/${game.replaceAll(" ", "-")}.png`
    return images[filename] 
  }

  return (
    <div className="grid grid-cols-5 gap-2 text-white m-5 mt-4">
      {
        games && 
        games.map((game, index) =>
        {
          return(
            <div key={index} className="flex flex-col items-center m-2 border border-white/30 p-2 rounded-xl hover:scale-[1.05] transition-all duration-300 ease-in-out">
              <img src={getImage(game)} className="rounded-xl border border-white/30 mb-2"></img>
              <p>{game}</p>
              <button className="px-2 bg-white/20 rounded-md cursor-pointer m-2 hover:scale-[1.05] transition-all duration-300 ease-in-out"
              onClick={() => navigate(`/${game.toLowerCase().replaceAll(" ", "-")}`)}>Play</button>
            </div>
          );
        })
      }
    </div>
  );
}

export default Body