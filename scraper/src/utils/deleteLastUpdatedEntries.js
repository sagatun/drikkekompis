import { FieldValue } from "@google-cloud/firestore"; // Dette er import-setningen du bør legge til øverst i koden din

export async function removeLastScrapedFromStores(firestore) {
  const storesCollection = firestore.collection("stores_new");
  const storesSnapshot = await storesCollection.get();
  const batch = firestore.batch();

  storesSnapshot.forEach((doc) => {
    const storeRef = storesCollection.doc(doc.id);
    batch.update(storeRef, { lastScraped: FieldValue.delete() });
  });

  await batch.commit();
}
