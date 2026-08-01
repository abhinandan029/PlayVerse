
function Buttons({setPlaying, playing, gameOver, restart}){

  console.log(playing);
  return(
    <div className="flex flex-col w-full m-2 p-5 rounded-md items-center justify-center">
      {
        gameOver === false && 
        playing === true ? 
        
        <button 
        className="text-black text-[20px] px-4 rounded-md bg-blue-500 cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out focus:outline-none"
        onClick={() => setPlaying(false)}>
          Pause
        </button> :

        <button 
        className="text-black text-[20px] px-4 rounded-md bg-green-500 cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out focus:outline-none"
        onClick={() => setPlaying(true)}>
          Play
        </button>
      }

      {
        gameOver === true &&

        <>
          <p className="text-red-500 text-[50px]">Game Over</p>
          
          <button 
          className="text-black text-[20px] px-4 rounded-md bg-red-700 cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out focus:outline-none"
          onClick={() => restart()}>
            Restart
          </button>

        </>
        
      }
      
    </div>
  )
}

export default Buttons