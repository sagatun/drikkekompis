import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
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
import { SortConfig, type SortingEntry } from "src/types";
import Select from "react-select";

const SortOptions = [
  { value: "name:asc", label: "Navn Stigende" },
  { value: "name:desc", label: "Navn Synkende" },
  { value: "price:asc", label: "Pris Stigende" },
  { value: "price:desc", label: "Pris Synkende" },
  { value: "apertifRating:asc", label: "Aperitif Rating Synkende" },
  { value: "untappdRating:asc", label: "Untappd Rating Synkende" },
  { value: "vivinoRating:asc", label: "Vivino Rating Synkende" },
];

export function ProductTable() {
  const { state, filterProducts } = useAppState();
  const { productsInStore: data } = state;

  const [sorting, setSorting] = useState<SortingEntry[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [priceRange, setPriceRange] = useState<any>([0, 100000]); // Anta et prisområde

  const [categoryFilter, setCategoryFilter] = useState<string | any>([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | any>([]);

  const handleSortChange = useCallback(
    (selectedOption: any) => {
      if (!selectedOption) return;

      const value = selectedOption.value.split(":");
      const key = value[0];
      const direction = value[1];

      setSorting([{ id: key, desc: direction === "desc" }]);
    },
    [
      setSorting,
      // sorting,
    ]
  );

  useEffect(() => {
    filterProducts({
      priceRange,
      categoryFilter,
      subCategoryFilter,
      globalFilter,
    });
  }, [priceRange, categoryFilter, subCategoryFilter, globalFilter]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(
      data.map((item) => item.mainCategory?.name).filter(Boolean)
    );
    return Array.from(categories);
  }, [data, categoryFilter, subCategoryFilter]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter basert på kategori, underkategori, og nå pris
      const isCategoryMatch = categoryFilter.length
        ? categoryFilter.includes(item.mainCategory?.name)
        : true;
      const isSubCategoryMatch = subCategoryFilter.length
        ? subCategoryFilter.includes(item.mainSubCategory?.name)
        : true;
      const isPriceMatch =
        Number(item.price) >= priceRange[0] &&
        Number(item.price) <= priceRange[1];
      return isCategoryMatch && isSubCategoryMatch && isPriceMatch;
    });
  }, [data, categoryFilter, subCategoryFilter, priceRange]);

  const uniqueSubCategories = useMemo(() => {
    if (!categoryFilter.length) {
      return [];
    }
    const subCategories = new Set(
      data
        .filter((item) => categoryFilter.includes(item.mainCategory?.name))
        .map((item) => item.mainSubCategory?.name)
        .filter(Boolean)
    );
    return Array.from(subCategories);
  }, [data, categoryFilter]);

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
            enableSorting: true,
          },
          {
            accessorFn: (row: { mainProducer: { name: any } }) =>
              row.mainProducer?.name || "N/A",
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
              row.mainCategory?.name || "N/A",
            id: "mainCategory",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Kategori</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
            enableSorting: true,
          },
          {
            accessorFn: (row: { mainCountry: { name: any } }) =>
              row.mainCountry?.name || "N/A",
            id: "mainCountry",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Land</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
          },
          {
            accessorFn: (row: { district: { name: any } }) =>
              row.district?.name || "N/A",
            id: "district",
            cell: (info: { getValue: () => any }) => info.getValue(),
            header: () => <span>Distrikt</span>,
            footer: (props: { column: { id: any } }) => props.column.id,
            enableSorting: true,
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
            id: "mainCategory",
          },
          {
            accessorFn: (row: any) => row.apertifRating?.rating,
            id: "apertifRating",
            sortingFn: "customApertifRatingSort",
          },
          {
            accessorFn: (row: any) => row.untappd?.rating,
            id: "untappdRating",
            sortingFn: "customUntappdRatingSort",
          },
          {
            accessorFn: (row: any) => row.vivino?.averageRating,
            id: "vivinoRating",
            sortingFn: "customVivinoRatingSort",
          },
        ],
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnFilters,
      globalFilter,
      rowSelection,
      sorting,
    },
    sortingFns: {
      customApertifRatingSort,
      customUntappdRatingSort,
      customVivinoRatingSort,
    },
    enableRowSelection: true, // enable row selection for all rows
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
    onSortingChange: setSorting, // Tillater oppdateringer av sortering
  });

  const renderCategoryFilter = () => {
    const options = uniqueCategories.map((category) => ({
      value: category,
      label: category,
    }));
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
          );
        }}
      />
    );
  };

  const renderSubCategoryFilter = () => {
    const options = uniqueSubCategories.map((subCategory) => ({
      value: subCategory,
      label: subCategory,
    }));
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
          );
        }}
        isDisabled={!categoryFilter.length || uniqueSubCategories.length === 0}
      />
    );
  };

  const renderSortDropdown = () => {
    return (
      <Select
        options={SortOptions}
        placeholder="Sorter etter..."
        classNamePrefix="select"
        onChange={handleSortChange} // Oppdater til å bruke den nye handleSortChange
        className="w-full transition-shadow duration-300 rounded shadow-md hover:shadow-lg"
      />
    );
  };

  return (
    <div className="w-full pr-4 mx-auto">
      <div className="flex flex-col items-center justify-between">
        <div className="flex flex-col lg:flex-col items-center justify-between w-full max-w-[600px] gap-4 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(e: any) => {
              if (!e) return;
              setGlobalFilter(String(e.target.value));
            }}
            className="w-full px-4 py-2 mt-12 text-sm border border-gray-300 rounded-md shadow-sm md:ml-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Søk i alle produkter...."
          />
          <div className="flex flex-col justify-between w-full h-auto gap-4">
            <div>
              <PriceInput
                min={0}
                max={100000}
                value={priceRange}
                onChange={setPriceRange}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between w-full h-auto gap-4">
            <div>{renderCategoryFilter()}</div>
            <div>{renderSubCategoryFilter()}</div>
          </div>
          <div className="w-full h-16 mt-8 ">{renderSortDropdown()}</div>
        </div>
      </div>
      {table.getRowModel().rows.length > 0 ? (
        <div>
          <Pagination table={table} />
          <PaginationCountPages table={table} />
          <div className="flex items-center justify-between mt-4" />
          <ProductCards table={table} />
          <Pagination table={table} />
          <PaginationCountPages table={table} />
        </div>
      ) : (
        <div className="flex items-center justify-center min-w-max h-96">
          {filteredData.length > 0 ? (
            <div className="text-white">Ingen produkter funnet...</div>
          ) : (
            <div className="text-white">Laster inn produkter...</div>
          )}
        </div>
      )}
    </div>
  );
}

