import React, { useState } from 'react'
import { type Product } from 'src/types'

// @ts-expect-error
import CheckMark from '@iconscout/react-unicons/icons/uil-check'
import ProductModal from '../ProductModal'

interface Props {
  product: Product | undefined
  isSelected?: boolean
  toggleSelectHandler?: any
  showSelect?: boolean
  minWidth?: string
  minHeight?: string
}

export default function ProductCard ({
  product,
  isSelected,
  toggleSelectHandler,
  showSelect = false,
  minWidth = '0rem',
  minHeight = '0rem'
}: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <div className="relative">
      <ProductModal
        product={product}
        isOpen={modalIsOpen}
        onRequestClose={() => { setModalIsOpen(false) }}
      />
      {!!toggleSelectHandler && showSelect && (
        <div onClick={toggleSelectHandler ? toggleSelectHandler() : () => {}}>
          {isSelected
            ? (
              <span className="absolute px-2 py-1 text-xs text-white bg-gray-900 rounded-md left-2 top-2">
                <CheckMark size="17" className="text-2xl" />
              </span>
              )
            : (
              <span className="absolute px-2 py-1 text-xs text-white bg-gray-900 rounded-md left-2 top-2">
                <div className="p-2"></div>
              </span>
              )}
        </div>
      )}
      <div
        className={`flex  h-full min-h-[${minHeight}] min-w-[${minWidth}]  cursor-pointer flex-col justify-between rounded-md border shadow-md transition duration-200 ease-in-out hover:shadow-lg ${
          isSelected ? 'bg-white opacity-50' : 'bg-white'
        }`}
        onClick={() => {
          setModalIsOpen(true)
        }}
      >
        <div className="relative w-full">
          <img
            className="object-cover w-full pt-12 max-h-40 rounded-t-md"
            src={
              product?.images && product?.images.length > 0
                ? product?.images[2].url
                : ''
            }
            alt={product?.name}
            style={{ objectFit: 'contain' }}
          />

          <span className="absolute px-2 py-1 text-xs text-white bg-gray-900 rounded-md right-2 top-2">
            {product?.mainCategory.name}
          </span>
        </div>
        <div className="p-4">
          <h2 className="font-bold">{product?.name}</h2>
          <p className="mb-4 text-base text-gray-700">{product?.description}</p>
          <div className="flex justify-between text-xs text-gray-600">
            <span>{`${product?.abv ? product?.abv + '%' : ''}`}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">
              {Math.round(Number(product?.price))} kr
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
