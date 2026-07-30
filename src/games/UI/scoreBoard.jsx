
function ScoreBoard({score}){
  return (
    <div className="w-full items-center flex flex-col">
      <p className="text-[100px] text-white font-mono">{score}</p>
    </div>
  );
}

export default ScoreBoard