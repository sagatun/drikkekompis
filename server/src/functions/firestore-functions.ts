import { Firestore } from "@google-cloud/firestore";

let firestoreInstance: string | Firestore;

// interface ServiceAccount {
//   type: string;
//   project_id: string;
//   private_key_id: string;
//   private_key: string;
//   client_email: string;
//   client_id: string;
//   auth_uri: string;
//   token_uri: string;
//   auth_provider_x509_cert_url: string;
//   client_x509_cert_url: string;
// }

// let serviceAccount: ServiceAccount | null = null;

// if (process.env.NODE_ENV !== "production") {
//   // Replace this with the path to your service account json file
//   import("../../eriks-playground-firestore-test.json").then((jsonModule) => {
//     serviceAccount = jsonModule.default;
//     // The rest of your code that depends on serviceAccount should be placed here.
//   });
// }

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
