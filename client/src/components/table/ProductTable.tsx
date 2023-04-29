import React, { useEffect, useState } from "react";
import Select from "react-select";
import ProductCards from "./ProductCards";
import { Product } from "../../types";
import ProductCard from "../shared/ProductCard";
import { CategorySelect } from "./CategorySelect";
import { DebouncedInput } from "./DebouncedInput";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";

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

export function ProductTable({
  productsData,
  categories,
  selectedProducts,
  setSelectedProducts,
  selectedCategory,
  setSelectedCategory,
}: any): React.ReactElement {
  const [data, setData] = React.useState(productsData);
  const [showSelectedProducts, setShowSelectedProducts] = React.useState(false);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  useEffect(() => {
    const selectedIds = Object.keys(rowSelection);

    const selectedProductsByCategory = selectedIds.map(
      (id) => table?.getCoreRowModel().rowsById[id].original
    );

    setSelectedProducts(selectedProductsByCategory);
  }, [rowSelection]);

  const columns = React.useMemo(
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
            accessorFn: (row) => row.productId,
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
            accessorFn: (row) =>
              (row.mainProducer && row.mainProducer?.name) || "N/A",
            id: "mainProducer",
            cell: (info) => info.getValue(),
            header: () => <span>Produsent</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.containerSize || "N/A",
            id: "containerSize",
            cell: (info) => info.getValue(),
            header: () => <span>Størrelse</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) =>
              (row.mainCategory && row.mainCategory?.name) || "N/A",
            id: "mainCategory",
            cell: (info) => info.getValue(),
            header: () => <span>Kategori</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) =>
              (row.mainCountry && row.mainCountry?.name) || "N/A",
            id: "mainCountry",
            cell: (info) => info.getValue(),
            header: () => <span>Land</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => (row.district && row.district?.name) || "N/A",
            id: "district",
            cell: (info) => info.getValue(),
            header: () => <span>Distrikt</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.price || "N/A",
            id: "price",
            cell: (info) => <span>{`${info.getValue()} kr`}</span>,
            header: () => <span>Pris</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.abv || "Alkoholfritt",
            id: "abv",
            cell: (info) => (
              <span>{`${
                info.getValue() !== "Alkoholfritt"
                  ? info.getValue() + "%"
                  : info.getValue()
              }`}</span>
            ),
            header: () => <span>Prosent Alkohol</span>,
            footer: (props) => props.column.id,
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
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: false,
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col items-center justify-between md:flex-col">
        <button
          onClick={() => setShowSelectedProducts((prev) => !prev)}
          className="my-4 w-full rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:bg-gray-300"
        >
          {`${
            showSelectedProducts
              ? "Skjul valgte produkter"
              : "Vis valgte produkter"
          } (${Object.keys(rowSelection).length})`}
        </button>
        {showSelectedProducts && (
          <ul className="my-4 md:my-0">
            {selectedProducts.map((product: Product) => {
              return (
                <React.Fragment key={product.productId}>
                  <ProductCard product={product} />
                </React.Fragment>
                // <li
                //   key={product.productId}
                //   className="my-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:bg-gray-300"
                // >
                //   {`${product.name} (${product.mainCategory.name})`}
                // </li>
              );
            })}
            <li
              onClick={() => setRowSelection([])}
              className="my-8 rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out hover:bg-gray-300"
            >
              Nullstill listen
            </li>
          </ul>
        )}
        <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <CategorySelect
            categories={categories}
            setColumnFilters={setColumnFilters}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            className="w-full md:w-auto"
          />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value: any) => setGlobalFilter(String(value))}
            placeholder="Søk i alle produkter...."
            className="w-full rounded-md bg-gray-200 px-4 py-2 text-gray-800 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-600 md:w-auto"
          />
          <Pagination className={"w-full"} table={table} />
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
