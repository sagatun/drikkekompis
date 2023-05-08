import React, { useState, useRef, ChangeEventHandler } from "react";
import slugify from "slugify";

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
  placeholder?: string;
  isLoading?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  className,
  isSearchable = false,
  placeholder = "",
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOptionSelect = (optionValue: string) => {
    setDropdownOpen(false);
    setSearchTerm("");
    onChange(optionValue);
  };

  const handleSearchFocus = () => setDropdownOpen(true);
  const handleSearchBlur = () => setTimeout(() => setDropdownOpen(false), 150);
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setSearchTerm(event.target.value);

  const filteredOptions = isSearchable
    ? options.filter((option) => {
        if (searchTerm.trim() === "") {
          return true;
        }

        const words = searchTerm.trim().toLowerCase().split(/\s+/);
        const label = option.label.toLowerCase();

        return words.every(
          (word) =>
            slugify(label, {
              lower: true,
              remove: /[$*_+~.()'"!\-:@]/g,
            }).indexOf(word) !== -1
        );
      })
    : options;

  const hasHits = filteredOptions.length > 0;

  const displayInputValue = options.find(
    (option) => option.value === value
  )?.label;

  return (
    <div className={`relative ${className}`}>
      {isLoading ? (
        <div>Henter butikker...</div>
      ) : (
        <>
          <div className="relative">
            {isSearchable && isDropdownOpen ? (
              <input
                ref={inputRef}
                type="text"
                className="w-full cursor-text rounded bg-gray-100 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                value={searchTerm}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onChange={handleSearchChange}
                aria-label="Select a value"
                placeholder={placeholder}
              />
            ) : (
              <input
                type="text"
                className="w-full cursor-pointer rounded bg-gray-100 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                value={displayInputValue || ""}
                readOnly
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                aria-label="Select a value"
                placeholder={placeholder}
              />
            )}
          </div>
        </>
      )}

      {hasHits && options.length > 0 && isDropdownOpen && (
        <div className="z-100 absolute mt-2 h-80 w-full overflow-auto rounded shadow-lg">
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
                    : "text-gray-800 hover:bg-gray-200"
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
