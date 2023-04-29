import React from "react";

function Header() {
  return (
    <header className="w-full rounded-bl-lg rounded-br-lg  bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="pl-4 text-center font-bangers text-4xl tracking-wider">
          Drikkekompis🍻
        </h1>
        <img
          src="/Header/DrikkekompisLogo1.png"
          alt="Drikkekompis Logo"
          className="header-logo h-16 w-16"
        />
      </div>
    </header>
  );
}

export default Header;
