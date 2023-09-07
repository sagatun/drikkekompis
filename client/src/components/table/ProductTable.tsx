import React, { useEffect, useMemo, useState, useCallback } from "react";
import ProductCards from "./ProductCards";

import { DebouncedInput } from "./DebouncedInput";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { useAppState } from "../../context/AppState.context.js";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "./pagination/Pagination";
import { PaginationCountPages } from "./pagination/Pagination_CountPages";

export function ProductTable() {
  const [state, dispatch] = useAppState();

  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const setSelectedProducts = useCallback(
    (products: any[]) => {
      dispatch({ type: "SET_SELECTED_PRODUCTS", payload: products });
    },
    [dispatch]
  );

  const { categories, subCategories, productsInStore: data } = state;

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: any) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
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
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        header: "Produktliste",
        footer: (props: any) => props.column.id,
        columns: [
          {
            accessorFn: (row: { productId: any }) => row.productId,
            id: "productId",
            cell: (info: any) => (
              <img
                src={`https://bilder.vinmonopolet.no/cache/${"300"}x${"300"}-${"0"}/${info.getValue()}-${"1"}.jpg`}
                alt={info.row.original.productName}
                loading="lazy"
              />
            ),
            header: () => <span></span>,
            footer: (props: any) => props.column.id,
          },
          {
            accessorFn: (row: any) => row.name || "N/A",
            id: "name",
            cell: (info: any) => info.getValue(),
            header: () => <span>Navn</span>,
            footer: (props: any) => props.column.id,
          },
          {
            accessorFn: (row: { mainProducer: { name: any } }) =>
              (row.mainProducer && row.mainProducer?.name) || "N/A",
            id: "mainProducer",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Produsent</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { containerSize: any }) =>
              row.containerSize || "N/A",
            id: "containerSize",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Størrelse</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { mainCategory: { name: any } }) =>
              (row.mainCategory && row.mainCategory?.name) || "N/A",
            id: "mainCategory",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Kategori</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { mainCountry: { name: any } }) =>
              (row.mainCountry && row.mainCountry?.name) || "N/A",
            id: "mainCountry",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Land</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { district: { name: any } }) =>
              (row.district && row.district?.name) || "N/A",
            id: "district",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Distrikt</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { price: any }) => row.price || "N/A",
            id: "price",
            cell: (info: { getValue: () => any }) => (
              <span>{`${info.getValue()} kr`}</span>
            ),
            header: () => <span>Pris</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { abv: any }) => row.abv || "Alkoholfritt",
            id: "abv",
            cell: (info: { getValue: () => string }) => (
              <span>{`${
                info.getValue() !== "Alkoholfritt"
                  ? info.getValue() + "%"
                  : info.getValue()
              }`}</span>
            ),
            header: () => <span>Prosent Alkohol</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { mainSubCategory: { code: any } }) =>
              row.mainSubCategory?.code || "N/A",
          },
        ],
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection);

    const selectedProductsByCategory = selectedIds.map(
      (id) => table?.getCoreRowModel().rowsById[id].original
    );

    setSelectedProducts(selectedProductsByCategory);
  }, [rowSelection, setSelectedProducts, table]);

  return (
    <div className="mx-auto pb-4 pr-4">
      <div className="flex flex-col items-center justify-between">
        <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value: any) => setGlobalFilter(String(value))}
            placeholder="Søk i alle produkter...."
            className="mb-8 w-full rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-600 md:w-auto"
          />
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
  );
}
