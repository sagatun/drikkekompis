export const flattenProducts = (data: any) => {
  const flattened = []
  for (const category in data) {
    if (data.hasOwnProperty(category)) {
      for (const productId in data[category]) {
        if (data[category].hasOwnProperty(productId)) {
          flattened.push({
            ...data[category][productId],
            category,
            productId
          })
        }
      }
    }
  }
  return flattened
}
