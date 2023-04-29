export function Pagination_CountProducts({ table }: any) {
  return (
    <div className="text-gray-500 text-sm">
      {table.getPrePaginationRowModel().rows.length} Produkter
    </div>
  );
}
