import React from "react";
import CustomSelect from "../blocks/CustomSelect.js";
import { useAppState } from "../context/AppState.context.js";
import { getPersonalityImgUrl } from "../utils/helpers";

const personalityOptions = [
  { value: "expert", label: "Expert" },
  { value: "rapper", label: "Gangster" },
  { value: "sarcastic", label: "Sarkastisk" },
];

export default function PersonaDropdown() {
  const [state, dispatch] = useAppState();

  const { personality } = state;
  const setPersonality = (personality: string) => {
    localStorage.setItem("personality", personality);
    dispatch({ type: "SET_PERSONALITY", payload: personality });
  };

  return (
    <>
      <CustomSelect
        value={personality}
        onChange={(value) => setPersonality(value)}
        options={personalityOptions}
        className="w-auto"
        triggerElement={
          <div className={"flex flex-col"}>
            <img
              loading="lazy"
              src={getPersonalityImgUrl(personality)}
              alt="Drikkekompis Logo"
              className="header-logo ml-auto  h-8 w-8  rounded-full border-2 border-gray-600 object-cover "
            />
          </div>
        }
      />
    </>
  );
}