const customApertifRatingSort = (rowA: any, rowB: any) => {
  const ratingA = rowA.original?.apertifRating?.rating;
  const ratingB = rowB.original?.apertifRating?.rating;

  // Hvis begge verdiene er undefined, betrakt dem som like
  if (ratingA === undefined && ratingB === undefined) {
    return 0;
  }

  // Hvis A er undefined, skal B komme først (A skal være sist)
  if (ratingA === undefined) {
    return 1;
  }

  // Hvis B er undefined, skal A komme først (B skal være sist)
  if (ratingB === undefined) {
    return -1;
  }

  // Vanlig sammenligning for tallverdier
  return ratingB - ratingA;
};

const customUntappdRatingSort = (rowA: any, rowB: any) => {
  const ratingA = rowA.original?.untappd?.rating;
  const ratingB = rowB.original?.untappd?.rating;

  // Hvis begge verdiene er undefined, betrakt dem som like
  if (ratingA === undefined && ratingB === undefined) {
    return 0;
  }

  // Hvis A er undefined, skal B komme først (A skal være sist)
  if (ratingA === undefined) {
    return 1;
  }

  // Hvis B er undefined, skal A komme først (B skal være sist)
  if (ratingB === undefined) {
    return -1;
  }

  // Vanlig sammenligning for tallverdier
  return ratingB - ratingA;
};

const customVivinoRatingSort = (rowA: any, rowB: any) => {
  const ratingA = rowA.original?.vivino?.averageRating;
  const ratingB = rowB.original?.vivino?.averageRating;

  // Hvis begge verdiene er undefined, betrakt dem som like
  if (ratingA === -1 && ratingB === -1) {
    return 0;
  }

  // Hvis A er -1, skal B komme først (A skal være sist)
  if (ratingA === -1) {
    return 1;
  }

  // Hvis B er -1, skal A komme først (B skal være sist)
  if (ratingB === -1) {
    return -1;
  }

  // Vanlig sammenligning for tallverdier
  return ratingB - ratingA;
};

interface PriceInputProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event && event.target) {
      const value = Number(event.target.value);
      const newValue = [...inputValue];
      newValue[index] = value;
      setInputValue(newValue as [number, number]);
      onChange(newValue as [number, number]);
    }
  };

  return (
    <div className="flex justify-between w-full gap-4">
      <div>
        <label htmlFor="min-price" className="block text-sm text-white ">
          Fra kr
        </label>
        <DebouncedInput
          id="min-price"
          type="tel"
          min={min}
          max={max}
          value={inputValue[0]}
          onChange={(event) => handleInputChange(0, event)}
          onFocus={(event) => event.target.select()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Min pris"
        />
      </div>
      <div>
        <label htmlFor="max-price" className="block text-sm text-white">
          Til kr
        </label>
        <DebouncedInput
          id="max-price"
          type="tel"
          min={min}
          max={max}
          value={inputValue[1]}
          onChange={(event) => handleInputChange(1, event)}
          onFocus={(event) => event.target.select()}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Max pris"
        />
      </div>
    </div>
  );
};
