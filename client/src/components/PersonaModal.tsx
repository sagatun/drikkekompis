import React, { useMemo } from "react";
import Modal from "react-modal";
import { useAppState } from "../context/AppState.context.js";
import { getPersonalityImgUrl } from "../utils/helpers.js";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import "./PersonaModal.css";

// import required modules
import { EffectCoverflow, Pagination } from "swiper";

const personalityOptions = [
  {
    gptModel: "gpt-3.5-turbo",
    imageUrl: "personas/expert192.png",
    description: `Eksperten er en AI-språkmodell med en dyp kunnskapsbase om alkoholholdige og alkoholfrie drikker. Den er alltid klar til å dele innsikt og anbefalinger med en profesjonell og vennlig tone.`,
    value: "expert",
    label: "Eksperten",
  },
  {
    gptModel: "gpt-3.5-turbo",
    imageUrl: "personas/gangsta192.png",
    description: `DrikkeGKompiz er en AI-språkmodell med en gangsta rap-persona. Den formidler sin omfattende kunnskap om drikkevarer gjennom rytmiske rap-vers, alltid med stil og attityde.`,
    value: "rapper",
    label: "DrikkeGkompiZ",
  },
  {
    gptModel: "gpt-3.5-turbo",
    imageUrl: "personas/sarkastisk192.png",
    description: `DrikkeIronisk er en AI-språkmodell med en sarkastisk persona. Den formidler sin kunnskap om drikkevarer med en skarp tunge og en bitende vidd, men gir alltid verdifull informasjon - selv om det er pakket inn i en dose ironi.`,
    value: "sarcastic",
    label: "DrikkeIronisk",
  },
  {
    gptModel: "gpt-3.5-turbo",
    imageUrl: "personas/pirat192.png",
    description: `Sjøsprøyt er en AI-språkmodell med en pirat-persona. Den formidler sin omfattende kunnskap om drikkevarer gjennom munter sjargong og ekstravagante havfortellinger, alltid med en god porsjon eventyrlyst.`,
    value: "pirat",
    label: "Sjøsprøyt",
  },
  {
    gptModel: "gpt-3.5-turbo",
    imageUrl: "personas/poet192.png",
    description: `Poeten er en AI-språkmodell som formidler sin kunnskap om drikkevarer gjennom poetisk prosa. Dens anbefalinger er ikke bare informerende, men er også omsvøpt i vakre og tankevekkende vers.`,
    value: "poet",
    label: "Poeten",
  },
  {
    gptModel: "gpt-4",
    imageUrl: "personas/expert192.png",
    description: `Basert på GPT-4, Eksperten er en AI-språkmodell utstyrt med en dyp kunnskapsbase om alkoholholdige og alkoholfrie drikker. Selv om responstiden kan være litt tregere, er anbefalingene mer presise og nøyaktige, noe som gjør Eksperten til en ideell samtalepartner for de som søker profesjonell rådgivning om drikkevarer.`,
    value: "expert",
    label: "Eksperten",
  },
  {
    gptModel: "gpt-4",
    imageUrl: "personas/gangsta192.png",
    description: `DrikkeGKompiz, drevet av GPT-4, formidler sin omfattende kunnskap om drikkevarer gjennom rytmiske rap-vers med en unik gangsta stil. Selv om responsene kan ta litt tid, er de fullpakket med detaljer og kreative rytmer, noe som gir en unik og underholdende opplevelse.`,
    value: "rapper",
    label: "DrikkeGkompiZ",
  },
  {
    gptModel: "gpt-4",
    imageUrl: "personas/sarkastisk192.png",
    description: `DrikkeIronisk, drevet av GPT-4, tar sarkasme til et nytt nivå med enda mer presise og vittige kommentarer. Selv om responstiden kan være litt tregere, er anbefalingene mer innsiktsfulle og skarpe, noe som gjør DrikkeIronisk til en ideell samtalepartner for de som setter pris på en litt tørr humor.`,
    value: "sarcastic",
    label: "DrikkeIronisk",
  },
  {
    gptModel: "gpt-4",
    imageUrl: "personas/pirat192.png",
    description: `Sjøsprøyt, drevet av GPT-4, tar piratpersonligheten til et nytt nivå med enda mer detaljerte og levende fortellinger. Selv om responsene kan ta litt tid, er de fullpakket med fargerike beskrivelser og eventyrlige anbefalinger, noe som gir en unik og engasjerende opplevelse.`,
    value: "pirat",
    label: "Sjøsprøyt",
  },
  {
    gptModel: "gpt-4",
    imageUrl: "personas/poet192.png",
    description: `Poeten, drevet av GPT-4, tar poesi til et nytt nivå med enda mer detaljerte og raffinerte vers. Selv om responstiden kan være litt tregere, er anbefalingene mer dyptgående og tankevekkende, noe som gjør Poeten til en ideell samtalepartner for de som søker en berikende opplevelse.`,
    value: "poet",
    label: "Poeten",
  },
];

