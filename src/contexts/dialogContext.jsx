import {createContext, useContext, useState, useCallback, useMemo, useEffect} from 'react'
import {createPortal} from 'react-dom'

const DialogContext = createContext(null)

export function DialogProvider({ children }){

  const [dialog, setDialog] = useState(null)

  const openDialog = useCallback((title, description, onConfirm) => {
    setDialog({title, description, onConfirm})
  }, [])

  const closeDialog = useCallback(() => {
    setDialog(null)
  }, [])

  useEffect(() => {
    document.body.style.overflow = dialog ? 'hidden' : ''
    return () => document.body.style.overflow = ''
  }, [dialog])

  const value = useMemo(() => ({ openDialog, closeDialog }), [openDialog, closeDialog])


return (
  <DialogContext.Provider value={ value }>
    { children }

    { dialog && 
      createPortal(
        <div 
        className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 test-xl"
        onClick={closeDialog}>

          <div 
          className="flex flex-col gap-4 bg-black border border-white/50 rounded-xl w-150 text-white"
          onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center gap-2 w-full p-4 bg-white/10">
              <span className="h-3 w-3 rounded-full bg-red-500"></span>
              <span className="font-semibold text-xl">{dialog.title}</span>
            </div>

            <p className="text-white text-xl leading-relaxed px-4">
              {dialog.description}
            </p>

            <div className="flex gap-3 justify-end p-4">

              <button
              className="px-4 py-2 text-xl text-red-500 border border-red-500/50 hover:bg-red-500/15 rounded-lg cursor-pointer"
              onClick={() => {
                  closeDialog()
                }}>
                No
              </button>
              
              <button 
              className="px-4 py-2 text-xl text-green-400 border border-green-400/50 rounded-lg hover:bg-green-400/15 hover:text-green-400 transition-colors cursor-pointer"
              onClick={() => {
                  dialog.onConfirm?.()
                  closeDialog()
                }}>
                Yes
              </button>

            </div>

          </div>

        </div>, document.body
      )
    }
  </DialogContext.Provider>
)
}

export function useDialog(){
  return useContext(DialogContext);
}

