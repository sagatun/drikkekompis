import React, { useState, useEffect } from "react";

interface DebouncedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: any;
  onChange: (value: any) => void;
  debounce?: number;
}

// A debounced input react component
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);
  const [event, setEvent] = useState<React.ChangeEvent<HTMLInputElement>>();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(event);
    }, debounce);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        setEvent(e);
      }}
    />
  );
}
