import React, { useEffect, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { calculateDistance } from '../utils/geolocation'
import { useAppState } from '../context/AppState.context'
import { fetchStores } from '../api/storeService'
import CustomSelect from '../blocks/CustomSelect'

function StoreDropdown () {
  const [state, dispatch] = useAppState()

  const [sortedStores, setSortedStores] = useState<any>([])
  const [isFindingNearestStore, setIsFindingNearestStore] = useState(false)
  const [geoShared, setGeoShared] = useState<boolean | null>(
    JSON.parse(localStorage.getItem('geoShared') || 'false')
  )

  // Access state properties
  const { selectedStore } = state

  const queryClient = useQueryClient()

  const setSelectedStore = useCallback(
    (store: any) => {
      dispatch({ type: 'SET_SELECTED_STORE', payload: store })
      localStorage.setItem('selectedStore', JSON.stringify(store))
    },
    [dispatch]
  )

  // Load selected store from local storage
  useEffect(() => {
    const store = localStorage.getItem('selectedStore')
    if (store && !selectedStore) {
      dispatch({ type: 'SET_SELECTED_STORE', payload: JSON.parse(store) })
    }
  }, [dispatch, selectedStore])

  const fetchStoresCallback = useCallback(async () => await fetchStores(), [])

  const {
    isLoading: storesIsLoading,
    error: storesError,
    data: stores
  } = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStoresCallback
  })

  // If stores are fetched, setStore

  useEffect(() => {
    // if store in localStorage then return
    if (localStorage.getItem('selectedStore')) {
      return
    }

    const fetchPositionAndFindNearestStore = async () => {
      if (stores.length > 0) {
        try {
          const geoPermission = await navigator.permissions.query({
            name: 'geolocation'
          })
          if (geoPermission.state === 'granted') {
            setGeoShared(true) // Set geoShared to true
            localStorage.setItem('geoShared', 'true')
            findNearestStore()
          } else {
            setIsFindingNearestStore(false)
          }
        } catch (error) {
          console.log(error)
          setIsFindingNearestStore(false)
        }
      }
    }

    fetchPositionAndFindNearestStore()
  }, [stores])

  const getPosition = async () => {
    return await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  async function findNearestStore () {
    if (navigator.geolocation && stores.length > 0) {
      try {
        setIsFindingNearestStore(true)
        const position: any = await getPosition()

        // setGeoShared(true); // Set geoShared to true
        const userLat = position?.coords?.latitude
        const userLng = position?.coords?.longitude

        let nearest = null
        let minDistance = Infinity

        const sortedStores = stores.map((store: any) => {
          const distance = calculateDistance(
            userLat,
            userLng,
            store?.lat,
            store?.lng
          )

          if (distance < minDistance) {
            minDistance = distance
            nearest = store
          }

          return {
            ...store,
            distance
          }
        })

        setSelectedStore(nearest)

        // Sort stores by distance
        setSortedStores(
          sortedStores.sort((a: any, b: any) => a.distance - b.distance)
        )
        setIsFindingNearestStore(false)
      } catch (e) {
        console.log(e)
        alert('Du må dele lokasjon for å finne nærmeste butikk')
        setIsFindingNearestStore(false)
      }
    } else {
      // alert("Geolocation is not supported by this browser.");
      setIsFindingNearestStore(false)
    }
  }

  async function handleSelectChange (optionvalue: string) {
    if (optionvalue === 'find_nearest') {
      queryClient.invalidateQueries({ queryKey: ['fetchProductsInStore'] })
      findNearestStore()
      return
    }
    const option = storeOptions.find((option) => option.value === optionvalue)

    setSelectedStore(option.store)
    queryClient.invalidateQueries({ queryKey: ['fetchProductsInStore'] })
  }

  const storeOptions = stores
    ? geoShared
      ? [
          { value: 'find_nearest', label: 'Finn nærmeste butikk' },
          ...stores.map((store: any) => ({
            value: store.id,
            label: store.distance
              ? `${store.name} (${Number(store.distance).toFixed(0)} km unna)`
              : store.name,
            store
          }))
        ]
      : [
          { value: 'find_nearest', label: 'Finn nærmeste butikk' },
          ...stores.map((store: any) => ({
            value: store.id,
            label: store.name,
            store
          }))
        ]
    : []

  return (
    <CustomSelect
      value={selectedStore?.id ?? ''}
      options={storeOptions}
      onChange={handleSelectChange}
      isSearchable
      placeholder={'Søk...'}
      className="w-fit-content"
      isLoading={storesIsLoading || isFindingNearestStore}
      triggerElement={
        <div className="flex flex-col">
          <button
            className={`flex h-8 items-center justify-center rounded-full text-xs ${
              selectedStore ? 'bg-orange-400' : 'bg-gray-400'
            } p-2 text-white`}
          >
            {selectedStore
              ? selectedStore.name.split(',').length > 1
                ? selectedStore.name.split(',').slice(1).join(' ')
                : selectedStore.name
              : 'Velg butikk'}
          </button>
        </div>
      }
    />
  )
}

export default StoreDropdown
