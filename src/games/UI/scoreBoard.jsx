
function ScoreBoard({score, name}){
  return (
    <div className="w-full items-center flex flex-col p-5">
      <p className="text-orange-600 text-[40px] font-mono">{name}</p>

      <p className="mb-0 text-white">Score :</p>
      <p className="text-[100px] text-green-700 font-mono mt-1 border border-white px-4 py-0 rounded-xl bg-black">{score}</p>
    </div>
  );
}

export default ScoreBoard