import axios from "axios";
import HTMLParser from "node-html-parser";
import { getFirestoreInstance } from "./firestore-functions.js";
import stringSimilarity from "string-similarity";

import slugify from "slugify";

function cleanName(name, breweryName = "") {
  const newName = name.replaceAll(
    /\b(IPA|DIPA|SIPA|TIPA|NEIPA)\b/g,
    (match) => {
      switch (match) {
        case "IPA":
          return "india pale ale";
        case "DIPA":
          return "double india pale ale";
        case "SIPA":
          return "session india pale ale";
        case "TIPA":
          return "triple india pale ale";
        case "NEIPA":
          return "new england india pale ale";
        default:
          return match;
      }
    }
  );

  let slugifiedBreweryName = slugify(breweryName, {
    lower: true,
    locale: "nb",
    remove: /[*+~.()'"!:@]/g,
  }).replaceAll("-", " ");

  let slugifiedName = slugify(newName, {
    lower: true,
    locale: "nb",
    remove: /[*+~.()'"!:@]/g,
  }).replaceAll("-", " ");

  slugifiedName
    .replace(/['"&%/|#!.()=$`´]/g, " ")
    // .replace(
    //   /(brewery|bryggeri|brauerei|bräu|co|company|as|ab|plc|s\.a\.|s\.p\.a\.|ag|gmbh|brewing|ales|beer|cidery|sideri)$/,
    //   ""
    // )
    // .replace(
    //   /(the|and|&|de|la|el|ipa|stout|ale|pils|lager|brew|ale|cidre|sider)/,
    //   ""
    // )
    .replace(/ß/g, "ss")

    // replace IPA with 'india pale ale', DIPA 'double india pale ale', SIPA with 'session india pale ale', TIPA with 'triple india pale ale' and NEIPA with 'new england india pale ale'

    // .replace(/\b(\d{4})\b/g, "")
    .trim();

  slugifiedBreweryName
    .replace(/['"`´]/g, " ")
    // .replace(
    //   /(brewery|bryggeri|brauerei|bräu|co|company|as|ab|plc|s\.a\.|s\.p\.a\.|ag|gmbh|brewing|ales|beer|cidery|sideri)$/,
    //   ""
    // )
    // .replace(
    //   /(the|and|&|de|la|el|ipa|stout|ale|pils|lager|brew|ale|cidre|sider)/,
    //   ""
    // )
    .replace(/ß/g, "ss")
    // .replace(/\b(\d{4})\b/g, "")
    .trim();

  // Fjerner bryggeriets navn ord for ord hvis det er oppgitt
  if (breweryName !== "") {
    const breweryWords = cleanName(slugifiedBreweryName).split(/\s+/);
    breweryWords.forEach((word) => {
      slugifiedName = slugifiedName
        .replace(new RegExp(`\\b${word}\\b`, "gi"), "")
        .trim();
    });
  }

  return slugifiedName;
}

export class UntappdFetcher {
  constructor() {
    this.baseUrl = "https://untappd.com/search";
  }

  async fetchProductRating(name, breweryName) {
    const url = `${this.baseUrl}?q=${encodeURIComponent(
      name.replace(/(\d\d\d\d)/, "")
    )}`;
    try {
      await this.sleep(1000); // Respectful delay
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
        },
      });
      return this.parseBeerData(response.data, name, breweryName);
    } catch (error) {
      console.error("Error fetching product rating:", error);
      return null;
    }
  }

  parseBeerData(html, productName, breweryName) {
    if (!productName || !breweryName) {
      console.log("productName or breweryName is empty.");
      return null;
    }

    console.log("Starter parsing av HTML-data.");
    const root = HTMLParser.parse(html);
    const beerItems = root.querySelectorAll(".beer-item");

    if (beerItems.length === 0) {
      if (productName.split(/\s+/).length <= 2) {
        console.log("Kunne ikke finne produktet på Untappd.");
        return null;
      }
      const newProductName = productName
        .split(/\s+/)
        .slice(0, -1)
        .join(" ")
        .trim();

      console.log(`Prøver med produkt-navn: ${newProductName}`);
      return this.fetchProductRating(newProductName, breweryName);
    }

    let topItem = null;
    for (let i = 0; i < beerItems.length; i++) {
      const breweryElement = beerItems[i].querySelector(".brewery a");
      const nameElement = beerItems[i].querySelector(".name a");

      if (!breweryElement || !nameElement) {
        console.log("Mangler element i beer-item: bryggeri eller navn.");
        continue;
      }

      const rawBreweryName = breweryElement.innerText;
      const rawProductName = nameElement.innerText;

      const itemBreweryName = cleanName(rawBreweryName);
      const itemProductName = cleanName(rawProductName, breweryName);

      if (
        this.isMatchSufficient(itemBreweryName, cleanName(breweryName)) &&
        this.isMatchSufficient(
          itemProductName,
          cleanName(productName, itemBreweryName)
        )
      ) {
        console.log("Tilstrekkelig match funnet for beer-item.");
        topItem = beerItems[i];
        break;
      } else {
        console.log("Match for beer-item ikke tilstrekkelig.");
      }
    }

    if (topItem) {
      return this.extractBeerInfo(topItem);
    } else {
      return null;
    }
  }

  calculateDynamicThreshold(name) {
    const wordCount = name.trim().split(/\s+/).length;
    if (wordCount <= 1) {
      return 0.25; // Senker terskelen litt for veldig korte navn (1 ord)
    } else if (wordCount === 2) {
      return 0.2; // Senker terskelen ytterligere for kortere navn (2 ord)
    } else if (wordCount <= 4) {
      return 0.15; // Gjør terskelen mer fleksibel for middels lange navn
    } else {
      return 0.1; // Beholder terskelen for lengre og mer komplekse navn
    }
  }

  isMatchSufficient(name1, name2) {
    console.log(`Sammenligner: '${name1}' med '${name2}'`);

    const words1 = new Set(name1.split(/\s+/));
    const words2 = new Set(name2.split(/\s+/));

    console.log(`Ordsett 1: ${[...words1]}`);
    console.log(`Ordsett 2: ${[...words2]}`);

    const intersect = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    const jaccardIndex = intersect.size / union.size;
    console.log(`Jaccard Index: ${jaccardIndex}`);

    // Velger navnet med flest ord for å beregne dynamisk terskel
    const longestName = words1.size > words2.size ? name1 : name2;
    const threshold = this.calculateDynamicThreshold(longestName);
    console.log(`Dynamisk terskel basert på navnlengde: ${threshold}`);

    const isSufficient = jaccardIndex >= threshold;
    console.log(`Er match tilstrekkelig: ${isSufficient}`);

    return isSufficient;
  }

  extractBeerInfo(item) {
    const ratingElement = item.querySelector(".num");
    const ratingText = ratingElement
      ? ratingElement.innerText.replace(/\(|\)/g, "")
      : null;

    const rating = ratingElement ? parseFloat(ratingText) : null;

    const validRating = rating && rating >= 0 && rating <= 5;

    const evaluatedRating = validRating ? rating : -1;

    const ratingUrl = rating
      ? `https://untappd.com${item
          .querySelector(".name a")
          .getAttribute("href")}`
      : null;

    return { evaluatedRating, ratingUrl };
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class FirestoreHandler {
  constructor() {
    this.firestore = null;
  }

  async init() {
    this.firestore = await getFirestoreInstance();
  }

  async updateProductRating(productId, ratingData) {
    if (!this.firestore) {
      console.error("Firestore not initialized");
      return;
    }

    const productRef = this.firestore.collection("products").doc(productId);
    await productRef.update({ untappd: ratingData });
  }

  async deleteUntappdRatings() {
    if (!this.firestore) {
      console.error("Firestore not initialized");
      return;
    }

    const productsRef = this.firestore.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      console.log("No products found in Firestore.");
      return;
    }

    for (const doc of snapshot.docs) {
      console.log(doc.data().untappd);
      if (doc.data().untappd !== null) {
        await doc.ref.update({ untappd: null }); // Setter untappd-feltet til null
        console.log(`Untappd rating deleted for product ID: ${doc.id}`);
      }
    }

    console.log("All Untappd ratings deleted.");
  }
}

const beerCategories = ["øl", "sider", "alkoholfritt", "mjød"];

const untappdFetcher = new UntappdFetcher();
const firestoreHandler = new FirestoreHandler();

export async function updateBeerRatings() {
  await firestoreHandler.init();

  // Uncomment to delete all Untappd ratings
  // await firestoreHandler.deleteUntappdRatings();
  // return;

  const productsRef = firestoreHandler.firestore.collection("products");
  const snapshot = await productsRef.get();

  if (snapshot.empty) {
    console.log("No products found in Firestore.");
    return;
  }

  for (const doc of snapshot.docs) {
    const product = doc.data();
    if (!beerCategories.includes(product.mainCategory.code)) {
      continue;
    }

    if (!doc.id || doc.id === "") {
      console.error(
        `Invalid product ID for product: ${JSON.stringify(product)}`
      );
      continue;
    }

    if (product.untappd && product.untappd.rating >= -1) {
      console.log(
        `Product with ID ${doc.id} already has a rating from Untappd. Skipping.`
      );
      continue;
    }

    const productName = cleanName(product.name)
      .split(" ")
      .splice(0, 3)
      .join(" ");

    console.log(`Processing product with ID ${doc.id}`);
    const ratingData = await untappdFetcher.fetchProductRating(
      product.name,
      product?.mainProducer?.name ?? ""
    );

    if (ratingData) {
      await firestoreHandler.updateProductRating(doc.id, ratingData);
      console.log(
        `Updated product with ID ${doc.id} with new rating from Untappd`
      );
    } else {
      console.log(
        `No rating found for product with ID ${doc.id} from Untappd.`
      );
      await firestoreHandler.updateProductRating(doc.id, {
        rating: -1,
        ratingUrl: null,
      });
    }
  }
  console.log("Update of product ratings from Untappd completed.");
}
