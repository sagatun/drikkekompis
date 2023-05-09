import React from "react";
import Modal from "react-modal";
// @ts-ignore
import ListUL from "@iconscout/react-unicons/icons/uil-list-ul";
import { ProductTable } from "./table/ProductTable";
import { useAppState } from "../context/AppState.context.js";
import ProductCard from "./shared/ProductCard";
import { Product } from "../types";

interface Props {
  value: string | number;
  style?: any;
  className?: string;
}

export function SelectProductsModal({ value, ...props }: Props) {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [state] = useAppState();

  const { selectedProducts } = state;

  function openModal() {
    setModalIsOpen((prev) => !prev);
  }

  function closeModal() {
    setModalIsOpen(false);
  }
  return (
    <>
      <button className="relative" {...props} onClick={openModal}>
        <div
          className={
            "absolute bottom-5 left-3 h-6 w-fit min-w-[1.5rem] rounded-full bg-orange-400 p-1 text-xs text-white"
          }
        >
          {value}
        </div>
        <ListUL className={""} />
      </button>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="relative  inset-0 min-h-full bg-gray-600 p-4"
        overlayClassName={"overflow-auto   inset-0 fixed"}
      >
        <div className={"flex flex-col"}>
          <button
            className={
              "sticky top-4 z-10 mb-4 w-fit self-end rounded bg-gray-400 px-4 py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500"
            }
            onClick={closeModal}
          >
            X
          </button>
          {selectedProducts.length > 0 ? (
            <>
              <div className={"my-4 flex flex-col items-start gap-2"}>
                <button
                  className={"rounded bg-orange-400 p-2 hover:bg-orange-200"}
                >
                  Legg til flere produkter
                </button>
                <button
                  className={"rounded bg-orange-400 p-2 hover:bg-orange-200"}
                >
                  Slett lista..
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {selectedProducts.map((product: Product) => {
                  return <ProductCard product={product} />;
                })}
              </div>
            </>
          ) : (
            <div className="height-screen text-center text-white">
              <h2>Ingen produkter valgt</h2>
              <button
                className={
                  "m-4 rounded-xl bg-orange-400 p-2  hover:bg-orange-200"
                }
              >
                + Trykk her for å legge til produkter
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
