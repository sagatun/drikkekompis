import React, { useState, useRef, ChangeEventHandler } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  isSearchable?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  className,
  isSearchable = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOptionSelect = (optionValue: string) => {
    setDropdownOpen(false);
    onChange(optionValue);
  };

  const handleSearchFocus = () => setDropdownOpen(true);
  const handleSearchBlur = () => setTimeout(() => setDropdownOpen(false), 150);
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setSearchTerm(event.target.value);

  const filteredOptions = isSearchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const inputValue = isSearchable
    ? searchTerm
    : options.find((option) => option.value === value)?.label || "";

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`w-full rounded bg-gray-100 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isSearchable && isDropdownOpen ? "cursor-text" : "cursor-pointer"
          }`}
          value={inputValue}
          readOnly={!isSearchable}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onChange={handleSearchChange}
          aria-label="Select a value"
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-full rounded shadow-lg">
          <ul
            className="shadow-xs rounded-md bg-white py-1"
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant={value}
            tabIndex={0}
          >
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white ${
                  value === option.value
                    ? "bg-blue-500 text-white"
                    : "text-gray-800"
                }`}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <input type="hidden" value={value} />
    </div>
  );
};

export default CustomSelect;
