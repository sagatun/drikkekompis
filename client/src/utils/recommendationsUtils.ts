import { type Category, type Product } from 'src/types'
import slugify from 'slugify'

export function findCategoryInInputText (
  inputText: string,
  categories: Category[],
  subCategories: Category[]
): string[] | undefined {
  const cleanedInputText = slugify(inputText, {
    lower: true
  })

  function findInText (text: string, searchWords: string[]) {
    const escapedSearchWords = searchWords
      .map((word) =>
        word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/ /g, '\\s')
      )
      .join('|')
    const regex = new RegExp(`\\b(?:${escapedSearchWords})\\b`, 'i')
    const match = text.match(regex)
    return match && match[0]
  }

  function findCategoriesWithFilter (filterFn: (name: string) => boolean) {
    const categoryCodes: string[] = []
    for (const category of categories.concat(subCategories)) {
      if (!category.names) continue
      const filteredNames = category.names
        .filter(filterFn)
        .map((name) => slugify(name, { lower: true }))
      const foundCategoryName = findInText(cleanedInputText, filteredNames)
      if (foundCategoryName) {
        categoryCodes.push(category.code)
      }
    }
    return categoryCodes
  }

  const categoryCodes: string[] = []

  // Look for two-word categories containing "vin"
  categoryCodes.push(
    ...findCategoriesWithFilter(
      (name) =>
        slugify(name, { lower: true }).includes('vin') &&
        name.split(' ').length === 2
    )
  )
  // If no two-word category containing "vin" is found, look for "vin" directly
  if (categoryCodes.length === 0) {
    const vinResult = findInText(cleanedInputText, ['vin'])
    if (vinResult) {
      categoryCodes.push(
        'rødvin',
        'hvitvin',
        'rosevin',
        'sterkvin',
        'musserende_vin',
        'aromatisert_vin',
        'perlende_vin',
        'sterkvin',
        'fruktvin'
      )
    }
  }

  // Look for other categories and add them to the list
  categoryCodes.push(...findCategoriesWithFilter(() => true))

  return categoryCodes
}

export function randomizeAndCap<T> (list: T[], maxItems: number): T[] {
  const shuffledList = list.sort(() => Math.random() - 0.5)

  return shuffledList.slice(0, maxItems)
}

export function filterProductsByCategory (
  products: Product[],
  categoryCodes: string[],
  subCategories: any[]
) {
  if (!categoryCodes || categoryCodes.length === 0) {
    return
  }

  const filteredProducts = products.filter((product) => {
    return (
      categoryCodes.includes(product.mainCategory.code) ||
      categoryCodes.includes(product.mainSubCategory?.code)
    )
  })

  return filteredProducts
}

function escapeRegExp (string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function getNamesFromResponse (rawContent: string, names: string[]) {
  // Slugify rawContent
  const slugifiedContent = slugify(rawContent, {
    lower: true,
    remove: /[*+~.()'"!:@]/g // add any special characters you want to remove
  })

  // Slugify names, escape special characters
  const slugifiedNames = names.map((name) =>
    escapeRegExp(slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }))
  )

  // Find all names in slugifiedContent using individual regex for each pattern
  const matchedNames: string[] = []
  slugifiedNames.forEach((name) => {
    const pattern = new RegExp(`(${name})`, 'gi')
    let match
    while ((match = pattern.exec(slugifiedContent)) !== null) {
      // Check if the character before and after the match are word characters
      // If they are, this means that the match is part of a larger word, and we should skip it
      const beforeChar = slugifiedContent[match.index - 1]
      const afterChar = slugifiedContent[match.index + match[0].length]
      if (
        (beforeChar === undefined || !/\w/.test(beforeChar)) &&
        (afterChar === undefined || !/\w/.test(afterChar))
      ) {
        matchedNames.push(match[0])
      }
    }
  })

  if (matchedNames.length > 0) {
    // Create a Set to remove duplicates, then convert it back to an array
    const uniqueMatchedNames = Array.from(new Set(matchedNames))
    return uniqueMatchedNames
  } else {
    return []
  }
}

export function convertProductList (products: Product[]) {
  return products.map((product) => product.name + '\n')
}
