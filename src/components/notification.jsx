import {createContext, useContext, useState, useCallback, useMemo, useRef} from 'react'
import {BellRing, X} from 'lucide-react'

const NotificationContext = createContext(null)


export function NotificationProvider({ children }){

  const [message, setMessage] = useState(null)
  const timeRef = useRef(null)
 
  const notify = useCallback( (body, duration = 5000) => {

    if(timeRef.current){
      clearTimeout(timeRef.current)
    }

    setMessage({ body })

    timeRef.current = setTimeout(() => {
      setMessage(null)
      timeRef.current = null
    }, duration)

  }, [])

  const dismiss = useCallback(() => {
    if(timeRef.current){
      clearTimeout(timeRef.current)
      timeRef.current = null
    }
    
    setMessage(null)
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <NotificationContext.Provider value={ value }>
      
      {children}
      
      <div className="fixed top-25 right-5 flex flex-col gap-2 z-999">
        
        {
          message &&
          <div 
          className="flex gap-5 items-center px-4 py-3 text-2xl rounded-lg text-white shadow-lg shadow-white/25 bg-black border border-white/70">
            <BellRing className="text-green-400"/>
            <p className="mr-10">{message.body}</p>
            <button 
            className="text-red-500 cursor-pointer"
            onClick={() => setMessage(null)}>
              <X className="size-7"/>
            </button>
          </div>

        }

      </div>

    </NotificationContext.Provider>
  )
}


export function useNotification(){
  return useContext(NotificationContext)
}