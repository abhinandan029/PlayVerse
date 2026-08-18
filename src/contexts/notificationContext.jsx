import {createContext, useContext, useState, useCallback, useMemo, useRef} from 'react'
import {createPortal} from 'react-dom'
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
        
      { 
        message &&
          createPortal(<div 
          className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-5 items-center px-4 py-3 text-2xl rounded-lg text-white shadow-lg/20 shadow-white/80 bg-black border border-white/70"
           onClick={(e) => e.stopPropagation()}>
              
            <BellRing className="text-green-400"/>
            <p className="mr-10">{message.body}</p>
              
            <button 
            className="text-red-500 cursor-pointer"
            onClick={() => setMessage(null)}>
              <X className="size-7"/>
            </button>
            
          </div>, document.body
        )

      }

    </NotificationContext.Provider>
  )
}


export function useNotification(){
  return useContext(NotificationContext)
}