import React from 'react'

export function PaginationCountPages ({ table }: any) {
  return (
    <div className={'mx-auto mt-2 flex justify-center text-xs dark:text-white'}>
      Side {table.getState().pagination.pageIndex + 1} av {table.getPageCount()}
    </div>
  )
}
