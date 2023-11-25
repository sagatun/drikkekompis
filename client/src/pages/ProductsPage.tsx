import * as React from 'react'
import { ProductTable } from '../components/table/ProductTable.js'
import { ClipLoader } from 'react-spinners'
import { useAppState } from '../context/AppState.context.js'
import { useIsFetching } from '@tanstack/react-query'
import ReactDOM from 'react-dom'

const BackdropSpinner = ({ isActive }: { isActive: boolean }) => {
  if (!isActive) return null

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed', // Use fixed instead of absolute to cover the entire screen
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000 // Ensure it's above other content
      }}
    >
      <ClipLoader color={'grey'} loading={true} size={30} />
    </div>,
    document.body // Assuming the body is the mount point
  )
}

export function ProductsPage () {
  const [state] = useAppState()

  const { productsInStore } = state

  const productsIsFetching = useIsFetching({
    queryKey: ['fetchProductsInStore']
  })

  const productsDisabled =
    !productsInStore || productsInStore.length === 0 || productsIsFetching > 0

  function renderProductTable () {
    if (!productsInStore) {
      return (
        <div className={'my-8 flex justify-center align-middle'}>
          <ClipLoader
            color={'grey'}
            loading={!productsInStore}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )
    }

    return <ProductTable />
  }

  // create a backdrop with spinner. use React.portal. Style inset 0 0 0 0.  ClipLoader is a spinner. Spin if profuctsDisabled === true

  return (
    <>
      <BackdropSpinner isActive={productsDisabled} />
      <div
        style={{
          position: 'absolute',
          top: '128px',
          bottom: '0px',
          overflowY: 'auto'
        }}
        className="products-container mx-auto flex max-w-[600px] flex-col justify-between overflow-y-auto px-4 pr-0"
      >
        {renderProductTable()}
      </div>
    </>
  )
}
