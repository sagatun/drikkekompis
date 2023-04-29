import React from "react";

interface Props {
  table: any;
}

export function Pagination({ table }: Props): React.ReactElement {
  return (
    <div className={"mt-8 flex w-full justify-center gap-6"}>
      <button
        className="mx-2 rounded bg-gray-800 px-2 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </button>
      <button
        className="mx-2 rounded bg-gray-800 px-2 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <button
        className="mx-2 rounded bg-gray-800 px-2 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </button>
      <button
        className="mx-2 rounded bg-gray-800 px-2 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </button>
    </div>
  );
}
