import React from 'react'
import Select from 'react-select'

interface Props {
  categories: Array<{ code: string, name: string }>
  setColumnFilters: (columnFilters: any) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  className: string
}

const customStyles = {
  option: (provided: any, state: { isFocused: any, isSelected: any }) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
    color: 'black',
    fontWeight: state.isSelected ? 'bold' : 'normal'
  }),
  control: (provided: any) => ({
    ...provided,
    borderColor: 'black'
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'white',
    border: '1px solid black'
  })
}

export function CategorySelect ({
  categories,
  setColumnFilters,
  selectedCategory,
  setSelectedCategory,
  ...props
}: Props) {
  const categoriesOptions: any = [
    { value: '', label: 'Alle' },
    ...categories.map((category) => ({
      value: category?.code,
      label: category?.name,
      category: category?.name
    }))
  ]

  function handleCategoryChange (option: any) {
    setSelectedCategory(option)
    setColumnFilters([
      {
        id: 'mainCategory',
        value: option?.value
      }
    ])
  }

  return (
    <Select
      options={categoriesOptions}
      value={selectedCategory}
      onChange={handleCategoryChange}
      placeholder="Velg kategori..."
      styles={customStyles}
      {...props}
    />
  )
}
