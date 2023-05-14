import React from "react";
import CustomSelect from "../blocks/CustomSelect.js";
import Modal from "react-modal";
import { useAppState } from "../context/AppState.context.js";
import { getPersonalityImgUrl } from "../utils/helpers.js";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import "./PersonaModal.css";

// import required modules
import { EffectCards } from "swiper";

const personalityOptions = [
  { imageUrl: "", description: "", value: "expert", label: "Expert" },
  { imageUrl: "", description: "", value: "rapper", label: "Gangster" },
  { imageUrl: "", description: "", value: "sarcastic", label: "Sarkastisk" },
];

export default function PersonaModal() {
  const [state, dispatch] = useAppState();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const { personality } = state;

  const setPersonality = (personality: string) => {
    localStorage.setItem("personality", personality);
    dispatch({ type: "SET_PERSONALITY", payload: personality });
  };

  function openModal() {
    setModalIsOpen((prev) => !prev);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <>
      <button className={"flex flex-col"} onClick={openModal}>
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
        className="fixed inset-0  bg-gray-600 "
      >
        <div
          className={"m-auto flex flex-col items-center justify-center  p-4"}
        >
          <div className={"flex w-full justify-between"}>
            <div>GPT 3.5 Turbo</div>
            <button
              className={
                "sticky top-4 z-10 mb-4 w-fit self-end rounded bg-gray-400 px-4 py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500"
              }
              onClick={closeModal}
            >
              X
            </button>
          </div>
          <div
            className={
              "flex h-[80vh] w-full max-w-[600px] flex-col items-center rounded-3xl bg-gray-400 p-8 "
            }
          >
            <>
              <h1>Title</h1>
              <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper"
              >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                <SwiperSlide>Slide 5</SwiperSlide>
                <SwiperSlide>Slide 6</SwiperSlide>
                <SwiperSlide>Slide 7</SwiperSlide>
                <SwiperSlide>Slide 8</SwiperSlide>
                <SwiperSlide>Slide 9</SwiperSlide>
              </Swiper>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt
                odio incidunt ea quo optio inventore, placeat minus rem commodi
                eum nisi possimus fuga modi ullam, perferendis blanditiis et
                consequatur at.
              </p>
            </>
          </div>
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
