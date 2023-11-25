import React, { useMemo } from "react";
import Modal from "react-modal";
import { useAppState } from "../context/AppState.context";
import { getPersonalityImgUrl } from "../utils/helpers";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "./PersonaModal.css";

// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";

const gpt4model = "gpt-4-1106-preview";

const personalityOptions = [
  {
    gptModel: gpt4model,
    imageUrl: "personas/expert192.png",
    description:
      "Basert på GPT-4-Turbo, Eksperten er en AI-språkmodell utstyrt med en dyp kunnskapsbase om alkoholholdige og alkoholfrie drikker. Selv om responstiden kan være litt tregere, er anbefalingene mer presise og nøyaktige, noe som gjør Eksperten til en ideell samtalepartner for de som søker profesjonell rådgivning om drikkevarer.",
    value: "expert",
    label: "Eksperten",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/standup192.png",
    description:
      "StandupKomiker, drevet av GPT-4-Turbo, er den morsomste eksperten på god drikke! Med en skarp og sofistikert humor beregnet for et voksent publikum, leverer denne AI-språkmodellen underholdende og humoristiske anbefalinger. Selv om responstiden kan være litt tregere, er anbefalingene fulle av vittige kommentarer og morsomme innfall, perfekt for de som ønsker å kombinere drikkekunnskap med en god latter.",
    value: "standup",
    label: "StandupKomiker",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/gangsta192.png",
    description:
      "DrikkeGKompiz, drevet av GPT-4-Turbo, formidler sin omfattende kunnskap om drikkevarer gjennom rytmiske rap-vers med en unik gangsta stil. Selv om responsene kan ta litt tid, er de fullpakket med detaljer og kreative rytmer, noe som gir en unik og underholdende opplevelse.",
    value: "rapper",
    label: "DrikkeGkompiZ",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/sarkastisk192.png",
    description:
      "DrikkeIronisk, drevet av GPT-4-Turbo, tar sarkasme til et nytt nivå med enda mer presise og vittige kommentarer. Selv om responstiden kan være litt tregere, er anbefalingene mer innsiktsfulle og skarpe, noe som gjør DrikkeIronisk til en ideell samtalepartner for de som setter pris på en litt tørr humor.",
    value: "sarcastic",
    label: "DrikkeIronisk",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/pirat192.png",
    description:
      "Sjøsprøyt, drevet av GPT-4-Turbo, tar piratpersonligheten til et nytt nivå med enda mer detaljerte og levende fortellinger. Selv om responsene kan ta litt tid, er de fullpakket med fargerike beskrivelser og eventyrlige anbefalinger, noe som gir en unik og engasjerende opplevelse.",
    value: "pirat",
    label: "Sjøsprøyt",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/poet192.png",
    description:
      "Poeten, drevet av GPT-4-Turbo, tar poesi til et nytt nivå med enda mer detaljerte og raffinerte vers. Selv om responstiden kan være litt tregere, er anbefalingene mer dyptgående og tankevekkende, noe som gjør Poeten til en ideell samtalepartner for de som søker en berikende opplevelse.",
    value: "poet",
    label: "Poeten",
  },
];

export default function PersonaModal() {
  const [state, dispatch] = useAppState();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const { personality } = state;

  const setPersonality = (personality: string) => {
    localStorage.setItem("personality", personality);
    dispatch({ type: "SET_PERSONALITY", payload: personality });

    // setModalIsOpen(false);
  };

  function openModal() {
    setModalIsOpen((prev) => !prev);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const selectedPersonalityIndex = useMemo(
    () =>
      personalityOptions.findIndex((persona) => persona.value === personality),
    [personality]
  );

  return (
    <>
      <button className={"cursor-pointer"} onClick={openModal}>
        <img
          loading="lazy"
          src={getPersonalityImgUrl(personality)}
          alt="Drikkekompis Logo"
          className="object-cover w-8 h-8 ml-auto border-2 border-gray-600 rounded-full header-logo "
        />
      </button>

      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 z-10 bg-gray-600"
        overlayClassName={"overflow-auto z-10 inset-0 fixed"}
      >
        <div
          className={
            "m-auto flex h-full flex-col items-center justify-between p-4 mt-16"
          }
        >
          <div className={"flex w-full justify-between"}>
            <div></div>
            <button
              className={
                "absolute right-4 top-4 z-10 mb-4 w-fit self-end rounded bg-gray-400 px-4 py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500"
              }
              onClick={closeModal}
            >
              X
            </button>
          </div>

          <>
            <Swiper
              effect={"coverflow"}
              onSlideChange={(swiper) => {
                const activeIndex = swiper.activeIndex; // this is the index of the current active slide
                const activePersona = personalityOptions[activeIndex]; // assuming 'personas' is the array containing your personas
                setPersonality(activePersona.value);
              }}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              initialSlide={selectedPersonalityIndex}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={true}
              modules={[EffectCoverflow, Pagination]}
              style={{ height: "100%", width: "100%", maxWidth: "40rem" }}
              className="mySwiper"
            >
              {personalityOptions.map((persona) => (
                <SwiperSlide
                  key={persona.value}
                  className="flex flex-col items-center justify-start gap-12"
                  onClick={() => {
                    setModalIsOpen(false);
                  }}
                >
                  <div className="flex flex-col items-center justify-between gap-12 text-gray-200">
                    <h2 className="text-3xl ">{persona.label}</h2>
                    <div className="bg-gray-200 rounded-full">
                      <img src={persona.imageUrl} alt={persona.label}></img>
                    </div>
                    <div
                      className={
                        " text-center text-sm font-light text-gray-200"
                      }
                    >
                      {persona.description}
                    </div>
                  </div>
                  <div></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        </div>
      </Modal>
    </>
  );
}
