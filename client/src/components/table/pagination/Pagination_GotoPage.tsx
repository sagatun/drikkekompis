import React from 'react'

export function Pagination_GotoPage ({ table }: any) {
  return (
    <div className="flex items-center">
      <label className="mr-2">Gå til side:</label>
      <input
        className="py-1 px-2 border rounded-md"
        type="number"
        defaultValue={table.getState().pagination.pageIndex + 1}
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0
          table.setPageIndex(page)
        }}
      />
    </div>
  )
}
