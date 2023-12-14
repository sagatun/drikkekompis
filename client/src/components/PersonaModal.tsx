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
      "Eksperten, din ultimate guide i drikkekunstens verden! Med en umiskjennelig dybde og rikdom av kunnskap, står Eksperten klar til å dele sin innsikt om både alkoholholdige og alkoholfrie drikker. For de som søker detaljerte og innsiktsfulle anbefalinger, er Eksperten den perfekte samtalepartneren.",
    value: "expert",
    label: "Eksperten",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/standup192.png",
    description:
      "Møt StandupKomiker, der humor og drikkekunnskap flyter i perfekt harmoni! Med en skarp og sofistikert sans for humor, er StandupKomiker klar til å levere underholdende og humoristiske anbefalinger som garantert vil sette et smil om munnen din. Perfekt for de som ønsker å krydre sin drikkeopplevelse med en god dose latter.",
    value: "standup",
    label: "StandupKomiker",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/gangsta192.png",
    description:
      "DrikkeGkompiZ er ikke bare en AI – det er en stilikon med rytme i blodet! Med en unik gangsta stil, formidler denne personaen kunnskap om drikkevarer gjennom fengende rap-vers. For de som søker en opplevelse utenom det vanlige, er DrikkeGkompiZ den ideelle partneren for rytmiske og kreative drikkeanbefalinger.",
    value: "rapper",
    label: "DrikkeGkompiZ",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/sarkastisk192.png",
    description:
      "DrikkeIronisk bringer sarkasmen til nye høyder! Med skarpe og vittige kommentarer, er denne personaen en mester i kunsten å kombinere drikkekunnskap med et tørt vidd. Perfekt for de som setter pris på et intelligent humornivå i sine samtaler om drikkevarer.",
    value: "sarcastic",
    label: "DrikkeIronisk",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/pirat192.png",
    description:
      "Sjøsprøyt, en ekte pirat av en AI! Med levende fortellinger og fargerike beskrivelser, tar Sjøsprøyt deg med på et eventyrlig dykk inn i drikkeverdenen. For de som ønsker en engasjerende og unik drikkeopplevelse, er Sjøsprøyt den ideelle følgesvenn på reisen.",
    value: "pirat",
    label: "Sjøsprøyt",
  },
  {
    gptModel: gpt4model,
    imageUrl: "personas/poet192.png",
    description:
      "Poeten, der hver anbefaling er et mesterverk av ordkunst! Med dyptgående og raffinerte vers, tilbyr Poeten en berikende og tankevekkende tilnærming til drikkekunnskap. For de som søker en mer poetisk og følelsesladet samtale om drikkevarer, er Poeten den perfekte samtalepartneren.",
    value: "poet",
    label: "Poeten",
  },
];

export default function PersonaModal() {
  const { state, dispatch } = useAppState();
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
