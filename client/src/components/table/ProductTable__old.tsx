import { flexRender } from "@tanstack/react-table";
import React from "react";
import Select from "react-select";

interface Props {
  table: any;
  rowSelection: any;
  selectedProducts: any;
  categoriesOptions: any;
  category: any;
  handleCategoryChange: any;
  setGlobalFilter: any;
  globalFilter: any;
  showSelectedProducts: any;
  setShowSelectedProducts: any;
}

function ProductTable({
  table,
  rowSelection,
  selectedProducts,
  categoriesOptions,
  category,
  handleCategoryChange,
  setGlobalFilter,
  globalFilter,
  showSelectedProducts,
  setShowSelectedProducts,
}: Props) {
  return (
    // <div>
    //   <div>
    //     <div>
    //       <button onClick={() => setShowSelectedProducts((prev) => !prev)}>
    //         {`Vis valge produkter (${Object.keys(rowSelection).length})`}
    //       </button>
    //     </div>
    //     <br />
    //     {showSelectedProducts && (
    //       <ul>
    //         {selectedProducts.map((product) => {
    //           return <li>{`${product.productName} (${product.category})`}</li>;
    //         })}
    //       </ul>
    //     )}

    //     <br />

    //     <div>
    //       <div>
    //         <div>
    //           <div>
    //             <Select
    //               options={categoriesOptions}
    //               value={category}
    //               onChange={(option) => handleCategoryChange(option)}
    //               placeholder="Velg kategori..."
    //               styles={customStyles}
    //             />
    //           </div>

    //           <DebouncedInput
    //             value={globalFilter ?? ""}
    //             onChange={(value) => setGlobalFilter(String(value))}
    //             placeholder="Søk i alle produkter...."
    //           />
    //         </div>
    //         <div>
    //           <div>
    //             <button
    //               onClick={() => table.setPageIndex(0)}
    //               disabled={!table.getCanPreviousPage()}
    //             >
    //               {"<<"}
    //             </button>
    //             <button
    //               onClick={() => table.previousPage()}
    //               disabled={!table.getCanPreviousPage()}
    //             >
    //               {"<"}
    //             </button>
    //             <button
    //               onClick={() => table.nextPage()}
    //               disabled={!table.getCanNextPage()}
    //             >
    //               {">"}
    //             </button>
    //             <button
    //               onClick={() => table.setPageIndex(table.getPageCount() - 1)}
    //               disabled={!table.getCanNextPage()}
    //             >
    //               {">>"}
    //             </button>
    //           </div>
    //           <select
    //             value={table.getState().pagination.pageSize}
    //             onChange={(e) => {
    //               table.setPageSize(Number(e.target.value));
    //             }}
    //           >
    //             {[10, 20, 30, 40, 50].map((pageSize) => (
    //               <option key={pageSize} value={pageSize}>
    //                 Vis {pageSize}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       </div>
    //       <div>
    //         <span>
    //           {/* <div>Page</div> */}
    //           <strong>
    //             {table.getState().pagination.pageIndex + 1} av
    //             {table.getPageCount()}
    //           </strong>
    //         </span>
    //         <div>{table.getPrePaginationRowModel().rows.length} Produkter</div>
    //         {/* <span>
    //             | Go to page:
    //             <input
    //               type="number"
    //               defaultValue={table.getState().pagination.pageIndex + 1}
    //               onChange={(e) => {
    //                 const page = e.target.value ? Number(e.target.value) - 1 : 0;
    //                 table.setPageIndex(page);
    //               }}
                
    //             />
    //           </span> */}
    //       </div>
    //     </div>

    //     <br />
    //     <div />

    //     <br />
    //   </div>

    //   <div />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                        {/* {header.column.getCanFilter() ? (
                              <div>
                                <Filter column={header.column} table={table} />
                              </div>
                            ) : null} */}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr onClick={row.getToggleSelectedHandler()} key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    //   <div />
    // </div>
  );
}

export default ProductTable;
