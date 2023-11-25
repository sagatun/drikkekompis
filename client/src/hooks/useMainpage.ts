// useMainPage.ts
import { useCallback } from 'react'
import { useAppState } from '../context/AppState.context'
import {
  categorySynonyms,
  subCategorySynonyms
} from '../utils/categorySynonyms'

export const useMainPage = () => {
  const [state, dispatch] = useAppState()

  const setCategories = useCallback(
    (categories: any[]) => {
      dispatch({ type: 'SET_CATEGORIES', payload: categories })
    },
    [dispatch]
  )

  const setSubCategories = useCallback(
    (subCategories: any[]) => {
      dispatch({ type: 'SET_SUB_CATEGORIES', payload: subCategories })
    },
    [dispatch]
  )

  const setSelectedCategory = useCallback(
    (category: any) => {
      dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category })
    },
    [dispatch]
  )

  // const setSelectedProducts = useCallback(
  //   (products: any[]) => {
  //     dispatch({ type: "SET_SELECTED_PRODUCTS", payload: products });
  //   },
  //   [dispatch]
  // );

  return {
    state,
    setCategories,
    setSubCategories,
    setSelectedCategory,
    // setSelectedProducts,
    categorySynonyms,
    subCategorySynonyms
  }
}
