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
    <div className="flex flex-col">

      <div className=" text-white m-5 mt-4 p-2 border flex">
        <div className="flex flex-col">
          <h1 className="text-[50px]">What is PlayVerse ?</h1>
          
        </div>
        
        {/* <div
          className="grid grid-cols-21 gap-0.5 p-1 py-2 bg-white/10 rounded-md ml-auto"
          style={{ gridTemplateColumns: `repeat(21, minmax(0, 1fr))` }}>
          {
            Array.from({ length : 210}).map((cell, index) => {
              let color = "bg-black"

              if(index % 2 === 0 ) color = "bg-white"

              return <div className={`h-5 w-5 rounded-md ${color}`} key={index}></div>
            })
          }
        </div> */}
       
      </div>

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
      
    </div>
  );
}

export default Body