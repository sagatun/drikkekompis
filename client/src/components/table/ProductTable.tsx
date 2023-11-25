import React, { useMemo, useState } from 'react'
import ProductCards from './ProductCards'

import { DebouncedInput } from './DebouncedInput'
import { IndeterminateCheckbox } from './IndeterminateCheckbox'
import { useAppState } from '../../context/AppState.context.js'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Pagination } from './pagination/Pagination'
import { PaginationCountPages } from './pagination/Pagination_CountPages'
import { SortConfig, type SortingEntry } from 'src/types'
import Select from 'react-select'

const SortOptions = [
  { value: 'name:asc', label: 'Navn Stigende' },
  { value: 'name:desc', label: 'Navn Synkende' },
  { value: 'price:asc', label: 'Pris Stigende' },
  { value: 'price:desc', label: 'Pris Synkende' },
  { value: 'mainCategory:asc', label: 'Kategori Stigende' },
  { value: 'mainCategory:desc', label: 'Kategori Synkende' }
]

export function ProductTable () {
  const [state] = useAppState()
  const { productsInStore: data } = state

  const handleSortChange = (e: any) => {
    const value = e.target.value.split(':')
    const key = value[0]
    const direction = value[1]

    setSorting([{ id: key, desc: direction === 'desc' }])
  }

  const [sorting, setSorting] = useState<SortingEntry[]>([])
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [categoryFilter, setCategoryFilter] = useState<string | any>([])
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | any>([])

  const uniqueCategories = useMemo(() => {
    const categories = new Set(
      data.map((item) => item.mainCategory?.name).filter(Boolean)
    )
    return Array.from(categories)
  }, [data, categoryFilter, subCategoryFilter])

  const filteredData = useMemo(() => {
    let filtered = data
    if (categoryFilter.length) {
      filtered = filtered.filter((item) =>
        categoryFilter.includes(item.mainCategory?.name)
      )
    }
    if (subCategoryFilter.length) {
      filtered = filtered.filter((item) =>
        subCategoryFilter.includes(item.mainSubCategory?.name)
      )
    }
    return filtered
  }, [data, categoryFilter, subCategoryFilter])

  const uniqueSubCategories = useMemo(() => {
    if (!categoryFilter.length) {
      return []
    }
    const subCategories = new Set(
      data
        .filter((item) => categoryFilter.includes(item.mainCategory?.name))
        .map((item) => item.mainSubCategory?.name)
        .filter(Boolean)
    )
    return Array.from(subCategories)
  }, [data, categoryFilter])

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }: any) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }: any) => (
          <div>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        )
      },
      {
        header: 'Produktliste',
        footer: (props: any) => props.column.id,
        columns: [
          {
            accessorFn: (row: { productId: any }) => row.productId,
            id: 'productId',
            cell: (info: any) => (
              <img
                src={`https://bilder.vinmonopolet.no/cache/${'300'}x${'300'}-${'0'}/${info.getValue()}-${'1'}.jpg`}
                alt={info.row.original.productName}
                loading="lazy"
              />
            ),
            header: () => <span></span>,
            footer: (props: any) => props.column.id
          },
          {
            accessorFn: (row: any) => row.name || 'N/A',
            id: 'name',
            cell: (info: any) => info.getValue(),
            header: () => <span>Navn</span>,
            footer: (props: any) => props.column.id,
            enableSorting: true
          },
          {
            accessorFn: (row: { mainProducer: { name: any } }) =>
              (row.mainProducer?.name) || 'N/A',
            id: 'mainProducer',
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Produsent</span>,
            footer: (props: { column: { id: any } }) => props.column.id
          },
          {
            accessorFn: (row: { containerSize: any }) =>
              row.containerSize || 'N/A',
            id: 'containerSize',
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Størrelse</span>,
            footer: (props: { column: { id: any } }) => props.column.id
          },
          {
            accessorFn: (row: { mainCategory: { name: any } }) =>
              (row.mainCategory?.name) || 'N/A',
            id: 'mainCategory',
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Kategori</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
            enableSorting: true
          },
          {
            accessorFn: (row: { mainCountry: { name: any } }) =>
              (row.mainCountry?.name) || 'N/A',
            id: 'mainCountry',
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Land</span>,
            footer: (props: { column: { id: any } }) => props.column.id
          },
          {
            accessorFn: (row: { district: { name: any } }) =>
              (row.district?.name) || 'N/A',
            id: 'district',
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Distrikt</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
            enableSorting: true
          },
          {
            accessorFn: (row: { price: any }) => row.price || 'N/A',
            id: 'price',
            cell: (info: { getValue: () => any }) => (
              <span>{`${info.getValue()} kr`}</span>
            ),
            header: () => <span>Pris</span>,
            footer: (props: { column: { id: any } }) => props.column.id
          },
          {
            accessorFn: (row: { abv: any }) => row.abv || 'Alkoholfritt',
            id: 'abv',
            cell: (info: { getValue: () => string }) => (
              <span>{`${
                info.getValue() !== 'Alkoholfritt'
                  ? info.getValue() + '%'
                  : info.getValue()
              }`}</span>
            ),
            header: () => <span>Prosent Alkohol</span>,
            footer: (props: { column: { id: any } }) => props.column.id
          },
          {
            accessorFn: (row: { mainSubCategory: { code: any } }) =>
              row.mainSubCategory?.code || 'N/A',
            id: 'mainCategory'
          }
        ]
      }
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
      sorting
    },
    enableRowSelection: true, // enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting // Tillater oppdateringer av sortering
  })

  const renderCategoryFilter = () => {
    const options = uniqueCategories.map((category) => ({
      value: category,
      label: category
    }))
    return (
      <Select
        isMulti
        name="categories"
        placeholder="Velg kategori"
        options={options}
        className="w-full rounded"
        classNamePrefix="select"
        onChange={(selectedOptions) => {
          setCategoryFilter(
            selectedOptions ? selectedOptions.map((option) => option.value) : []
          )
        }
        }
      />
    )
  }

  const renderSubCategoryFilter = () => {
    const options = uniqueSubCategories.map((subCategory) => ({
      value: subCategory,
      label: subCategory
    }))
    return (
      <Select
        isMulti
        name="subCategories"
        placeholder="Velg underkategori"
        options={options}
        className="w-full rounded"
        classNamePrefix="select"
        onChange={(selectedOptions) => {
          setSubCategoryFilter(
            selectedOptions && selectedOptions.length > 0
              ? selectedOptions.map((option: any) => option.value)
              : []
          )
        }
        }
        isDisabled={!categoryFilter.length || (uniqueSubCategories.length === 0)}
      />
    )
  }

  const renderSortDropdown = () => {
    // For å håndtere endring av valget i react-select
    const handleReactSelectChange = (selectedOption: any) => {
      handleSortChange({ target: { value: selectedOption.value } })
    }

    return (
      <Select
        options={SortOptions}
        placeholder="Sorter etter..."
        name="sort"
        // defaultValue={SortOptions.find(
        //   (option) =>
        //     option.value === `${sortConfig.key}:${sortConfig.direction}`
        // )}
        classNamePrefix="select"
        onChange={handleReactSelectChange}
        className="w-full rounded"
      />
    )
  }

  return (
    <div className="pb-4 pr-4 mx-auto">
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-col lg:flex-col items-center justify-between w-full max-w-[600px] gap-4 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={(value: any) => { setGlobalFilter(String(value)) }}
            placeholder="Søk i alle produkter...."
          />

          <div className="flex flex-col justify-between w-full h-auto gap-4">
            <div>{renderCategoryFilter()}</div>
            <div>{renderSubCategoryFilter()}</div>
          </div>
          <div className="w-full h-24 mt-8 ">{renderSortDropdown()}</div>
          <Pagination table={table} />
          <PaginationCountPages table={table} />
        </div>
      </div>
      <div className="mt-6">
        <ProductCards table={table} />
        <Pagination table={table} />
        <PaginationCountPages table={table} />
      </div>
    </div>
  )
}
