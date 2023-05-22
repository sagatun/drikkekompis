import React from "react";
import PersonaModal from "../PersonaModal.js";
import StoreDropdown from "../StoreDropdown.js";

function Header() {
  return (
    <header className="h-full rounded-bl-lg rounded-br-lg bg-gray-800 px-4 text-white shadow-md">
      <div className="items-top mx-auto flex h-full  max-w-[600px] items-center justify-between ">
        <h1 className="text-start font-bangers text-3xl sm:text-5xl">
          Drikkekompis🍻
        </h1>
        <div className="flex items-center justify-center gap-4">
          <StoreDropdown />
          <PersonaModal />
        </div>
      </div>
    </header>
  );
}

export default Header;
