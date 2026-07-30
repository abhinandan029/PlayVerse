import {useNavigate} from "react-router-dom"

import gameImage from "../assets/gameImage.jpg"

function Body() {
  const navigate = useNavigate();

  const games = ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g10"]


  return (
    <div className="grid grid-cols-5 gap-4 text-white m-2 mt-4">
      {
        games && 
        games.map((game) =>
        {
          return(
            <div key={Math.random()} className="flex flex-col items-center border border-white/30 p-2 rounded-xl">
              <img src={gameImage} className="rounded-xl"></img>
              <p>{game}</p>
              <button className="px-2 bg-white/20 rounded-md cursor-pointer m-2 hover:scale-[1.05] transition-all duration-300 ease-in-out"
              onClick={() => navigate("/game")}>Play</button>
            </div>
          );
        })
      }
    </div>
  );
}

export default Body