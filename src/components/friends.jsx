import {Users} from "lucide-react"

const TILE_BG = {
  backgroundImage:
    "radial-gradient(circle, hsla(0, 100%, 100%, 0.2) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

function Friends(){

  return (
    <div className="text-white" style={TILE_BG}>

      <div className="flex items-center gap-4 px-5 sm:px-10 pt-8 sm:pt-10">
        <Users className="text-red-500 size-8 sm:size-10 fill-red-500" />
        <h1 className="text-4xl sm:text-5xl">Your Friends List</h1>
      </div>

      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Users className="size-16 text-white/30" />
        <p className="text-white/50 text-xl">You dont have any friends...</p>
        <button className="border px-4 py-2 rounded-md border-green-400 bg-green-400/10 cursor-pointer">
          Add Friends
        </button>
      </div>

    </div>
  )
}

export default Friends