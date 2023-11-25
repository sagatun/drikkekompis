import React, { useState, useEffect } from 'react'

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

// A debounced input react component
export function DebouncedInput ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => { clearTimeout(timeout) }
  }, [value, debounce, onChange])

  return (
    <input
      {...props}
      value={value}
      className="w-full px-4 py-2 mt-12 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      onChange={(e) => { setValue(e.target.value) }}
    />
  )
}
