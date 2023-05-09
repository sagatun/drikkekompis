import React from "react";
import PersonaDropdown from "../PersonaDropdown.js";
import StoreDropdown from "../StoreDropdown.js";

function Header() {
  return (
    <header className="w-full rounded-bl-lg rounded-br-lg bg-gray-800 text-white shadow-md">
      <div className="items-top mx-auto flex  max-w-[600px] justify-between p-4">
        <h1 className="text-center font-bangers text-4xl tracking-wider sm:text-5xl">
          Drikkekompis🍻
        </h1>
        <div className="flex items-center justify-center gap-4">
          <StoreDropdown />
          <PersonaDropdown />
        </div>
      </div>
    </header>
  );
}

export default Header;