export default function PersonaModal() {
  const [state, dispatch] = useAppState();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const { personality, chatGPTModel } = state;

  console.log("chatGPTModel", chatGPTModel);

  const setPersonality = (personality: string) => {
    localStorage.setItem("personality", personality);
    dispatch({ type: "SET_PERSONALITY", payload: personality });

    // setModalIsOpen(false);
  };

  const setChatGPTModel = (chatGPTModel: "gpt-3.5-turbo" | "gpt-4") => {
    console.log("setChatGPTModel", chatGPTModel);
    localStorage.setItem("chatGPTModel", chatGPTModel);
    dispatch({ type: "SET_CHAT_GPT_MODEL", payload: chatGPTModel });
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

  const filteredPersonalityOptions = personalityOptions.filter(
    (persona) => persona.gptModel === chatGPTModel
  );

  return (
    <>
      <button className={"cursor-pointer"} onClick={openModal}>
        <img
          loading="lazy"
          src={getPersonalityImgUrl(personality)}
          alt="Drikkekompis Logo"
          className="header-logo ml-auto  h-8 w-8  rounded-full border-2 border-gray-600 object-cover "
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
            "m-auto flex h-full flex-col items-center justify-between p-4"
          }
        >
          <div className={"flex w-full justify-between"}>
            <div>
              <select
                value={chatGPTModel}
                onChange={(e) =>
                  setChatGPTModel(e.target.value as "gpt-3.5-turbo" | "gpt-4")
                }
              >
                <option value="gpt-3.5-turbo">Chat GPT 3.5 Turbo</option>
                <option value="gpt-4">Chat GPT 4</option>
              </select>
            </div>
            <button
              className={
                "sticky top-4 z-10 mb-4 w-fit self-end rounded bg-gray-400 px-4 py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500"
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
              style={{ height: "100%" }}
              className="mySwiper"
            >
              {filteredPersonalityOptions.map((persona) => (
                <SwiperSlide
                  key={persona.value}
                  className="flex flex-col items-center justify-start gap-12"
                  onClick={() => setModalIsOpen(false)}
                >
                  <div className="flex flex-col items-center justify-between gap-12  text-gray-200">
                    <h2 className=" text-3xl">{persona.label}</h2>
                    <div className="rounded-full bg-gray-200">
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
              {/* <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
                </SwiperSlide> */}
            </Swiper>
          </>
        </div>
      </Modal>
    </>
    // <CustomSelect
    //   value={personality}
    //   onChange={(value) => setPersonality(value)}
    //   options={personalityOptions}
    //   className="w-auto"
    //   triggerElement={
    //     <div className={"flex flex-col"}>
    //       <img
    //         loading="lazy"
    //         src={getPersonalityImgUrl(personality)}
    //         alt="Drikkekompis Logo"
    //         className="header-logo ml-auto  h-8 w-8  rounded-full border-2 border-gray-600 object-cover "
    //       />
    //     </div>
    //   }
    // />
  );
}
