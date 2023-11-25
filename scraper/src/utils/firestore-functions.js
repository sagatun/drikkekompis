import { Firestore } from "@google-cloud/firestore";
import SAkey from "../../drikkekompis-firestore-test.json" assert { type: "json" };
import dotenv from "dotenv";

dotenv.config();

let firestoreInstance;

const serviceAccount = process.env.NODE_ENV === "production" ? null : SAkey;

// Rest of the code remains the same

async function initializeFirestore() {
  if (!firestoreInstance) {
    const firestoreConfig =
      process.env.NODE_ENV === "production"
        ? null
        : {
            projectId: serviceAccount.project_id,
            credentials: serviceAccount,
          };

    firestoreInstance = new Firestore(firestoreConfig);
  }
  console.log("Firestore initialized: " + JSON.stringify(firestoreInstance));
}

async function getFirestoreInstance() {
  if (!firestoreInstance) {
    await initializeFirestore();
  }
  return firestoreInstance;
}

export { initializeFirestore, getFirestoreInstance };
