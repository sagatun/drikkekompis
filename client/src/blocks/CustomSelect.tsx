import React, { useState, useRef, useEffect, ChangeEventHandler } from "react";
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
  triggerElement: JSX.Element;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  className,
  isSearchable = false,
  placeholder = "",
  isLoading = false,
  triggerElement = <div>Test</div>,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div className={`${className}`} ref={dropdownRef}>
      <>
        <div className="">
          {React.cloneElement(triggerElement, {
            onClick: () => setDropdownOpen(!isDropdownOpen),
          })}
        </div>
      </>

      {hasHits && options.length > 0 && isDropdownOpen && (
        <div
          style={{
            width: "calc(100vw - 2rem)",
            zIndex: 10,
          }}
          className="absolute right-4 mt-2 h-fit  max-h-[70vh] overflow-auto rounded bg-gray-100 p-2 shadow-lg"
        >
          {isSearchable && (
            <input
              autoFocus
              className="mb-4 w-full cursor-text rounded  bg-white px-2 py-2 text-gray-800 "
              value={searchTerm}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onChange={handleSearchChange}
              aria-label="Search"
              placeholder={placeholder}
            />
          )}
          <ul
            className="shadow-xs rounded-md py-1"
            role="listbox"
            aria-labelledby="listbox-label"
            aria-activedescendant={value}
            tabIndex={0}
          >
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`cursor-pointer px-2 py-1 hover:bg-blue-500 hover:text-white sm:px-4 sm:py-2 ${
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
      {/* <input type="hidden" value={value} /> */}
    </div>
  );
};

export default CustomSelect;
