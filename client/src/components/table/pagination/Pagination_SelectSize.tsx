import React from "react";

function Pagination_Select_Size({ table }: any) {
  return (
    <select
      className="bg-gray-800 text-white rounded-md py-2 px-4 border border-gray-700 focus:outline-none focus:border-green-500"
      value={table.getState().pagination.pageSize}
      onChange={(e) => {
        table.setPageSize(Number(e.target.value));
      }}
    >
      {[10, 20, 30, 40, 50].map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          Vis {pageSize}
        </option>
      ))}
    </select>
  );
}
