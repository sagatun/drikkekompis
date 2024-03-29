import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

export async function getSecret(secretName, retries = 3, delayFactor = 2) {
  if (process.env.NODE_ENV === "production") {
    const client = new SecretManagerServiceClient();
    const projectID = "drikkekompis";

    let attempt = 0;
    while (attempt < retries) {
      try {
        const [version] = await client.accessSecretVersion({
          name: `projects/${projectID}/secrets/${secretName}/versions/latest`,
        });

        const secretValue = version?.payload?.data.toString() ?? "";
        return secretValue;
      } catch (error: any) {
        if (error?.code === 4 && attempt < retries - 1) {
          // DEADLINE_EXCEEDED (code 4)
          const sleepTime = delayFactor ** attempt * 1000; // Exponential backoff in milliseconds
          console.log(`Retrying in ${sleepTime / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, sleepTime));
          attempt++;
        } else {
          console.error("Error accessing secret:", error);
          throw error;
        }
      }
    }
  } else {
    // In development, use local environment variables
    return process.env[secretName];
  }
}
