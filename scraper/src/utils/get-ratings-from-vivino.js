import axios from "axios";
import HTMLParser from "node-html-parser";

import { getFirestoreInstance } from "./firestore-functions.js";
import stringSimilarity from "string-similarity";

import slugify from "slugify";

function cleanName(name) {
  let slugifiedName = slugify(name, {
    lower: true,
    locale: "nb",
    // remove: /[*+~.()'"!:@]/g,
  }).replaceAll("-", " ");

  // if slugifiedName contains word with only one letter, remove it
  slugifiedName = slugifiedName;

  slugifiedName
    .replace(/\b\w{1}\b/g, "")
    .replace(/['"&%/|#!.()=$`´]/g, " ")
    .replace(/ß/g, "ss")
    .trim();

  return slugifiedName;
}

export class VivinoFetcher {
  constructor() {
    this.baseUrl = "https://www.vivino.com/search/wines";
  }

  async fetchWineData(wineName) {
    const url = `${this.baseUrl}?q=${encodeURIComponent(wineName)}`;
    try {
      await this.sleep(10000);
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:86.0) Gecko/20100101 Firefox/86.0",
        },
      });
      if (response.status === 429) {
        throw new Error("Too many requests");
      }
      return this.parseWineData(response.data);
    } catch (error) {
      console.error("Error fetching wine data:", error);
      return null;
    }
  }

  parseWineData(html) {
    const root = HTMLParser.parse(html);
    const wineCards = root.querySelectorAll(".wine-card__content");

    let highestSimilarity = -1;
    let bestMatch = null;

    wineCards.forEach((wineCard) => {
      const boldElement = wineCard.querySelector("span.bold");
      const markElements = wineCard.querySelectorAll("mark");

      const boldText = boldElement.innerText.trim();
      let markText = "";
      markElements.forEach((element) => {
        markText += element.innerText;
      });

      const newBoldText = cleanName(boldText);
      const newMarkText = cleanName(markText);

      const similarity = stringSimilarity.compareTwoStrings(
        newBoldText,
        newMarkText
      );

      if (similarity > 0.666 && similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = wineCard;
      }
    });

    if (bestMatch) {
      return this.extractWineInfo(bestMatch);
    }
    return null;
  }

  // let bestMatch = null;
  // let highestSimilarity = 0;

  // wineCards.forEach((card) => {
  //   const nameElement = card.querySelector(".wine-card__name a span");
  //   const cardName = nameElement.innerText.trim().toLowerCase();
  //   const similarity = stringSimilarity.compareTwoStrings(
  //     wineName.toLowerCase(),
  //     cardName
  //   );

  //   if (similarity > highestSimilarity) {
  //     highestSimilarity = similarity;
  //     bestMatch = card;
  //   }
  // });

  // if (bestMatch) {
  //   return this.extractWineInfo(bestMatch);
  // }
  // return null;
  // }

  extractWineInfo(card) {
    const urlElement = card.querySelector(
      ".wine-card__name a.link-color-alt-grey"
    );
    const vivinoUrl = urlElement
      ? `https://www.vivino.com${urlElement.getAttribute("href")}`
      : null;
    const ratingElement = card.querySelector(".average__number");

    const averageRating = ratingElement
      ? parseFloat(ratingElement.innerText.replace(",", ".").trim())
      : null;

    const validRating =
      averageRating && averageRating > 0 && averageRating <= 5;

    const evaluatedRating = validRating ? averageRating : -1;

    console.log("AverageRating: " + averageRating);

    return { vivinoUrl, evaluatedRating };
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
    await productRef.update({ vivino: ratingData });
  }

  async deleteVivinoRatings() {
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
      console.log(doc.data().vivino);
      if (doc.data().vivino !== null) {
        await doc.ref.update({ vivino: null }); // Setter untappd-feltet til null
        console.log(`Vivino rating deleted for product ID: ${doc.id}`);
      }
    }

    console.log("All Vivino ratings deleted.");
  }

  // if averageRating is -1, set vivino to null
  async removeVivinoWithoutRating() {
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
      if (doc.data()?.vivino?.averageRating === -1) {
        await doc.ref.update({ vivino: null });
        console.log(`Vivino rating deleted for product ID: ${doc.id}`);
      }
    }

    console.log("All Vivino ratings deleted.");
  }
}

const wineCategories = [
  "rødvin",
  "hvitvin",
  "rosévin",
  "musserende_vin",
  "sterkvin",
  "perlende_vin",
  "aromatisert_vin",
  "alkoholfritt",
  "sake",
  "fruktvin",
];

const vivinoFetcher = new VivinoFetcher();
const firestoreHandler = new FirestoreHandler();

export async function updateWineRatings() {
  await firestoreHandler.init();

  // Uncomment to delete all Vivino ratings
  // await firestoreHandler.deleteVivinoRatings();
  // return;

  // Uncomment to delete all Vivino ratings with -1 score
  // await firestoreHandler.removeVivinoWithoutRating();
  // return;

  const productsRef = firestoreHandler.firestore.collection("products");
  const snapshot = await productsRef.get();

  if (snapshot.empty) {
    console.log("No products found in Firestore.");
    return;
  }

  for (const doc of snapshot.docs) {
    const product = doc.data();
    if (!wineCategories.includes(product.mainCategory.code)) {
      continue;
    }

    if (!doc.id || doc.id === "") {
      console.error(
        `Invalid product ID for product: ${JSON.stringify(product)}`
      );
      continue;
    }

    if (product.vivino && product.vivino.averageRating >= -1) {
      console.log(
        `Product with ID ${doc.id} already has a rating from Vivino. Skipping.`
      );
      continue;
    }

    console.log(`Processing product with ID ${doc.id}`);
    console.log(`${product?.mainProducer?.name ?? ""} ${product.name}`);

    const ratingData = await vivinoFetcher.fetchWineData(
      `${product?.mainProducer?.name} ${product.name}`
    );

    if (ratingData) {
      await firestoreHandler.updateProductRating(doc.id, ratingData);
      console.log(
        `Updated product with ID ${doc.id} with new rating from Vivino`
      );
    } else {
      console.log(`No rating found for product with ID ${doc.id} from Vivino.`);
      await firestoreHandler.updateProductRating(doc.id, {
        vivinoUrl: null,
        averageRating: -1,
      });
    }
  }
  console.log("Update of product ratings from Vivino completed.");
}
