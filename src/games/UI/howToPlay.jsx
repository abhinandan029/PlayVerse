import {ArrowUp, ArrowDown, ArrowLeft, ArrowRight} from 'lucide-react'

export default function HowToPlay({htp}){
  return(
    <div className="flex flex-col items-center w-[calc(100%-2rem)] max-w-6xl mx-auto my-8 sm:my-12 px-4 sm:px-8 py-5 sm:py-8 text-white border border-white/40 rounded-xl bg-black">

      
      <p className="text-4xl sm:text-6xl text-green-400 text-center">How To Play?</p>

      <ul className="w-full list-decimal text-white text-base sm:text-2xl pl-6 sm:pl-10 pr-1 sm:pr-2 py-4 sm:py-6">
        {
          htp.map((rule, i) => {
            return <li key={i} className="py-3 px-3 sm:px-4 my-3 sm:my-4 border border-white/20 rounded-xl leading-relaxed wrap-break-word">{rule}</li>
          })
        }

      </ul>

    </div>
  )
}