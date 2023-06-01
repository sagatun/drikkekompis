const { Firestore } = require("@google-cloud/firestore");

let firestoreInstance;

const serviceAccount =
  process.env.NODE_ENV === "production"
    ? null
    : require("./drikkekompis-firestore-test.json");

// Rest of the code remains the same

async function initializeFirestore() {
  if (!firestoreInstance) {
    const firestoreConfig =
      process.env.NODE_ENV === "production"
        ? {}
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

module.exports = { initializeFirestore, getFirestoreInstance };
