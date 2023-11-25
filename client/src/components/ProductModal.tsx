import React, { useEffect } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

const ProductModal = ({ isOpen, onRequestClose, product }: any) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isOpen])

  const {
    name,
    productType,
    abv,
    price,
    pricePerLiter,
    images,
    containerSize,
    containerType,
    vintage,
    color,
    aroma,
    taste,
    storable,
    foodPairing,
    eco,
    gluten,
    kosher,
    fairTrade,
    bioDynamic,
    mainProducer,
    distributor,
    wholesaler,
    url
  } = product

  const primaryImage = images.find((image: any) => image.format === 'product')

  if (!product) return <></>

  const updatedContainerSize = (containerSize / 10).toFixed(1)

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 z-10 m-auto overflow-y-auto bg-gray-600"
      overlayClassName={'overflow-auto z-10 inset-0 fixed '}
    >
      <button
        className={
          'fixed right-4 top-4 z-10 w-8 rounded   py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500'
        }
        onClick={onRequestClose}
      >
        X
      </button>
      <div className="flex flex-col m-0 bg-gray-600 rounded-lg ">
        <div className="m-auto my-8 max-w-[22rem] rounded-full bg-white p-12 ">
          <img
            src={primaryImage.url}
            alt={name}
            className="object-contain w-64 h-64 m-auto cursor-pointer"
          />
        </div>
        <div className={'flex flex-col items-start gap-2 p-4 text-gray-200'}>
          <h2 className="self-center mb-2 text-4xl font-bold">{name}</h2>
          <p className="mb-6 text-gray-600">{productType}</p>
          <a
            className="underline cursor-pointer visited:text-gray-200 hover:text-gray-200"
            href={url}
            rel="noreferrer"
          >
            Lenke til vinmonopolets produktside
          </a>
          {abv
            ? (
              <p className="my-2 mt-6">
                <strong>Alkohol prosent:</strong> {abv}%
              </p>
              )
            : (
              <p className="my-2 mt-6">Alkoholfri</p>
              )}
          <p className="mb-2">
            <strong>Pris:</strong> {price} kroner per enhet
          </p>
          <p className="mb-2">
            <strong>Pris per liter:</strong> {pricePerLiter.toFixed(0)} kroner
          </p>
          <p className="mb-2">
            <strong>Størrelse:</strong> {updatedContainerSize} liter
          </p>
          <p className="mb-2">
            <strong>Embalasje:</strong> {containerType}
          </p>
          {vintage && (
            <p className="mb-2">
              <strong>Årgang:</strong> {vintage}
            </p>
          )}
          <p className="mb-2">
            <strong>Farge:</strong> {color}
          </p>
          <p className="mb-2">
            <strong>Aroma:</strong> {aroma}
          </p>
          <p className="mb-2">
            <strong>Smak:</strong> {taste}
          </p>
          <p className="mb-2">
            <strong>Lagring:</strong> {storable}
          </p>
          <p className="mb-4">
            <strong>Går til: </strong>
            {foodPairing?.map((item: any, index: any) => (
              <span key={item.code}>
                {item.name}
                {index < foodPairing.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          <p className="mb-4">
            <strong>Produsent:</strong>{' '}
            <a href={mainProducer.url} target="_blank" rel="noreferrer">
              {mainProducer.name}
            </a>
          </p>
          <p className="mb-2">
            <strong>Distributør:</strong> {distributor}
          </p>
          <p className="mb-4">
            <strong>Wholesaler:</strong> {wholesaler}
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default ProductModal
