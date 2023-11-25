import * as React from 'react'
import { SelectProductsModal } from './SelectProductsModal'
import { Product } from 'src/types'

export interface IChatInputProps {
  inputMessage: string
  setInputMessage: (inputMessage: string) => void
  handleSendMessage: () => void
  disabled: boolean
}

export function ChatInput (props: IChatInputProps) {
  const { inputMessage, setInputMessage, handleSendMessage, disabled } = props

  return (
    <div className="flex justify-between h-16 pt-2 pb-4 pr-4">
      <div className="relative flex flex-grow" style={{ minHeight: '40px' }}>
        <textarea
          autoFocus
          placeholder="Aa"
          className="absolute flex flex-grow h-10 p-2 overflow-hidden leading-tight transition-all duration-300 border-2 border-gray-300 rounded-lg resize-none placeholder:leading-tight"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          style={{
            left: inputMessage.length > 0 ? '0rem' : '3rem',
            right: '0',
            bottom: 0
          }}
        />
      </div>

      <button
        className={`ml-4 rounded-lg bg-chat-blue px-4 py-2 font-bold text-white ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        onClick={handleSendMessage}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  )
}
