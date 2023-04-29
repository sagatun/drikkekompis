export const flattenProducts = (data) => {
  let flattened = [];
  for (const category in data) {
    if (data.hasOwnProperty(category)) {
      for (const productId in data[category]) {
        if (data[category].hasOwnProperty(productId)) {
          flattened.push({
            ...data[category][productId],
            category: category,
            productId: productId,
          });
        }
      }
    }
  }
  return flattened;
};
