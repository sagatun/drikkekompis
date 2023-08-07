import { Firestore } from "@google-cloud/firestore";

let firestoreInstance: Firestore | undefined;

export async function initializeFirestore() {
  console.log("Initializing Firestore...");

  if (!firestoreInstance) {
    const firestoreConfig = {};
    try {
      firestoreInstance = new Firestore(firestoreConfig);
    } catch (error) {
      console.error("Failed to initialize Firestore", error);
      throw error;
    }
  }

  if (firestoreInstance instanceof Firestore) {
    console.log("Firestore instance is valid");
  } else {
    console.error("Firestore instance is not valid");
  }

  console.log("Firestore initialized.");
}

export async function getFirestoreInstance() {
  if (!firestoreInstance) {
    await initializeFirestore();
  }
  return firestoreInstance;
}
