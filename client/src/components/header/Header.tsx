import React from "react";
import { useAppState } from "../../context/AppStateContext.js";
import { getPersonalityImgUrl } from "../../utils/helpers";

function Header() {
  const [state, dispatch] = useAppState();

  // Access state properties
  const { personality } = state;
  const setPersonality = (personality: string) => {
    localStorage.setItem("personality", personality);
    dispatch({ type: "SET_PERSONALITY", payload: personality });
  };

  return (
    <header className="w-full rounded-bl-lg rounded-br-lg  bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="pl-4 text-center font-bangers text-4xl tracking-wider">
          Drikkekompis🍻
        </h1>
        <img
          src={getPersonalityImgUrl(personality)}
          alt="Drikkekompis Logo"
          className="header-logo h-16 w-16"
        />
      </div>
      <div className="container mx-auto flex  items-center justify-end text-xs">
        <select
          className="w-fit rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
        >
          <option value="expert" className="bg-blue-500 hover:bg-blue-700">
            Expert
          </option>
          <option value="rapper" className="bg-blue-500 hover:bg-blue-700">
            GangsterRapper
          </option>
          <option value="sarcastic" className="bg-blue-500 hover:bg-blue-700">
            Sarkastisk
          </option>
        </select>
      </div>
    </header>
  );
}

export default Header;
