import { Firestore } from "@google-cloud/firestore";

let firestoreInstance: string | Firestore;

export async function initializeFirestore() {
  if (!firestoreInstance) {
    const firestoreConfig = {};

    firestoreInstance = new Firestore(firestoreConfig);
  }
  console.log("Firestore initialized: " + firestoreInstance);
}

export async function getFirestoreInstance() {
  if (!firestoreInstance) {
    await initializeFirestore();
  }
  return firestoreInstance;
}
