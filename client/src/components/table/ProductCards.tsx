import React from "react";

import ProductCard from "../shared/ProductCard";

interface Props {
  table: any;
}

function ProductCards({ table }: Props) {
  return (
    <div className="grid min-w-full grid-cols-2 gap-3">
      {table.getRowModel().rows.map((row: any) => {
        const isSelected = row.getIsSelected();
        const product = row?.original;

        return (
          <ProductCard
            product={product}
            isSelected={isSelected}
            toggleSelectHandler={row.getToggleSelectedHandler}
            key={row.id}
          />
        );
      })}
    </div>
  );
}

export default ProductCards;
