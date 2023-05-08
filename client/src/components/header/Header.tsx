import React from "react";
import { useAppState } from "../../context/AppStateContext.js";
import { getPersonalityImgUrl } from "../../utils/helpers";
import CustomSelect from "../../blocks/CustomSelect.js";
import StoreDropdown from "../StoreDropdown.js";

const siteUrl = import.meta.env.VITE_SITE_URL;

function Header() {
  const [state, dispatch] = useAppState();

  // Access state properties
  const { personality } = state;
  const setPersonality = (personality: string) => {
    localStorage.setItem("personality", personality);
    dispatch({ type: "SET_PERSONALITY", payload: personality });
  };

  const personalityOptions = [
    { value: "expert", label: "Expert" },
    { value: "rapper", label: "GangsterRapper" },
    { value: "sarcastic", label: "Sarkastisk" },
  ];

  return (
    <header className="w-full rounded-bl-lg rounded-br-lg  bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="pl-4 text-center font-bangers text-4xl tracking-wider">
          <a href={siteUrl}>Drikkekompis🍻</a>
        </h1>
        <img
          loading="lazy"
          src={getPersonalityImgUrl(personality)}
          alt="Drikkekompis Logo"
          className="header-logo h-16 w-16"
        />
      </div>
      <div className="container mx-auto flex  items-center justify-between text-xs">
        <StoreDropdown />
        <CustomSelect
          value={personality}
          onChange={(value) => setPersonality(value)}
          options={personalityOptions}
          className="w-32"
        />
      </div>
    </header>
  );
}

export default Header;
