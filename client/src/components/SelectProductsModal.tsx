import React from 'react'
import Modal from 'react-modal'
// @ts-expect-error
import ListUL from '@iconscout/react-unicons/icons/uil-list-ul'

interface Props {
  value: string | number
  style?: any
  className?: string
}

export function SelectProductsModal ({ value, ...props }: Props) {
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  function openModal () {
    setModalIsOpen((prev) => !prev)
  }

  function closeModal () {
    setModalIsOpen(false)
  }
  return (
    <>
      <button className="relative" {...props} onClick={openModal}>
        {value !== 0 && (
          <div
            className={
              'absolute bottom-6 left-4 h-6 w-fit min-w-[1.5rem] rounded-full bg-orange-400 p-1 text-xs text-white'
            }
          >
            {value}
          </div>
        )}
        <ListUL className={'h-8 w-8'} />
      </button>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 z-10 bg-gray-600"
        overlayClassName={'overflow-auto z-10 inset-0 fixed'}
      >
        <div className={'flex flex-col'}>
          <button
            className={
              'sticky top-4 z-10 mb-4 w-fit self-end rounded bg-gray-400 px-4 py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500'
            }
            onClick={closeModal}
          >
            X
          </button>

          <div className="text-center text-white height-screen">
            <h2>Ingen produkter valgt</h2>
            <button
              className={
                'm-4 rounded-xl bg-orange-400 p-2  hover:bg-orange-200'
              }
            >
              + Trykk her for å legge til produkter (WIP)
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
