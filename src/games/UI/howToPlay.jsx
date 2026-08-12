import {ArrowUp, ArrowDown, ArrowLeft, ArrowRight} from 'lucide-react'

export default function HowToPlay({htp}){
  return(
    <div className="flex flex-col items-center mx-50 px-10 py-5 text-white border border-white/40 rounded-xl bg-black">

      
      <p className="text-6xl text-green-400">How To Play?</p>

      <ul className="list-decimal text-white text-2xl p-10 ">
        {
          htp.map((rule, i) => {
            return <li key={i} className="py-2 px-4 my-4 border border-white/20 rounded-xl">{rule}</li>
          })
        }

      </ul>

    </div>
  )
}