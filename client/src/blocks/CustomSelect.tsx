import React, { useState, useRef, useEffect, ChangeEventHandler } from "react";
import { PuffLoader } from "react-spinners";
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
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

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

  useEffect(() => {
    // New effect to scroll to the selected option when dropdown opens
    if (isDropdownOpen) {
      const selectedIndex = options.findIndex(
        (option) => option.value === value
      );
      const selectedOptionRef = optionRefs.current[selectedIndex];

      selectedOptionRef?.scrollIntoView({
        block: "center",
        inline: "start",
      });
    }
  }, [isDropdownOpen, options, value]);

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
    <div className={className} ref={dropdownRef}>
      <>
        {isLoading ? (
          <PuffLoader color="white" size={35} />
        ) : (
          <div className="">
            {React.cloneElement(triggerElement, {
              onClick: () => setDropdownOpen(!isDropdownOpen),
            })}
          </div>
        )}
      </>
      {isDropdownOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)", // Semi-transparent black
            zIndex: 9, // Ensure this is below the dropdown but above everything else
          }}
          onClick={() => setDropdownOpen(false)} // Close dropdown when backdrop is clicked
        />
      )}
      {hasHits && options.length > 0 && isDropdownOpen && (
        <div
          style={{
            width: "calc(100vw - 2rem)",
            zIndex: "20",
            maxHeight: "40vh",
          }}
          className="absolute right-4 mt-2 overflow-auto rounded bg-gray-100 p-2 shadow-lg"
        >
          {isSearchable && (
            <input
              autoFocus
              className="sticky -left-2 -right-2 -top-2 mb-4 w-full cursor-text rounded bg-white  px-2 py-2 text-gray-800 shadow-md "
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
            {filteredOptions.map((option, index) => (
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
                ref={(el) => (optionRefs.current[index] = el)}
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
