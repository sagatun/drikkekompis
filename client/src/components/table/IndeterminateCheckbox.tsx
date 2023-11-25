import React, { type InputHTMLAttributes, useRef, useEffect } from 'react'

interface IndeterminateCheckboxProps
  extends InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean
}

export function IndeterminateCheckbox ({
  indeterminate,
  className = '',
  ...rest
}: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [indeterminate, rest.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`${className} cursor-pointer`}
      {...rest}
    />
  )
}
