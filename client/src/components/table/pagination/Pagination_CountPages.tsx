import React from "react";

export function PaginationCountPages({ table }: any) {
  const pageIndex = table?.getState()?.pagination?.pageIndex;
  const pageCount = table?.getPageCount?.();
  if (pageIndex === undefined || pageCount === undefined) {
    return null; // or some fallback UI
  }
  return (
    <div className={"mx-auto my-4 flex justify-center text-xs dark:text-white"}>
      Side {table.getState().pagination.pageIndex + 1} av {table.getPageCount()}
    </div>
  );
}
