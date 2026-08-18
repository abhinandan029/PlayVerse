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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={closeDialog}>

          <div 
          className="flex flex-col gap-4 bg-[#0a0a0a] border border-zinc-700 rounded-xl p-6 w-[380px] text-white font-mono"
          onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="font-semibold text-lg">{dialog.title}</span>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed">
              {dialog.description}
            </p>

            <div className="flex gap-3 justify-end pt-2">

              <button
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors font-mono"
              onClick={() => {
                  closeDialog()
                }}>
                No
              </button>
              
              <button 
              className="px-4 py-2 text-sm text-green-400 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-mono"
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

