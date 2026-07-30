
function Buttons({setPlaying, playing, gameOver, restart}){

  console.log(playing);
  return(
    <div className="border border-white flex flex-col w-full m-2 p-2 rounded-md">
      {
        playing === true ? 
        
        <button 
        className="text-white border border-white"
        onClick={() => setPlaying(false)}>
          Pause
        </button> :

        <button 
        className="text-white border border-white"
        onClick={() => setPlaying(true)}>
          Play
        </button>
      }

      {
        gameOver === true &&

        <button 
        className="text-white border border-white"
        onClick={() => restart()}>Restart</button>
      }
      
    </div>
  )
}

export default Buttons