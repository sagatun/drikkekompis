import axios from "axios";
import { getFirestoreInstance } from "./firestore-functions.js";
import HTMLParser from "node-html-parser";

const STORE_ID = "200"; // ButikkID

export async function updateProductRatingsInFirestore() {
  try {
    console.log("Starter oppdatering av produktvurderinger");

    const firestore = await getFirestoreInstance();
    const productsRef = firestore.collection("products"); // Oppdatert til sentral "products" samling

    console.log("Henter produkter fra Firestore...");
    const snapshot = await productsRef.get();
    if (snapshot.empty) {
      console.log("Ingen produkter funnet i Firestore.");
      return;
    }
    console.log(`Funnet ${snapshot.docs.length} produkter i Firestore`);

    const batch = firestore.batch();
    for (const doc of snapshot.docs) {
      const product = doc.data();
      if (
        Boolean(product.apertifRating) &&
        Number(product.apertifRating.rating) >= -1
      ) {
        console.log(
          `Produkt med ID ${product.productId} har allerede rating. Hopper over.`
        );
        continue;
      }
      product.productId = doc.id;
      console.log(`Behandler produkt med ID ${product.productId}`);

      const ratingData = await FetchProductRating(
        product.productId,
        product.name
      );

      if (ratingData && ratingData.rating !== null) {
        console.log(
          `Oppdaterer produktet med ID ${product.productId} med ny rating`
        );
        batch.update(doc.ref, {
          apertifRating: {
            rating: ratingData.rating,
            ratingComment: ratingData.comment,
            ratingUrl: ratingData.ratingUrl,
          },
        });
      } else {
        console.log(
          `Ingen rating funnet for produktet med ID ${product.productId}.`
        );
        batch.update(doc.ref, {
          apertifRating: {
            rating: -1,
            ratingComment: null,
            ratingUrl: null,
          },
        });
      }
    }
    await batch.commit();
    console.log("Oppdatering av produktvurderinger fullført.");
  } catch (error) {
    console.error(`Feil under oppdatering av produktvurderinger: ${error}`);
  }
}

async function FetchProductRating(productId, name) {
  let rating = null;
  let ratingComment = null;

  console.log(`Henter rating for produkt-ID ${productId} fra Aperitif`);
  name = encodeURIComponent(name.replace(/(\d\d\d\d)/, ""));
  return await axios
    .get("https://www.aperitif.no/pollisten?query=" + name)
    .then(async function (res) {
      console.log(`Forespørsel fullført for produkt-ID ${productId}`);
      let pageRoot = HTMLParser.parse(res.data);
      let ratingHtml = pageRoot.querySelectorAll(
        ".product-list-element .group-2 .points .number"
      );
      let urlHtml = pageRoot.querySelectorAll(
        ".product-list-element .group-1  a"
      );
      let results = pageRoot.querySelectorAll(
        ".product-list-element .group-1  .detail .index"
      );
      let matchIndex = results.findIndex((e) =>
        e.innerText.includes(productId)
      );

      if (matchIndex == -1) {
        console.log(
          `Ingen treff funnet for produkt-ID ${productId} på Aperitif`
        );
        return {
          productId: productId,
          rating: null,
          comment: null,
          ratingUrl: null,
        };
      }

      let url = urlHtml.length > 0 ? urlHtml[matchIndex].attributes.href : null;
      rating = parseInt(ratingHtml[matchIndex].innerText);
      url = "https://www.aperitif.no/" + url;

      console.log(`Rating funnet for produkt-ID ${productId}: ${rating}`);
      await axios.get(url).then(async function (res) {
        let pageRoot = HTMLParser.parse(res.data);
        let commentHtml = pageRoot.querySelectorAll("h2.conclusion");
        ratingComment =
          commentHtml.length > 0 ? commentHtml[0].innerText : null;
        console.log(`Rating kommentar hentet for produkt-ID ${productId}`);
      });

      return {
        productId: productId,
        rating: rating,
        comment: ratingComment,
        ratingUrl: url,
      };
    })
    .catch((err) => {
      console.error(
        `Feil ved henting av produkt rating for ID ${productId}: ${err}`
      );
      return {
        productId: productId,
        rating: rating,
        comment: null,
        ratingUrl: null,
      };
    });
}
