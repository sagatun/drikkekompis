import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";

dotenv.config();

let firestoreInstance;

const serviceAccount =
  process.env.NODE_ENV === "production"
    ? null
    : await import("../../drikkekompis-firestore-test.json", {
        assert: { type: "json" },
      });

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
  console.log("Firestore initialized: " + firestoreInstance);
}

async function getFirestoreInstance() {
  if (!firestoreInstance) {
    await initializeFirestore();
  }
  return firestoreInstance;
}

export { initializeFirestore, getFirestoreInstance };
