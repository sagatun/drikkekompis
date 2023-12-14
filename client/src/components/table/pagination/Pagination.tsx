import React from "react";

interface Props {
  table: any;
}

export function Pagination({ table }: Props): React.ReactElement {
  return (
    <div className={"flex w-full my-4 justify-between gap-6"}>
      <button
        className="px-2 py-1 mx-2 text-white bg-gray-800 rounded disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </button>
      <button
        className="px-2 py-1 mx-2 text-white bg-gray-800 rounded disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <button
        className="px-2 py-1 mx-2 text-white bg-gray-800 rounded disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </button>
      <button
        className="px-2 py-1 mx-2 text-white bg-gray-800 rounded disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </button>
    </div>
  );
}
